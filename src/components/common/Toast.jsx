import { usePulse } from '../../context/PulseContext';

export function Toast() {
  const { toastMsg } = usePulse();

  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xl shadow-slate-900/20 border border-slate-800 z-50 transition-all flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      <span>{toastMsg}</span>
    </div>
  );
}
