import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ViewStyle,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import styled from '@emotion/native';
import Icon from './Icon';
import {IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH, ZIndex} from '../constants';
import {useAccessibilityContext} from '../accessibilityContext';

interface Props {
  text: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
}

const ToolTip = ({text, icon, onPress}: Props) => {
  const {announce} = useAccessibilityContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const [offset, setOffset] = useState<{x: number; y: number} | null>(null);
  const toolTipContainerRef = useRef<View>(null);
  const translation = useRef(new Animated.Value(0)).current;
  const {tooltipContainerStyle} = styles({translation});

  useEffect(() => {
    Animated.timing(translation, {
      toValue: showTooltip ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showTooltip, translation]);

  useEffect(() => {
    if (toolTipContainerRef.current) {
      toolTipContainerRef.current.measure(
        (_fx, _fy, _width, _height, px, py) => {
          setOffset({x: px, y: py});
        },
      );
    }
  }, [toolTipContainerRef]);

  useEffect(() => {
    if (IS_IOS && showTooltip) {
      announce({message: text, delay: 100});
    }
  }, [showTooltip, text, announce]);

  return (
    <ToolTipContainer ref={toolTipContainerRef} collapsable={false}>
      {showTooltip && offset && (
        <TapOutsideListenerElement
          onPress={() => {
            onPress && onPress();
            setShowTooltip(false);
          }}
          top={-offset.y}
          left={-offset.x}
        />
      )}
      <TooltipTextContainer
        style={tooltipContainerStyle}
        accessibilityLiveRegion={showTooltip ? 'assertive' : 'none'}
        accessibilityLabel={text}
        pointerEvents={showTooltip ? 'box-only' : 'none'}
        accessible={showTooltip}
        accessibilityRole="text">
        <TooltipText maxFontSizeMultiplier={1}>{text}</TooltipText>
        <TooltipPoint />
      </TooltipTextContainer>
      <Icon
        source={icon}
        height={22}
        width={20}
        onPress={() => {
          onPress && onPress();
          setShowTooltip(!showTooltip);
        }}
        accessibilityLabel={'show tooltip icon'}
        accessibilityRole="button"
      />
    </ToolTipContainer>
  );
};

export default ToolTip;

const ToolTipContainer = styled.View({
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 20,
  zIndex: ZIndex.MAX,
});

const TooltipTextContainer = styled(Animated.View)({
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  right: -73,
  top: -95,
  width: 165,
  borderRadius: 5,
  backgroundColor: 'black',
  marginBottom: 0,
  marginTop: 0,
});

const TooltipText = styled.Text({
  color: 'white',
  textAlign: 'center',
  margin: 10,
  fontSize: 12,
});

const TooltipPoint = styled.View({
  position: 'absolute',
  bottom: -8,
  height: 20,
  width: 20,
  transform: [{rotate: '45deg'}],
  backgroundColor: 'black',
  zIndex: ZIndex.MIN,
});

const TapOutsideListenerElement = styled.TouchableOpacity(
  ({top, left}: ViewStyle) => ({
    top: top,
    left: left,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'absolute',
  }),
);

interface AnimationProps {
  translation: Animated.Value;
}

const styles = ({translation}: AnimationProps) =>
  StyleSheet.create({
    tooltipContainerStyle: {
      opacity: translation as unknown as number,
    },
  });
