import { Link } from 'react-router-dom';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function EntryScreen() {
  const { setEmpScreen } = usePulse();

  return (
    <div className="text-center py-6 sm:py-10">
      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-5 shadow-xs">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2.5">
        Participant Pulse Access
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Enter the secure session code provided by your team lead to submit your feedback.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Button variant="primary" size="lg" onClick={() => setEmpScreen('join')}>
          Enter Session Code
        </Button>
        <Link
          to="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mt-3"
        >
          Host or Administrator? Open Host Console →
        </Link>
      </div>
    </div>
  );
}
