import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PeopleIcon, ClipboardIcon, BoltIcon, KeyIcon } from '../common/Icons';
import { computeSnapshot } from '../../utils/analytics';
import { usePulse } from '../../context/PulseContext';

export function LiveSession() {
  const {
    activePulse,
    nextLiveQuestion,
    endLivePulse,
    setHostScreen,
    showToast,
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
  const qq = p.questions[p.liveQIndex] || p.questions[0];
  const progressPct = ((p.liveQIndex + 1) / p.questions.length) * 100;
  const snap = computeSnapshot(p);
  const pq = snap.perQuestion[p.liveQIndex];

  function handleCopyLink() {
    const url = `${window.location.origin}/join/${p.joinCode.replace(/\s/g, '')}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      showToast('Participant link copied to clipboard!');
    } else {
      showToast(url);
    }
  }

  function renderLiveAggregates() {
    if (!pq || p.responses.length === 0) {
      return (
        <div className="py-6 text-center">
          <p className="text-sm font-bold text-ink-soft mb-1">
            Waiting for live participant responses…
          </p>
          <p className="text-xs text-ink-faint">
            Share the join code or link below. Responses update automatically.
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
                <div className="flex justify-between text-xs sm:text-sm font-bold text-ink mb-1.5">
                  <span>{opt}</span>
                  <span>{pct}% ({count})</span>
                </div>
                <div className="h-3.5 bg-gray-soft border-[1.5px] border-ink rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
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
        <p className="text-xs font-extrabold text-ink-soft uppercase tracking-wider mb-1">
          {pq.comments.length} comments shared
        </p>
        <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
          {pq.comments.map((c, i) => (
            <div
              key={i}
              className="p-3 bg-surface-2 border border-ink/20 rounded-xl text-xs font-semibold text-ink leading-relaxed"
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
      <div className="bg-surface-2 border-[2.5px] border-ink rounded-3xl p-6 sm:p-8 shadow-hard mb-8 relative">
        {/* Corner Accents */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-accent border border-ink" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent border border-ink" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-accent border border-ink" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-accent border border-ink" />

        {/* Top Console Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dashed border-line-soft pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-ink">
              Live Session Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              📋 Copy Join Link
            </Button>
            <a
              href={`/join/${p.joinCode.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-ink underline underline-offset-4 decoration-accent hover:text-accent-dark"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>

        {/* 4-Stat Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-surface border-2 border-ink rounded-2xl p-3.5 shadow-hard-sm">
            <div className="text-[10.5px] font-black uppercase tracking-wider text-ink-soft flex items-center gap-1 mb-1">
              <PeopleIcon /> Responses
            </div>
            <div className="font-display font-bold text-2xl text-accent-dark">
              {p.responses.length}
              <span className="text-xs font-normal text-ink-faint ml-1">
                / {p.participantCount}
              </span>
            </div>
          </div>

          <div className="bg-surface border-2 border-ink rounded-2xl p-3.5 shadow-hard-sm">
            <div className="text-[10.5px] font-black uppercase tracking-wider text-ink-soft flex items-center gap-1 mb-1">
              <ClipboardIcon /> Question
            </div>
            <div className="font-display font-bold text-2xl text-ink">
              {p.liveQIndex + 1}
              <span className="text-xs font-normal text-ink-faint ml-1">
                / {p.questions.length}
              </span>
            </div>
          </div>

          <div className="bg-surface border-2 border-ink rounded-2xl p-3.5 shadow-hard-sm">
            <div className="text-[10.5px] font-black uppercase tracking-wider text-ink-soft flex items-center gap-1 mb-1">
              <BoltIcon /> Status
            </div>
            <div className="font-display font-bold text-2xl text-accent-dark">
              Live
            </div>
          </div>

          <div className="bg-surface border-2 border-ink rounded-2xl p-3.5 shadow-hard-sm">
            <div className="text-[10.5px] font-black uppercase tracking-wider text-ink-soft flex items-center gap-1 mb-1">
              <KeyIcon /> Join code
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-ink">
              {p.joinCode}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-soft border-[1.5px] border-ink rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Live Question Card */}
        <Card className="p-6 mb-6">
          <div className="inline-flex items-center gap-1 text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-ink bg-accent-soft text-accent-dark mb-3">
            {qq.type.toUpperCase()}
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-ink mb-5 leading-snug">
            {qq.text}
          </h3>
          {renderLiveAggregates()}
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
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

      {/* Nav */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setHostScreen('home')}
          className="text-xs font-black text-ink underline underline-offset-4 decoration-accent hover:text-accent-dark cursor-pointer"
        >
          ← Back to your pulses
        </button>
      </div>
    </div>
  );
}
