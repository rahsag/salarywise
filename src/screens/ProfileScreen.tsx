import type { CityTier } from '../lib/types';
import type { SalaryWiseActions } from '../lib/useSalaryWise';
import StepDots from '../components/StepDots';

interface ProfileScreenProps {
  age: number;
  cityTier: CityTier;
  dependents: number;
  actions: SalaryWiseActions;
}

const CITY_TIERS: CityTier[] = ['Metro', 'Tier-2', 'Tier-3'];

const stepperBtn = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: '1px solid #e0d6c2',
  background: '#fffdf8',
  fontSize: 18,
  cursor: 'pointer',
  color: '#2b2618',
} as const;

export default function ProfileScreen({ age, cityTier, dependents, actions }: ProfileScreenProps) {
  return (
    <div className="sw-screen-in" style={{ padding: '14px 26px 40px' }}>
      <StepDots active={0} />
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: '#2b2618', marginTop: 18 }}>A little about you</div>
      <div style={{ fontSize: 14, color: '#8a7f68', marginTop: 6 }}>This tailors your plan and score.</div>

      <div style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#6b6250' }}>
          <span>Age</span>
          <b style={{ color: '#2b2618', fontSize: 15 }}>{age} yrs</b>
        </div>
        <input type="range" min={21} max={60} value={age} onChange={(e) => actions.setAge(+e.target.value)} style={{ width: '100%', marginTop: 12 }} />
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#6b6250', marginBottom: 10 }}>City tier</div>
        <div style={{ display: 'flex', gap: 9 }}>
          {CITY_TIERS.map((c) => (
            <button
              key={c}
              onClick={() => actions.setCityTier(c)}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 13,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                border: '1px solid ' + (cityTier === c ? '#2f4a34' : '#e0d6c2'),
                background: cityTier === c ? '#2f4a34' : '#fffdf8',
                color: cityTier === c ? '#f6f1e7' : '#6b6250',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b6250' }}>Dependents</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={actions.depMinus} style={stepperBtn}>
              −
            </button>
            <b style={{ fontSize: 17, color: '#2b2618', minWidth: 14, textAlign: 'center' }}>{dependents}</b>
            <button onClick={actions.depPlus} style={stepperBtn}>
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => actions.go('income')}
        style={{ width: '100%', marginTop: 38, background: '#2f4a34', color: '#f6f1e7', border: 'none', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
      >
        Continue
      </button>
    </div>
  );
}
