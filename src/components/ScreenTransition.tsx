import { useEffect, useRef, type PropsWithChildren } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenTransitionProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export default function ScreenTransition({ children, style }: ScreenTransitionProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  // Android renders edge-to-edge by default, so screens must add the status
  // bar inset themselves — this adds it on top of whatever paddingTop the
  // caller already set, rather than replacing it, to preserve their spacing.
  const flatStyle = StyleSheet.flatten(style) ?? {};
  const paddingTop = (typeof flatStyle.paddingTop === 'number' ? flatStyle.paddingTop : 0) + insets.top;

  return (
    <Animated.View style={[style, { paddingTop, opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
