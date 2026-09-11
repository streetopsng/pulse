import { usePulse } from '../../context/PulseContext';

export function Toast() {
  const { toastMsg } = usePulse();

  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-ink text-white font-bold text-sm px-6 py-3 rounded-full border-2 border-ink shadow-[4px_4px_0px_#7A4FE0] z-50 animate-bounce transition-all">
      {toastMsg}
    </div>
  );
}
