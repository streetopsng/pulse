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
    <div className="fixed inset-0 bg-ink/55 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface border-[2.5px] border-ink rounded-3xl p-6 sm:p-8 shadow-hard-lg">
        {/* Close Button */}
        <button
          type="button"
          onClick={closePreview}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full border-2 border-ink bg-surface text-ink flex items-center justify-center font-black shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          ✕
        </button>

        {/* Brand Banner */}
        <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-line-soft">
          <LogoIcon className="w-5 h-5" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-ink-faint">
            Preview · Employee View
          </span>
        </div>

        {isFinished ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-accent border-[2.5px] border-ink flex items-center justify-center text-2xl font-black text-ink mx-auto mb-3 shadow-hard-sm">
              ✓
            </div>
            <h3 className="font-display font-bold text-2xl text-ink mb-2">
              Thanks for sharing.
            </h3>
            <p className="text-xs text-ink-soft mb-6 font-semibold">
              Your response has been recorded.
            </p>
            <Button variant="primary" size="sm" onClick={closePreview}>
              Close Preview
            </Button>
          </div>
        ) : (
          <div>
            {/* Counter & Bar */}
            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-ink-faint mb-2">
              <span>Question {previewQIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>

            <div className="h-2 bg-gray-soft border border-ink rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="font-display font-bold text-xl text-ink mb-6 leading-snug">
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
