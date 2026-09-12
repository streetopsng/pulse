import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { usePulse } from '../../context/PulseContext';

export function CreateStep() {
  const { draft, updateDraft, setHostScreen } = usePulse();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={0} />

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
          Create Pulse Survey
        </h2>
        <p className="text-sm text-slate-500">
          Name your pulse survey and define its scope before configuring questions.
        </p>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Survey Name <span className="text-purple-600">*</span>
          </label>
          <input
            type="text"
            autoFocus
            value={draft.name}
            onChange={(e) => updateDraft({ name: e.target.value })}
            placeholder="e.g. Q3 Team Health &amp; Pace Check-in"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Context &amp; Objective (Optional)
          </label>
          <textarea
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
            placeholder="Explain to participants what this pulse is measuring and how responses will be used..."
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium bg-slate-50/50 text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <Button
          variant="primary"
          size="lg"
          disabled={!draft.name.trim()}
          onClick={() => setHostScreen('builder')}
        >
          Continue to Builder →
        </Button>
        <Button variant="ghost" onClick={() => setHostScreen('home')}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
