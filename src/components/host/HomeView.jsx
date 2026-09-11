import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PulseCard } from './PulseCard';
import { usePulse } from '../../context/PulseContext';

export function HomeView() {
  const { pulses, startCreate } = usePulse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3 py-1 rounded-full mb-2">
            Team Engagement · Pulse Survey
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display">
            Your pulses
          </h1>
          <p className="text-ink-soft text-sm mt-1">
            Every pulse you've run — its questions, and what the team said.
          </p>
        </div>

        {pulses.length > 0 && (
          <Button variant="primary" onClick={startCreate}>
            + Create Pulse
          </Button>
        )}
      </div>

      {/* Pulses List or Empty state */}
      {pulses.length === 0 ? (
        <Card className="p-10 sm:p-14 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent-soft border-2 border-ink flex items-center justify-center text-3xl mx-auto mb-4 shadow-hard-sm">
            ✨
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-ink mb-2">
            No pulse surveys yet
          </h3>
          <p className="text-ink-soft text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Create your first pulse check to get honest, anonymous feedback and actionable insights from your team.
          </p>
          <Button variant="primary" size="lg" onClick={startCreate}>
            + Create Your First Pulse
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {pulses.map((pulse) => (
            <PulseCard key={pulse.id} pulse={pulse} />
          ))}
        </div>
      )}
    </div>
  );
}
