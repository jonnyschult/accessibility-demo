import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from '@emotion/native';
import {Animated, ScrollView, StyleSheet, ViewStyle, View} from 'react-native';
import {IS_IOS, ZIndex} from '../constants';
import {useAccessibilityContext} from '../accessibilityContext';

interface Props extends ViewStyle {
  marginBottom?: number;
  defaultText: string;
  dropDownOptions: string[];
  selection?: string | null;
  height?: number;
  accessibilityLabel?: string;
  scrollEnabled?: boolean;
  error?: boolean;
  setSelection: (value: string) => void;
}

const DropDownInput = ({
  defaultText,
  selection,
  width,
  height = 56,
  marginBottom = 20,
  dropDownOptions,
  accessibilityLabel,
  scrollEnabled,
  error,
  setSelection,
}: Props) => {
  const {setFocus} = useAccessibilityContext();
  const openTranslation = useRef(new Animated.Value(0)).current;
  const openMenuRef = useRef(null);
  const layoutRef = useRef<ScrollView>(null);
  const firstOptionRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [zIndex, setZIndex] = useState(ZIndex.MIN);
  const menuHeight = dropDownOptions.length * 30;
  const componentHeight = menuHeight + height + 4;
  const bottomMarginOffset = marginBottom - menuHeight;

  const {spinArrow, slide} = animationStyles({
    openTranslation,
    menuHeight: menuHeight,
  });

  useEffect(() => {
    Animated.timing(openTranslation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, openTranslation]);

  const handlePress = (openStatus: boolean, option?: string) => {
    if (option) {
      setSelection(option);
    }
    // Auto focus on the first menu item
    // Android requires a bit of time to properly focus
    if (!isOpen && firstOptionRef.current) {
      setFocus({ref: firstOptionRef, delay: IS_IOS ? 0 : 500});
    }
    // Auto focus on the pressable after selection
    if (isOpen && openMenuRef.current) {
      setFocus({ref: openMenuRef, delay: 400});
    }

    if (layoutRef.current && scrollEnabled) {
      layoutRef.current.scrollTo({y: 0});
    }
    setIsOpen(!openStatus);
    setTimeout(
      () => {
        setZIndex(openStatus ? ZIndex.MIN : ZIndex.MIDDLE);
      },
      openStatus ? 300 : 0,
    );
  };

  return (
    <Layout
      marginBottom={bottomMarginOffset}
      accessible={false}
      importantForAccessibility="yes"
      height={componentHeight}
      zIndex={zIndex}
      accessibilityViewIsModal={isOpen}
      ref={layoutRef}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      nestedScrollEnabled={isOpen && scrollEnabled}
      contentContainerStyle={contentContainerStyle({
        height: componentHeight,
        marginBottom: bottomMarginOffset,
        zIndex,
      })}>
      <DropDown
        menuHeight={menuHeight}
        height={height}
        importantForAccessibility="yes">
        <DropDownPressable
          width={width}
          height={height}
          ref={openMenuRef}
          onPress={() => handlePress(isOpen)}
          pointerEvents="auto"
          error={error}
          accessibilityLabel={
            selection
              ? `${'current selection: ' + selection}`
              : accessibilityLabel ?? 'Dropdown menu'
          }
          accessibilityHint="Double tap to open and see dropdown options."
          accessible
          importantForAccessibility="yes">
          {selection ? (
            <SelectionText>{selection}</SelectionText>
          ) : (
            <InputText>{defaultText}</InputText>
          )}
          <Arrow style={spinArrow} pointerEvents="none" />
        </DropDownPressable>
        <DropDownMenu
          style={slide}
          height={menuHeight}
          error={error}
          accessible={!IS_IOS}
          pointerEvents={isOpen ? 'auto' : 'box-none'}>
          {dropDownOptions.map((option, index) => (
            <DropDownOption
              key={index}
              ref={index === 0 ? firstOptionRef : undefined}
              accessibilityLabel={`${option}, option ${index + 1} of ${
                dropDownOptions.length
              } `}
              accessibilityRole="menuitem"
              accessible={isOpen}
              onPress={() => handlePress(isOpen, option)}>
              <DropDownText accessible={false}>{option}</DropDownText>
            </DropDownOption>
          ))}
        </DropDownMenu>
      </DropDown>
    </Layout>
  );
};

export default DropDownInput;

const contentContainerStyle = ({height, marginBottom, zIndex}: ViewStyle) =>
  css({
    flexGrow: 1,
    marginBottom: marginBottom,
    width: '100%',
    justifyContent: 'flex-start',
    height: height,
    zIndex,
    alignItems: 'flex-start',
  });

const Layout = styled.ScrollView(
  ({height, marginBottom, zIndex}: ViewStyle) => ({
    marginBottom: marginBottom,
    width: '100%',
    height: height,
    zIndex,
  }),
);

const DropDown = styled.View(
  ({menuHeight, height}: {menuHeight: number; height: number}) => ({
    height: menuHeight + height,
    width: '100%',
    overflow: 'hidden',
  }),
);

const DropDownPressable = styled.Pressable(
  ({
    width,
    height,
    error,
  }: {
    width?: number | string;
    height: number;
    error?: boolean;
  }) => ({
    zIndex: ZIndex.MAX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: error ? 'red' : 'black',
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
    height: height,
    width: width ?? '100%',
  }),
);

const SelectionText = styled.Text({
  fontSize: 16,
  fontWeight: '600',
  color: 'black',
});

const InputText = styled.Text({
  fontSize: 16,
  color: 'black',
});

const Arrow = styled(Animated.View)({
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderTopWidth: 0,
  borderRightWidth: 10,
  borderBottomWidth: 12,
  borderLeftWidth: 10,
  borderTopColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'black',
  borderLeftColor: 'transparent',
});

const DropDownMenu = styled(Animated.View)(
  ({height, error}: {height: number; error?: boolean}) => ({
    top: -height + 2,
    borderWidth: 1,
    borderColor: error ? 'red' : 'black',
    borderTopColor: 'transparent',
    backgroundColor: 'white',
    width: '100%',
  }),
);

const DropDownOption = styled.Pressable({
  height: 30,
  width: '100%',
});

const DropDownText = styled.Text({
  textAlign: 'left',
  width: '100%',
  paddingLeft: 15,
  fontWeight: '600',
  color: 'black',
});

interface StylesProps {
  openTranslation: Animated.Value;
  menuHeight: number;
}

const animationStyles = ({openTranslation, menuHeight}: StylesProps) =>
  StyleSheet.create({
    slide: {
      transform: [
        {
          translateY: openTranslation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, menuHeight - 4],
          }) as unknown as number,
        },
      ],
    },

    spinArrow: {
      transform: [
        {
          rotate: openTranslation.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }) as unknown as string,
        },
      ],
    },
  });
