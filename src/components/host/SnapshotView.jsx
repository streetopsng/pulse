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
  const rate = p.participantCount
    ? Math.round((p.responses.length / p.participantCount) * 100)
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b-2 border-line-soft mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3 py-1 rounded-full mb-3">
            {p.name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink font-display">
            Snapshot
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-ink-faint font-mono mt-1 flex-wrap">
            <span>{p.responses.length} responses</span>
            <span>·</span>
            <span>{rate}% response rate</span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-[1.5px] border-ink bg-mint-soft text-mint">
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
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-5xl sm:text-6xl text-ink">
              {snap.overall}
            </span>
            <span className="text-sm font-bold text-ink-faint">
              / 5 overall
            </span>
          </div>
        )}
      </div>

      {/* What's Standing Out - Category Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-4">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>What's standing out</span>
        </div>

        {snap.categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {snap.categories.map((cat, i) => {
              const pct = (cat.score / 5) * 100;
              let tag = { text: 'Steady', bg: 'bg-ink-faint/15', color: 'text-ink-faint' };
              if (cat.score >= 4) {
                tag = { text: 'Strong area', bg: 'bg-mint-soft', color: 'text-mint' };
              } else if (cat.score < 3.5) {
                tag = { text: 'Needs attention', bg: 'bg-amber-soft', color: 'text-amber' };
              }

              return (
                <div
                  key={i}
                  className="bg-surface border-2 border-ink rounded-2xl p-5 shadow-hard-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-extrabold text-ink mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent border-[1.5px] border-ink" />
                    <span>{cat.name}</span>
                  </div>

                  <div className="font-display font-bold text-2xl sm:text-3xl text-ink mb-2">
                    {cat.score}
                  </div>

                  <div className="h-2.5 bg-gray-soft border-[1.5px] border-ink rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span
                    className={`inline-block text-[10.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-[1.5px] border-ink ${tag.bg} ${tag.color}`}
                  >
                    {tag.text}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-xs sm:text-sm font-semibold text-ink-faint">
              No responses yet — category scores will appear here once people start answering.
            </p>
          </Card>
        )}
      </div>

      {/* All Questions Asked */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-4">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>All questions asked</span>
        </div>

        <div className="flex flex-col gap-3">
          {snap.perQuestion.map((pq, i) => {
            const qq = pq.q;
            const qTypeInfo = QTYPES[qq.type] || QTYPES.rating;

            return (
              <div
                key={qq.id}
                className="bg-surface border-2 border-ink rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-hard-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg border-2 border-ink bg-accent-soft text-ink text-xs font-black flex items-center justify-center shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-ink">
                      {qq.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10.5px] font-extrabold text-ink bg-gray-soft px-2.5 py-0.5 rounded-full border-[1.5px] border-ink">
                        {qTypeInfo.icon} {qTypeInfo.label}
                      </span>
                      {qq.topic && (
                        <span className="text-[10.5px] font-extrabold text-ink bg-accent-soft px-2.5 py-0.5 rounded-full border-[1.5px] border-ink">
                          {qq.topic}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  {qq.type === 'rating' || qq.type === 'likert' ? (
                    pq.avg !== null ? (
                      <span className="inline-block text-xs font-black bg-accent-soft text-ink px-3 py-1 rounded-full border border-ink">
                        avg {pq.avg} / 5
                      </span>
                    ) : (
                      <span className="text-xs text-ink-faint font-semibold">
                        No responses yet
                      </span>
                    )
                  ) : (
                    <span className="inline-block text-xs font-black bg-gray-soft text-ink px-3 py-1 rounded-full border border-ink">
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
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-3">
            <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
            <span>What your team is saying</span>
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
                  ? 'All'
                  : filterKey === 'attention'
                  ? 'Needs attention'
                  : filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
              </Chip>
            ))}
          </div>

          {/* Comments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredComments.map((c, i) => (
              <div
                key={i}
                className="bg-surface border-2 border-ink rounded-2xl p-4 sm:p-5 text-sm font-semibold leading-relaxed relative shadow-hard-sm"
              >
                "{c.text}"
                {c.isReal && (
                  <span
                    title="Real employee submission"
                    className="absolute top-3 left-3 text-[10px] font-black text-accent-dark"
                  >
                    ●
                  </span>
                )}
                <span
                  className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full border border-ink ${
                    c.tag === 'positive'
                      ? 'bg-mint'
                      : c.tag === 'attention'
                      ? 'bg-amber'
                      : 'bg-ink-faint'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developer note on Change Metre reuse */}
      <div className="p-6 sm:p-8 mb-8 bg-surface border-2 border-ink rounded-3xl text-xs text-ink-soft leading-relaxed shadow-hard-sm">
        <b className="text-ink">Developer / design note — reuse in Change Metre</b>
        <p className="mt-2">
          Pulse Survey is standalone: it owns questions, response controls, the employee-facing experience, collection, history, and these results. Change Metre (a separate, standalone experience under Measure) owns scheduling and longitudinal comparison — it will later import the same Pulse blocks as a repeatable measurement inside a tracked timeline.
        </p>
        <div className="font-mono text-xs text-ink bg-surface-2 border-[1.5px] border-dashed border-ink rounded-2xl p-4 my-4 leading-loose overflow-x-auto">
          CHANGE METRE <br />
          &nbsp;&nbsp;Baseline <br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓ <br />
          &nbsp;&nbsp;Pulse Survey <br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓ <br />
          &nbsp;&nbsp;Checkpoint → Pulse Survey <br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓ <br />
          &nbsp;&nbsp;Checkpoint → Pulse Survey <br />
          &nbsp;&nbsp;&nbsp;&nbsp;↓ <br />
          &nbsp;&nbsp;Endline → Compare Change
        </div>
        <p>
          Reusable blocks built here: RatingScale, LikertScale, ChoiceList, OpenTextarea, SurveyContainer, Stepper, and the computeSnapshot analytics engine.
        </p>
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
