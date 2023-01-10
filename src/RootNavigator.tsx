import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AccessibilityMenu from './AccessibilityMenu';
import Form from './form/Form';

const Stack = createNativeStackNavigator<RootStackParams>();

export type RootStackParams = {
  AccessibilityMenu: undefined;
  Form: undefined;
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen
          name="AccessibilityMenu"
          options={{headerTitle: 'Accessibility Menu'}}
          component={AccessibilityMenu}
        />
        <Stack.Screen name="Form" component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
