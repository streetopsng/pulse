import { SurveyContainer } from '../layout/SurveyContainer';
import { EntryScreen } from './screens/EntryScreen';
import { JoinScreen } from './screens/JoinScreen';
import { InviteScreen } from './screens/InviteScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { CompletionScreen } from './screens/CompletionScreen';
import { AlreadyScreen } from './screens/AlreadyScreen';
import { usePulse } from '../../context/PulseContext';

export function EmployeeView() {
  const { empScreen, activePulse } = usePulse();

  let badgeText = 'GUMMYGUM · PULSE';
  if (activePulse) {
    badgeText = activePulse.delivery === 'live' ? 'LIVE PULSE · GUMMYGUM' : 'PRIVATE PULSE · GUMMYGUM';
  }

  return (
    <SurveyContainer badgeText={badgeText}>
      {empScreen === 'entry' && <EntryScreen />}
      {empScreen === 'join' && <JoinScreen />}
      {empScreen === 'invite' && <InviteScreen />}
      {empScreen === 'welcome' && <WelcomeScreen />}
      {empScreen === 'question' && <QuestionScreen />}
      {empScreen === 'completion' && <CompletionScreen />}
      {empScreen === 'already' && <AlreadyScreen />}
    </SurveyContainer>
  );
}
