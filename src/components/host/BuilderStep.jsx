import { Stepper } from '../common/Stepper';
import { Button } from '../common/Button';
import { QTYPES } from '../../constants/questionTypes';
import { usePulse } from '../../context/PulseContext';

export function BuilderStep() {
  const {
    draft,
    toggleBuilderQ,
    editQuestion,
    moveQuestion,
    duplicateQuestion,
    deleteQuestion,
    addQuestion,
    addOption,
    editOption,
    removeOption,
    openPreview,
    setHostScreen,
  } = usePulse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Stepper currentStepIndex={1} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink font-display">
            {draft.name || 'Untitled Pulse'}
          </h2>
          <p className="text-xs font-bold text-ink-faint mt-0.5">
            {draft.questions.length} questions
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={openPreview}>
          Preview
        </Button>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-3 mb-4">
        {draft.questions.map((qq, index) => {
          const isOpen = draft.openQ === qq.id;
          const qTypeInfo = QTYPES[qq.type] || QTYPES.rating;

          return (
            <div
              key={qq.id}
              className="bg-surface border-2 border-ink rounded-2xl overflow-hidden shadow-hard-sm transition-shadow"
            >
              {/* Question Item Header */}
              <div
                onClick={() => toggleBuilderQ(qq.id)}
                className="flex items-center gap-3 p-4 sm:px-5 cursor-pointer select-none"
              >
                <span className="text-ink-faint text-base cursor-grab">⠿</span>

                <span className="w-7 h-7 rounded-lg border-2 border-ink bg-accent-soft text-ink text-xs font-black flex items-center justify-center shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink truncate">
                    {qq.text || 'Untitled question'}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10.5px] font-extrabold text-ink bg-gray-soft px-2.5 py-0.5 rounded-full border-[1.5px] border-ink">
                      {qTypeInfo.icon} {qTypeInfo.label}
                    </span>
                    {qq.topic && (
                      <span className="text-[10.5px] font-extrabold text-ink bg-accent-soft px-2.5 py-0.5 rounded-full border-[1.5px] border-ink">
                        {qq.topic}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    title="Move up"
                    disabled={index === 0}
                    onClick={() => moveQuestion(qq.id, -1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-ink-faint hover:bg-surface-2 hover:border hover:border-ink hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === draft.questions.length - 1}
                    onClick={() => moveQuestion(qq.id, 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-ink-faint hover:bg-surface-2 hover:border hover:border-ink hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    title="Duplicate"
                    onClick={() => duplicateQuestion(qq.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-ink-faint hover:bg-surface-2 hover:border hover:border-ink hover:text-ink cursor-pointer"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => deleteQuestion(qq.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-ink-faint hover:bg-red-100 hover:border hover:border-red-600 hover:text-red-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Collapsible Edit Form */}
              {isOpen && (
                <div className="border-t-2 border-ink p-5 sm:pl-14 flex flex-col gap-4 bg-surface-2/40">
                  {/* Question Text */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-ink mb-1.5">
                      Question text
                    </label>
                    <input
                      type="text"
                      value={qq.text}
                      onChange={(e) => editQuestion(qq.id, 'text', e.target.value)}
                      placeholder="e.g. I feel supported by my manager."
                      className="w-full border-2 border-ink rounded-xl px-4 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0]"
                    />
                  </div>

                  {/* Response Type Selector */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-ink mb-1.5">
                      Response type
                    </label>
                    <select
                      value={qq.type}
                      onChange={(e) => editQuestion(qq.id, 'type', e.target.value)}
                      className="w-full border-2 border-ink rounded-xl px-4 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0]"
                    >
                      {Object.entries(QTYPES).map(([typeKey, typeMeta]) => (
                        <option key={typeKey} value={typeKey}>
                          {typeMeta.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choice Options Editor */}
                  {(qq.type === 'single' || qq.type === 'multi') && (
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-ink mb-2">
                        Options
                      </label>
                      <div className="flex flex-col gap-2 mb-2">
                        {(qq.options || []).map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                editOption(qq.id, optIndex, e.target.value)
                              }
                              className="flex-1 border-2 border-ink rounded-xl px-3 py-2 text-sm bg-surface text-ink focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(qq.id, optIndex)}
                              className="w-8 h-8 rounded-full border-2 border-ink bg-surface flex items-center justify-center text-xs font-black hover:bg-red-50"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(qq.id)}
                        className="text-xs font-black text-ink underline underline-offset-2 hover:text-accent-dark cursor-pointer"
                      >
                        + Add option
                      </button>
                    </div>
                  )}

                  {/* Topic Tag */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-ink mb-1.5">
                      Topic (for snapshot category cards)
                    </label>
                    <input
                      type="text"
                      value={qq.topic || ''}
                      onChange={(e) => editQuestion(qq.id, 'topic', e.target.value)}
                      placeholder="e.g. Communication, Well-being, Support"
                      className="w-full border-2 border-ink rounded-xl px-4 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0]"
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleBuilderQ(qq.id)}
                      className="text-xs font-black text-ink underline underline-offset-2 hover:text-accent-dark cursor-pointer"
                    >
                      Done editing
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qq.id)}
                      className="text-xs font-black text-red-600 hover:text-red-800 underline underline-offset-2 cursor-pointer"
                    >
                      Delete question
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Question Button */}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full py-4 border-[2.5px] border-dashed border-ink rounded-2xl text-sm font-extrabold text-ink hover:bg-accent-soft hover:border-solid transition-all cursor-pointer mb-8"
      >
        + Add Question
      </button>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          disabled={draft.questions.length === 0}
          onClick={() => setHostScreen('config')}
        >
          Continue to Configuration
        </Button>
        <Button
          variant="ghost"
          onClick={() => setHostScreen('create')}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
