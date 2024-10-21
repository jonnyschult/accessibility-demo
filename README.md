# React Native Accessibility Demo

This repository contains a React Native application that demonstrates best practices and common gotchas in implementing accessibility features in React Native (0.70) apps. The app is designed to help developers understand how to make their apps more accessible to users with disabilities, particularly those who rely on screen readers.

## Overview

Accessibility is a crucial aspect of modern app development. This project showcases how to implement accessibility features in a React Native app, focusing on:

- Using React Context to manage accessibility state.
- Implementing accessibility props in reusable components.
- Announcing UI updates, especially for pop-ups and modals.
- Handling nested links and absolutely positioned elements.
- Managing accessibility delays and focus.

The accompanying [blog](https://www.yeti.co/blog/accessibility-first-in-react-native) post provides an in-depth discussion of these topics.

## Features

- Accessibility Provider: Utilizes React Context to manage accessibility state across the app.
- Reusable Components: Accessibility props are integrated into shared components to reduce redundancy.
- Screen Reader Support: Implements logic to detect and adapt to screen reader usage.
- Announcements: Utilizes AccessibilityInfo API to announce UI changes.
- Accessibility Gotchas: Demonstrates solutions to common accessibility challenges, such as nested links and absolute positioning.

## Prerequisites

- Node.js: Ensure you have Node.js installed.
- React Native CLI: Install the React Native CLI.
- Android Studio / Xcode: Required for running the app on Android or iOS simulators.

## Getting Started

### Clone the Repository

```bash
git clone git@github.com:jonnyschult/accessibility-demo.git
cd react-native-accessibility-demo
```

### Install Dependencies

```bash
npm install
```

### Running the App

#### iOS

```bash
npx react-native run-ios
```

#### Android

```bash
npx react-native run-android
```

## Project Structure

- App.tsx: Entry point of the app, wraps the application with `AccessibilityProvider`.
- AccessibilityProvider: Manages accessibility state and provides utility functions for announcing messages and setting focus.
- Reusable Components: Custom button, modal, tooltip, etc., with accessibility props included.
- Screens:
  - **AccessibilityMenu**: Main menu showcasing various accessibility features.
  - **Form**: Demonstrates handling of form validation and error messages with accessibility in mind.
- Utils: Helper functions and constants, including static assets.

## Key Concepts

### Accessibility Context

The `AccessibilityProvider` uses React Context to manage and provide accessibility-related state and functions throughout the app.

```tsx
export const AccessibilityContext = createContext<AccessibilityContent>({
  screenReaderIsEnabled: false,
  setFocus: () => {},
  announce: () => {},
  setScreenReaderIsEnabled: () => {},
});
```

### Announcing UI Updates

Uses `AccessibilityInfo` to announce changes, ensuring that screen reader users are aware of dynamic content.

```tsx
const announce = ({message, queue = false, delay}: AnnounceOptions) => {
  if (delay) {
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, delay);
  } else {
    AccessibilityInfo.announceForAccessibility(message);
  }
};
```

### Handling Nested Links

Provides solutions for making nested links accessible by adjusting `accessibilityRole` and `onPress` handlers based on screen reader status.

```tsx
<Copy
  accessibilityRole="link"
  onPress={
    screenReaderIsEnabled
      ? () => {
          Linking.openURL('https://example.com');
        }
      : undefined
  }>
  Check out our{' '}
  <Link onPress={() => Linking.openURL('https://example.com')}>website</Link>.
</Copy>
```

### Absolute Positioning

Demonstrates how to handle absolutely positioned elements, which can be problematic for screen readers, by using alternative layout strategies.

## Additional Resources

- [React Native Accessibility Documentation](https://reactnative.dev/docs/0.70/accessibility)
- [Accessibility Best Practices and Gotchas Blog Post](https://www.yeti.co/blog/accessibility-first-in-react-native)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Contact

For questions or support, please contact <jonny.nb.schult@gmail.com>.
