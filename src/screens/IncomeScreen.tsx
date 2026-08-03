import { inr } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import SliderRow from '../components/SliderRow';
import StepDots from '../components/StepDots';

interface IncomeScreenProps {
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  actions: SalaryWiseActions;
}

export default function IncomeScreen({ salary, rent, emi, expenses, sip, actions }: IncomeScreenProps) {
  return (
    <div className="sw-screen-in" style={{ padding: '14px 26px 40px' }}>
      <StepDots active={1} />
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: '#2b2618', marginTop: 18 }}>Your monthly money</div>
      <div style={{ fontSize: 14, color: '#8a7f68', marginTop: 6 }}>Rough numbers are fine — you can edit later.</div>

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SliderRow label="Take-home salary" display={inr(salary)} valueColor="#2f4a34" min={20000} max={400000} step={1000} value={salary} onChange={actions.setSalary} />
        <SliderRow label="Rent / home EMI" display={inr(rent)} min={0} max={150000} step={1000} value={rent} onChange={actions.setRent} />
        <SliderRow label="Other loan EMIs" display={inr(emi)} min={0} max={100000} step={1000} value={emi} onChange={actions.setEmi} />
        <SliderRow label="Living expenses" display={inr(expenses)} min={0} max={150000} step={1000} value={expenses} onChange={actions.setExpenses} />
        <SliderRow label="Monthly investing (SIP)" display={inr(sip)} min={0} max={150000} step={1000} value={sip} onChange={actions.setSip} />
      </div>

      <button
        onClick={() => actions.go('score')}
        style={{ width: '100%', marginTop: 32, background: '#e9a23b', color: '#2b2618', border: 'none', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
      >
        Reveal my Financial Health Score ✦
      </button>
    </div>
  );
}
