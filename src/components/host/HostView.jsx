import { WelcomeView } from './WelcomeView';
import { HomeView } from './HomeView';
import { CreateStep } from './CreateStep';
import { BuilderStep } from './BuilderStep';
import { ConfigStep } from './ConfigStep';
import { DeployStep } from './DeployStep';
import { LiveSession } from './LiveSession';
import { PrivateStatus } from './PrivateStatus';
import { SnapshotView } from './SnapshotView';
import { usePulse } from '../../context/PulseContext';

export function HostView() {
  const { hostScreen } = usePulse();

  switch (hostScreen) {
    case 'welcome':
      return <WelcomeView />;
    case 'home':
      return <HomeView />;
    case 'create':
      return <CreateStep />;
    case 'builder':
      return <BuilderStep />;
    case 'config':
      return <ConfigStep />;
    case 'deploy':
      return <DeployStep />;
    case 'live-session':
      return <LiveSession />;
    case 'private-status':
      return <PrivateStatus />;
    case 'snapshot':
      return <SnapshotView />;
    default:
      return <WelcomeView />;
  }
}
