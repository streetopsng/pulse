import { createContext, useContext, useState, useEffect } from 'react';
import { TEMPLATES, cloneQuestions, createQuestion } from '../constants/templates';

const PulseContext = createContext(null);

const STORAGE_KEY_PULSES = 'pulse_surveys_data';
const STORAGE_KEY_COMPLETED = 'pulse_completed_ids';

function createBlankDraft() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const joinCode = String(randomNum).replace(/(\d{3})(\d{3})/, '$1 $2');
  return {
    name: '',
    description: '',
    template: null,
    questions: [],
    openQ: null,
    delivery: 'private',
    scope: 'team',
    participantCount: 20,
    privacy: 'anonymous',
    joinCode,
  };
}

function getStoredPulses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PULSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
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
  const [snapshotPulseId, setSnapshotPulseId] = useState(null);

  const [topView, setTopViewState] = useState('host'); // 'host' | 'employee'
  const [hostScreen, setHostScreen] = useState('welcome'); // 'welcome'|'home'|'create'|'builder'|'config'|'deploy'|'live-session'|'private-status'|'snapshot'
  const [draft, setDraft] = useState(createBlankDraft);
  const [commentFilter, setCommentFilter] = useState('all');

  // Employee state
  const [empScreen, setEmpScreen] = useState('join');
  const [empJoinInput, setEmpJoinInput] = useState('');
  const [empQIndex, setEmpQIndex] = useState(0);
  const [empAnswers, setEmpAnswers] = useState({});
  const [completedPulseIds, setCompletedPulseIds] = useState(getStoredCompleted);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQIndex, setPreviewQIndex] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState({});

  // Toast state
  const [toastMsg, setToastMsg] = useState(null);

  const activePulse = pulses.find((p) => p.id === activePulseId) || null;
  const snapshotPulse = pulses.find((p) => p.id === snapshotPulseId) || null;

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

  // Multi-tab sync: listen for storage changes from other tabs/windows
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
          setEmpScreen(activePulse.delivery === 'live' ? 'join' : 'invite');
        }
      } else {
        setEmpScreen('join');
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
    showToast('Pulse survey deleted');
  }

  function closePulse(id) {
    setPulses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'completed' } : p))
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
      scope: draft.scope,
      participantCount: Number(draft.participantCount) || 20,
      privacy: draft.privacy,
      joinCode: draft.joinCode,
      status: draft.delivery === 'live' ? 'live' : 'collecting',
      createdDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()),
      liveQIndex: 0,
      responses: [],
    };

    setPulses((prev) => [newPulse, ...prev]);
    setActivePulseId(id);
    setHostScreen(draft.delivery === 'live' ? 'live-session' : 'private-status');
    showToast(draft.delivery === 'live' ? 'Live pulse started' : `Pulse sent to ${draft.participantCount} people`);
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

  // Employee Flow Actions
  function empJoinSubmit(overrideCode) {
    const input = (overrideCode || empJoinInput).replace(/\s/g, '');
    if (!input) {
      showToast('Please enter a 6-digit join code');
      return;
    }

    const match = pulses.find(
      (p) => p.joinCode && p.joinCode.replace(/\s/g, '') === input
    );

    if (!match) {
      showToast("No pulse survey found matching that code.");
      return;
    }

    setActivePulseId(match.id);

    if (completedPulseIds.includes(match.id)) {
      setEmpScreen('already');
      return;
    }

    if (match.status === 'completed') {
      showToast('This survey has already been completed and closed.');
      return;
    }

    setEmpScreen('welcome');
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
    };

    setPulses((prev) =>
      prev.map((p) => (p.id === activePulse.id ? { ...p, responses: [...p.responses, submission] } : p))
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
        // Employee state & actions
        empScreen,
        setEmpScreen,
        empJoinInput,
        setEmpJoinInput,
        empQIndex,
        empAnswers,
        empJoinSubmit,
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
