import { LogoIcon } from '../common/Icons';
import { Link } from 'react-router-dom';

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-surface border-b-2 border-ink px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2.5">
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

      {/* Direct link to employee participant view */}
      <div className="flex items-center gap-2">
        <Link
          to="/join"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-ink bg-surface hover:bg-accent-soft border-2 border-ink px-4 py-2 rounded-full shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span>Take Survey (Participant) ↗</span>
        </Link>
      </div>
    </header>
  );
}
