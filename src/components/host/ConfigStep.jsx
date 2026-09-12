import { useState } from 'react';
import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { usePulse } from '../../context/PulseContext';

export function ConfigStep() {
  const { draft, updateDraft, addInvitee, removeInvitee, clearInvitees, setHostScreen } = usePulse();
  const [emailInput, setEmailInput] = useState('');
  const [inputError, setInputError] = useState('');

  const invitedEmployees = draft.invitedEmployees || [];

  function handleAddEmail(e) {
    e?.preventDefault();
    setInputError('');
    const raw = emailInput.trim();
    if (!raw) return;

    // Support comma or whitespace separated bulk paste
    const parts = raw.split(/[\s,;]+/).filter(Boolean);
    let addedCount = 0;
    for (const part of parts) {
      if (part.includes('@') && part.includes('.')) {
        const ok = addInvitee(part);
        if (ok) addedCount++;
      } else {
        setInputError(`Invalid email format: "${part}"`);
        return;
      }
    }

    if (addedCount > 0) {
      setEmailInput('');
    } else if (parts.length > 0) {
      setInputError('Email already added to recipient list');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={2} />

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
          Configure Survey Delivery
        </h2>
        <p className="text-sm text-slate-500">
          Define how responses are collected, who can participate, and anonymity guarantees.
        </p>
      </div>

      {/* Delivery Choice */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          1. Delivery Method
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateDraft({ delivery: 'live' })}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              draft.delivery === 'live'
                ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3 shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="font-bold text-base text-slate-900 mb-1">
              Real-time Live Poll
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Host controls the presentation screen. Responses stream in live during all-hands or team meetings.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateDraft({ delivery: 'private' })}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              draft.delivery === 'private'
                ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3 shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-bold text-base text-slate-900 mb-1">
              Async / Self-Paced
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Participants receive invite links and answer whenever convenient within an open collection window.
            </p>
          </button>
        </div>
      </div>

      {/* Target Participants */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            2. Participant Access &amp; Invitations
          </label>
          {invitedEmployees.length > 0 && (
            <button
              type="button"
              onClick={clearInvitees}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Clear all ({invitedEmployees.length})
            </button>
          )}
        </div>

        {/* Add Input */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-4">
          <form onSubmit={handleAddEmail} className="flex gap-2.5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setInputError('');
                }}
                placeholder="Enter participant work email, or paste multiple (e.g. sarah@company.com, alex@company.com)"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!emailInput.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              + Add Email
            </button>
          </form>

          {inputError && (
            <p className="text-xs text-rose-600 mt-2 font-medium">
              {inputError}
            </p>
          )}

          {/* Recipient Chips */}
          {invitedEmployees.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-700">
                  Targeted Recipients ({invitedEmployees.length})
                </span>
                <span>Only these emails can participate</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {invitedEmployees.map((emp) => (
                  <span
                    key={emp.email}
                    className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/80 rounded-lg px-3 py-1.5 text-xs text-purple-900 font-medium shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-700 text-[10px] font-bold flex items-center justify-center">
                      {emp.email[0].toUpperCase()}
                    </span>
                    <span>{emp.email}</span>
                    <button
                      type="button"
                      onClick={() => removeInvitee(emp.email)}
                      className="text-purple-400 hover:text-purple-700 ml-0.5 cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong>Open Access Mode:</strong> No email restrictions. Anyone with the direct survey link or 6-digit session code can participate.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Choice */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          3. Privacy &amp; Psychological Safety
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateDraft({ privacy: 'anonymous' })}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              draft.privacy === 'anonymous'
                ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3 shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="font-bold text-base text-slate-900 mb-1">
              Fully Anonymous (Recommended)
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Responses are completely disassociated from respondent identity to promote candid, honest transparency.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateDraft({ privacy: 'identified' })}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              draft.privacy === 'identified'
                ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3 shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="font-bold text-base text-slate-900 mb-1">
              Identified Responses
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Responses are tagged with participant emails for targeted 1-on-1 coaching and direct accountability.
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <Button
          variant="primary"
          onClick={() => setHostScreen('deploy')}
        >
          Continue to Deploy →
        </Button>
        <Button variant="ghost" onClick={() => setHostScreen('builder')}>
          ← Back to Builder
        </Button>
      </div>
    </div>
  );
}
