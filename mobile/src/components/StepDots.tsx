import { View } from 'react-native';
import { colors } from '../theme/colors';

interface StepDotsProps {
  active: number;
  total?: number;
}

export default function StepDots({ active, total = 3 }: StepDotsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 22 : 8,
            height: 8,
            borderRadius: 8,
            backgroundColor: i === active ? colors.green : '#d8cdb8',
          }}
        />
      ))}
    </View>
  );
}
