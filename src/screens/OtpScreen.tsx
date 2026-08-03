import type { SalaryWiseActions } from '../lib/useSalaryWise';

interface OtpScreenProps {
  mobile: string;
  otp: [string, string, string, string];
  actions: SalaryWiseActions;
}

const otpInputStyle = {
  textAlign: 'center' as const,
  fontSize: 26,
  fontWeight: 700,
  padding: '16px 0',
};

export default function OtpScreen({ mobile, otp, actions }: OtpScreenProps) {
  const mobileDisplay = mobile || '+91 98765 43210';

  return (
    <div className="sw-screen-in" style={{ padding: '14px 26px 40px' }}>
      <button onClick={() => actions.go('signup')} style={{ background: 'none', border: 'none', fontSize: 22, color: '#2b2618', cursor: 'pointer', padding: 0 }}>
        ←
      </button>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: '#2b2618', marginTop: 20 }}>Verify your number</div>
      <div style={{ fontSize: 14, color: '#8a7f68', marginTop: 8, lineHeight: 1.5 }}>
        We sent a 4-digit code to
        <br />
        <b style={{ color: '#2b2618' }}>{mobileDisplay}</b>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            className="sw-ti"
            style={otpInputStyle}
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={(e) => actions.setOtpDigit(i, e.target.value)}
          />
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#c2a24a', background: '#faf1dc', border: '1px solid #f0e2bf', borderRadius: 12, padding: '10px 12px', marginTop: 18, lineHeight: 1.45 }}>
        ⚠ Demo mode — OTP is mocked, any code works.
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#a99e86', marginTop: 18 }}>Resend code in 0:24</div>
      <button
        onClick={() => actions.go('profile')}
        style={{ width: '100%', marginTop: 22, background: '#2f4a34', color: '#f6f1e7', border: 'none', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
      >
        Verify &amp; continue
      </button>
    </div>
  );
}
