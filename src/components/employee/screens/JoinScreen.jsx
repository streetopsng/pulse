import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function JoinScreen() {
  const { code } = useParams();
  const { empJoinInput, setEmpJoinInput, empJoinSubmit } = usePulse();

  useEffect(() => {
    if (code) {
      const clean = code.replace(/\s/g, '');
      setEmpJoinInput(code);
      empJoinSubmit(clean);
    }
  }, [code]);

  function handleSubmit(e) {
    e.preventDefault();
    empJoinSubmit();
  }

  return (
    <div className="text-center py-6 sm:py-10 max-w-sm mx-auto">
      <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3 py-1 rounded-full mb-3">
        Join Pulse Survey
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
        Enter the join code
      </h2>
      <p className="text-xs text-ink-soft mb-6 leading-relaxed">
        Enter the 6-digit code provided by your host or team lead
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          maxLength={7}
          value={empJoinInput}
          onChange={(e) => setEmpJoinInput(e.target.value)}
          placeholder="000 000"
          className="w-full text-center font-display font-black text-3xl sm:text-4xl tracking-widest border-[2.5px] border-ink rounded-2xl p-4 bg-surface text-ink focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0] uppercase"
          autoFocus
        />

        <Button variant="primary" size="lg" type="submit" className="w-full">
          Continue to Survey →
        </Button>
      </form>
    </div>
  );
}
