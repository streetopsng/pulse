import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PulseProvider, usePulse } from './context/PulseContext';
import { TopBar } from './components/layout/TopBar';
import { HostView } from './components/host/HostView';
import { EmployeeView } from './components/employee/EmployeeView';
import { PreviewModal } from './components/preview/PreviewModal';
import { Toast } from './components/common/Toast';
import { BgDeco } from './components/common/BgDeco';

function MainLayout() {
  const { topView } = usePulse();

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <BgDeco />
      <TopBar />
      <main className="flex-1">
        {topView === 'host' ? <HostView /> : <EmployeeView />}
      </main>
      <PreviewModal />
      <Toast />
    </div>
  );
}

function EmployeeStandaloneLayout() {
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
          {/* Main Interactive Prototype with TopBar switcher */}
          <Route path="/" element={<MainLayout />} />

          {/* Standalone Participant Survey Route */}
          <Route path="/join" element={<EmployeeStandaloneLayout />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </PulseProvider>
  );
}
