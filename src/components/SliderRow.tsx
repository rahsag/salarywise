import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Text, TextInput, View } from 'react-native';
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
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  const commit = () => {
    setEditing(false);
    const parsed = parseFloat(text);
    if (Number.isFinite(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label }}>{label}</Text>
        <TextInput
          value={editing ? text : display}
          onFocus={() => {
            setText(String(value));
            setEditing(true);
          }}
          onChangeText={setText}
          onBlur={commit}
          onSubmitEditing={commit}
          keyboardType="decimal-pad"
          selectTextOnFocus
          style={{ fontWeight: '700', color: valueColor, fontSize: 15, textAlign: 'right', minWidth: 80, padding: 0 }}
        />
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
