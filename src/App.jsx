import { useEffect, useRef } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { PulseProvider, usePulse } from './context/PulseContext';
import { GummyGumProvider, useGummyGum } from './context/GummyGumContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TopBar } from './components/layout/TopBar';
import { HostView } from './components/host/HostView';
import { EmployeeView } from './components/employee/EmployeeView';
import { PreviewModal } from './components/preview/PreviewModal';
import { Toast } from './components/common/Toast';
import { BgDeco } from './components/common/BgDeco';

/**
 * Production Host Management Portal (Manager / Organizer view)
 * Accessible at root `/`, gated to GummyGum-launched hosts only.
 */
function HostLayout() {
  const { ggSession } = useGummyGum();
  const { hostScreen, setHostScreen, deployPulseFromGummyGum } = usePulse();
  const deployedRef = useRef(false);

  // A host GummyGum already authenticated skips the marketing splash. If
  // they built their survey entirely in GummyGum's setup modal (the normal
  // path now), deploy straight from that config and land on the live
  // session / private status screen — never home, welcome, or the native
  // builder. Only a host with no config (shouldn't normally happen once
  // this is live) falls back to the old "land on home, use native builder"
  // behavior.
  useEffect(() => {
    if (!ggSession?.isHost || hostScreen !== 'welcome') return;
    if (ggSession.config) {
      if (deployedRef.current) return;
      deployedRef.current = true;
      deployPulseFromGummyGum(ggSession.config);
    } else {
      setHostScreen('home');
    }
  }, [ggSession, hostScreen, setHostScreen, deployPulseFromGummyGum]);

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <BgDeco />
      <TopBar />
      <main className="flex-1">
        <HostView />
      </main>
      <PreviewModal />
      <Toast />
    </div>
  );
}

/**
 * Root route: blocks direct, non-GummyGum access to the host console (nobody
 * should be able to spin up surveys outside a GummyGum-launched org context),
 * and hands off straight to the employee flow if a resolved GummyGum session
 * turns out to belong to a participant rather than the host.
 */
function RootRoute() {
  const { ggAccessState, ggSession } = useGummyGum();

  if (ggAccessState === 'checking') {
    return <div className="min-h-screen w-full bg-slate-50" />;
  }

  if (ggAccessState === 'denied') {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 z-10">
        <BgDeco />
        <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-[400px] mx-auto p-8 text-center shadow-sm">
          <h1 className="text-slate-900 text-xl font-bold mb-3">Locked</h1>
          <p className="text-slate-500 text-[15px] mb-6 leading-relaxed">
            This experience is only available through GummyGum.
          </p>
          <a
            href="https://gummygum.app"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            Go to GummyGum
          </a>
        </div>
      </div>
    );
  }

  if (ggSession && !ggSession.isHost) {
    return <Navigate to="/join" replace />;
  }

  return <HostLayout />;
}

/**
 * Production Employee / Participant Survey Page
 * Accessible via `#/join`, `#/join/:code`, `#/survey`, and `#/survey/:pulseId`
 * Handles deep links, query parameters, session codes, and — when present —
 * a GummyGum-verified identity, in which case the manual code/email steps
 * are skipped entirely since GummyGum already resolved who this is and
 * which room they belong to.
 * Never gated: this stays reachable directly (e.g. a native Brevo email
 * invite) whether or not a GummyGum session is active.
 */
function EmployeeLayout() {
  const { pulseId: routePulseId, code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const { ggSession } = useGummyGum();
  const {
    loadPulseById,
    loadPulseByCode,
    setEmailInput,
    setVerifiedEmail,
    setEmpScreen,
    activePulse,
  } = usePulse();

  useEffect(() => {
    const targetId = routePulseId || searchParams.get('id');
    const targetCode = routeCode || searchParams.get('code');
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmailInput(emailParam);
    }

    if (targetId) {
      loadPulseById(targetId).then((found) => {
        if (found) {
          setEmpScreen('invite');
        }
      });
    } else if (targetCode) {
      loadPulseByCode(targetCode).then((found) => {
        if (found) {
          setEmpScreen('invite');
        }
      });
    } else if (ggSession && !ggSession.isHost && ggSession.roomCode) {
      loadPulseByCode(ggSession.roomCode).then((found) => {
        if (found) {
          if (ggSession.player?.email) {
            setEmailInput(ggSession.player.email);
            setVerifiedEmail(ggSession.player.email);
          }
          setEmpScreen('instructions');
        } else {
          setEmpScreen('entry');
        }
      });
    } else if (!activePulse) {
      setEmpScreen('entry');
    }
  }, [
    routePulseId,
    routeCode,
    searchParams,
    loadPulseById,
    loadPulseByCode,
    setEmailInput,
    setVerifiedEmail,
    setEmpScreen,
    activePulse,
    ggSession,
  ]);

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <BgDeco />
      <main className="flex-1">
        <EmployeeView />
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GummyGumProvider>
        <PulseProvider>
          <HashRouter>
            <Routes>
              {/* Host Management Console */}
              <Route path="/" element={<RootRoute />} />

              {/* Participant Survey Deep Links & Access Routes */}
              <Route path="/join" element={<EmployeeLayout />} />
              <Route path="/join/:code" element={<EmployeeLayout />} />
              <Route path="/survey" element={<EmployeeLayout />} />
              <Route path="/survey/:pulseId" element={<EmployeeLayout />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </PulseProvider>
      </GummyGumProvider>
    </ErrorBoundary>
  );
}
