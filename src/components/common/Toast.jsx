import { usePulse } from '../../context/PulseContext';

export function Toast() {
  const { toastMsg, syncError, setSyncError } = usePulse();

  if (!toastMsg && !syncError) return null;

  return (
    <>
      {syncError && (
        <div role="alert" className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-red-700 text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-start gap-3">
          <span className="flex-1">{syncError}</span>
          <button type="button" onClick={() => setSyncError(null)} aria-label="Dismiss" className="text-white/80 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xl shadow-slate-900/20 border border-slate-800 z-50 transition-all flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
