import type { ReactNode } from 'react';

interface PhoneFrameProps {
  statusBarColor: string;
  nav?: ReactNode;
  children: ReactNode;
}

export default function PhoneFrame({ statusBarColor, nav, children }: PhoneFrameProps) {
  return (
    <div
      style={{
        width: 392,
        height: 812,
        borderRadius: 38,
        background: '#0e0d0b',
        padding: 11,
        boxShadow: '0 40px 80px -24px rgba(0,0,0,.55)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 29,
          overflow: 'hidden',
          background: '#f6f1e7',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: 40,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            fontSize: 13,
            fontWeight: 700,
            color: statusBarColor,
            zIndex: 5,
          }}
        >
          <span>9:41</span>
          <span style={{ letterSpacing: '.02em' }}>5G ▮▮▮ 84%</span>
        </div>

        <div className="sw-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>

        {nav}
      </div>
    </div>
  );
}
