import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, View } from 'react-native';

interface CollapsibleProps {
  expanded: boolean;
  children: ReactNode;
}

export default function Collapsible({ expanded, children }: CollapsibleProps) {
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const height = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(height, {
        toValue: expanded ? measuredHeight : 0,
        duration: expanded ? 280 : 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 220 : 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [expanded, measuredHeight]);

  return (
    <View>
      {/* Invisible measurer — always mounted so height is known before the user opens the card */}
      <View
        style={{ position: 'absolute', left: 0, right: 0, opacity: 0 }}
        pointerEvents="none"
        onLayout={(e) => setMeasuredHeight(e.nativeEvent.layout.height)}
      >
        {children}
      </View>
      <Animated.View style={{ height, opacity, overflow: 'hidden' }}>{children}</Animated.View>
    </View>
  );
}
