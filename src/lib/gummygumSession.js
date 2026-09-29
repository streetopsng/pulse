// Handles the handoff from the GummyGum hub: verifying a launch token on
// load and reporting this experience's outcome back to the hub when the
// launching player (the host) finishes their session.

const API_URL = import.meta.env.VITE_GUMMYGUM_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://paige-server.onrender.com');
const STORAGE_KEY = 'gummygum_launch_session';

export function getGummyGumSession() {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

async function verifyLaunchTokenOnce(ggt) {
  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: ggt }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) return null;
    return body;
  } catch (err) {
    console.error('GummyGum launch verify failed', err);
    return null;
  }
}

export async function resolveGummyGumLaunch() {
  const params = new URLSearchParams(window.location.search);
  const ggt = params.get('ggt');

  if (!ggt) {
    return getGummyGumSession();
  }

  let body = await verifyLaunchTokenOnce(ggt);
  if (!body) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    body = await verifyLaunchTokenOnce(ggt);
  }

  if (!body) {
    const existing = getGummyGumSession();
    if (existing) {
      params.delete('ggt');
      const query = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash);
      return existing;
    }
    return null;
  }

  const hubUrl =
    body.data.hubUrl ||
    (typeof document !== 'undefined' && document.referrer
      ? new URL(document.referrer).origin
      : 'https://gummygum.app');

  const session = {
    sessionId: body.data.sessionId,
    experienceId: body.data.experienceId,
    isGuest: body.data.isGuest,
    player: body.data.player,
    reportToken: body.data.reportToken,
    roomCode: body.data.roomCode ?? null,
    // The URL sessionId is the hub's hosted session; the verify response's sessionId is per-launch.
    hostedSessionId: params.get('sessionId') || null,
    isHost: Boolean(body.data.isHost),
    invitedCount: body.data.invitedCount ?? null,
    // Full survey setup assembled in GummyGum before launch (see
    // PulseContext's deployPulseFromGummyGum) — null for a host who
    // launched before this existed, or for any non-host session.
    config: body.data.config ?? null,
    hubUrl,
    round: 1,
    reported: false,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

  params.delete('ggt');
  const query = params.toString();
  window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash);

  return session;
}

function persistSession(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

async function postLaunch(path, body) {
  const res = await fetch(`${API_URL}/api/gummygum/launch/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  });
  return res.ok;
}

// Host-only: a report ends the hosted session hub-side, so participants must never call this.
export async function reportGummyGumResult(report) {
  const session = getGummyGumSession();
  if (!session || !session.isHost || !session.reportToken || session.reported) return false;

  try {
    const ok = await postLaunch('report', { reportToken: session.reportToken, report });
    if (ok) {
      session.reported = true;
      persistSession(session);
    }
    return ok;
  } catch (err) {
    console.error('GummyGum result report failed', err);
    return false;
  }
}

// Host-only End session: reports the result (completed) or cancels, then returns to the hub.
export async function endGummyGumSession(finalReport) {
  const session = getGummyGumSession();
  const hub = session?.hubUrl || 'https://gummygum.app';

  if (session?.isHost && session.reportToken) {
    try {
      if (finalReport && !session.reported) {
        await postLaunch('close', { reportToken: session.reportToken, report: finalReport });
      } else if (!session.reported) {
        await postLaunch('cancel', { reportToken: session.reportToken });
      }
    } catch (err) {
      console.error('GummyGum end session failed', err);
    }
  }

  clearSession();
  window.location.href = hub;
}

// The hub already closed the session, so leave without reporting or cancelling again.
export function leaveToGummyGumHub() {
  const hub = getGummyGumSession()?.hubUrl || 'https://gummygum.app';
  clearSession();
  window.location.href = hub;
}

const HUB_STATUS_POLL_MS = 15_000;

// The hub can't write to this experience's database, so a session ended from the hub is
// detected by polling its status. A newer hosted session under the same PIN also means ours is over.
export function watchHubSessionStatus({ pin, hostedSessionId, onEnded }) {
  let stopped = false;
  let timer = null;

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (!stopped && !document.hidden) timer = setTimeout(check, HUB_STATUS_POLL_MS);
  };

  async function check() {
    if (stopped) return;
    try {
      const res = await fetch(`${API_URL}/api/gummygum/sessions/by-pin/${encodeURIComponent(pin)}`);
      if (res.ok) {
        const body = await res.json();
        const data = body?.success ? body.data : null;
        if (!stopped && data?.id && (data.id !== hostedSessionId || data.status === 'Ended')) {
          stop();
          onEnded();
          return;
        }
      }
    } catch {
      // Network errors never end a session.
    }
    schedule();
  }

  const onVisibility = () => {
    if (document.hidden) {
      if (timer) clearTimeout(timer);
      timer = null;
    } else {
      void check();
    }
  };

  function stop() {
    stopped = true;
    if (timer) clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisibility);
  }

  document.addEventListener('visibilitychange', onVisibility);
  void check();
  return stop;
}

// Host-only: start next round from within the experience, preserving tracking in GummyGum
export async function startNextRoundGummyGum(previousRoundReport) {
  const session = getGummyGumSession();
  if (!session || !session.isHost || !session.reportToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/next-round`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report: previousRoundReport }),
    });
    const body = await res.json();
    if (res.ok && body.success && body.data) {
      session.sessionId = body.data.sessionId;
      session.reportToken = body.data.reportToken;
      session.round = body.data.round || (session.round + 1);
      session.reported = false;
      persistSession(session);
      return session;
    }
  } catch (err) {
    console.error('GummyGum start next round failed', err);
  }
  return session;
}
