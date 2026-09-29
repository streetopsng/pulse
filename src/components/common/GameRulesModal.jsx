import { Button } from './Button';
import { ArrowRightIcon, LightbulbIcon } from './Icons';

export function GameRulesModal({ onConfirm, name, anonymous = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white border-2 border-slate-200/80 rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto text-slate-900">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            Survey Overview
          </div>
          <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
            How Pulse Works
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-600 mt-1.5 leading-relaxed">
            Welcome{name ? `, ${name}` : ''}! Before you begin, here is what you need to know about this check-in.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs">
              1
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-slate-900">Answer candid questions</div>
              <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">
                Share your honest take on workload, team connection, energy, and work satisfaction.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs">
              2
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-slate-900">
                {anonymous ? 'Responses are 100% confidential' : 'Responses are attributed to you'}
              </div>
              <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">
                {anonymous
                  ? 'Individual responses are aggregated into collective trends so your feedback remains completely safe.'
                  : 'Your host will see your answers alongside your email, as well as the overall team trends.'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs">
              3
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-slate-900">Drive meaningful action</div>
              <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">
                Team leaders use overall sentiment and highlights to build a better, healthier work environment.
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-left flex items-center gap-2.5 mb-6">
          <LightbulbIcon className="w-4 h-4 shrink-0 text-purple-600" />
          <span className="text-[11.5px] text-purple-900 font-medium leading-snug">
            <strong>Pro tip:</strong> Take your time — you can navigate back to adjust any response before final submission.
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={onConfirm}
          className="w-full py-3.5 text-sm sm:text-base font-bold rounded-xl cursor-pointer shadow-md bg-purple-600 hover:bg-purple-700 text-white"
        >
          Got it, begin survey <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
