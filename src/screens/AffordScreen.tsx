import { affCalc, inr, short } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import BackHeader from '../components/BackHeader';
import SliderRow from '../components/SliderRow';

interface AffordScreenProps {
  affIncome: number;
  affDown: number;
  affRate: number;
  affTenure: number;
  actions: SalaryWiseActions;
}

export default function AffordScreen({ affIncome, affDown, affRate, affTenure, actions }: AffordScreenProps) {
  const a = affCalc(affIncome, affDown, affRate, affTenure);

  return (
    <div className="sw-screen-in" style={{ padding: '8px 24px 40px' }}>
      <BackHeader title="Home Affordability" onBack={() => actions.go('dashboard')} />

      <div style={{ background: '#2f4a34', borderRadius: 24, padding: 22, marginTop: 18, color: '#f4f0e6', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#b6cbaa', fontWeight: 600, letterSpacing: '.05em' }}>YOU CAN LOOK AT HOMES UP TO</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 44, fontWeight: 600, marginTop: 4 }}>{short(a.price)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.14)' }}>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Max loan</div>
            <div style={{ fontWeight: 700, marginTop: 2 }}>{short(a.loan)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Comfortable EMI</div>
            <div style={{ fontWeight: 700, marginTop: 2, color: '#e9a23b' }}>{inr(a.emi)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 24 }}>
        <SliderRow label="Monthly income" display={inr(affIncome)} min={30000} max={600000} step={5000} value={affIncome} onChange={actions.setAffIncome} />
        <SliderRow label="Down payment saved" display={short(affDown)} min={0} max={10000000} step={100000} value={affDown} onChange={actions.setAffDown} />
        <SliderRow label="Interest rate" display={`${affRate}%`} min={6} max={14} step={0.1} value={affRate} onChange={actions.setAffRate} />
        <SliderRow label="Tenure" display={`${affTenure} years`} min={5} max={30} step={1} value={affTenure} onChange={actions.setAffTenure} />
      </div>

      <div style={{ fontSize: 11.5, color: '#a99e86', marginTop: 16, lineHeight: 1.5 }}>Assumes EMIs stay under 40% of income. Indicative only — not financial advice.</div>
    </div>
  );
}
