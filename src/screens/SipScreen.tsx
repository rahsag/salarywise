import { inr, short, sipCalc } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import BackHeader from '../components/BackHeader';
import SliderRow from '../components/SliderRow';

interface SipScreenProps {
  sipAmt: number;
  sipR: number;
  sipY: number;
  actions: SalaryWiseActions;
}

export default function SipScreen({ sipAmt, sipR, sipY, actions }: SipScreenProps) {
  const s = sipCalc(sipAmt, sipR, sipY);

  return (
    <div className="sw-screen-in" style={{ padding: '8px 24px 40px' }}>
      <BackHeader title="SIP Calculator" onBack={() => actions.go('dashboard')} />

      <div style={{ background: '#2f4a34', borderRadius: 24, padding: 22, marginTop: 18, color: '#f4f0e6', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#b6cbaa', fontWeight: 600, letterSpacing: '.05em' }}>PROJECTED VALUE IN {sipY} YEARS</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 44, fontWeight: 600, marginTop: 4 }}>{short(s.fv)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.14)' }}>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Invested</div>
            <div style={{ fontWeight: 700, marginTop: 2 }}>{short(s.invested)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#b6cbaa' }}>Est. gain</div>
            <div style={{ fontWeight: 700, marginTop: 2, color: '#8fe3c8' }}>{short(s.gain)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 24 }}>
        <SliderRow label="Monthly investment" display={inr(sipAmt)} min={500} max={200000} step={500} value={sipAmt} onChange={actions.setSipAmt} />
        <SliderRow label="Expected return" display={`${sipR}% p.a.`} min={4} max={20} step={0.5} value={sipR} onChange={actions.setSipR} />
        <SliderRow label="Time period" display={`${sipY} years`} min={1} max={40} step={1} value={sipY} onChange={actions.setSipY} />
      </div>
    </div>
  );
}
