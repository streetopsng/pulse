import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TEMPLATES, cloneQuestions, createQuestion } from '../constants/templates';
import { isFirebaseConfigured } from '../config/firebase';
import {
  subscribeToPulses,
  subscribeToResponses,
  subscribeToPulseDoc,
  fetchPulseById,
  fetchPulseByCode,
  savePulseToFirebase,
  submitResponseToFirebase,
  updatePulseFieldsInFirebase,
  deletePulseFromFirebase,
  isPulseEnded,
  pickPulseForPin,
  ggResponseId,
  normalizeEmail,
} from '../services/pulseFirebaseService';
import { sendPulseInvitations } from '../services/emailService';
import {
  getGummyGumSession,
  reportGummyGumResult,
  endGummyGumSession,
  leaveToGummyGumHub,
  watchHubSessionStatus,
} from '../lib/gummygumSession';
import { useGummyGum } from './GummyGumContext';

const PulseContext = createContext(null);

const STORAGE_KEY_PULSES = 'pulse_surveys_production_v1';
const STORAGE_KEY_COMPLETED = 'pulse_completed_ids_v1';

function createBlankDraft() {
  return {
    name: '',
    description: '',
    template: null,
    questions: [],
    openQ: null,
    delivery: 'private',
    invitedEmployees: [],
    privacy: 'anonymous',
  };
}

function getResponseCount(pulse) {
  return Math.max(pulse?.responses?.length || 0, pulse?.responseCount || 0);
}

function buildPulseReport(pulse) {
  return {
    experience: 'pulse',
    outcome: 'completed',
    surveyName: pulse.name,
    delivery: pulse.delivery,
    privacy: pulse.privacy,
    questionCount: pulse.questions?.length || 0,
    invitedCount: pulse.invitedEmployees?.length || 0,
    responseCount: getResponseCount(pulse),
  };
}

function isGummyGumHostPulse(pulse) {
  const ggSession = getGummyGumSession();
  return Boolean(
    pulse &&
      ggSession?.isHost &&
      ggSession.roomCode &&
      pulse.accessCode === ggSession.roomCode &&
      (!ggSession.hostedSessionId || !pulse.hostedSessionId || pulse.hostedSessionId === ggSession.hostedSessionId)
  );
}

function getStoredPulses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PULSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load pulses from storage', e);
  }
  return [];
}

function getStoredCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load completed pulse IDs from storage', e);
  }
  return [];
}

export function PulseProvider({ children }) {
  const [pulses, setPulses] = useState(getStoredPulses);
  const [activePulseId, setActivePulseId] = useState(() => pulses[0]?.id || null);
  const [snapshotPulseId, setSnapshotPulseId] = useState(() => pulses[1]?.id || null);

  const [topView, setTopViewState] = useState('host'); // 'host' | 'employee'
  const [hostScreen, setHostScreen] = useState('loading');
  const [draft, setDraft] = useState(createBlankDraft);
  const [commentFilter, setCommentFilter] = useState('all');

  // Employee state
  const [empScreen, setEmpScreen] = useState('loading');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [empQIndex, setEmpQIndex] = useState(0);
  const [empAnswers, setEmpAnswers] = useState({});
  const [completedPulseIds, setCompletedPulseIds] = useState(getStoredCompleted);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQIndex, setPreviewQIndex] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState({});

  // Toast state
  const [toastMsg, setToastMsg] = useState(null);
  const [syncError, setSyncError] = useState(null);

  const activePulse = pulses.find((p) => p.id === activePulseId) || pulses[0] || null;
  const snapshotPulse = pulses.find((p) => p.id === snapshotPulseId) || pulses[0] || null;

  // Persist pulses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PULSES, JSON.stringify(pulses));
    } catch (e) {
      console.error('Error saving pulses to localStorage', e);
    }
  }, [pulses]);

  // Persist completed pulse IDs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedPulseIds));
    } catch (e) {
      console.error('Error saving completed IDs to localStorage', e);
    }
  }, [completedPulseIds]);

  // Multi-tab sync
  useEffect(() => {
    function handleStorageEvent(e) {
      if (e.key === STORAGE_KEY_PULSES && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setPulses(updated);
          }
        } catch (err) {
          console.error('Storage sync error', err);
        }
      }
      if (e.key === STORAGE_KEY_COMPLETED && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setCompletedPulseIds(updated);
          }
        } catch (err) {
          console.error('Storage sync error', err);
        }
      }
    }

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const { ggSession } = useGummyGum();
  const hubPin = ggSession?.roomCode || null;

  // Scoped to this room's PIN: the collection holds every organisation's pulses and responses.
  useEffect(() => {
    if (!isFirebaseConfigured || !hubPin) return;

    const unsubscribe = subscribeToPulses((firestorePulses) => {
      if (firestorePulses && firestorePulses.length > 0) {
        setPulses(firestorePulses);
      }
    }, undefined, hubPin);

    return () => unsubscribe();
  }, [hubPin]);

  // Real-time subcollection responses sync for active pulse
  const isGgParticipant = Boolean(ggSession) && !ggSession.isHost;
  useEffect(() => {
    // Only the host shows results; a participant has no use for everyone else's answers.
    if (!isFirebaseConfigured || !activePulseId || isGgParticipant) return;

    const unsubscribe = subscribeToResponses(activePulseId, (subResponses) => {
      if (subResponses && subResponses.length > 0) {
        setPulses((prev) =>
          prev.map((p) => (p.id === activePulseId ? { ...p, responses: subResponses } : p))
        );
      }
    });

    return () => unsubscribe();
  }, [activePulseId, isGgParticipant]);

  // Detect the host ending or deleting the active pulse in real time so a
  // connected participant mid-flow doesn't freeze on a stale screen.
  useEffect(() => {
    if (!isFirebaseConfigured || !activePulseId) return;

    let seenExisting = false;
    const unsubscribe = subscribeToPulseDoc(activePulseId, ({ exists, status }) => {
      if (exists) seenExisting = true;
      // A missing doc only means "ended" once we've seen it exist (the host may still be creating it).
      if (exists ? !isPulseEnded({ status }) : !seenExisting) return;
      // Before a pulse is resolved the active id can still point at an unrelated local pulse.
      setEmpScreen((current) =>
        ['session-ended', 'loading', 'unavailable', 'locked'].includes(current)
          ? current
          : 'session-ended'
      );
    });

    return () => unsubscribe();
  }, [activePulseId]);

  const [hubEnded, setHubEnded] = useState(false);
  const hubHostedSessionId = ggSession?.hostedSessionId || null;
  const ggHostPulse =
    ggSession?.isHost && hubPin ? pickPulseForPin(pulses, hubPin, hubHostedSessionId) : null;
  // Finalising or ending in-app reports to the hub itself, which also ends the hub session.
  // A participant who already submitted keeps watching so their tab still closes out with the session.
  const endedInApp = ggSession?.isHost ? isPulseEnded(ggHostPulse) : empScreen === 'session-ended';
  const watchHub = Boolean(hubPin && hubHostedSessionId) && !hubEnded && !endedInApp;

  useEffect(() => {
    if (!watchHub) return;
    return watchHubSessionStatus({
      pin: hubPin,
      hostedSessionId: hubHostedSessionId,
      onEnded: () => setHubEnded(true),
    });
  }, [watchHub, hubPin, hubHostedSessionId]);

  // Mirrors endHostSession's Firestore update so connected participants see the ended screen.
  const hubEndHandledRef = useRef(false);
  useEffect(() => {
    if (!hubEnded || !ggSession?.isHost || hubEndHandledRef.current) return;
    hubEndHandledRef.current = true;
    (async () => {
      if (ggHostPulse && !isPulseEnded(ggHostPulse)) {
        const fields = { status: 'cancelled', endedAt: new Date().toISOString() };
        setPulses((prev) => prev.map((p) => (p.id === ggHostPulse.id ? { ...p, ...fields } : p)));
        await updatePulseFieldsInFirebase(ggHostPulse.id, fields).catch((err) =>
          console.warn('Firebase status update failed:', err)
        );
      }
      leaveToGummyGumHub();
    })();
  }, [hubEnded, ggSession, ggHostPulse]);

  const loadPulseById = useCallback(
    async (pulseId) => {
      if (!pulseId) return null;
      const existing = pulses.find((p) => p.id === pulseId);
      if (existing) {
        setActivePulseId(existing.id);
        return existing;
      }
      const fetched = await fetchPulseById(pulseId);
      if (fetched) {
        setPulses((prev) => [fetched, ...prev.filter((p) => p.id !== fetched.id)]);
        setActivePulseId(fetched.id);
        return fetched;
      }
      return null;
    },
    [pulses]
  );

  const loadPulseByCode = useCallback(
    async (code, hostedSessionId = null) => {
      if (!code) return null;
      const clean = code.toString().trim();
      const localPick = pickPulseForPin(pulses, clean, hostedSessionId);
      if (localPick && !isPulseEnded(localPick)) {
        setActivePulseId(localPick.id);
        return localPick;
      }
      const fetched = await fetchPulseByCode(clean, hostedSessionId);
      if (fetched) {
        setPulses((prev) => [fetched, ...prev.filter((p) => p.id !== fetched.id)]);
        setActivePulseId(fetched.id);
        return fetched;
      }
      if (localPick) {
        setActivePulseId(localPick.id);
        return localPick;
      }
      return null;
    },
    [pulses]
  );

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 2800);
  }

  function setTopView(view) {
    setTopViewState(view);
    if (view === 'employee') {
      if (activePulse) {
        if (completedPulseIds.includes(activePulse.id)) {
          setEmpScreen('already');
        } else {
          setEmpScreen('invite');
        }
      } else {
        setEmpScreen('loading');
      }
    }
  }

  // Host navigation
  function openPulseCard(id) {
    const p = pulses.find((x) => x.id === id);
    if (!p) return;
    if (isPulseEnded(p)) {
      openSnapshot(id);
      return;
    }
    setActivePulseId(id);
    setHostScreen(p.delivery === 'live' ? 'live-session' : 'private-status');
  }

  function openSnapshot(id) {
    setSnapshotPulseId(id);
    setHostScreen('snapshot');
  }

  function deletePulse(id) {
    setPulses((prev) => prev.filter((p) => p.id !== id));
    if (activePulseId === id) setActivePulseId(null);
    if (snapshotPulseId === id) setSnapshotPulseId(null);
    deletePulseFromFirebase(id).catch((err) => console.warn('Firebase delete fallback:', err));
    showToast('Pulse survey deleted');
  }

  // Finalising results is what "completed" means for Pulse, so this is where GummyGum gets the result.
  function closePulse(id) {
    const target = pulses.find((p) => p.id === id);
    const fields = { status: 'completed', endedAt: new Date().toISOString() };
    setPulses((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
    updatePulseFieldsInFirebase(id, fields).catch((err) => {
      console.warn('Firebase status update failed:', err);
      setSyncError("The survey closed here, but we couldn't reach the server, so participants may still see it as open. Check your connection.");
    });
    if (isGummyGumHostPulse(target)) {
      reportGummyGumResult(buildPulseReport({ ...target, ...fields }));
    }
    showToast('Pulse survey closed');
  }

  async function endHostSession() {
    const ggSession = getGummyGumSession();
    const target = ggSession?.roomCode
      ? pickPulseForPin(pulses, ggSession.roomCode, ggSession.hostedSessionId || null)
      : null;
    let report = null;

    if (target) {
      // Only finalised results count; ending before that cancels so no partial results reach GummyGum.
      const completed = target.status === 'completed';
      if (!isPulseEnded(target)) {
        const fields = { status: 'cancelled', endedAt: new Date().toISOString() };
        setPulses((prev) => prev.map((p) => (p.id === target.id ? { ...p, ...fields } : p)));
        await updatePulseFieldsInFirebase(target.id, fields).catch((err) =>
          console.warn('Firebase status update fallback:', err)
        );
      }
      if (completed) report = buildPulseReport({ ...target, status: 'completed' });
    }

    await endGummyGumSession(report);
  }

  function startCreate() {
    setDraft(createBlankDraft());
    setHostScreen('create');
  }

  function pickTemplate(id) {
    const tmpl = TEMPLATES[id];
    setDraft((prev) => ({
      ...prev,
      template: id,
      questions: cloneQuestions(tmpl.questions),
      name: prev.name ? prev.name : tmpl.name + ' Pulse',
    }));
  }

  function updateDraft(updates) {
    setDraft((prev) => ({ ...prev, ...updates }));
  }

  function toggleInvitee(email) {
    setDraft((prev) => {
      const list = [...(prev.invitedEmployees || [])];
      const idx = list.findIndex((p) => p.email === email);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        const cleanName = email.split('@')[0].replace(/[._]/g, ' ');
        list.push({ email, name: cleanName });
      }
      return { ...prev, invitedEmployees: list };
    });
  }

  function addInvitee(email, name) {
    if (!email || !email.includes('@')) return false;
    const cleanEmail = email.trim().toLowerCase();
    let added = false;
    setDraft((prev) => {
      const list = [...(prev.invitedEmployees || [])];
      if (list.some((p) => p.email.toLowerCase() === cleanEmail)) return prev;
      const cleanName = name?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      list.push({ email: cleanEmail, name: cleanName });
      added = true;
      return { ...prev, invitedEmployees: list };
    });
    return added;
  }

  function removeInvitee(email) {
    setDraft((prev) => ({
      ...prev,
      invitedEmployees: (prev.invitedEmployees || []).filter(
        (p) => p.email.toLowerCase() !== email.toLowerCase()
      ),
    }));
  }

  function clearInvitees() {
    setDraft((prev) => ({
      ...prev,
      invitedEmployees: [],
    }));
  }

  // Question builder operations
  function toggleBuilderQ(id) {
    setDraft((prev) => ({
      ...prev,
      openQ: prev.openQ === id ? null : id,
    }));
  }

  function editQuestion(id, field, value) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    }));
  }

  function moveQuestion(id, dir) {
    setDraft((prev) => {
      const qs = [...prev.questions];
      const i = qs.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= qs.length) return prev;
      const temp = qs[i];
      qs[i] = qs[j];
      qs[j] = temp;
      return { ...prev, questions: qs };
    });
  }

  function duplicateQuestion(id) {
    setDraft((prev) => {
      const qs = [...prev.questions];
      const i = qs.findIndex((x) => x.id === id);
      if (i === -1) return prev;
      const original = qs[i];
      const copy = {
        ...original,
        id: 'q_' + Math.random().toString(36).slice(2, 9),
        options: original.options ? [...original.options] : undefined,
        text: original.text + ' (copy)',
      };
      qs.splice(i + 1, 0, copy);
      return { ...prev, questions: qs };
    });
    showToast('Question duplicated');
  }

  function deleteQuestion(id) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.filter((x) => x.id !== id),
      openQ: prev.openQ === id ? null : prev.openQ,
    }));
    showToast('Question deleted');
  }

  function addQuestion() {
    const nq = createQuestion('New question', 'rating');
    setDraft((prev) => ({
      ...prev,
      questions: [...prev.questions, nq],
      openQ: nq.id,
    }));
  }

  function addOption(qId) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== qId) return q;
        const currentOpts = q.options || [];
        return { ...q, options: [...currentOpts, `Option ${currentOpts.length + 1}`] };
      }),
    }));
  }

  function editOption(qId, optIdx, val) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== qId) return q;
        const nextOpts = [...(q.options || [])];
        nextOpts[optIdx] = val;
        return { ...q, options: nextOpts };
      }),
    }));
  }

  function removeOption(qId, optIdx) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== qId) return q;
        const nextOpts = (q.options || []).filter((_, idx) => idx !== optIdx);
        return { ...q, options: nextOpts };
      }),
    }));
  }

  function deployPulse() {
    const id = 'p_' + Math.random().toString(36).slice(2, 9);
    const ggSession = getGummyGumSession();
    const accessCode =
      (ggSession?.isHost && ggSession.roomCode) ||
      Math.floor(100000 + Math.random() * 900000).toString();
    const newPulse = {
      id,
      accessCode,
      name: draft.name.trim() || 'Untitled Pulse',
      description: draft.description.trim(),
      template: draft.template,
      questions: cloneQuestions(draft.questions),
      delivery: draft.delivery,
      invitedEmployees: (draft.invitedEmployees || []).map((p) => ({ ...p })),
      privacy: draft.privacy,
      status: draft.delivery === 'live' ? 'live' : 'collecting',
      createdDate: 'Today',
      createdAt: new Date().toISOString(),
      liveQIndex: 0,
      responses: [],
      ...(ggSession?.isHost && ggSession.hostedSessionId ? { hostedSessionId: ggSession.hostedSessionId } : {}),
    };

    setPulses((prev) => [newPulse, ...prev]);
    setActivePulseId(id);
    setHostScreen(draft.delivery === 'live' ? 'live-session' : 'private-status');

    savePulseToFirebase(newPulse).catch((err) =>
      console.warn('Firebase save fallback:', err)
    );

    // Trigger email dispatch via Brevo (or local simulation with deep link)
    const invitees = draft.invitedEmployees || [];
    // GummyGum-launched hosts (even ones that fell back to the native
    // builder) join via their own hub, not this PIN — never surface it.
    const isFromGummyGum = Boolean(ggSession);
    if (invitees.length > 0) {
      sendPulseInvitations({ pulse: newPulse, recipients: invitees })
        .then((result) => {
          if (result.mode === 'brevo_serverless' || result.mode === 'brevo_client_direct') {
            showToast(`Invites sent to ${invitees.length} participants via Brevo`);
          } else {
            showToast(
              isFromGummyGum
                ? `Pulse launched · ${invitees.length} invited`
                : `Pulse launched · PIN: ${accessCode} · ${invitees.length} invited`
            );
          }
        })
        .catch((_err) => {
          showToast(isFromGummyGum ? `Pulse launched` : `Pulse launched · PIN: ${accessCode}`);
        });
    } else {
      showToast(
        isFromGummyGum
          ? `Pulse launched · Open Access`
          : `Pulse launched · Open Access · PIN: ${accessCode}`
      );
    }
  }

  // Deploys straight from a fully-assembled config object (the survey a
  // host built entirely inside GummyGum's PulseSetupModal) instead of the
  // internal `draft` state — same deploy semantics as deployPulse(), just
  // reading from `config` so the native builder chain can be skipped
  // entirely. See src/App.jsx's HostLayout for the caller.
  async function deployPulseFromGummyGum(config) {
    if (!config) return null;
    const ggSession = getGummyGumSession();
    const accessCode =
      (ggSession?.isHost && ggSession.roomCode) ||
      Math.floor(100000 + Math.random() * 900000).toString();

    // A host who reconnects to the same GummyGum room (closed tab, resumed
    // from the hub, another device, etc.) mints a fresh launch token and
    // re-runs this on mount — reuse the pulse already tied to that room's
    // PIN instead of creating a duplicate every time.
    // A re-run of the same PIN is a different hosted session and gets its own pulse.
    const hostedSessionId = (ggSession?.isHost && ggSession.hostedSessionId) || null;
    let existing = pickPulseForPin(pulses, accessCode, hostedSessionId);
    if ((!existing || isPulseEnded(existing)) && isFirebaseConfigured) {
      let fetched = null;
      try {
        fetched = await fetchPulseByCode(accessCode, hostedSessionId, { strict: true });
      } catch {
        // Treating a failed read as "no pulse yet" would launch a duplicate and strand everyone on the first one.
        setSyncError("We couldn't reach the server to load your Pulse. Check your connection and reload this page.");
        return null;
      }
      // A pulse this same hosted session ended stays ended (snapshot), so a duplicate tab can't reopen it.
      if (fetched && (!isPulseEnded(fetched) || (hostedSessionId && !existing))) {
        existing = fetched;
        setPulses((prev) => [fetched, ...prev.filter((p) => p.id !== fetched.id)]);
      }
    }
    if (existing && !isPulseEnded(existing)) {
      if (hostedSessionId && !existing.hostedSessionId) {
        existing = { ...existing, hostedSessionId };
        setPulses((prev) => prev.map((p) => (p.id === existing.id ? { ...p, hostedSessionId } : p)));
        updatePulseFieldsInFirebase(existing.id, { hostedSessionId }).catch((err) =>
          console.warn('Firebase hosted session tag fallback:', err)
        );
      }
      setActivePulseId(existing.id);
      setHostScreen(existing.delivery === 'live' ? 'live-session' : 'private-status');
      return existing;
    }
    if (existing) {
      setActivePulseId(existing.id);
      openSnapshot(existing.id);
      return existing;
    }

    const id = 'p_' + Math.random().toString(36).slice(2, 9);
    const delivery = config.delivery === 'live' ? 'live' : 'private';
    const newPulse = {
      id,
      accessCode,
      name: (config.name || '').trim() || 'Untitled Pulse',
      description: (config.description || '').trim(),
      template: config.template || null,
      questions: cloneQuestions(config.questions || []),
      delivery,
      invitedEmployees: (config.invitedEmployees || []).map((p) => ({ ...p })),
      privacy: config.privacy === 'identified' ? 'identified' : 'anonymous',
      status: delivery === 'live' ? 'live' : 'collecting',
      createdDate: 'Today',
      createdAt: new Date().toISOString(),
      liveQIndex: 0,
      responses: [],
      ...(hostedSessionId ? { hostedSessionId } : {}),
    };

    setPulses((prev) => [newPulse, ...prev]);
    setActivePulseId(id);
    setHostScreen(delivery === 'live' ? 'live-session' : 'private-status');

    try {
      await savePulseToFirebase(newPulse);
    } catch (err) {
      console.warn('Firebase save failed:', err);
      // Dropped locally too, so a reload launches it again instead of reusing a pulse nobody else can see.
      setPulses((prev) => prev.filter((p) => p.id !== id));
      setHostScreen('loading');
      setSyncError("Your Pulse didn't reach the server, so nobody can join it. Check your connection and reload this page.");
      return null;
    }

    // GummyGum already emailed these people a personalized, identity-aware
    // invite link when the host launched — sending Pulse's own native Brevo
    // invite on top would give them a second, non-GummyGum-aware link.
    const inviteCount = (config.invitedEmployees || []).length;
    showToast(
      inviteCount > 0
        ? `Pulse launched · ${inviteCount} invited`
        : `Pulse launched · Open Access`
    );

    return newPulse;
  }

  // Persisted so the Firestore snapshot listener doesn't reset the host back to question 1.
  function nextLiveQuestion() {
    if (!activePulse || activePulse.liveQIndex >= activePulse.questions.length - 1) return;
    const liveQIndex = activePulse.liveQIndex + 1;
    setPulses((prev) => prev.map((p) => (p.id === activePulse.id ? { ...p, liveQIndex } : p)));
    updatePulseFieldsInFirebase(activePulse.id, { liveQIndex }).catch((err) =>
      console.warn('Firebase live question update fallback:', err)
    );
  }

  function endLivePulse() {
    if (!activePulse) return;
    closePulse(activePulse.id);
    openSnapshot(activePulse.id);
  }

  // Employee Flow Actions
  function empEmailSubmit() {
    if (!activePulse) return;
    const typed = (emailInput || '').trim().toLowerCase();
    if (!typed || !typed.includes('@') || !typed.includes('.')) {
      setEmailError("Please enter a valid work email address.");
      return;
    }
    const invited = activePulse.invitedEmployees || [];
    const ggSession = getGummyGumSession();
    const ggEmail = normalizeEmail(ggSession?.player?.email);
    if (invited.length === 0 || (ggEmail && typed === ggEmail)) {
      // Open Access Mode, or an identity GummyGum already verified for this room
      setVerifiedEmail(typed);
      setEmailError(null);
      setEmpScreen('instructions');
      return;
    }
    const match = invited.find((inv) => inv.email.toLowerCase() === typed);
    if (match) {
      setVerifiedEmail(match.email);
      setEmailError(null);
      setEmpScreen('instructions');
    } else {
      setEmailError("This email isn't on the recipient list for this pulse survey.");
    }
  }

  function empStart() {
    if (hubEnded || isPulseEnded(activePulse)) {
      setEmpScreen('session-ended');
      return;
    }
    setEmpQIndex(0);
    setEmpAnswers({});
    setEmpScreen('question');
  }

  function empAnswer(qId, val, autoAdvance = true) {
    setEmpAnswers((prev) => ({ ...prev, [qId]: val }));
    if (autoAdvance) {
      setTimeout(() => {
        empNext();
      }, 260);
    }
  }

  function empAnswerMulti(qId, optIdx) {
    setEmpAnswers((prev) => {
      const arr = prev[qId] ? [...prev[qId]] : [];
      const pos = arr.indexOf(optIdx);
      if (pos > -1) arr.splice(pos, 1);
      else arr.push(optIdx);
      return { ...prev, [qId]: arr };
    });
  }

  function empNext() {
    if (!activePulse) return;
    if (empQIndex < activePulse.questions.length - 1) {
      setEmpQIndex((prev) => prev + 1);
    } else {
      empSubmit();
    }
  }

  function empBack() {
    if (empQIndex > 0) {
      setEmpQIndex((prev) => prev - 1);
    }
  }

  function empSubmit() {
    if (!activePulse) return;
    if (hubEnded || isPulseEnded(activePulse)) {
      setEmpScreen('session-ended');
      return;
    }
    const ggEmail = normalizeEmail(getGummyGumSession()?.player?.email);
    // One response per invite email, so a rejoin from another device can't double-count.
    const submission = {
      id: (ggEmail && ggResponseId(ggEmail)) || 'r_' + Math.random().toString(36).slice(2, 9),
      answers: { ...empAnswers },
      submittedAt: new Date().toISOString(),
      isReal: true,
      // Firestore rejects undefined fields, so an anonymous response omits the key entirely.
      ...(activePulse.privacy === 'identified' && verifiedEmail ? { respondentEmail: verifiedEmail } : {}),
    };

    const pulseId = activePulse.id;
    setPulses((prev) =>
      prev.map((p) =>
        p.id === pulseId && !(p.responses || []).some((r) => r.id === submission.id)
          ? { ...p, responses: [...(p.responses || []), submission] }
          : p
      )
    );
    submitResponseToFirebase(pulseId, submission)
      .then(() => setSyncError(null))
      .catch((err) => {
        console.warn('Firebase response submit failed:', err);
        // Showing "thanks" for answers that never arrived would lose them for good.
        setPulses((prev) =>
          prev.map((p) =>
            p.id === pulseId ? { ...p, responses: (p.responses || []).filter((r) => r.id !== submission.id) } : p
          )
        );
        setCompletedPulseIds((prev) => prev.filter((x) => x !== pulseId));
        setEmpScreen((current) => (current === 'completion' ? 'question' : current));
        setSyncError("Your answers didn't send. Check your connection and submit again.");
      });
    setCompletedPulseIds((prev) => (prev.includes(activePulse.id) ? prev : [...prev, activePulse.id]));
    setEmpScreen('completion');
  }

  // Preview Flow Actions
  function openPreview() {
    setPreviewQIndex(0);
    setPreviewAnswers({});
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
  }

  function previewAnswer(qId, val, autoAdvance = true) {
    setPreviewAnswers((prev) => ({ ...prev, [qId]: val }));
    if (autoAdvance) {
      setTimeout(() => {
        previewNext();
      }, 260);
    }
  }

  function previewAnswerMulti(qId, optIdx) {
    setPreviewAnswers((prev) => {
      const arr = prev[qId] ? [...prev[qId]] : [];
      const pos = arr.indexOf(optIdx);
      if (pos > -1) arr.splice(pos, 1);
      else arr.push(optIdx);
      return { ...prev, [qId]: arr };
    });
  }

  function previewNext() {
    setPreviewQIndex((prev) => prev + 1);
  }

  function previewBack() {
    if (previewQIndex > 0) {
      setPreviewQIndex((prev) => prev - 1);
    }
  }

  return (
    <PulseContext.Provider
      value={{
        isFirebaseConfigured,
        pulses,
        activePulse,
        activePulseId,
        setActivePulseId,
        loadPulseById,
        loadPulseByCode,
        snapshotPulse,
        snapshotPulseId,
        topView,
        setTopView,
        hostScreen,
        setHostScreen,
        draft,
        updateDraft,
        toggleInvitee,
        addInvitee,
        removeInvitee,
        clearInvitees,
        commentFilter,
        setCommentFilter,
        showToast,
        toastMsg,
        syncError,
        setSyncError,
        // Host actions
        openPulseCard,
        openSnapshot,
        deletePulse,
        closePulse,
        endHostSession,
        ggHostPulse,
        startCreate,
        pickTemplate,
        toggleBuilderQ,
        editQuestion,
        moveQuestion,
        duplicateQuestion,
        deleteQuestion,
        addQuestion,
        addOption,
        editOption,
        removeOption,
        deployPulse,
        deployPulseFromGummyGum,
        nextLiveQuestion,
        endLivePulse,
        // Employee state & actions
        empScreen,
        hubEnded,
        setEmpScreen,
        completedPulseIds,
        emailInput,
        setEmailInput,
        emailError,
        setEmailError,
        verifiedEmail,
        setVerifiedEmail,
        empEmailSubmit,
        empQIndex,
        empAnswers,
        empStart,
        empAnswer,
        empAnswerMulti,
        empNext,
        empBack,
        empSubmit,
        // Preview state & actions
        previewOpen,
        previewQIndex,
        previewAnswers,
        openPreview,
        closePreview,
        previewAnswer,
        previewAnswerMulti,
        previewNext,
        previewBack,
        isFromGummyGum: Boolean(getGummyGumSession()),
      }}
    >
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
