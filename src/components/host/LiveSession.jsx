import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PeopleIcon, ClipboardIcon, BoltIcon, CalendarIcon } from '../common/Icons';
import { computeSnapshot } from '../../utils/analytics';
import { usePulse } from '../../context/PulseContext';

export function LiveSession() {
  const {
    activePulse,
    nextLiveQuestion,
    endLivePulse,
    simulateLiveJoins,
    setHostScreen,
  } = usePulse();

  if (!activePulse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sm font-bold text-ink-soft mb-4">
          No live session is currently active.
        </p>
        <Button variant="primary" onClick={() => setHostScreen('home')}>
          Return to Pulses
        </Button>
      </div>
    );
  }

  const p = activePulse;
  const totalInvited = p.invitedEmployees?.length || 0;
  const qq = p.questions[p.liveQIndex] || p.questions[0];
  const progressPct = ((p.liveQIndex + 1) / p.questions.length) * 100;
  const snap = computeSnapshot(p);
  const pq = snap.perQuestion[p.liveQIndex];

  function renderLiveAggregates() {
    if (!pq || p.responses.length === 0) {
      return (
        <div className="py-6 text-center">
          <p className="text-sm font-bold text-ink-soft mb-1">
            Waiting for live participant responses…
          </p>
          <p className="text-xs text-ink-faint">
            Employees have been invited by email. You can simulate incoming responses below.
          </p>
        </div>
      );
    }

    if (qq.type === 'rating') {
      return (
        <div className="font-display text-4xl sm:text-5xl font-bold text-ink">
          {pq.avg ?? '—'}
          <span className="text-base sm:text-lg font-semibold text-ink-faint ml-2">
            / {qq.scaleMax || 5}
          </span>
        </div>
      );
    }

    if (qq.type === 'likert') {
      return (
        <div>
          <div className="font-display text-4xl sm:text-5xl font-bold text-ink">
            {pq.avg ?? '—'}
            <span className="text-base sm:text-lg font-semibold text-ink-faint ml-2">
              / 5
            </span>
          </div>
          <p className="text-xs font-semibold text-ink-faint mt-2">
            Average agreement across {pq.answered} responses
          </p>
        </div>
      );
    }

    if (qq.type === 'single' || qq.type === 'multi') {
      const total = pq.dist.reduce((a, b) => a + b, 0) || 1;
      return (
        <div className="flex flex-col gap-3">
          {(qq.options || []).map((opt, optIndex) => {
            const count = pq.dist[optIndex] || 0;
            const pct = Math.round((count / total) * 100);

            return (
              <div key={optIndex} className="w-full">
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  <span>{opt}</span>
                  <span className="text-slate-500">{pct}% ({count})</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // open comments
    return (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {pq.comments.length} comments shared
        </p>
        <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
          {pq.comments.map((c, i) => (
            <div
              key={i}
              className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed"
            >
              "{c.text}"
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Console Frame */}
      <div className="bg-surface border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 relative">
        {/* Top Console Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Session Active
            </span>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Invited: <span className="font-semibold text-slate-900">{totalInvited} employees</span>
          </div>
        </div>

        {/* 4-Stat Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
              <PeopleIcon className="w-3.5 h-3.5 text-slate-400" /> Responses
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {p.responses.length}
              <span className="text-xs font-normal text-slate-400 ml-1">
                / {totalInvited}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
              <ClipboardIcon className="w-3.5 h-3.5 text-slate-400" /> Question
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {p.liveQIndex + 1}
              <span className="text-xs font-normal text-slate-400 ml-1">
                / {p.questions.length}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
              <BoltIcon className="w-3.5 h-3.5 text-slate-400" /> Mode
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              Realtime
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> Sent
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {p.createdDate}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Live Question Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 mb-6 shadow-xs">
          <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
            {qq.type.toUpperCase()}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-5 leading-snug">
            {qq.text}
          </h3>
          {renderLiveAggregates()}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <Button variant="ghost" onClick={simulateLiveJoins}>
            ⚡ Simulate Responses
          </Button>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" onClick={endLivePulse}>
              End Pulse &amp; View Snapshot
            </Button>
            <Button
              variant="primary"
              disabled={p.liveQIndex >= p.questions.length - 1}
              onClick={nextLiveQuestion}
            >
              Next Question →
            </Button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="text-center">
        <p className="text-xs text-slate-400 font-medium mb-2">
          Invited by email · {totalInvited} participants
        </p>
        <button
          type="button"
          onClick={() => setHostScreen('home')}>
          ← Back to your pulses
        </button>
      </div>
    </div>
  );
}
