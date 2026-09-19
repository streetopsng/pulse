import { useEffect } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { PulseProvider, usePulse } from './context/PulseContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TopBar } from './components/layout/TopBar';
import { HostView } from './components/host/HostView';
import { EmployeeView } from './components/employee/EmployeeView';
import { PreviewModal } from './components/preview/PreviewModal';
import { Toast } from './components/common/Toast';
import { BgDeco } from './components/common/BgDeco';

/**
 * Production Host Management Portal (Manager / Organizer view)
 * Accessible at root `/`
 */
function HostLayout() {
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
 * Production Employee / Participant Survey Page
 * Accessible via `#/join`, `#/join/:code`, `#/survey`, and `#/survey/:pulseId`
 * Handles deep links, query parameters, and session codes
 */
function EmployeeLayout() {
  const { pulseId: routePulseId, code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const { loadPulseById, loadPulseByCode, setEmailInput, setEmpScreen, activePulse } = usePulse();

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
    } else if (!activePulse) {
      setEmpScreen('entry');
    }
  }, [routePulseId, routeCode, searchParams, loadPulseById, loadPulseByCode, setEmailInput, setEmpScreen, activePulse]);

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
      <PulseProvider>
        <HashRouter>
          <Routes>
            {/* Host Management Console */}
            <Route path="/" element={<HostLayout />} />

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
    </ErrorBoundary>
  );
}
