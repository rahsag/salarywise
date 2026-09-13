import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  centerValueColor?: string;
  centerLabelColor?: string;
}

const GAP_PX = 3;

export default function DonutChart({
  segments,
  size = 168,
  strokeWidth = 26,
  centerLabel,
  centerValue,
  centerValueColor = colors.ink,
  centerLabelColor = colors.tan,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(
    segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0),
    1
  );
  const innerDiameter = Math.max(size - strokeWidth * 2 - 12, 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const frac = Math.max(seg.value, 0) / total;
    const rawDash = frac * circumference;
    const dash = Math.max(rawDash - GAP_PX, 0);
    const arc = { key: seg.label, dash, gap: circumference - dash, dashOffset: -offset, color: seg.color };
    offset += rawDash;
    return arc;
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.borderCard} strokeWidth={strokeWidth} fill="none" />
          {arcs.map((arc) => (
            <Circle
              key={arc.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
              fill="none"
            />
          ))}
        </G>
      </Svg>
      {(centerLabel || centerValue) && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {centerValue && (
            <Text
              style={{ fontFamily: fonts.serifSemiBold, fontSize: 20, color: centerValueColor, width: innerDiameter, textAlign: 'center' }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {centerValue}
            </Text>
          )}
          {centerLabel && (
            <Text
              style={{ fontSize: 10.5, color: centerLabelColor, marginTop: 1, width: innerDiameter, textAlign: 'center' }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {centerLabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
