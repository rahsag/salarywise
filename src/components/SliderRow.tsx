interface SliderRowProps {
  label: string;
  display: string;
  valueColor?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

export default function SliderRow({ label, display, valueColor = '#2b2618', min, max, step, value, onChange }: SliderRowProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#6b6250' }}>
        <span>{label}</span>
        <b style={{ color: valueColor, fontSize: 15 }}>{display}</b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: '100%', marginTop: 11 }}
      />
    </div>
  );
}
