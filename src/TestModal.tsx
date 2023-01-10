import React from 'react';
import styled from '@emotion/native';
import Modal from './shared/reusableComponents/Modal';
import {CustomButton} from './shared/reusableComponents/Button';

interface Props {
  visible: boolean;
  handleClose: () => void;
}

//Most of the accessibility logic is in the reusable Modal component.
const TestModal = ({visible, handleClose}: Props) => {
  return (
    <Modal
      visible={visible}
      handleClose={handleClose}
      accessibilityAlertReason="You pressed the test modal button">
      <Layout>
        <Header accessibilityRole="header">Hello!</Header>
        <Copy>Hopefully you heard an announcement that the modal is open!</Copy>
        <CustomButton
          onPress={handleClose}
          width={'70%'}
          height={52}
          marginTop={10}
          borderWidth={2}
          borderColor={'black'}>
          Close
        </CustomButton>
      </Layout>
    </Modal>
  );
};

export default TestModal;

const Layout = styled.View({
  width: '100%',
  paddingBottom: 40,
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const Header = styled.Text({
  fontSize: 40,
  marginBottom: 20,
  color: 'black',
  fontWeight: '600',
});

const Copy = styled.Text(() => ({
  textAlign: 'center',
  fontSize: 16,
  marginTop: 10,
  marginBottom: 20,
  width: '70%',
  color: 'black',
}));
