import { Button } from '../common/Button';
import { PulseCard } from './PulseCard';
import { usePulse } from '../../context/PulseContext';

export function HomeView() {
  const { pulses, startCreate } = usePulse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase text-purple-700 bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full mb-2.5 shadow-2xs">
            Continuous Listening Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pulse Surveys
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, collect, and analyze real-time sentiment benchmarks across your organization.
          </p>
        </div>

        {pulses.length > 0 && (
          <Button variant="primary" onClick={startCreate}>
            + Create Pulse
          </Button>
        )}
      </div>

      {/* Zero State (Pitch-Ready for $1M Seed Demo) or Pulses List */}
      {pulses.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-5 shadow-xs">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              No Active Pulse Surveys Yet
            </h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
              Launch your first pulse survey in under two minutes. Select from research-backed team engagement frameworks or build custom questions.
            </p>

            <div>
              <Button variant="primary" size="lg" onClick={startCreate}>
                + Create Your First Pulse
              </Button>
            </div>
          </div>
        </div>
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
