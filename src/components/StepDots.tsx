interface StepDotsProps {
  active: number;
  total?: number;
}

export default function StepDots({ active, total = 3 }: StepDotsProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 22 : 8,
            height: 8,
            borderRadius: 8,
            background: i === active ? '#2f4a34' : '#d8cdb8',
          }}
        />
      ))}
    </div>
  );
}
