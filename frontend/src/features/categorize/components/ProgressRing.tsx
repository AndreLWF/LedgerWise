import { StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ringStyles = StyleSheet.create({
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
});

interface Props {
  progress: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  progress,
  color,
  trackColor,
  size = 52,
  strokeWidth = 4,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size} style={ringStyles.svg}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}
