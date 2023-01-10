import React from 'react';
import styled from '@emotion/native';
import Modal from '../shared/reusableComponents/Modal';
import {CustomButton} from '../shared/reusableComponents/Button';

interface Props {
  visible: boolean;
  handleClose: () => void;
}

//Most of the accessibility logic is in the reusable Modal component.
const SuccessModal = ({visible, handleClose}: Props) => {
  return (
    <Modal
      visible={visible}
      handleClose={handleClose}
      accessibilityAlertReason="Form submission successful">
      <Layout>
        <Title accessibilityRole="header">Success</Title>
        <Copy>The Correct Answer is Endeavour, Morse, Icarus.</Copy>

        <CustomButton
          onPress={handleClose}
          width={'70%'}
          height={52}
          marginTop={10}
          borderWidth={2}
          borderColor={'black'}
          accessibilityLabel="Close and navigate back to accessibility menu">
          Close
        </CustomButton>
      </Layout>
    </Modal>
  );
};

export default SuccessModal;

const Layout = styled.View({
  width: '100%',
  paddingBottom: 40,
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const Title = styled.Text({
  fontSize: 40,
  marginBottom: 20,
  color: 'black',
});

const Copy = styled.Text({
  textAlign: 'center',
  fontSize: 16,
  marginTop: 10,
  marginBottom: 40,
  width: '70%',
  color: 'black',
});
