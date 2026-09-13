import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

interface AmountInputProps {
  label: string;
  display: string;
  valueColor?: string;
  min?: number;
  value: number;
  onChange: (v: number) => void;
}

export default function AmountInput({ label, display, valueColor = colors.ink, min = 0, value, onChange }: AmountInputProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  const commit = () => {
    setEditing(false);
    const parsed = parseFloat(text);
    if (Number.isFinite(parsed)) {
      onChange(Math.max(min, parsed));
    }
  };

  return (
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
        style={{ fontWeight: '700', color: valueColor, fontSize: 15, textAlign: 'right', minWidth: 100, padding: 0 }}
      />
    </View>
  );
}
