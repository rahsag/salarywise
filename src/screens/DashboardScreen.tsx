import { computeScore, inr, scoreBand } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';

interface DashboardScreenProps {
  name: string;
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  actions: SalaryWiseActions;
}

interface ToolButtonProps {
  icon: string;
  bg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function ToolButton({ icon, bg, title, subtitle, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ textAlign: 'left', background: '#fff', border: '1px solid #ece3d1', borderRadius: 18, padding: '14px 15px', display: 'flex', gap: 11, alignItems: 'center', cursor: 'pointer' }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#2b2618' }}>{title}</div>
        <div style={{ fontSize: 10.5, color: '#9a8f78' }}>{subtitle}</div>
      </div>
    </button>
  );
}

export default function DashboardScreen({ name, salary, rent, emi, expenses, sip, actions }: DashboardScreenProps) {
  const sc = computeScore(salary, rent, emi, expenses, sip);
  const band = scoreBand(sc.total);
  const greetName = name ? name.split(' ')[0] : 'Rahul';
  const initial = (name || 'R').trim().charAt(0).toUpperCase();
  const dashScoreMsg = sc.total >= 65 ? '3 quick wins could push you past 80' : 'Small changes can move this fast';

  const spent = rent + emi + expenses;
  const left = salary - spent - sip;
  const spentPct = Math.round((spent / Math.max(salary, 1)) * 100);
  const pw = (v: number) => `${((v / Math.max(salary, 1)) * 100).toFixed(1)}%`;

  return (
    <div className="sw-screen-in" style={{ padding: '8px 20px 26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px 0' }}>
        <div>
          <div style={{ fontSize: 13, color: '#9a8f78', fontWeight: 600 }}>Tuesday, 3 Aug</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: '#2b2618', letterSpacing: '-.01em' }}>{greetName}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e5dcc7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a7d4f', fontWeight: 700, fontFamily: "'Fraunces',serif", fontSize: 18 }}>
          {initial}
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#2f4a34', borderRadius: 26, padding: '22px 24px', color: '#f4f0e6', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#b6cbaa', letterSpacing: '.03em' }}>FINANCIAL HEALTH</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 52, fontWeight: 600, lineHeight: 0.9 }}>{sc.total}</div>
              <div style={{ fontSize: 15, color: '#b6cbaa', fontWeight: 600 }}>/100</div>
            </div>
          </div>
          <div style={{ background: '#e9a23b', color: '#2b2618', fontSize: 12, fontWeight: 800, padding: '6px 12px', borderRadius: 20 }}>{band}</div>
        </div>
        <div style={{ fontSize: 13, color: '#d6e0cb', marginTop: 8 }}>{dashScoreMsg}</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '15px 16px', border: '1px solid #ece3d1' }}>
          <div style={{ fontSize: 11, color: '#9a8f78', fontWeight: 600 }}>Earned</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: '#2b2618', marginTop: 2 }}>{inr(salary)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '15px 16px', border: '1px solid #ece3d1' }}>
          <div style={{ fontSize: 11, color: '#9a8f78', fontWeight: 600 }}>Left to spend</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: '#5a7d4f', marginTop: 2 }}>{inr(Math.max(0, left))}</div>
        </div>
      </div>

      <div style={{ marginTop: 14, background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #ece3d1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a8f78', fontWeight: 600 }}>
          <span>Spent {spentPct}% of income</span>
          <span>{inr(spent)}</span>
        </div>
        <div style={{ height: 9, borderRadius: 6, background: '#efe8da', marginTop: 9, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: pw(rent), background: '#5a7d4f', height: '100%' }} />
          <div style={{ width: pw(emi), background: '#e9a23b', height: '100%' }} />
          <div style={{ width: pw(expenses), background: '#c98a56', height: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11, color: '#6b6250' }}>
          <span>
            ● Home <b>{inr(rent)}</b>
          </span>
          <span style={{ color: '#e9a23b' }}>● EMI</span>
          <span style={{ color: '#c98a56' }}>● Living</span>
        </div>
      </div>

      <div style={{ margin: '22px 4px 12px', fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: '#2b2618' }}>Your toolkit</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 11 }}>
        <ToolButton icon="📊" bg="#eaf1e4" title="Budget" subtitle="50/30/20" onClick={() => actions.go('budget')} />
        <ToolButton icon="🏦" bg="#f6ecd9" title="EMI" subtitle="Loan calc" onClick={() => actions.go('emi')} />
        <ToolButton icon="📈" bg="#eae4f2" title="SIP" subtitle="Grow wealth" onClick={() => actions.go('sip')} />
        <ToolButton icon="🏠" bg="#e4eef2" title="Home" subtitle="Affordability" onClick={() => actions.go('afford')} />
      </div>

      <button
        onClick={() => actions.go('tax')}
        style={{ width: '100%', textAlign: 'left', marginTop: 11, background: '#fff', border: '1px solid #ece3d1', borderRadius: 18, padding: '15px 16px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5e3df', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>🧾</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2b2618' }}>Tax Planner & Salary Optimizer</div>
          <div style={{ fontSize: 11, color: '#9a8f78' }}>New vs old regime · ranked savings</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#e9a23b', background: '#faf1dc', padding: '4px 9px', borderRadius: 20 }}>PRO</div>
      </button>

      <button
        onClick={() => actions.go('coach')}
        style={{ width: '100%', textAlign: 'left', marginTop: 14, background: '#e9a23b', border: 'none', borderRadius: 20, padding: '16px 18px', display: 'flex', gap: 13, alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#2b2618', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, color: '#e9a23b' }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#2b2618', fontWeight: 800, fontSize: 14 }}>Chat with your Money Coach</div>
          <div style={{ color: '#6b4d1e', fontSize: 11.5, marginTop: 1 }}>Ask anything about your money</div>
        </div>
        <div style={{ color: '#2b2618', fontSize: 18 }}>→</div>
      </button>
    </div>
  );
}
