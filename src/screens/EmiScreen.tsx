import { emiCalc, inr, short } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import BackHeader from '../components/BackHeader';
import SliderRow from '../components/SliderRow';

interface EmiScreenProps {
  emiP: number;
  emiR: number;
  emiN: number;
  actions: SalaryWiseActions;
}

export default function EmiScreen({ emiP, emiR, emiN, actions }: EmiScreenProps) {
  const e = emiCalc(emiP, emiR, emiN);

  return (
    <div className="sw-screen-in" style={{ padding: '8px 24px 40px' }}>
      <BackHeader title="EMI Calculator" onBack={() => actions.go('dashboard')} />

      <div style={{ background: '#2f4a34', borderRadius: 24, padding: 22, marginTop: 18, color: '#f4f0e6', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#b6cbaa', fontWeight: 600, letterSpacing: '.05em' }}>MONTHLY EMI</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 46, fontWeight: 600, marginTop: 4 }}>{inr(e.m)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.14)' }}>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Principal</div>
            <div style={{ fontWeight: 700, marginTop: 2 }}>{short(emiP)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Interest</div>
            <div style={{ fontWeight: 700, marginTop: 2, color: '#e9a23b' }}>{short(e.interest)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Total</div>
            <div style={{ fontWeight: 700, marginTop: 2 }}>{short(e.total)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 24 }}>
        <SliderRow label="Loan amount" display={short(emiP)} min={100000} max={20000000} step={50000} value={emiP} onChange={actions.setEmiP} />
        <SliderRow label="Interest rate" display={`${emiR}%`} min={6} max={18} step={0.1} value={emiR} onChange={actions.setEmiR} />
        <SliderRow label="Tenure" display={`${emiN} years`} min={1} max={30} step={1} value={emiN} onChange={actions.setEmiN} />
      </div>
    </div>
  );
}
