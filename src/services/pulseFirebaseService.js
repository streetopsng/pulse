import { collection, doc, query, where } from 'firebase/firestore';
import {
  db,
  isFirebaseConfigured,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  runTransaction,
} from '../config/firebase';

const COLLECTION_NAME = 'pulses';

export const ENDED_STATUSES = ['completed', 'cancelled'];

export function isPulseEnded(pulse) {
  return Boolean(pulse) && ENDED_STATUSES.includes(pulse.status);
}

// The hub reuses a PIN when a session is re-run: with a hostedSessionId, never pick another
// hosted session's pulse or a closed legacy one. Prefers this session's pulse, then open, then newest.
export function pickPulseForPin(pulses, code, hostedSessionId) {
  const clean = String(code || '').trim();
  const matches = (pulses || []).filter(
    (p) =>
      p.accessCode === clean &&
      (!hostedSessionId ||
        p.hostedSessionId === hostedSessionId ||
        (!p.hostedSessionId && !isPulseEnded(p)))
  );
  matches.sort((a, b) => {
    if (hostedSessionId) {
      const ownDiff = Number(b.hostedSessionId === hostedSessionId) - Number(a.hostedSessionId === hostedSessionId);
      if (ownDiff !== 0) return ownDiff;
    }
    const endedDiff = Number(isPulseEnded(a)) - Number(isPulseEnded(b));
    if (endedDiff !== 0) return endedDiff;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
  return matches[0] || null;
}
const SUBCOLLECTION_RESPONSES = 'responses';

const ATTEMPTS = 5;
const RETRY_DELAY_MS = 1000;

async function withRetry(label, run) {
  let lastError = null;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      return await run(attempt);
    } catch (error) {
      lastError = error;
      console.warn(`${label} failed (attempt ${attempt + 1}):`, error);
      if (error?.code === 'permission-denied' || error?.code === 'not-found') break;
      if (attempt < ATTEMPTS - 1) await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  throw lastError;
}

/**
 * Subscribe to real-time updates for all pulses in Firestore
 */
export function subscribeToPulses(callback, onError, accessCode = null) {
  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  const colRef = collection(db, COLLECTION_NAME);
  const source = accessCode ? query(colRef, where('accessCode', '==', String(accessCode).trim())) : colRef;
  return onSnapshot(
    source,
    (snapshot) => {
      const pulsesList = [];
      snapshot.forEach((docSnap) => {
        pulsesList.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(pulsesList);
    },
    (error) => {
      console.error('Firestore onSnapshot error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to real-time updates for responses of a specific pulse
 */
export function subscribeToResponses(pulseId, callback, onError) {
  if (!isFirebaseConfigured || !db || !pulseId) {
    return () => {};
  }

  const responsesRef = collection(db, COLLECTION_NAME, pulseId, SUBCOLLECTION_RESPONSES);
  return onSnapshot(
    responsesRef,
    (snapshot) => {
      const responsesList = [];
      snapshot.forEach((docSnap) => {
        responsesList.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(responsesList);
    },
    (error) => {
      console.warn('Responses onSnapshot error (falling back to parent doc responses):', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to real-time updates for a single pulse document — lets a
 * connected participant detect the host ending or deleting the session.
 */
export function subscribeToPulseDoc(pulseId, callback, onError) {
  if (!isFirebaseConfigured || !db || !pulseId) {
    return () => {};
  }

  const docRef = doc(db, COLLECTION_NAME, pulseId);
  return onSnapshot(
    docRef,
    (snap) => {
      callback({ exists: snap.exists(), status: snap.exists() ? snap.data().status : null });
    },
    (error) => {
      console.error('Pulse doc onSnapshot error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Fetch a single pulse by ID
 */
export async function fetchPulseById(pulseId) {
  if (!isFirebaseConfigured || !db || !pulseId) return null;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulseId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    // Try to fetch subcollection responses as well
    try {
      const responsesRef = collection(db, COLLECTION_NAME, pulseId, SUBCOLLECTION_RESPONSES);
      const respSnap = await getDocs(responsesRef);
      if (!respSnap.empty) {
        const subResponses = [];
        respSnap.forEach((r) => subResponses.push({ id: r.id, ...r.data() }));
        data.responses = subResponses;
      }
    } catch {
      // Fallback to data.responses if subcollection read fails
    }

    return { id: snap.id, ...data };
  } catch (error) {
    console.error('Failed to fetch pulse by ID:', error);
    return null;
  }
}

/**
 * Fetch a pulse by 6-digit access code (PIN)
 */
// strict rethrows a failed read, for callers that must not mistake it for "no pulse yet".
export async function fetchPulseByCode(code, hostedSessionId = null, { strict = false } = {}) {
  if (!isFirebaseConfigured || !db || !code) return null;

  try {
    const cleanCode = code.toString().trim();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('accessCode', '==', cleanCode));
    const snapshot = strict ? await withRetry('Fetch pulse by code', () => getDocs(q)) : await getDocs(q);

    if (snapshot.empty) return null;

    const matches = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return pickPulseForPin(matches, cleanCode, hostedSessionId);
  } catch (error) {
    console.error('Failed to fetch pulse by code:', error);
    if (strict) throw error;
    return null;
  }
}

/**
 * Create or replace a pulse document in Firestore
 */
export async function savePulseToFirebase(pulse) {
  if (!isFirebaseConfigured || !db || !pulse?.id) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulse.id);
    await withRetry('Save pulse', async (attempt) => {
      // An earlier attempt may have landed; merging again would reset responses recorded since.
      if (attempt > 0 && (await getDoc(docRef)).exists()) return;
      await setDoc(docRef, pulse, { merge: true });
    });
  } catch (error) {
    console.error('Failed to save pulse to Firebase:', error);
    throw error;
  }
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// Hashed so an anonymous pulse's response ids don't expose who answered.
export function ggResponseId(email) {
  const str = normalizeEmail(email);
  if (!str) return null;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'gg_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export async function responseExists(pulseId, respId) {
  if (!isFirebaseConfigured || !db || !pulseId || !respId) return false;
  try {
    const snap = await getDoc(doc(db, COLLECTION_NAME, pulseId, SUBCOLLECTION_RESPONSES, respId));
    return snap.exists();
  } catch {
    return false;
  }
}

/**
 * Submit an employee response to a pulse
 * Stores into subcollection `pulses/{pulseId}/responses/{responseId}` to prevent 1MB doc limits
 */
export async function submitResponseToFirebase(pulseId, response) {
  if (!isFirebaseConfigured || !db || !pulseId || !response) return;

  try {
    const respId = response.id || 'r_' + Math.random().toString(36).slice(2, 9);
    const responseDocRef = doc(db, COLLECTION_NAME, pulseId, SUBCOLLECTION_RESPONSES, respId);

    // An email-keyed response already on file is the same invitee resubmitting; keep the original.
    const alreadyOnFile = await withRetry('Submit response', async () => {
      if (respId.startsWith('gg_') && (await getDoc(responseDocRef)).exists()) return true;
      await setDoc(responseDocRef, { ...response, id: respId });
      return false;
    });
    if (alreadyOnFile) return;

    // Also update response count on the parent pulse doc for lightweight queries.
    // A transaction, so participants submitting at the same moment don't overwrite each other's entry.
    try {
      const pulseDocRef = doc(db, COLLECTION_NAME, pulseId);
      await runTransaction(db, async (tx) => {
        const pulseSnap = await tx.get(pulseDocRef);
        if (!pulseSnap.exists()) return;
        const currentData = pulseSnap.data();
        const existingResponses = currentData.responses || [];
        if (existingResponses.some((r) => r.id === respId)) return;
        // Keep a capped list on parent doc for quick preview, but full data is in subcollection
        const updatedSubset = [...existingResponses, { ...response, id: respId }].slice(-100);
        tx.update(pulseDocRef, {
          responses: updatedSubset,
          responseCount: (currentData.responseCount || existingResponses.length) + 1,
        });
      });
    } catch {
      // Subcollection write succeeded, parent count update is secondary
    }
  } catch (error) {
    console.error('Failed to submit response to Firebase:', error);
    throw error;
  }
}

/**
 * Update pulse status (e.g., 'completed' or 'collecting')
 */
export async function updatePulseStatusInFirebase(pulseId, status) {
  if (!isFirebaseConfigured || !db || !pulseId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulseId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Failed to update pulse status in Firebase:', error);
    throw error;
  }
}

export async function updatePulseFieldsInFirebase(pulseId, fields) {
  if (!isFirebaseConfigured || !db || !pulseId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulseId);
    await withRetry('Update pulse', () => updateDoc(docRef, fields));
  } catch (error) {
    console.error('Failed to update pulse in Firebase:', error);
    throw error;
  }
}

/**
 * Delete a pulse from Firestore
 */
export async function deletePulseFromFirebase(pulseId) {
  if (!isFirebaseConfigured || !db || !pulseId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete pulse from Firebase:', error);
    throw error;
  }
}
