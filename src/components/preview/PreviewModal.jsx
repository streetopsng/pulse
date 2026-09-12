import { RatingScale } from '../inputs/RatingScale';
import { LikertScale } from '../inputs/LikertScale';
import { ChoiceList } from '../inputs/ChoiceList';
import { OpenTextarea } from '../inputs/OpenTextarea';
import { Button } from '../common/Button';
import { LogoIcon } from '../common/Icons';
import { usePulse } from '../../context/PulseContext';

export function PreviewModal() {
  const {
    previewOpen,
    previewQIndex,
    previewAnswers,
    previewAnswer,
    previewAnswerMulti,
    previewNext,
    closePreview,
    draft,
  } = usePulse();

  if (!previewOpen) return null;

  const questions = draft.questions;
  const qq = questions[previewQIndex];
  const isFinished = !qq;
  const progressPct = questions.length ? ((previewQIndex + 1) / questions.length) * 100 : 0;
  const currentAnswer = qq ? previewAnswers[qq.id] : undefined;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closePreview}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          ✕
        </button>

        {/* Brand Banner */}
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
          <LogoIcon className="w-5 h-5" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Preview · Participant Experience
          </span>
        </div>

        {isFinished ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl font-bold text-emerald-600 mx-auto mb-3 shadow-2xs">
              ✓
            </div>
            <h3 className="font-semibold text-xl text-slate-900 mb-2">
              Thanks for sharing.
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Your response has been recorded.
            </p>
            <Button variant="primary" size="sm" onClick={closePreview}>
              Close Preview
            </Button>
          </div>
        ) : (
          <div>
            {/* Counter & Bar */}
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <span>Question {previewQIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-6 leading-snug">
              {qq.text}
            </h3>

            {/* Dynamic Input */}
            <div className="mb-6">
              {qq.type === 'rating' && (
                <RatingScale
                  max={qq.scaleMax || 5}
                  value={currentAnswer}
                  onChange={(val) => previewAnswer(qq.id, val, true)}
                />
              )}

              {qq.type === 'likert' && (
                <LikertScale
                  value={currentAnswer}
                  onChange={(val) => previewAnswer(qq.id, val, true)}
                />
              )}

              {qq.type === 'single' && (
                <ChoiceList
                  options={qq.options}
                  value={currentAnswer}
                  onChange={(val) => previewAnswer(qq.id, val, true)}
                  multi={false}
                />
              )}

              {qq.type === 'multi' && (
                <ChoiceList
                  options={qq.options}
                  value={currentAnswer}
                  onChange={(idx) => previewAnswerMulti(qq.id, idx)}
                  multi={true}
                />
              )}

              {qq.type === 'open' && (
                <OpenTextarea
                  value={currentAnswer || ''}
                  onChange={(val) => previewAnswer(qq.id, val, false)}
                />
              )}
            </div>

            {/* Advance Button */}
            {(qq.type === 'open' || qq.type === 'multi' || currentAnswer !== undefined) && (
              <div className="text-right pt-3 border-t-2 border-line-soft">
                <Button variant="primary" size="sm" onClick={previewNext}>
                  {previewQIndex === questions.length - 1 ? 'Finish' : 'Next →'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
