import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { usePulse } from '../../context/PulseContext';

export function PrivateStatus() {
  const {
    activePulse,
    closePulse,
    openSnapshot,
    setHostScreen,
    showToast,
  } = usePulse();

  if (!activePulse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sm font-bold text-ink-soft mb-4">
          No private survey is currently active.
        </p>
        <Button variant="primary" onClick={() => setHostScreen('home')}>
          Return to Pulses
        </Button>
      </div>
    );
  }

  const p = activePulse;
  const pct = p.participantCount
    ? Math.round((p.responses.length / p.participantCount) * 100)
    : 0;

  function handleCopyLink() {
    const url = `${window.location.origin}/join/${p.joinCode.replace(/\s/g, '')}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      showToast('Participant link copied to clipboard!');
    } else {
      showToast(url);
    }
  }

  function handleCloseAndSnapshot() {
    closePulse(p.id);
    openSnapshot(p.id);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3.5 py-1.5 rounded-full mb-3">
          Private Pulse · Collecting Responses
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          {p.name}
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft mt-1.5 font-bold">
          Target: {p.participantCount} employee responses
        </p>
      </div>

      {/* Progress Card */}
      <Card className="p-8 sm:p-10 text-center mb-6">
        <div className="font-display font-bold text-4xl sm:text-5xl text-ink mb-1">
          {p.responses.length} / {p.participantCount}
        </div>
        <p className="text-xs sm:text-sm font-bold text-ink-faint mb-6">
          responses recorded ({pct}%)
        </p>

        {/* Progress Track */}
        <div className="max-w-xs mx-auto h-3.5 bg-gray-soft border-[1.5px] border-ink rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-mint rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Share Link Banner */}
        <div className="bg-accent-soft border-2 border-ink rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <div className="text-xs font-black text-ink uppercase tracking-wider">
              Participant Join Code: <span className="text-accent-dark font-mono text-sm">{p.joinCode}</span>
            </div>
            <div className="text-[11px] text-ink-soft font-semibold mt-0.5">
              Share link with your team to collect their honest feedback
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            📋 Copy Link
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => openSnapshot(p.id)}
          >
            View Real-time Snapshot
          </Button>
          <Button
            variant="ghost"
            onClick={handleCloseAndSnapshot}
          >
            End Survey &amp; Finalize
          </Button>
        </div>
      </Card>

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
