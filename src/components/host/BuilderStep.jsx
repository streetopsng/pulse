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
              className="bg-surface border border-slate-200/80 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Question Item Header */}
              <div
                onClick={() => toggleBuilderQ(qq.id)}
                className="flex items-center gap-3 p-4 sm:px-5 cursor-pointer select-none"
              >
                <span className="text-slate-400 text-sm cursor-grab">⠿</span>

                <span className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {qq.text || 'Untitled question'}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/70">
                      {qTypeInfo.icon} {qTypeInfo.label}
                    </span>
                    {qq.topic && (
                      <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
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
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === draft.questions.length - 1}
                    onClick={() => moveQuestion(qq.id, 1)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    title="Duplicate"
                    onClick={() => duplicateQuestion(qq.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => deleteQuestion(qq.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Collapsible Edit Form */}
              {isOpen && (
                <div className="border-t border-slate-200 p-5 sm:pl-14 flex flex-col gap-4 bg-slate-50/50">
                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Question text
                    </label>
                    <input
                      type="text"
                      value={qq.text}
                      onChange={(e) => editQuestion(qq.id, 'text', e.target.value)}
                      placeholder="e.g. I feel supported by my manager."
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                    />
                  </div>

                  {/* Response Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Response type
                    </label>
                    <select
                      value={qq.type}
                      onChange={(e) => editQuestion(qq.id, 'type', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs cursor-pointer"
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
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                              className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(qq.id, optIndex)}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(qq.id)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                      >
                        + Add option
                      </button>
                    </div>
                  )}

                  {/* Topic Tag */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Topic (for snapshot category analytics)
                    </label>
                    <input
                      type="text"
                      value={qq.topic || ''}
                      onChange={(e) => editQuestion(qq.id, 'topic', e.target.value)}
                      placeholder="e.g. Communication, Well-being, Support"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-2xs"
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleBuilderQ(qq.id)}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                    >
                      Done editing
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qq.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
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
        className="w-full py-3.5 border border-dashed border-slate-300 hover:border-purple-400 bg-white hover:bg-purple-50/40 rounded-xl text-sm font-semibold text-slate-700 hover:text-purple-600 transition-all cursor-pointer mb-8 flex items-center justify-center gap-2 shadow-2xs"
      >
        + Add Question
      </button>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <Button
          variant="primary"
          disabled={draft.questions.length === 0}
          onClick={() => setHostScreen('config')}
        >
          Continue to Configuration →
        </Button>
        <Button
          variant="ghost"
          onClick={() => setHostScreen('create')}
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}
