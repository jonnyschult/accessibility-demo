import styled from '@emotion/native';
import React from 'react';
import {AccessibilityProvider} from './src/shared/accessibilityContext';
import RootNavigator from './src/RootNavigator';

const App = () => {
  return (
    <AppView>
      <AccessibilityProvider>
        <RootNavigator />
      </AccessibilityProvider>
    </AppView>
  );
};

export default App;

const AppView = styled.SafeAreaView({
  flex: 1,
});
