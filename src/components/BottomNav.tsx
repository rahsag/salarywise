import type { Screen } from '../lib/types';

interface BottomNavProps {
  screen: Screen;
  go: (screen: Screen) => void;
}

export default function BottomNav({ screen, go }: BottomNavProps) {
  const navHome = screen === 'dashboard' ? '#5a7d4f' : '#b6a88c';
  const navCoach = screen === 'coach' ? '#5a7d4f' : '#b6a88c';

  return (
    <div
      style={{
        flex: 'none',
        height: 64,
        background: '#fffdf8',
        borderTop: '1px solid #ece3d1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 6,
      }}
    >
      <button onClick={() => go('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: navHome }}>
        <div style={{ fontSize: 18 }}>◉</div>
        <div style={{ fontSize: 9.5, fontWeight: 700 }}>Home</div>
      </button>
      <button onClick={() => go('budget')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#b6a88c' }}>
        <div style={{ fontSize: 18 }}>▤</div>
        <div style={{ fontSize: 9.5, fontWeight: 600 }}>Tools</div>
      </button>
      <button onClick={() => go('sip')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#b6a88c' }}>
        <div style={{ fontSize: 18 }}>◈</div>
        <div style={{ fontSize: 9.5, fontWeight: 600 }}>Grow</div>
      </button>
      <button onClick={() => go('coach')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: navCoach }}>
        <div style={{ fontSize: 18 }}>✦</div>
        <div style={{ fontSize: 9.5, fontWeight: 600 }}>Coach</div>
      </button>
    </div>
  );
}
