import type { CSSProperties } from 'react';
import type { SalaryWiseActions } from '../lib/useSalaryWise';

interface SignupScreenProps {
  name: string;
  mobile: string;
  email: string;
  actions: SalaryWiseActions;
}

const fieldLabel: CSSProperties = { fontSize: 12, fontWeight: 600, color: '#8a7f68', marginBottom: 6 };

export default function SignupScreen({ name, mobile, email, actions }: SignupScreenProps) {
  return (
    <div className="sw-screen-in" style={{ padding: '14px 26px 40px' }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: '#2f4a34',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fraunces',serif",
          fontSize: 26,
          fontWeight: 600,
          color: '#e9a23b',
        }}
      >
        S
      </div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 600, color: '#2b2618', marginTop: 22, lineHeight: 1.1, letterSpacing: '-.01em' }}>
        Money, made
        <br />
        manageable.
      </div>
      <div style={{ fontSize: 14, color: '#8a7f68', marginTop: 10, lineHeight: 1.5 }}>
        Budgeting, tax, loans and investing for salaried India — in one calm place.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30 }}>
        <div>
          <div style={fieldLabel}>Full name</div>
          <input className="sw-ti" value={name} onChange={(e) => actions.setName(e.target.value)} placeholder="Rahul Sharma" />
        </div>
        <div>
          <div style={fieldLabel}>Mobile number</div>
          <input className="sw-ti" value={mobile} onChange={(e) => actions.setMobile(e.target.value)} inputMode="numeric" placeholder="+91 98765 43210" />
        </div>
        <div>
          <div style={fieldLabel}>Email</div>
          <input className="sw-ti" value={email} onChange={(e) => actions.setEmail(e.target.value)} placeholder="rahul@email.com" />
        </div>
      </div>
      <button
        onClick={() => actions.go('otp')}
        style={{ width: '100%', marginTop: 26, background: '#2f4a34', color: '#f6f1e7', border: 'none', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
      >
        Create account
      </button>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: '#a99e86', marginTop: 16 }}>
        Already have an account? <b style={{ color: '#5a7d4f' }}>Log in</b>
      </div>
    </div>
  );
}
