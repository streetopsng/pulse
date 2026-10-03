import { LiveSession } from './LiveSession';
import { PrivateStatus } from './PrivateStatus';
import { SnapshotView } from './SnapshotView';
import { LoadingScreen } from '../common/LoadingScreen';
import { usePulse } from '../../context/PulseContext';

export function HostView() {
  const { hostScreen } = usePulse();

  switch (hostScreen) {
    case 'live-session':
      return <LiveSession />;
    case 'private-status':
      return <PrivateStatus />;
    case 'snapshot':
      return <SnapshotView />;
    default:
      return <LoadingScreen />;
  }
}
