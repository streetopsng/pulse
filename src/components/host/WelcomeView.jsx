import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { usePulse } from '../../context/PulseContext';

export function WelcomeView() {
  const { setHostScreen } = usePulse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-xl mx-auto mb-14 pt-2">
        <div className="inline-flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
          <span>Team Engagement Suite</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
          Welcome to <span className="text-accent">Pulse Centre</span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed max-w-md mx-auto">
          Everything you need to check in with your team — create quick pulses, gather honest feedback, and track team health over time.
        </p>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setHostScreen('home')}
          >
            Enter Pulse Centre →
          </Button>
        </div>
      </div>

      {/* What's Inside Grid */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
          <span>Platform Capabilities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6 text-left border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg mb-3 shadow-2xs">
              🎯
            </div>
            <h3 className="font-semibold text-base mb-1 text-slate-900">
              Ready-made templates
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Team experience, manager support, workload and more — or build your own from scratch.
            </p>
          </Card>

          <Card className="p-6 text-left border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg mb-3 shadow-2xs">
              📡
            </div>
            <h3 className="font-semibold text-base mb-1 text-slate-900">
              Live or private
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Run live interactive sessions together in real time, or send async pulses by email.
            </p>
          </Card>

          <Card className="p-6 text-left border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg mb-3 shadow-2xs">
              📈
            </div>
            <h3 className="font-semibold text-base mb-1 text-slate-900">
              History &amp; analytics
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every pulse you've run, participation rates, and sentiment trends in one unified dashboard.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
