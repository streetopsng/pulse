import { useEffect, useState } from 'react';
import { BgDeco } from './BgDeco';

function useConnectingMessage() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const slow = setTimeout(() => setStage(1), 8000);
    const verySlow = setTimeout(() => setStage(2), 20000);
    return () => {
      clearTimeout(slow);
      clearTimeout(verySlow);
    };
  }, []);
  if (stage === 2) return "This is taking longer than usual — check your internet connection. We'll keep trying.";
  if (stage === 1) return 'Still connecting… please wait';
  return 'Loading…';
}

// Pulse only runs from a GummyGum launch, so anything that would have shown a
// home, create or code-entry screen waits here instead.
export function LoadingScreen({ fullScreen = false }) {
  const message = useConnectingMessage();
  const content = (
    <div className="text-center py-10 sm:py-14 max-w-sm mx-auto">
      <div className="w-10 h-10 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-4" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
  if (!fullScreen) return content;
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 z-10">
      <BgDeco />
      <div className="relative">{content}</div>
    </div>
  );
}
