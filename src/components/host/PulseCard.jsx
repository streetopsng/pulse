import { useState } from 'react';
import { computeSnapshot } from '../../utils/analytics';
import { BoltIcon, CheckIcon, CalendarIcon } from '../common/Icons';
import { usePulse } from '../../context/PulseContext';
import { ConfirmationModal } from '../common/ConfirmationModal';

export function PulseCard({ pulse }) {
  const { openPulseCard, openSnapshot, deletePulse } = usePulse();
  const [showConfirm, setShowConfirm] = useState(false);
  const snap = computeSnapshot(pulse);
  const inviteCount = pulse.invitedEmployees?.length ?? pulse.participantCount ?? 0;
  const rate = inviteCount
    ? Math.round((pulse.responses.length / inviteCount) * 100)
    : 0;

  function renderStatusBadge(status) {
    if (status === 'live') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 shrink-0">
          <BoltIcon className="w-3 h-3 text-purple-600" /> Live
        </span>
      );
    }
    if (status === 'collecting') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 shrink-0">
          Collecting
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shrink-0">
        <CheckIcon className="w-3 h-3 text-emerald-600" /> Completed
      </span>
    );
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setShowConfirm(true);
  }

  function handleConfirmDelete() {
    deletePulse(pulse.id);
    setShowConfirm(false);
  }

  return (
    <div
      onClick={() => openPulseCard(pulse.id)}
      className="bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group"
    >
      {/* Top Header */}
      <div className="flex items-start sm:items-center justify-between gap-3.5 mb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg shrink-0 text-purple-600 shadow-2xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate group-hover:text-purple-700 transition-colors">
              {pulse.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                {pulse.createdDate}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-medium text-slate-600">{pulse.delivery === 'live' ? 'Live Poll' : 'Async Survey'}</span>
              <span className="text-slate-300">·</span>
              <span>{pulse.questions.length} questions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge(pulse.status)}
          <button
            type="button"
            onClick={handleDeleteClick}
            title="Delete pulse"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 text-xs font-bold ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-7">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                {pulse.responses.length}
              </span>
              <span className="text-xs font-medium text-slate-400">
                / {inviteCount}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              responses ({rate}%)
            </span>
          </div>

          <div className="flex flex-col">
            {snap.avgScore !== null ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-bold text-purple-600">
                    {snap.avgScore}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/ 5</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  avg agreement
                </span>
              </>
            ) : (
              <>
                <span className="text-lg sm:text-xl font-bold text-slate-300">
                  —
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  no responses yet
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openSnapshot(pulse.id);
          }}
          className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer ml-auto sm:ml-0"
        >
          View snapshot →
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title={`Delete "${pulse.name}"?`}
        message="This pulse survey and all collected participant responses will be permanently removed. This action cannot be undone."
        confirmText="Delete Pulse"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
