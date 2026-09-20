import { createContext, useContext, useState, useEffect } from 'react';
import { resolveGummyGumLaunch } from '../lib/gummygumSession';

const GummyGumContext = createContext(null);

export function GummyGumProvider({ children }) {
  const [ggAccessState, setGgAccessState] = useState('checking'); // 'checking' | 'granted' | 'denied'
  const [ggSession, setGgSession] = useState(null);

  useEffect(() => {
    resolveGummyGumLaunch()
      .then((session) => {
        setGgSession(session);
        setGgAccessState(session ? 'granted' : 'denied');
      })
      .catch((err) => {
        console.error('GummyGum launch resolve failed', err);
        setGgAccessState('denied');
      });
  }, []);

  return (
    <GummyGumContext.Provider value={{ ggAccessState, ggSession }}>
      {children}
    </GummyGumContext.Provider>
  );
}

export function useGummyGum() {
  const context = useContext(GummyGumContext);
  if (!context) {
    throw new Error('useGummyGum must be used within a GummyGumProvider');
  }
  return context;
}
