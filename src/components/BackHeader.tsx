interface BackHeaderProps {
  title: string;
  onBack: () => void;
}

export default function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, color: '#2b2618', cursor: 'pointer', padding: 0 }}>
        ←
      </button>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: '#2b2618' }}>{title}</div>
    </div>
  );
}
