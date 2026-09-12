import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Button } from '../common/Button';
import { CheckIcon, BoltIcon } from '../common/Icons';
import { QTYPES } from '../../constants/questionTypes';
import { computeSnapshot } from '../../utils/analytics';
import { usePulse } from '../../context/PulseContext';

export function SnapshotView() {
  const {
    snapshotPulse,
    commentFilter,
    setCommentFilter,
    setHostScreen,
  } = usePulse();

  if (!snapshotPulse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sm font-bold text-ink-soft mb-4">
          No pulse selected for snapshot.
        </p>
        <Button variant="primary" onClick={() => setHostScreen('home')}>
          Back to Pulses
        </Button>
      </div>
    );
  }

  const p = snapshotPulse;
  const snap = computeSnapshot(p);
  const inviteCount = p.invitedEmployees?.length ?? p.participantCount ?? 0;
  const rate = inviteCount
    ? Math.round((p.responses.length / inviteCount) * 100)
    : 0;

  const filteredComments =
    commentFilter === 'all'
      ? snap.allComments
      : snap.allComments.filter((c) => c.tag === commentFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setHostScreen('home')}
          className="text-xs sm:text-sm font-extrabold text-ink underline underline-offset-4 decoration-accent decoration-2 hover:text-accent-dark cursor-pointer"
        >
          ← All pulses
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3 shadow-2xs">
            {p.name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Snapshot Overview
          </h1>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1 flex-wrap">
            <span>{p.responses.length} responses</span>
            <span>·</span>
            <span>{rate}% response rate</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
              {p.status === 'live' ? (
                <>
                  <BoltIcon className="w-2.5 h-2.5" /> Live
                </>
              ) : (
                <>
                  <CheckIcon className="w-2.5 h-2.5" /> {p.status}
                </>
              )}
            </span>
          </div>
        </div>

        {snap.overall !== null && (
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-4xl sm:text-5xl text-slate-900 tracking-tight">
              {snap.overall}
            </span>
            <span className="text-xs font-medium text-slate-400">
              / 5.0 overall
            </span>
          </div>
        )}
      </div>

      {/* What's Standing Out - Category Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>Category Performance</span>
        </div>

        {snap.categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {snap.categories.map((cat, i) => {
              const pct = (cat.score / 5) * 100;
              let tag = { text: 'Steady', bg: 'bg-slate-100', color: 'text-slate-600', border: 'border-slate-200' };
              if (cat.score >= 4) {
                tag = { text: 'Strong area', bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200' };
              } else if (cat.score < 3.5) {
                tag = { text: 'Needs attention', bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200' };
              }

              return (
                <div
                  key={i}
                  className="bg-surface border border-slate-200/80 rounded-xl p-5 shadow-xs"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span>{cat.name}</span>
                  </div>

                  <div className="font-bold text-2xl sm:text-3xl text-slate-900 mb-2 tracking-tight">
                    {cat.score}
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span
                    className={`inline-block text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full border ${tag.border} ${tag.bg} ${tag.color}`}
                  >
                    {tag.text}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              No responses recorded yet — category scores will populate as team responses arrive.
            </p>
          </Card>
        )}
      </div>

      {/* All Questions Asked */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>Question Breakdowns</span>
        </div>

        <div className="flex flex-col gap-3">
          {snap.perQuestion.map((pq, i) => {
            const qq = pq.q;
            const qTypeInfo = QTYPES[qq.type] || QTYPES.rating;

            return (
              <div
                key={qq.id}
                className="bg-surface border border-slate-200 rounded-xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {qq.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {qTypeInfo.icon} {qTypeInfo.label}
                      </span>
                      {qq.topic && (
                        <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {qq.topic}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  {qq.type === 'rating' || qq.type === 'likert' ? (
                    pq.avg !== null ? (
                      <span className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                        avg {pq.avg} / 5
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        No responses yet
                      </span>
                    )
                  ) : (
                    <span className="inline-block text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                      {pq.answered} responses
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Comments */}
      {snap.allComments.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Verbatim Team Comments</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'positive', 'neutral', 'attention'].map((filterKey) => (
              <Chip
                key={filterKey}
                active={commentFilter === filterKey}
                onClick={() => setCommentFilter(filterKey)}
              >
                {filterKey === 'all'
                  ? 'All Comments'
                  : filterKey === 'attention'
                  ? 'Needs Attention'
                  : filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
              </Chip>
            ))}
          </div>

          {/* Comments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredComments.map((c, i) => (
              <div
                key={i}
                className="bg-surface border border-slate-200 rounded-xl p-4 sm:p-5 text-sm text-slate-700 leading-relaxed relative shadow-xs"
              >
                "{c.text}"
                {c.isReal && (
                  <span
                    title="Real employee submission"
                    className="absolute top-3 right-3 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100"
                  >
                    Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developer note on Change Metre reuse */}
      <div className="p-6 mb-8 bg-surface border border-slate-200/80 rounded-2xl text-xs text-slate-600 leading-relaxed shadow-xs">
        <div className="flex items-center gap-2 mb-1.5 text-slate-800 font-semibold">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Architecture & Modular Reuse (Change Metre)</span>
        </div>
        <p>
          Pulse Survey is standalone: it owns questions, response controls, employee-facing flows, collection, history, and real-time results. Change Metre (under Measure) owns scheduling and longitudinal comparisons — importing Pulse survey blocks as repeatable measurement points inside a tracked timeline.
        </p>
        <div className="font-mono text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 leading-relaxed overflow-x-auto">
          Baseline → Checkpoint (Pulse Survey) → Checkpoint (Pulse Survey) → Endline Analysis
        </div>
      </div>

      {/* Footer Back Button */}
      <div>
        <Button variant="ghost" onClick={() => setHostScreen('home')}>
          ← Back to your pulses
        </Button>
      </div>
    </div>
  );
}
