import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Animated, Modal as RNModal, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import Icon from './Icon';
import {IS_IOS, ZIndex} from '../constants';
import {exitIcon} from '../../static';

interface Props {
  children: ReactNode;
  visible: boolean;
  accessibilityAlertReason?: string;
  paddingBottom?: number;
  announcementDuration?: number;
  handleClose: () => void;
}

const Modal = ({
  children,
  visible,
  accessibilityAlertReason,
  paddingBottom,
  announcementDuration = 2000, // May vary by screen reader reading speed
  handleClose,
}: Props) => {
  const translation = useRef(new Animated.Value(0)).current;
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const {modalContentStyle} = styles({translation});
  const accessibilityAnnouncement = `Modal has opened. ${
    accessibilityAlertReason ? 'Reason: ' + accessibilityAlertReason : ''
  }`;

  // Accessibility takes a bit of time to focus, so the timeout
  // makes sure that the value doens't change until after it's read
  // Only needed for iOS, android's live region works well
  useEffect(() => {
    const timer = setTimeout(() => {
      if (IS_IOS && visible) {
        setHasAnnounced(true);
      }
    }, announcementDuration);
    return () => {
      clearTimeout(timer);
      setHasAnnounced(false);
    };
  }, [announcementDuration, visible]);

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => handleClose}>
      <Layout
        accessibilityLiveRegion="assertive"
        accessibilityLabel={`Modal has opened. ${
          accessibilityAlertReason ? 'Reason: ' + accessibilityAlertReason : ''
        }`}>
        <ModalContent paddingBottom={paddingBottom} style={modalContentStyle}>
          <ExitIconContainer>
            <Icon
              size={50}
              source={exitIcon}
              onPress={handleClose}
              accessibilityRole="none"
              accessibilityLabel={
                hasAnnounced || !IS_IOS
                  ? 'exit modal: button'
                  : accessibilityAnnouncement
              }
            />
          </ExitIconContainer>
          {children}
        </ModalContent>
      </Layout>
    </RNModal>
  );
};

export default Modal;

const Layout = styled.View({
  flex: 1,
  height: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000000b3',
});

const ModalContent = styled(Animated.View)(
  ({paddingBottom}: {paddingBottom?: number}) => ({
    width: '90%',
    maxHeight: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 39,
    paddingBottom,
    backgroundColor: 'white',
  }),
);

const ExitIconContainer = styled.View({
  flexDirection: 'row',
  paddingHorizontal: 18,
  paddingTop: 15,
  width: '100%',
  justifyContent: 'flex-end',
  zIndex: ZIndex.MIDDLE,
});
interface AnimationProps {
  translation: Animated.Value;
}

const styles = ({translation}: AnimationProps) =>
  StyleSheet.create({
    modalContentStyle: {
      marginBottom: translation as unknown as number,
    },
  });
