import React, {useState} from 'react';
import styled from '@emotion/native';
import {CustomButton} from './shared/reusableComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from './RootNavigator';
import {Linking} from 'react-native';
import TestModal from './TestModal';
import ToolTip from './shared/reusableComponents/ToolTip';
import {tooltip} from './static';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AccessibilityMenu'> {}

const AccessibilityMenu = ({navigation}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowToolTip] = useState(false);
  return (
    <Layout>
      <TestModal visible={showModal} handleClose={() => setShowModal(false)} />
      <ToolTip
        icon={tooltip}
        text={
          "This absolutely positioned element can just be read, since there's nothing to select."
        }
        onPress={() => setShowToolTip(!showTooltip)}
      />
      <CustomButton onPress={() => navigation.navigate('Form')}>
        Form
      </CustomButton>
      <CustomButton onPress={() => setShowModal(true)}>Modal</CustomButton>
      <CustomButton
        accessibilityRole="link"
        accessibilityLabel="Open blog about react native accessibility"
        onPress={() =>
          Linking.openURL(
            'https://www.yeti.co/blog/accessibility-best-practices-and-gotchas',
          )
        }>
        Accessibility Blog
      </CustomButton>
    </Layout>
  );
};

export default AccessibilityMenu;

const Layout = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});
