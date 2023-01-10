import React, {Dispatch, RefObject, SetStateAction, useEffect} from 'react';
import {createContext, ReactNode, useContext, useState} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';

export interface AccessibilityContent {
  screenReaderIsEnabled: boolean;
  setFocus: (ref: RefObject<any>, delay?: number) => void;
  setScreenReaderIsEnabled: Dispatch<SetStateAction<boolean>>;
}

export const AccessibilityContext = createContext<AccessibilityContent>({
  screenReaderIsEnabled: false,
  setFocus: (_ref, _delay) => {},
  setScreenReaderIsEnabled: () => {},
});

export const useAccessibilityContext = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({children}: {children: ReactNode}) => {
  const [screenReaderIsEnabled, setScreenReaderIsEnabled] = useState(false);

  const updateScreenReaderStatus = async (isActive: boolean) => {
    setScreenReaderIsEnabled(isActive);
  };

  // Create a setFocus function so you can simplify focus setting throughout the app
  const setFocus = (reactNode: RefObject<any>, delay: number = 0) => {
    const reactTag = findNodeHandle(reactNode.current);
    if (reactTag) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }, delay);
    }
  };

  useEffect(() => {
    // Create listener for when a screen reader is enable
    // If it is, set a state variable to be used throughout the app
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      isActive => {
        updateScreenReaderStatus(isActive);
      },
    );

    return () => {
      screenReaderListener.remove();
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        screenReaderIsEnabled,
        setFocus,
        setScreenReaderIsEnabled,
      }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
