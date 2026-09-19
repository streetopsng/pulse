import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const COLLECTION_NAME = 'pulses';
const SUBCOLLECTION_RESPONSES = 'responses';

/**
 * Subscribe to real-time updates for all pulses in Firestore
 */
export function subscribeToPulses(callback, onError) {
  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
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
export async function fetchPulseByCode(code) {
  if (!isFirebaseConfigured || !db || !code) return null;

  try {
    const cleanCode = code.toString().trim();
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('accessCode', '==', cleanCode));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const firstDoc = snapshot.docs[0];
    return { id: firstDoc.id, ...firstDoc.data() };
  } catch (error) {
    console.error('Failed to fetch pulse by code:', error);
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
    await setDoc(docRef, pulse, { merge: true });
  } catch (error) {
    console.error('Failed to save pulse to Firebase:', error);
    throw error;
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

    // Save full detailed response to subcollection
    await setDoc(responseDocRef, { ...response, id: respId });

    // Also update response count on the parent pulse doc for lightweight queries
    try {
      const pulseDocRef = doc(db, COLLECTION_NAME, pulseId);
      const pulseSnap = await getDoc(pulseDocRef);
      if (pulseSnap.exists()) {
        const currentData = pulseSnap.data();
        const existingResponses = currentData.responses || [];
        const isAlreadyAdded = existingResponses.some((r) => r.id === respId);
        if (!isAlreadyAdded) {
          // Keep a capped list on parent doc for quick preview, but full data is in subcollection
          const updatedSubset = [...existingResponses, response].slice(-100);
          await updateDoc(pulseDocRef, {
            responses: updatedSubset,
            responseCount: (currentData.responseCount || existingResponses.length) + 1,
          });
        }
      }
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
