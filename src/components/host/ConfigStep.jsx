import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { DIRECTORY } from '../../constants/directory';
import { usePulse } from '../../context/PulseContext';

export function ConfigStep() {
  const { draft, updateDraft, toggleInvitee, setHostScreen } = usePulse();

  const invitedEmployees = draft.invitedEmployees || [];
  const invitedEmails = new Set(invitedEmployees.map((p) => p.email));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={2} />

      <h2 className="text-xl sm:text-2xl font-black text-ink mb-6 font-display">
        Configure delivery
      </h2>

      {/* Delivery Choice */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-3">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>Delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateDraft({ delivery: 'live' })}
            className={`p-6 rounded-3xl border-2 border-ink text-left transition-all duration-200 cursor-pointer ${
              draft.delivery === 'live'
                ? 'bg-accent-soft shadow-hard'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <div className="w-11 h-11 rounded-2xl border-2 border-ink bg-accent-soft flex items-center justify-center text-xl mb-3">
              📡
            </div>
            <div className="font-display font-bold text-lg text-ink mb-1">
              Live
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Employees get an email invite; you watch aggregate responses arrive in real time.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateDraft({ delivery: 'private' })}
            className={`p-6 rounded-3xl border-2 border-ink text-left transition-all duration-200 cursor-pointer ${
              draft.delivery === 'private'
                ? 'bg-accent-soft shadow-hard'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <div className="w-11 h-11 rounded-2xl border-2 border-ink bg-mint-soft flex items-center justify-center text-xl mb-3">
              ✉️
            </div>
            <div className="font-display font-bold text-lg text-ink mb-1">
              Private
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Employees get an email invite and complete it individually, at their own pace — no live session.
            </p>
          </button>
        </div>
      </div>

      {/* Participants Directory Picker */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-3">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>Who should get the invite?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {DIRECTORY.map((p) => {
            const isSelected = invitedEmails.has(p.email);
            const initials = p.name
              .split(' ')
              .map((x) => x[0])
              .join('');

            return (
              <button
                key={p.email}
                type="button"
                onClick={() => toggleInvitee(p.email)}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 border-ink text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-accent-soft translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_#1B1224]'
                    : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
                }`}
              >
                <div className="w-9 h-9 rounded-full border-2 border-ink bg-accent-tint flex items-center justify-center font-extrabold text-xs text-ink shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-ink truncate">{p.name}</div>
                  <div className="text-[11px] font-semibold text-ink-faint truncate">
                    {p.email}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-md border-2 border-ink bg-surface flex items-center justify-center text-xs font-black text-ink shrink-0">
                  {isSelected && (
                    <span className="w-full h-full bg-accent flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-2 bg-surface border-2 border-ink rounded-full px-4 py-2 text-xs font-extrabold text-ink shadow-hard-sm">
          <span>
            {invitedEmployees.length} employee{invitedEmployees.length === 1 ? '' : 's'} will get an email invite
          </span>
        </div>
      </div>

      {/* Privacy Choice */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink mb-3">
          <span className="w-2 h-2 rounded-xs bg-accent border-[1.5px] border-ink" />
          <span>Privacy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateDraft({ privacy: 'anonymous' })}
            className={`p-5 rounded-2xl border-2 border-ink text-left transition-all duration-150 cursor-pointer ${
              draft.privacy === 'anonymous'
                ? 'bg-accent-soft shadow-hard'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <div className="w-10 h-10 rounded-xl border-2 border-ink bg-grape-soft flex items-center justify-center text-lg mb-2">
              🕶️
            </div>
            <div className="font-display font-bold text-base text-ink mb-1">
              Anonymous
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Responses can't be traced back to a person.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateDraft({ privacy: 'identified' })}
            className={`p-5 rounded-2xl border-2 border-ink text-left transition-all duration-150 cursor-pointer ${
              draft.privacy === 'identified'
                ? 'bg-accent-soft shadow-hard'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <div className="w-10 h-10 rounded-xl border-2 border-ink bg-amber-soft flex items-center justify-center text-lg mb-2">
              🪪
            </div>
            <div className="font-display font-bold text-base text-ink mb-1">
              Identified
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Responses are associated with the person who gave them.
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          disabled={invitedEmployees.length === 0}
          onClick={() => setHostScreen('deploy')}
        >
          Continue to Deploy
        </Button>
        <Button variant="ghost" onClick={() => setHostScreen('builder')}>
          Back
        </Button>
      </div>
    </div>
  );
}
