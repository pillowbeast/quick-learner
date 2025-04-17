# Quick Learner - Language Learning App

Quick Learner is a modern, intuitive language learning application built with React Native and Expo. The app helps users learn new languages through an engaging and interactive interface, making language acquisition both fun and effective.

## Features

- **Multi-language Support**: Learn multiple languages with a unified interface
- **Interactive Learning**: Engage with words and phrases through various learning modes
- **Progress Tracking**: Monitor your learning progress and achievements
- **User Profiles**: Personalized learning experience with user profiles
- **Modern UI**: Clean, intuitive interface built with React Native Paper components
- **Offline Support**: Learn anytime, anywhere with offline capabilities

## Tech Stack

- **Frontend**: React Native, Expo
- **UI Components**: React Native Paper, Custom Components
- **Type Safety**: TypeScript
- **State Management**: React Context API
- **Database**: Local storage with SQLite
- **Styling**: React Native StyleSheet, React Native Paper theming

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
    npx expo start
   ```

3. Choose your preferred development environment:
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go) (for quick testing)

## Development

The project uses [file-based routing](https://docs.expo.dev/router/introduction) for navigation. Main application code is located in the `app` directory, while reusable components are in the `components` directory.

### Project Structure

```
quick-learner/
├── app/              # Main application routes and screens
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── assets/          # Images, fonts, and other static assets
```

## Building for Production

To build the Android APK:

1. Configure your Android build settings in `app.json`
2. Create a keystore file for signing
3. Run the build command:
   ```bash
   npx expo prebuild
   cd android
   ./gradlew assembleRelease
   ```

### Download Latest APK

You can download the latest Android APK from our Expo build:
[Download APK](https://expo.dev/artifacts/eas/jQDDaFZ3zMUumE5s2z48tY.apk)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Expo Documentation

For more information about developing with Expo, refer to the official documentation:

- [Expo Documentation](https://docs.expo.dev/): Learn fundamentals and advanced topics
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Step-by-step tutorial for creating cross-platform apps

## Community

Join our community of developers:

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)

## Tasks

- [Verb Conjugation API](https://api.verbix.com/conjugator/html)
- [verb & conjugation](https://github.com/ian-hamlin/verb-data?tab=readme-ov-file)