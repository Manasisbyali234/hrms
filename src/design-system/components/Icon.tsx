import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: object;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#1F2937', style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);
