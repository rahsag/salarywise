import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { colors } from '../theme/colors';
import type { ChatMessage } from '../lib/types';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const isUser = message.role === 'user';

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        backgroundColor: isUser ? colors.green : '#fff',
        borderWidth: isUser ? 0 : 1,
        borderColor: colors.borderCard,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 16,
        borderBottomRightRadius: isUser ? 5 : 16,
        borderBottomLeftRadius: isUser ? 16 : 5,
      }}
    >
      <Text style={{ color: isUser ? colors.cream : colors.ink, fontSize: 13.5, lineHeight: 20 }}>{message.text}</Text>
    </Animated.View>
  );
}
