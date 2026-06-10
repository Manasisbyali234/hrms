import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius } from '../tokens';

interface AvatarProps {
  name?: string;
  initials?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  uri?: string | null;
  online?: boolean;
  style?: object;
}

const GRADIENT_COLORS = [
  ['#2563EB', '#60A5FA'],
  ['#1E40AF', '#3B82F6'],
  ['#10B981', '#34D399'],
  ['#F59E0B', '#FCD34D'],
  ['#EF4444', '#FCA5A5'],
  ['#8B5CF6', '#C4B5FD'],
  ['#06B6D4', '#67E8F9'],
  ['#3B82F6', '#93C5FD'],
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index][0];
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  initials,
  size = 44,
  backgroundColor,
  textColor = Colors.white,
  online,
  style,
}) => {
  const computed = initials || (name ? getInitials(name) : 'U');
  const bg = backgroundColor || (name ? getAvatarColor(name) : Colors.primary);
  const fontSize = size * 0.38;
  const dotSize = size * 0.28;

  return (
    <View style={[style]}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bg,
          },
        ]}
      >
        <Text style={[styles.text, { fontSize, color: textColor }]}>{computed}</Text>
      </View>
      {online !== undefined && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: online ? Colors.success : Colors.gray400,
              right: 1,
              bottom: 1,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
