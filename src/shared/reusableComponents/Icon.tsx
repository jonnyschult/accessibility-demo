import React from 'react';
import {
  AccessibilityRole,
  ImageProps,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import styled from '@emotion/native';

type IconProps = ImageProps & {
  size?: number;
  height?: number;
  width?: number;
  source: ImageSourcePropType;
  marginLeft?: number;
  marginBottom?: number;
  borderRadius?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  onPress?: () => void;
};

const Icon = ({
  source,
  size,
  height,
  width,
  borderRadius,
  marginLeft,
  marginBottom,
  accessibilityLabel,
  accessibilityRole,
  onPress,
  ...props
}: IconProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.2 : 1}
      accessibilityRole={
        accessibilityRole ? accessibilityRole : onPress ? 'button' : undefined
      }
      accessibilityLabel={accessibilityLabel}>
      <StyledIcon
        source={source}
        size={size}
        height={height}
        width={width}
        borderRadius={borderRadius}
        marginLeft={marginLeft}
        marginBottom={marginBottom}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default Icon;

const StyledIcon = styled.Image(
  ({
    size,
    height,
    width,
    borderRadius,
    marginBottom,
    marginLeft,
  }: IconProps) => ({
    height: size ?? height,
    width: size ?? width,
    borderRadius,
    marginLeft,
    marginBottom,
  }),
);
