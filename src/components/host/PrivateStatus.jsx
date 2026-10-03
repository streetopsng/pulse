import { useState } from 'react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Card } from '../common/Card';
import { ClipboardIcon, LinkIcon } from '../common/Icons';
import { usePulse } from '../../context/PulseContext';

export function PrivateStatus() {
  const {
    activePulse,
    closePulse,
    openSnapshot,
    showToast,
    isFromGummyGum,
  } = usePulse();
  const [confirmFinalizeOpen, setConfirmFinalizeOpen] = useState(false);

  if (!activePulse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sm font-bold text-ink-soft mb-4">
          No private survey is currently active.
        </p>
      </div>
    );
  }

  const p = activePulse;
  const totalInvited = p.invitedEmployees?.length || 0;
  const pct = totalInvited
    ? Math.round((p.responses.length / totalInvited) * 100)
    : 0;
  const accessCode = p.accessCode || '—';
  const directLink = `${window.location.origin}/#/survey/${p.id}`;

  function handleCloseAndSnapshot() {
    closePulse(p.id);
    openSnapshot(p.id);
  }

  function copyLink() {
    navigator.clipboard.writeText(directLink);
    showToast('Direct survey link copied to clipboard');
  }

  function copyCode() {
    navigator.clipboard.writeText(accessCode);
    showToast('Session PIN copied to clipboard');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full mb-3">
          Async Pulse · In Progress
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {p.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium mb-3">
          {totalInvited} participants invited by email
        </p>

        {!isFromGummyGum && (
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Session PIN:</span>
              <button
                type="button"
                onClick={copyCode}
                title="Click to copy PIN"
                className="inline-flex items-center gap-1 font-mono font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
              >
                {accessCode} <ClipboardIcon />
              </button>
            </div>

            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <LinkIcon /> Copy Direct Link
            </button>
          </div>
        )}
      </div>

      {/* Progress Card */}
      <Card className="p-8 sm:p-10 text-center mb-6">
        <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-1">
          {p.responses.length} / {totalInvited}
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-6">
          responses recorded ({pct}%)
        </p>

        {/* Progress Track */}
        <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            disabled={p.responses.length === 0}
            onClick={() => openSnapshot(p.id)}
          >
            View Snapshot
          </Button>
          <Button variant="ghost" onClick={() => setConfirmFinalizeOpen(true)}>
            End Survey &amp; Finalize
          </Button>
        </div>
      </Card>

      {/* Nav */}
      <div className="text-center">
      </div>
      <ConfirmationModal
        isOpen={confirmFinalizeOpen}
        title="Finalise results?"
        message="This closes the survey to new responses and records the results in GummyGum. Participants still answering will see that it has closed."
        confirmText="Finalise results"
        cancelText="Keep collecting"
        isDanger={false}
        onConfirm={() => {
          setConfirmFinalizeOpen(false);
          handleCloseAndSnapshot();
        }}
        onCancel={() => setConfirmFinalizeOpen(false)}
      />
    </div>
  );
}
