import { Pressable, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface BackHeaderProps {
  title: string;
  onBack: () => void;
}

export default function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4 }}>
      <Pressable onPress={onBack} hitSlop={10}>
        <Text style={{ fontSize: 22, color: colors.ink }}>←</Text>
      </Pressable>
      <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 22, color: colors.ink }}>{title}</Text>
    </View>
  );
}
