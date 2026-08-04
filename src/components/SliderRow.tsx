import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
import { colors } from '../theme/colors';

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

export default function SliderRow({ label, display, valueColor = colors.ink, min, max, step, value, onChange }: SliderRowProps) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label }}>{label}</Text>
        <Text style={{ fontWeight: '700', color: valueColor, fontSize: 15 }}>{display}</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor="#e5dcc7"
        thumbTintColor={colors.green}
        style={{ width: '100%', marginTop: 11, height: 22 }}
      />
    </View>
  );
}
