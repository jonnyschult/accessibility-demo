import React, {Dispatch, RefObject, SetStateAction, useEffect} from 'react';
import {createContext, ReactNode, useContext, useState} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';

interface AnnounceOptions {
  message: string;
  queue?: boolean;
  delay?: number;
}

interface SetFocusOptions {
  ref: RefObject<any>;
  delay?: number;
}

export interface AccessibilityContent {
  screenReaderIsEnabled: boolean;
  setFocus: (options: SetFocusOptions) => void;
  announce: (options: AnnounceOptions) => void;
  setScreenReaderIsEnabled: Dispatch<SetStateAction<boolean>>;
}

export const AccessibilityContext = createContext<AccessibilityContent>({
  screenReaderIsEnabled: false,
  setFocus: _options => {},
  announce: _options => {},
  setScreenReaderIsEnabled: () => {},
});

export const useAccessibilityContext = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({children}: {children: ReactNode}) => {
  const [screenReaderIsEnabled, setScreenReaderIsEnabled] = useState(false);

  const updateScreenReaderStatus = async (isActive: boolean) => {
    setScreenReaderIsEnabled(isActive);
  };

  // Create a setFocus function so you can simplify focus setting throughout the app
  const setFocus = ({ref, delay}: SetFocusOptions) => {
    const reactTag = findNodeHandle(ref.current);
    if (reactTag) {
      if (delay) {
        setTimeout(() => {
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        }, delay);
      } else {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  };

  const announce = ({message, queue = false, delay}: AnnounceOptions) => {
    console.log(message);
    if (delay) {
      setTimeout(() => {
        // @ts-ignore for some unknown reason, this method isn't recognized.
        AccessibilityInfo.announceForAccessibilityWithOptions(message, {
          queue,
        });
      }, delay);
    } else {
      // @ts-ignore for some unknown reason, this method isn't recognized.
      AccessibilityInfo.announceForAccessibilityWithOptions(message, {
        queue,
      });
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
        announce,
        setScreenReaderIsEnabled,
      }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
