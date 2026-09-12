import { TEMPLATES } from '../../constants/templates';
import { computeSnapshot } from '../../utils/analytics';
import { BoltIcon, CheckIcon, CalendarIcon } from '../common/Icons';
import { usePulse } from '../../context/PulseContext';

export function PulseCard({ pulse }) {
  const { openPulseCard, openSnapshot, deletePulse } = usePulse();
  const snap = computeSnapshot(pulse);
  const inviteCount = pulse.invitedEmployees?.length ?? pulse.participantCount ?? 0;
  const rate = inviteCount
    ? Math.round((pulse.responses.length / inviteCount) * 100)
    : 0;
  const tmpl = TEMPLATES[pulse.template] || TEMPLATES.custom;

  function renderStatusBadge(status) {
    if (status === 'live') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-[1.5px] border-ink bg-accent text-ink shrink-0">
          <BoltIcon className="w-3 h-3" /> Live
        </span>
      );
    }
    if (status === 'collecting') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-[1.5px] border-ink bg-gray-soft text-ink shrink-0">
          Collecting
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-[1.5px] border-ink bg-mint-soft text-mint shrink-0">
        <CheckIcon className="w-3 h-3" /> Completed
      </span>
    );
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete "${pulse.name}"? This action cannot be undone.`)) {
      deletePulse(pulse.id);
    }
  }

  return (
    <div
      onClick={() => openPulseCard(pulse.id)}
      className="bg-surface border-2 border-ink rounded-3xl p-5 sm:p-6 shadow-hard-sm hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Top Header */}
      <div className="flex items-start sm:items-center justify-between gap-3.5 mb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl border-2 border-ink ${tmpl.bgColor} flex items-center justify-center text-lg shrink-0`}
          >
            {tmpl.icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-display font-bold text-base sm:text-lg text-ink truncate">
              {pulse.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-ink-soft mt-0.5">
              <span className="flex items-center gap-1 text-ink-soft">
                <CalendarIcon className="w-3.5 h-3.5" />
                {pulse.createdDate}
              </span>
              <span>·</span>
              <span>{pulse.delivery === 'live' ? 'Live' : 'Private'}</span>
              <span>·</span>
              <span>{pulse.questions.length} questions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge(pulse.status)}
          <button
            type="button"
            onClick={handleDelete}
            title="Delete pulse"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-red-600 p-1 rounded-md text-xs font-bold ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-line-soft">
        <div className="flex items-center gap-7">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg sm:text-xl font-bold text-ink">
                {pulse.responses.length}
              </span>
              <span className="text-xs font-semibold text-ink-faint">
                / {inviteCount}
              </span>
            </div>
            <span className="text-[10.5px] font-extrabold text-ink-faint uppercase tracking-wider">
              responses ({rate}%)
            </span>
          </div>

          <div className="flex flex-col">
            {snap.overall !== null ? (
              <>
                <span className="font-display text-lg sm:text-xl font-bold text-accent-dark">
                  {snap.overall}
                </span>
                <span className="text-[10.5px] font-extrabold text-ink-faint uppercase tracking-wider">
                  / 5 overall
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-lg sm:text-xl font-bold text-ink-faint">
                  —
                </span>
                <span className="text-[10.5px] font-extrabold text-ink-faint uppercase tracking-wider">
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
          className="text-xs sm:text-sm font-extrabold text-ink underline underline-offset-4 decoration-accent decoration-2 hover:text-accent-dark cursor-pointer ml-auto sm:ml-0"
        >
          View snapshot →
        </button>
      </div>
    </div>
  );
}
