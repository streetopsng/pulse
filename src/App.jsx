import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PulseProvider } from './context/PulseContext';
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
 * Dedicated separate page accessible at `#/join` or `#/survey`
 */
function EmployeeLayout() {
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
    <PulseProvider>
      <HashRouter>
        <Routes>
          {/* Host Management Console */}
          <Route path="/" element={<HostLayout />} />

          {/* Participant Survey Route */}
          <Route path="/join" element={<EmployeeLayout />} />
          <Route path="/survey" element={<EmployeeLayout />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PulseProvider>
  );
}
