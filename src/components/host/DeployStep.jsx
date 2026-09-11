import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { usePulse } from '../../context/PulseContext';

export function DeployStep() {
  const { draft, deployPulse, openPreview, setHostScreen } = usePulse();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={3} />

      {/* Summary Card */}
      <div className="bg-surface border-[2.5px] border-ink rounded-[34px] p-6 sm:p-10 shadow-hard-lg relative overflow-hidden mb-8">
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-accent-soft pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3.5 py-1.5 rounded-full mb-3">
            Ready to launch
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-6">
            {draft.name}
          </h2>

          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3.5 border-b-2 border-dashed border-line-soft">
              <span className="text-sm font-bold text-ink-soft">Questions</span>
              <span className="text-sm font-extrabold text-ink">
                {draft.questions.length}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b-2 border-dashed border-line-soft">
              <span className="text-sm font-bold text-ink-soft">Participants</span>
              <span className="text-sm font-extrabold text-ink">
                {draft.participantCount} people
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b-2 border-dashed border-line-soft">
              <span className="text-sm font-bold text-ink-soft">Privacy</span>
              <span className="text-sm font-extrabold text-ink">
                {draft.privacy === 'anonymous' ? 'Anonymous' : 'Identified'}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm font-bold text-ink-soft">Delivery</span>
              <span className="text-sm font-extrabold text-ink">
                {draft.delivery === 'live' ? 'Live session' : 'Private, self-paced'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={deployPulse}>
          {draft.delivery === 'live' ? 'Start Live Pulse' : 'Send Pulse'}
        </Button>
        <Button variant="ghost" onClick={openPreview}>
          Preview as Employee
        </Button>
        <Button
          variant="text"
          onClick={() => setHostScreen('config')}
          className="ml-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
