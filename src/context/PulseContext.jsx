import { createContext, useContext, useState, useEffect } from 'react';
import { TEMPLATES, cloneQuestions, createQuestion } from '../constants/templates';
import { DIRECTORY, fakeRespondentAnswers } from '../constants/directory';
import { isFirebaseConfigured } from '../config/firebase';
import {
  subscribeToPulses,
  savePulseToFirebase,
  submitResponseToFirebase,
  updatePulseStatusInFirebase,
  deletePulseFromFirebase,
} from '../services/pulseFirebaseService';

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
  const [hostScreen, setHostScreen] = useState('welcome');
  const [draft, setDraft] = useState(createBlankDraft);
  const [commentFilter, setCommentFilter] = useState('all');

  // Employee state
  const [empScreen, setEmpScreen] = useState('invite');
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

  // Real-time Firestore sync when configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = subscribeToPulses((firestorePulses) => {
      if (firestorePulses && firestorePulses.length > 0) {
        setPulses(firestorePulses);
      }
    });

    return () => unsubscribe();
  }, []);

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
        setEmpScreen('entry');
      }
    }
  }

  // Host navigation
  function openPulseCard(id) {
    const p = pulses.find((x) => x.id === id);
    if (!p) return;
    if (p.status === 'completed') {
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

  function closePulse(id) {
    setPulses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'completed' } : p))
    );
    updatePulseStatusInFirebase(id, 'completed').catch((err) =>
      console.warn('Firebase status update fallback:', err)
    );
    showToast('Pulse survey closed');
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
    const newPulse = {
      id,
      name: draft.name.trim() || 'Untitled Pulse',
      description: draft.description.trim(),
      template: draft.template,
      questions: cloneQuestions(draft.questions),
      delivery: draft.delivery,
      invitedEmployees: (draft.invitedEmployees || []).map((p) => ({ ...p })),
      privacy: draft.privacy,
      status: draft.delivery === 'live' ? 'live' : 'collecting',
      createdDate: 'Today',
      liveQIndex: 0,
      responses: [],
    };

    setPulses((prev) => [newPulse, ...prev]);
    setActivePulseId(id);
    setHostScreen(draft.delivery === 'live' ? 'live-session' : 'private-status');
    savePulseToFirebase(newPulse).catch((err) =>
      console.warn('Firebase save fallback:', err)
    );
    showToast(
      draft.delivery === 'live'
        ? 'Live pulse started — invites sent by email'
        : `Pulse sent to ${draft.invitedEmployees.length} people by email`
    );
  }

  function nextLiveQuestion() {
    if (!activePulse) return;
    setPulses((prev) =>
      prev.map((p) =>
        p.id === activePulse.id && p.liveQIndex < p.questions.length - 1
          ? { ...p, liveQIndex: p.liveQIndex + 1 }
          : p
      )
    );
  }

  function endLivePulse() {
    if (!activePulse) return;
    setPulses((prev) =>
      prev.map((p) => (p.id === activePulse.id ? { ...p, status: 'completed' } : p))
    );
    openSnapshot(activePulse.id);
  }

  function simulateLiveJoins() {
    if (!activePulse) return;
    const target = activePulse.invitedEmployees?.length || 10;
    setPulses((prev) => {
      const current = prev.find((p) => p.id === activePulse.id);
      if (!current || current.responses.length >= target) return prev;
      const batch = Math.ceil(target / 6);
      const added = [];
      for (let i = 0; i < batch && current.responses.length + added.length < target; i++) {
        added.push({
          id: 'r_' + Math.random().toString(36).slice(2, 9),
          answers: fakeRespondentAnswers(current.questions),
          isReal: false,
          submittedAt: new Date().toISOString(),
        });
      }
      return prev.map((p) =>
        p.id === current.id ? { ...p, responses: [...p.responses, ...added] } : p
      );
    });
    showToast('Simulated incoming live responses');
  }

  function simulatePrivateResponses() {
    if (!activePulse) return;
    const target = activePulse.invitedEmployees?.length || 10;
    setPulses((prev) => {
      const current = prev.find((p) => p.id === activePulse.id);
      if (!current || current.responses.length >= target) return prev;
      const batch = Math.ceil(target / 6);
      const added = [];
      for (let i = 0; i < batch && current.responses.length + added.length < target; i++) {
        added.push({
          id: 'r_' + Math.random().toString(36).slice(2, 9),
          answers: fakeRespondentAnswers(current.questions),
          isReal: false,
          submittedAt: new Date().toISOString(),
        });
      }
      const newResponses = [...current.responses, ...added];
      const newStatus = newResponses.length >= target ? 'completed' : current.status;
      return prev.map((p) =>
        p.id === current.id
          ? { ...p, responses: newResponses, status: newStatus }
          : p
      );
    });
    showToast('Simulated incoming private responses');
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
    if (invited.length === 0) {
      // Open Access Mode - any employee can participate
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
    const submission = {
      id: 'r_' + Math.random().toString(36).slice(2, 9),
      answers: { ...empAnswers },
      submittedAt: new Date().toISOString(),
      isReal: true,
      respondentEmail: activePulse.privacy === 'identified' ? verifiedEmail : undefined,
    };

    setPulses((prev) =>
      prev.map((p) =>
        p.id === activePulse.id ? { ...p, responses: [...p.responses, submission] } : p
      )
    );
    submitResponseToFirebase(activePulse.id, submission).catch((err) =>
      console.warn('Firebase response submit fallback:', err)
    );
    setCompletedPulseIds((prev) => [...prev, activePulse.id]);
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
        // Host actions
        openPulseCard,
        openSnapshot,
        deletePulse,
        closePulse,
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
        nextLiveQuestion,
        endLivePulse,
        simulateLiveJoins,
        simulatePrivateResponses,
        // Employee state & actions
        empScreen,
        setEmpScreen,
        emailInput,
        setEmailInput,
        emailError,
        setEmailError,
        verifiedEmail,
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
