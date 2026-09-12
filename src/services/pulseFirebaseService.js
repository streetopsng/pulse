import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const COLLECTION_NAME = 'pulses';

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
 */
export async function submitResponseToFirebase(pulseId, response) {
  if (!isFirebaseConfigured || !db || !pulseId || !response) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, pulseId);
    await updateDoc(docRef, {
      responses: arrayUnion(response),
    });
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
