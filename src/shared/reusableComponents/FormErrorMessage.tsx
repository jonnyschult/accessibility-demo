import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import {alert} from '../../static';
import {IS_IOS} from '../constants';
import Icon from './Icon';
import {useAccessibilityContext} from '../accessibilityContext';

interface Props {
  isVisible: boolean;
  errorMessage?: string;
  marginBottom?: number;
  width?: number | string;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'yes' | 'no' | 'no-hide-descendants';
}

const FormErrorMessage = ({
  errorMessage,
  isVisible,
  marginBottom = 20,
  width = '100%',
  accessibilityElementsHidden,
  importantForAccessibility,
}: Props) => {
  const {announce} = useAccessibilityContext();
  const growTranslation = useRef(new Animated.Value(0)).current;
  const {grow} = styles({
    growTranslation,
    width,
    marginBottom,
  });

  useEffect(() => {
    Animated.timing(growTranslation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible, growTranslation]);

  useEffect(() => {
    if (IS_IOS && isVisible) {
      announce({message: 'Error alert: ' + errorMessage, queue: true});
    }
  }, [isVisible, errorMessage, announce]);

  return (
    <Layout
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      accessibilityLiveRegion={isVisible ? 'polite' : 'none'}
      style={grow}>
      <ErrorContainer>
        <Icon source={alert} size={22} />
        <ErrorText accessibilityRole="alert">{errorMessage}</ErrorText>
      </ErrorContainer>
    </Layout>
  );
};

export default FormErrorMessage;

const Layout = styled(Animated.View)({});

const ErrorContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  width: '100%',
  overflow: 'hidden',
});

const ErrorText = styled.Text({
  flex: 1,
  flexWrap: 'wrap',
  fontSize: 14,
  marginLeft: 10,
  textAlign: 'left',
  overflow: 'hidden',
  fontWeight: '600',
  color: 'black',
});

interface AnimationProps {
  growTranslation: Animated.Value;
  width: number | string;
  marginBottom: number;
}

const styles = ({growTranslation, width, marginBottom}: AnimationProps) =>
  StyleSheet.create({
    grow: {
      maxHeight: growTranslation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }) as unknown as number,
      marginBottom: growTranslation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, marginBottom],
      }) as unknown as number,
      width,
    },
  });
