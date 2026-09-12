import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { usePulse } from '../../context/PulseContext';

export function DeployStep() {
  const { draft, deployPulse, openPreview, setHostScreen } = usePulse();
  const inviteCount = draft.invitedEmployees?.length || 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={3} />

      {/* Summary Card */}
      <div className="bg-surface border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready to Deploy</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            {draft.name}
          </h2>

          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Questions</span>
              <span className="text-sm font-semibold text-slate-900">
                {draft.questions.length}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Target Audience</span>
              <span className="text-sm font-semibold text-slate-900">
                {inviteCount > 0
                  ? `${inviteCount} specified recipient${inviteCount === 1 ? '' : 's'}`
                  : 'Open Access (Anyone with Link or Code)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Privacy Guarantee</span>
              <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {draft.privacy === 'anonymous' ? 'Fully Anonymous' : 'Identified by Email'}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm font-medium text-slate-500">Delivery Channel</span>
              <span className="text-sm font-semibold text-slate-900">
                {draft.delivery === 'live'
                  ? 'Real-Time Live Poll'
                  : 'Async / Self-Paced (Open Window)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button variant="primary" size="lg" onClick={deployPulse}>
          {draft.delivery === 'live' ? 'Launch Live Session →' : 'Publish & Activate Pulse →'}
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
