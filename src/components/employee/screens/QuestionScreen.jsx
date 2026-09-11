import { RatingScale } from '../../inputs/RatingScale';
import { LikertScale } from '../../inputs/LikertScale';
import { ChoiceList } from '../../inputs/ChoiceList';
import { OpenTextarea } from '../../inputs/OpenTextarea';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function QuestionScreen() {
  const {
    activePulse,
    empQIndex,
    empAnswers,
    empAnswer,
    empAnswerMulti,
    empNext,
    empBack,
  } = usePulse();

  if (!activePulse) return null;

  const questions = activePulse.questions;
  const qq = questions[empQIndex];
  if (!qq) return null;

  const currentAnswer = empAnswers[qq.id];
  const isLast = empQIndex === questions.length - 1;
  const progressPct = ((empQIndex + 1) / questions.length) * 100;

  return (
    <div>
      {/* Question Counter & Progress */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-ink-faint mb-2">
        <span>Question {empQIndex + 1} of {questions.length}</span>
        <span>{Math.round(progressPct)}%</span>
      </div>

      <div className="h-2 bg-gray-soft border border-ink rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Headline */}
      <h2 className="font-display font-black text-xl sm:text-2xl text-ink mb-6 leading-snug">
        {qq.text}
      </h2>

      {/* Dynamic Input Widget */}
      <div className="mb-8">
        {qq.type === 'rating' && (
          <RatingScale
            max={qq.scaleMax || 5}
            value={currentAnswer}
            onChange={(val) => empAnswer(qq.id, val, true)}
          />
        )}

        {qq.type === 'likert' && (
          <LikertScale
            value={currentAnswer}
            onChange={(val) => empAnswer(qq.id, val, true)}
          />
        )}

        {qq.type === 'single' && (
          <ChoiceList
            options={qq.options}
            value={currentAnswer}
            onChange={(val) => empAnswer(qq.id, val, true)}
            multi={false}
          />
        )}

        {qq.type === 'multi' && (
          <ChoiceList
            options={qq.options}
            value={currentAnswer}
            onChange={(idx) => empAnswerMulti(qq.id, idx)}
            multi={true}
          />
        )}

        {qq.type === 'open' && (
          <OpenTextarea
            value={currentAnswer || ''}
            onChange={(val) => empAnswer(qq.id, val, false)}
          />
        )}
      </div>

      {/* Nav Controls */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-line-soft">
        {empQIndex > 0 ? (
          <Button variant="text" onClick={empBack}>
            ← Back
          </Button>
        ) : (
          <div />
        )}

        {(qq.type === 'open' || qq.type === 'multi' || currentAnswer !== undefined) && (
          <Button variant="primary" size="sm" onClick={empNext}>
            {isLast ? 'Submit' : 'Next →'}
          </Button>
        )}
      </div>
    </div>
  );
}
