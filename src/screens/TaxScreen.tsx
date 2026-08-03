import { inr, short, taxCalc } from '../lib/finance';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import BackHeader from '../components/BackHeader';
import SliderRow from '../components/SliderRow';

interface TaxScreenProps {
  taxIncome: number;
  tax80c: number;
  taxHra: number;
  actions: SalaryWiseActions;
}

interface Rec {
  t: string;
  d: string;
  v: string;
}

function RecRow({ rec, index }: { rec: Rec; index: number }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
      <div style={{ width: 22, height: 22, flex: 'none', borderRadius: 7, background: '#eaf1e4', color: '#2f4a34', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {index + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#2b2618' }}>{rec.t}</div>
        <div style={{ fontSize: 11, color: '#9a8f78' }}>{rec.d}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#5a7d4f' }}>{rec.v}</div>
    </div>
  );
}

export default function TaxScreen({ taxIncome, tax80c, taxHra, actions }: TaxScreenProps) {
  const taxNew = taxCalc(taxIncome, 'new', 0, 0);
  const taxOld = taxCalc(taxIncome, 'old', tax80c, taxHra);
  const best = taxNew <= taxOld ? 'New' : 'Old';
  const taxSaving = Math.abs(taxNew - taxOld);

  const recs: Rec[] = [
    best === 'New'
      ? { t: 'Switch to the New regime', d: 'Lower tax at your income & deductions', v: short(taxSaving) }
      : { t: 'Stay on the Old regime', d: 'Your deductions make it cheaper', v: short(taxSaving) },
    {
      t: 'Max out 80C to ₹1.5L',
      d: tax80c < 150000 ? 'ELSS / PPF / EPF — Old regime only' : 'Already maxed ✓',
      v: tax80c < 150000 ? short((150000 - tax80c) * 0.3) : '—',
    },
    { t: 'Claim HRA exemption', d: 'If you pay rent & get HRA in CTC', v: short(taxHra * 0.2) },
  ];

  return (
    <div className="sw-screen-in" style={{ padding: '8px 24px 40px' }}>
      <BackHeader title="Tax & Salary Optimizer" onBack={() => actions.go('dashboard')} />

      <div style={{ background: '#e9a23b', borderRadius: 22, padding: '20px 22px', marginTop: 18, color: '#2b2618', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.04em' }}>RECOMMENDED FOR YOU</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, marginTop: 6 }}>{best} regime</div>
        <div style={{ fontSize: 13.5, marginTop: 6, fontWeight: 600 }}>
          Saves you <b>{inr(taxSaving)}</b> a year vs the other
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div style={{ flex: 1, background: '#fff', border: `2px solid ${best === 'New' ? '#5a7d4f' : '#ece3d1'}`, borderRadius: 18, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8a7f68' }}>NEW REGIME</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: '#2b2618', marginTop: 4 }}>{inr(taxNew)}</div>
          <div style={{ fontSize: 11, color: '#9a8f78', marginTop: 2 }}>tax / year</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: `2px solid ${best === 'Old' ? '#5a7d4f' : '#ece3d1'}`, borderRadius: 18, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8a7f68' }}>OLD REGIME</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: '#2b2618', marginTop: 4 }}>{inr(taxOld)}</div>
          <div style={{ fontSize: 11, color: '#9a8f78', marginTop: 2 }}>with deductions</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 24 }}>
        <SliderRow label="Annual gross income" display={short(taxIncome)} min={300000} max={5000000} step={50000} value={taxIncome} onChange={actions.setTaxIncome} />
        <SliderRow label="80C investments" display={short(tax80c)} min={0} max={150000} step={5000} value={tax80c} onChange={actions.setTax80c} />
        <SliderRow label="HRA + other exemptions" display={short(taxHra)} min={0} max={500000} step={10000} value={taxHra} onChange={actions.setTaxHra} />
      </div>

      <div style={{ background: '#fff', border: '1px solid #ece3d1', borderRadius: 18, padding: '16px 18px', marginTop: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8a7f68' }}>RANKED RECOMMENDATIONS</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recs.map((r, i) => (
            <RecRow key={i} rec={r} index={i} />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11.5, color: '#a99e86', marginTop: 14, lineHeight: 1.5 }}>⚠ Slabs simplified & indicative — verify against current law before filing.</div>
    </div>
  );
}
