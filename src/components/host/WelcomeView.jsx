import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { usePulse } from '../../context/PulseContext';

export function WelcomeView() {
  const { setHostScreen } = usePulse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 font-extrabold text-[11px] tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3 py-1 rounded-full mb-3 shadow-2xs">
          GummyGum · Team Engagement
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3 text-ink font-display">
          Welcome to <br />
          <span className="text-accent">Pulse Centre</span>
        </h1>

        <p className="text-ink-soft text-sm sm:text-base mb-6 leading-relaxed">
          Everything you need to check in with your team — create a pulse, see what people are saying, and keep track of it over time.
        </p>

        <Button
          variant="primary"
          size="md"
          onClick={() => setHostScreen('home')}
        >
          Enter Pulse Centre →
        </Button>
      </div>

      {/* What's Inside Grid */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-4">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>What's inside</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 text-left">
            <div className="w-9 h-9 rounded-xl border-2 border-ink bg-accent-soft flex items-center justify-center text-base mb-2.5">
              🎯
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base mb-1 text-ink">
              Ready-made templates
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Team experience, manager support, workload and more — or build your own from scratch.
            </p>
          </Card>

          <Card className="p-5 text-left">
            <div className="w-9 h-9 rounded-xl border-2 border-ink bg-mint-soft flex items-center justify-center text-base mb-2.5">
              📡
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base mb-1 text-ink">
              Live or private
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Run it together in real time, or send it out for people to answer on their own.
            </p>
          </Card>

          <Card className="p-5 text-left">
            <div className="w-9 h-9 rounded-xl border-2 border-ink bg-grape-soft flex items-center justify-center text-base mb-2.5">
              🌤️
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base mb-1 text-ink">
              History &amp; analytics
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Every pulse you've run, and what the team said — together, in one place.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
