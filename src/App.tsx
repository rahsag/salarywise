import { useSalaryWise } from './lib/useSalaryWise';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import SignupScreen from './screens/SignupScreen';
import OtpScreen from './screens/OtpScreen';
import ProfileScreen from './screens/ProfileScreen';
import IncomeScreen from './screens/IncomeScreen';
import ScoreScreen from './screens/ScoreScreen';
import DashboardScreen from './screens/DashboardScreen';
import BudgetScreen from './screens/BudgetScreen';
import EmiScreen from './screens/EmiScreen';
import SipScreen from './screens/SipScreen';
import AffordScreen from './screens/AffordScreen';
import TaxScreen from './screens/TaxScreen';
import CoachScreen from './screens/CoachScreen';

function App() {
  const { state, actions } = useSalaryWise();
  const { screen } = state;

  const showNav = screen === 'dashboard' || screen === 'coach';
  const statusBarColor = screen === 'score' ? '#f4f0e6' : '#2b2618';

  let content;
  switch (screen) {
    case 'signup':
      content = <SignupScreen name={state.name} mobile={state.mobile} email={state.email} actions={actions} />;
      break;
    case 'otp':
      content = <OtpScreen mobile={state.mobile} otp={state.otp} actions={actions} />;
      break;
    case 'profile':
      content = <ProfileScreen age={state.age} cityTier={state.cityTier} dependents={state.dependents} actions={actions} />;
      break;
    case 'income':
      content = <IncomeScreen salary={state.salary} rent={state.rent} emi={state.emi} expenses={state.expenses} sip={state.sip} actions={actions} />;
      break;
    case 'score':
      content = (
        <ScoreScreen
          name={state.name}
          salary={state.salary}
          rent={state.rent}
          emi={state.emi}
          expenses={state.expenses}
          sip={state.sip}
          animScore={state.animScore}
          actions={actions}
        />
      );
      break;
    case 'dashboard':
      content = <DashboardScreen name={state.name} salary={state.salary} rent={state.rent} emi={state.emi} expenses={state.expenses} sip={state.sip} actions={actions} />;
      break;
    case 'budget':
      content = <BudgetScreen salary={state.salary} rent={state.rent} emi={state.emi} expenses={state.expenses} actions={actions} />;
      break;
    case 'emi':
      content = <EmiScreen emiP={state.emiP} emiR={state.emiR} emiN={state.emiN} actions={actions} />;
      break;
    case 'sip':
      content = <SipScreen sipAmt={state.sipAmt} sipR={state.sipR} sipY={state.sipY} actions={actions} />;
      break;
    case 'afford':
      content = <AffordScreen affIncome={state.affIncome} affDown={state.affDown} affRate={state.affRate} affTenure={state.affTenure} actions={actions} />;
      break;
    case 'tax':
      content = <TaxScreen taxIncome={state.taxIncome} tax80c={state.tax80c} taxHra={state.taxHra} actions={actions} />;
      break;
    case 'coach':
      content = <CoachScreen chat={state.chat} chatInput={state.chatInput} coachTyping={state.coachTyping} actions={actions} />;
      break;
  }

  return (
    <PhoneFrame statusBarColor={statusBarColor} nav={showNav ? <BottomNav screen={screen} go={actions.go} /> : undefined}>
      {content}
    </PhoneFrame>
  );
}

export default App;
