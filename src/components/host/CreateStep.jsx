import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { TEMPLATES } from '../../constants/templates';
import { usePulse } from '../../context/PulseContext';

export function CreateStep() {
  const { draft, updateDraft, pickTemplate, setHostScreen } = usePulse();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={0} />

      <h2 className="text-xl sm:text-2xl font-extrabold text-ink mb-6 font-display">
        Create Pulse Survey
      </h2>

      {/* Form Fields */}
      <div className="mb-5">
        <label className="block text-xs font-black uppercase tracking-wider text-ink mb-2">
          Pulse name
        </label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => updateDraft({ name: e.target.value })}
          placeholder="e.g. Q3 Team Check-in"
          className="w-full border-2 border-ink rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0] transition-shadow"
        />
      </div>

      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-wider text-ink mb-2">
          Description
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          placeholder="What's this pulse about?"
          rows={3}
          className="w-full border-2 border-ink rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-faint resize-none focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0] transition-shadow"
        />
      </div>

      {/* Template Gallery */}
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-4">
        <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
        <span>Start from a template, or build your own</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(TEMPLATES).map(([id, t]) => {
          const isSelected = draft.template === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => pickTemplate(id)}
              className={`p-5 rounded-2xl border-2 border-ink text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-accent-soft shadow-hard'
                  : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border-2 border-ink ${t.bgColor} flex items-center justify-center text-lg mb-3`}
              >
                {t.icon}
              </div>
              <div className="font-display font-bold text-base text-ink mb-1">
                {t.name}
              </div>
              <div className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                {t.desc}
              </div>
              <div className="text-[10.5px] font-black uppercase tracking-wider text-ink-faint mt-3">
                {t.questions.length
                  ? `${t.questions.length} example questions`
                  : 'Blank canvas'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          disabled={!draft.name.trim() || !draft.template}
          onClick={() => setHostScreen('builder')}
        >
          Continue to Builder
        </Button>
        <Button
          variant="ghost"
          onClick={() => setHostScreen('home')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
