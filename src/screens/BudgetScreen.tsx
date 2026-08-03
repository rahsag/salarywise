import { inr } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import BackHeader from '../components/BackHeader';

interface BudgetScreenProps {
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  actions: SalaryWiseActions;
}

function BudgetCard({ label, amount, note, bg, fg, sub }: { label: string; amount: string; note: string; bg: string; fg: string; sub: string }) {
  return (
    <div style={{ background: bg, borderRadius: 20, padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 800, color: fg, fontSize: 15 }}>{label}</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: fg }}>{amount}</div>
      </div>
      <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{note}</div>
    </div>
  );
}

export default function BudgetScreen({ salary, rent, emi, expenses, actions }: BudgetScreenProps) {
  const needs = salary * 0.5;
  const wants = salary * 0.3;
  const saveTarget = salary * 0.2;
  const spent = rent + emi + expenses;
  const actualSave = (salary - spent) / Math.max(salary, 1);
  const asr = Math.round(actualSave * 100);
  const verdictColor = actualSave >= 0.2 ? '#5a7d4f' : actualSave >= 0.1 ? '#c2882a' : '#c0562f';
  const verdict =
    actualSave >= 0.2
      ? "You're beating the 20% savings target — great discipline. Consider bumping your SIP."
      : actualSave >= 0.1
        ? "You're saving, but below the 20% target. Trim 'wants' by a little to catch up."
        : 'Essentials are eating most of your income. Revisit rent or big EMIs before adding goals.';

  return (
    <div className="sw-screen-in" style={{ padding: '8px 24px 40px' }}>
      <BackHeader title="Budget Planner" onBack={() => actions.go('dashboard')} />
      <div style={{ fontSize: 13, color: '#8a7f68', marginTop: 8, lineHeight: 1.5 }}>The 50/30/20 rule on your {inr(salary)} take-home.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
        <BudgetCard label="Needs · 50%" amount={inr(needs)} note="Rent, EMIs, groceries, bills, transport" bg="#eaf1e4" fg="#2f4a34" sub="#5a7d4f" />
        <BudgetCard label="Wants · 30%" amount={inr(wants)} note="Dining, shopping, travel, subscriptions" bg="#f6ecd9" fg="#a5702a" sub="#b58b48" />
        <BudgetCard label="Savings · 20%" amount={inr(saveTarget)} note="SIP, emergency fund, goals" bg="#e4eef2" fg="#3d6d84" sub="#5a8ba3" />
      </div>

      <div style={{ background: '#fff', border: '1px solid #ece3d1', borderRadius: 18, padding: '16px 18px', marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8a7f68' }}>HOW YOU'RE ACTUALLY DOING</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13.5, color: '#2b2618' }}>
          <span>Actual saving rate</span>
          <b style={{ color: verdictColor }}>{asr}%</b>
        </div>
        <div style={{ fontSize: 12.5, color: '#8a7f68', marginTop: 8, lineHeight: 1.5 }}>{verdict}</div>
      </div>
    </div>
  );
}
