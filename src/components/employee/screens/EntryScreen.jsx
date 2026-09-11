import { Link } from 'react-router-dom';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function EntryScreen() {
  const { setEmpScreen } = usePulse();

  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-4xl mb-4">📋</div>
      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-3">
        Ready to take a pulse survey?
      </h2>
      <p className="text-xs sm:text-sm text-ink-soft mb-8 max-w-sm mx-auto leading-relaxed">
        Enter the 6-digit code provided by your host to access and submit your response.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Button variant="primary" onClick={() => setEmpScreen('join')}>
          Enter Join Code
        </Button>
        <Link
          to="/"
          className="text-xs font-bold text-ink underline underline-offset-4 decoration-accent hover:text-accent-dark mt-2"
        >
          Are you a host? Open Host Dashboard →
        </Link>
      </div>
    </div>
  );
}
