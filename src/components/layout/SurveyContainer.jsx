import { LogoIcon } from '../common/Icons';

export function SurveyContainer({ children, badgeText = 'GUMMYGUM' }) {
  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-surface border-2 sm:border-[2.5px] border-ink rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-hard sm:shadow-hard-lg relative">
        {/* Survey Badge */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 pb-4 border-b-2 border-line-soft">
          <LogoIcon className="w-5 h-5 shrink-0" />
          <span className="text-[10.5px] font-extrabold tracking-widest text-ink-faint uppercase font-body">
            {badgeText}
          </span>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
