import React from 'react';
import {
  AccessibilityRole,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import styled from '@emotion/native';
import {loadingIndicator} from '../../static';
import Icon from './Icon';

interface Props extends ViewStyle {
  onPress: (event: GestureResponderEvent) => void;
  children: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  width?: number | string;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

export const CustomButton = ({
  onPress,
  children,
  isLoading,
  isDisabled,
  width,
  accessibilityRole,
  accessibilityLabel,
  accessibilityElementsHidden,
  importantForAccessibility,
}: Props) => {
  return (
    <Button
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      width={width}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityLabel={isLoading ? 'Loading' : accessibilityLabel}>
      {isLoading ? (
        <Icon source={loadingIndicator} size={48} />
      ) : (
        <CustomText>{children}</CustomText>
      )}
    </Button>
  );
};

const Button = styled.TouchableHighlight(
  ({width}: {width?: string | number}) => ({
    alignItems: 'center',
    justifyContent: 'center',
    width: width ?? 200,
    borderRadius: 20,
    height: 52,
    marginBottom: 20,
    backgroundColor: 'black',
  }),
);

const CustomText = styled.Text({
  color: 'white',
  fontSize: 16,
  fontWeight: '700',
});
