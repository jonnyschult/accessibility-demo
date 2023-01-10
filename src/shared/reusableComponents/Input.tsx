import React, {useEffect, useState, useRef, ReactNode} from 'react';
import {
  View,
  TextInputProps,
  StyleProp,
  TextStyle,
  Animated,
  StyleSheet,
  TextInputFocusEventData,
  NativeSyntheticEvent,
  AccessibilityInfo,
} from 'react-native';
import styled from '@emotion/native';
import {showPassword, hidePassword, alert} from '../../static';
import Icon from './Icon';
import {IS_IOS} from '../constants';

type MyTextInputProps = TextInputProps & {
  marginBottom?: number;
  label: string;
  activeLabel?: string;
  extraText?: string;
  error?: boolean;
  errorMessage?: string;
  errorComponent?: ReactNode;
  showErrorComponent?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  labelHeight?: number;
  multiline?: boolean;
  width?: string | number;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const Input = ({
  marginBottom,
  secureTextEntry,
  onChangeText,
  placeholder,
  label,
  activeLabel,
  extraText,
  error = true,
  errorMessage,
  errorComponent,
  showErrorComponent,
  value,
  width = '100%',
  minHeight = 56,
  maxHeight = 150,
  labelHeight = 18,
  multiline = false,
  labelStyle,
  inputStyle,
  accessibilityElementsHidden,
  importantForAccessibility,
  onBlur,
  onFocus,
  ...props
}: MyTextInputProps) => {
  const [showActiveLabel, setShowActiveLabel] = useState(Boolean(value));
  const [passwordIsRevealed, setPasswordIsRevealed] = useState(false);
  const [extraPadding, setExtraPadding] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const labelTranslation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const errorTranslation = useRef(new Animated.Value(0)).current;
  const {errorMessageAnimation, labelAnimation} = styles({
    showActiveLabel,
    labelTranslation,
    labelHeight,
    extraText,
    errorTranslation,
  });

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onFocus) {
      // Function passed from react-hook-form
      onFocus(e);
    }
    setIsActive(true);
    setShowActiveLabel(Boolean(true));
    Animated.timing(labelTranslation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onBlur) {
      // Function passed from react-hook-form
      onBlur(e);
    }
    setIsActive(false);
    setShowActiveLabel(Boolean(value));
    Animated.timing(labelTranslation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    Animated.timing(errorTranslation, {
      toValue: error ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    if (IS_IOS && error) {
      //@ts-ignore for some unknown reason, this method isn't recognized.
      AccessibilityInfo.announceForAccessibilityWithOptions(
        'Error alert: ' + errorMessage,
        {
          queue: true,
        },
      );
    }
  }, [error, errorTranslation, errorMessage]);

  return (
    <Layout
      width={width}
      marginBottom={marginBottom}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}>
      <View
        accessible
        // adding active allows the user to know when input they are currently typing in,
        // even if accessibility is focused elsewhere
        accessibilityLabel={`${activeLabel} input: ${
          isActive ? 'active' : ''
        }`}>
        <Label
          //@ts-ignore Seems to have lost the pointerEvents type when adding Animate.Text
          pointerEvents="none"
          selectable={false}
          style={[labelAnimation, labelStyle]}
          error={error}
          onChangeText={onChangeText}
          labelTranslation={labelTranslation}
          accessible={false}>
          {showActiveLabel && activeLabel ? activeLabel : label}
        </Label>

        <StyledTextInput
          error={error}
          style={inputStyle}
          onChangeText={onChangeText}
          placeholder={showActiveLabel ? placeholder : ''}
          onFocus={e => handleFocus(e)}
          onBlur={e => handleBlur(e)}
          secureTextEntry={secureTextEntry && !showPassword}
          value={value}
          multiline={multiline}
          minHeight={minHeight}
          maxHeight={maxHeight}
          extraPadding={extraPadding}
          onContentSizeChange={e => {
            if (e.nativeEvent.contentSize.height > 20) {
              setExtraPadding(true);
            } else {
              setExtraPadding(false);
            }
          }}
          {...props}
        />
      </View>
      {secureTextEntry && (
        <ShowPasswordContainer>
          <Icon
            source={passwordIsRevealed ? showPassword : hidePassword}
            size={17}
            accessibilityLabel={
              passwordIsRevealed ? 'hide password' : 'show password'
            }
            onPress={() => setPasswordIsRevealed(!passwordIsRevealed)}
          />
        </ShowPasswordContainer>
      )}

      <Animated.View style={errorMessageAnimation}>
        {extraText && <ExtraText>{extraText}</ExtraText>}
        {showErrorComponent && !errorMessage ? (
          errorComponent
        ) : (
          <ErrorContainer accessibilityLiveRegion={error ? 'polite' : 'none'}>
            <Icon source={alert} size={22} />
            <ErrorText accessibilityRole="alert">{errorMessage}</ErrorText>
          </ErrorContainer>
        )}
      </Animated.View>
    </Layout>
  );
};

export default Input;

const Layout = styled.View(
  ({marginBottom, width}: {marginBottom?: number; width: number | string}) => ({
    width,
    marginBottom: marginBottom !== undefined ? marginBottom : 26,
  }),
);

const Label = styled(Animated.Text)({
  marginLeft: 18,
  position: 'absolute',
  color: 'black',
  zIndex: 1,
});

const StyledTextInput = styled.TextInput(
  ({
    error,
    minHeight,
    maxHeight,
    extraPadding,
  }: {
    error: boolean;
    minHeight: number | string;
    maxHeight: number | string;
    extraPadding: boolean;
  }) => ({
    fontSize: 16,
    paddingLeft: 18,
    paddingTop: 20,
    paddingBottom: extraPadding ? 10 : 0,
    backgroundColor: 'white',
    width: '100%',
    maxHeight: maxHeight,
    height: 'auto',
    minHeight: minHeight,
    borderColor: error ? 'red' : 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    color: 'black',
  }),
);

const ShowPasswordContainer = styled.View({
  top: 20,
  right: 17,
  position: 'absolute',
  zIndex: 1,
});

const ExtraText = styled.Text({
  alignSelf: 'flex-start',
  position: 'absolute',
  top: 8,
  fontSize: 12,
  color: 'black',
});

const ErrorContainer = styled.View({
  marginTop: 16,
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
  showActiveLabel: boolean;
  labelTranslation: Animated.Value;
  extraText?: string;
  errorTranslation: Animated.Value;
  labelHeight: number;
}

const styles = ({
  showActiveLabel,
  labelTranslation,
  errorTranslation,
  labelHeight,
  extraText,
}: AnimationProps) =>
  StyleSheet.create({
    labelAnimation: {
      fontWeight: showActiveLabel ? 'bold' : 'normal',
      fontSize: labelTranslation.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 10],
      }),
      top: labelTranslation!.interpolate({
        inputRange: [0, 1],
        outputRange: [labelHeight, 8],
      }) as unknown as number,
    },
    errorMessageAnimation: {
      paddingTop: extraText ? 16 : 0,
      maxHeight: errorTranslation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }) as unknown as number,
    },
  });
