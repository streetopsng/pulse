import { SurveyContainer } from '../layout/SurveyContainer';
import { EntryScreen } from './screens/EntryScreen';
import { JoinScreen } from './screens/JoinScreen';
import { InviteScreen } from './screens/InviteScreen';
import { VerifyEmailScreen } from './screens/VerifyEmailScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { CompletionScreen } from './screens/CompletionScreen';
import { AlreadyScreen } from './screens/AlreadyScreen';
import { SessionEndedScreen } from './screens/SessionEndedScreen';
import { Button } from '../common/Button';
import { usePulse } from '../../context/PulseContext';

function LoadingScreen() {
  return (
    <div className="text-center py-10 sm:py-14">
      <div className="w-10 h-10 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-4" />
      <p className="text-sm font-medium text-slate-500">Opening your pulse survey...</p>
    </div>
  );
}

function UnavailableScreen() {
  return (
    <div className="text-center py-8 sm:py-10 max-w-sm mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
        Survey not available yet
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        We couldn't find this pulse survey. Your host may still be setting it up. Try again in a moment.
      </p>
      <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  );
}

export function EmployeeView() {
  const { empScreen: currentScreen, activePulse, hubEnded } = usePulse();
  // The hub-ended screen wins over any in-flight screen except a finished survey.
  const empScreen =
    hubEnded && !['completion', 'already'].includes(currentScreen) ? 'session-ended' : currentScreen;

  let badgeText = 'GUMMYGUM · PULSE';
  if (activePulse) {
    badgeText =
      activePulse.delivery === 'live' ? 'LIVE PULSE · GUMMYGUM' : 'PRIVATE PULSE · GUMMYGUM';
  }

  return (
    <SurveyContainer badgeText={badgeText}>
      {empScreen === 'loading' && <LoadingScreen />}
      {empScreen === 'unavailable' && <UnavailableScreen />}
      {empScreen === 'entry' && <EntryScreen />}
      {empScreen === 'join' && <JoinScreen />}
      {empScreen === 'invite' && <InviteScreen />}
      {empScreen === 'verify-email' && <VerifyEmailScreen />}
      {(empScreen === 'instructions' || empScreen === 'welcome') && <InstructionsScreen />}
      {empScreen === 'question' && <QuestionScreen />}
      {empScreen === 'completion' && <CompletionScreen />}
      {empScreen === 'already' && <AlreadyScreen />}
      {empScreen === 'session-ended' && <SessionEndedScreen />}
    </SurveyContainer>
  );
}
