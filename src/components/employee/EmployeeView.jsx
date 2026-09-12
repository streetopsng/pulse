import { SurveyContainer } from '../layout/SurveyContainer';
import { EntryScreen } from './screens/EntryScreen';
import { InviteScreen } from './screens/InviteScreen';
import { VerifyEmailScreen } from './screens/VerifyEmailScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { CompletionScreen } from './screens/CompletionScreen';
import { AlreadyScreen } from './screens/AlreadyScreen';
import { usePulse } from '../../context/PulseContext';

export function EmployeeView() {
  const { empScreen, activePulse } = usePulse();

  let badgeText = 'GUMMYGUM · PULSE';
  if (activePulse) {
    badgeText =
      activePulse.delivery === 'live' ? 'LIVE PULSE · GUMMYGUM' : 'PRIVATE PULSE · GUMMYGUM';
  }

  return (
    <SurveyContainer badgeText={badgeText}>
      {empScreen === 'entry' && <EntryScreen />}
      {empScreen === 'invite' && <InviteScreen />}
      {empScreen === 'verify-email' && <VerifyEmailScreen />}
      {(empScreen === 'instructions' || empScreen === 'welcome') && <InstructionsScreen />}
      {empScreen === 'question' && <QuestionScreen />}
      {empScreen === 'completion' && <CompletionScreen />}
      {empScreen === 'already' && <AlreadyScreen />}
    </SurveyContainer>
  );
}
