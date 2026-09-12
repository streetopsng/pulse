import { LogoIcon } from '../common/Icons';
import { Link } from 'react-router-dom';
import { usePulse } from '../../context/PulseContext';

export function TopBar() {
  const { topView, setTopView } = usePulse();

  return (
    <header className="sticky top-0 z-30 bg-surface border-b-2 border-ink px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          onClick={() => setTopView('host')}
          className="flex items-center gap-2.5"
        >
          <LogoIcon className="w-7 h-7 shrink-0" />
          <span className="font-display font-black text-xl tracking-tight text-ink">
            Pulse Survey
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-ink-soft tracking-wide ml-2">
          <span>TEAM ENGAGEMENT</span>
          <span className="text-ink-faint">›</span>
          <b className="text-ink font-extrabold">Pulse Survey</b>
        </div>
      </div>

      {/* Prototype View Switcher from new.html */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center bg-surface border-2 border-ink rounded-full p-1 gap-1 shadow-hard-sm">
          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-ink-faint px-2 hidden sm:inline-block">
            Prototype
          </span>
          <button
            type="button"
            onClick={() => setTopView('host')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              topView === 'host'
                ? 'bg-accent text-white shadow-[inset_0_0_0_2px_#1B1224]'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Host View
          </button>
          <button
            type="button"
            onClick={() => setTopView('employee')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              topView === 'employee'
                ? 'bg-accent text-white shadow-[inset_0_0_0_2px_#1B1224]'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Employee View
          </button>
        </div>

        {/* Direct link for standalone testing */}
        <Link
          to="/join"
          target="_blank"
          rel="noopener noreferrer"
          title="Open participant survey in standalone tab"
          className="hidden md:inline-flex items-center gap-1 text-xs font-extrabold text-ink bg-surface hover:bg-accent-soft border-2 border-ink px-3 py-1.5 rounded-full shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <span>↗</span>
        </Link>
      </div>
    </header>
  );
}
