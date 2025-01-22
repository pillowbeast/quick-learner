# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
quick-learner
├─ .git
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ branches
│  ├─ config
│  ├─ description
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           └─ HEAD
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.idx
│  │     ├─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.pack
│  │     └─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.rev
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ HEAD
│     └─ tags
├─ .gitignore
├─ LICENSE
├─ README.md
├─ app
│  ├─ _layout.tsx
│  ├─ components
│  ├─ index.tsx
│  ├─ screens
│  ├─ styles
│  └─ utils
├─ app.json
├─ assets
│  ├─ fonts
│  │  └─ SpaceMono-Regular.ttf
│  └─ images
│     ├─ adaptive-icon.png
│     ├─ background-image.png
│     ├─ emoji1.png
│     ├─ emoji2.png
│     ├─ emoji3.png
│     ├─ emoji4.png
│     ├─ emoji5.png
│     ├─ emoji6.png
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ partial-react-logo.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     ├─ splash-icon.png
│     └─ splash.png
├─ package-lock.json
├─ package.json
└─ tsconfig.json

```
```
quick-learner
├─ .git
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ branches
│  ├─ config
│  ├─ description
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           └─ HEAD
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.idx
│  │     ├─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.pack
│  │     └─ pack-0e4f24e7687b8e06237ae1094dfe3a8f2b25fee1.rev
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ HEAD
│     └─ tags
├─ .gitignore
├─ LICENSE
├─ README.md
├─ app
│  ├─ (tabs)
│  │  ├─ _layout.tsx
│  │  ├─ about.tsx
│  │  └─ index.tsx
│  ├─ +not-found.tsx
│  └─ _layout.tsx
├─ app.json
├─ assets
│  ├─ fonts
│  │  └─ SpaceMono-Regular.ttf
│  └─ images
│     ├─ adaptive-icon.png
│     ├─ background-image.png
│     ├─ emoji1.png
│     ├─ emoji2.png
│     ├─ emoji3.png
│     ├─ emoji4.png
│     ├─ emoji5.png
│     ├─ emoji6.png
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ partial-react-logo.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     ├─ splash-icon.png
│     └─ splash.png
├─ components
│  ├─ Button.tsx
│  └─ ImageViewer.tsx
├─ package-lock.json
├─ package.json
├─ tailwind.config.js
└─ tsconfig.json

```