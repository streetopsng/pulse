import { Link } from 'react-router-dom';
import { usePulse } from '../../context/PulseContext';

export function TopBar() {
  const { hostScreen, setHostScreen } = usePulse();

  return (
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
  );
}
