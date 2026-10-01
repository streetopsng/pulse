import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePulse } from '../../context/PulseContext';
import { useGummyGum } from '../../context/GummyGumContext';
import { ConfirmationModal } from '../common/ConfirmationModal';

export function TopBar() {
  const { hostScreen, setHostScreen, endHostSession, ggHostPulse } = usePulse();
  const finalised = ggHostPulse?.status === 'completed';
  const { ggSession } = useGummyGum();
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const hostExitInProgressRef = useRef(false);

  async function handleConfirmEnd() {
    if (hostExitInProgressRef.current) return;
    hostExitInProgressRef.current = true;
    setEnding(true);
    try {
      await endHostSession();
    } catch (err) {
      console.error('End session failed', err);
      hostExitInProgressRef.current = false;
      setEnding(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
        {/* Brand & Context */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            onClick={() => setHostScreen('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Pulse
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/70">
              Enterprise
            </span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-4">
            <button
              type="button"
              onClick={() => setHostScreen('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                hostScreen === 'home'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setHostScreen('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                hostScreen === 'snapshot'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Right Controls: Host User Pill */}
        <div className="flex items-center gap-3">
          {ggSession?.isHost && (
            <button
              type="button"
              onClick={() => setConfirmEndOpen(true)}
              disabled={ending}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {ending ? 'Ending...' : 'End session'}
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-xs text-purple-700 shadow-2xs">
                H
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-slate-900">
                Lead Host
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Team Admin
              </span>
            </div>
          </div>
        </div>
      </header>
      <ConfirmationModal
        isOpen={confirmEndOpen}
        title="End this session?"
        message={
          finalised
            ? 'Everyone will be removed and the session will close in GummyGum.'
            : "Everyone will be removed and the session will close in GummyGum. Results haven't been finalised, so this session won't be recorded as completed."
        }
        confirmText={ending ? 'Ending...' : 'End session'}
        cancelText="Keep running"
        onConfirm={handleConfirmEnd}
        onCancel={() => !ending && setConfirmEndOpen(false)}
      />
    </>
  );
}
