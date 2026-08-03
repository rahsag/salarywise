import { computeScore, scoreBand } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';

interface ScoreScreenProps {
  name: string;
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  animScore: number;
  actions: SalaryWiseActions;
}

function ScoreBar({ label, points, width }: { label: string; points: string; width: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: '#d6e0cb' }}>{label}</span>
        <b>{points}</b>
      </div>
      <div style={{ height: 7, borderRadius: 5, background: 'rgba(255,255,255,.14)', marginTop: 7, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#8fb47f', width }} />
      </div>
    </div>
  );
}

export default function ScoreScreen({ name, salary, rent, emi, expenses, sip, animScore, actions }: ScoreScreenProps) {
  const sc = computeScore(salary, rent, emi, expenses, sip);
  const band = scoreBand(sc.total);
  const scoreDash = 590.6 * (1 - animScore / 100);
  const scoreMsg =
    sc.total >= 65 ? `Solid footing, ${name || 'Rahul'}. A few nudges take you higher.` : `A real starting point — here's where the easy wins are.`;

  return (
    <div className="sw-score-in" style={{ padding: '20px 26px 40px', minHeight: '100%', background: '#2f4a34', color: '#f4f0e6' }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, letterSpacing: '.14em', color: '#b6cbaa' }}>YOUR FINANCIAL HEALTH SCORE</div>
      <div style={{ textAlign: 'center', marginTop: 22, position: 'relative' }}>
        <svg width={220} height={220} viewBox="0 0 220 220" style={{ display: 'block', margin: '0 auto' }}>
          <circle cx={110} cy={110} r={94} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={15} />
          <circle
            cx={110}
            cy={110}
            r={94}
            fill="none"
            stroke="#e9a23b"
            strokeWidth={15}
            strokeLinecap="round"
            strokeDasharray={590.6}
            strokeDashoffset={scoreDash}
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dashoffset .1s linear' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-56%)' }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 76, fontWeight: 600, lineHeight: 0.9 }}>{animScore}</div>
          <div style={{ fontSize: 14, color: '#e9a23b', fontWeight: 700, marginTop: 4 }}>{band}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 14, color: '#d6e0cb', marginTop: 14, lineHeight: 1.5, padding: '0 6px' }}>{scoreMsg}</div>
      <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 20, padding: '18px 20px', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ScoreBar label="Savings rate" points={`${sc.savePts}/40`} width={`${(sc.savePts / 40) * 100}%`} />
        <ScoreBar label="Debt burden" points={`${sc.debtPts}/30`} width={`${(sc.debtPts / 30) * 100}%`} />
        <ScoreBar label="Investing habit" points={`${sc.investPts}/30`} width={`${(sc.investPts / 30) * 100}%`} />
      </div>
      <button
        onClick={() => actions.go('dashboard')}
        style={{ width: '100%', marginTop: 26, background: '#e9a23b', color: '#2b2618', border: 'none', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
      >
        Enter SalaryWise →
      </button>
    </div>
  );
}
