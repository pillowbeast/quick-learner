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
```
quick-learner
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ ORIG_HEAD
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
│  │           ├─ HEAD
│  │           └─ main
│  ├─ objects
│  │  ├─ 03
│  │  │  └─ d6f6b6c6727954aec1d8206222769afd178d8d
│  │  ├─ 07
│  │  │  └─ c00f4f037281f91600c8cc444189ee279baa25
│  │  ├─ 08
│  │  │  └─ 266695fbd1e59ede956ef810751d92519430ba
│  │  ├─ 09
│  │  │  └─ 403cab3ef21d1ced3a0972ac188941de9d34f5
│  │  ├─ 0a
│  │  │  └─ 7eda3f06e39dec169c579eda9224120d69c3e0
│  │  ├─ 11
│  │  │  └─ 38bac8e4369c918ba0f8802e77576be65aeb8f
│  │  ├─ 12
│  │  │  └─ 4eed1c26d8ad6eac191f4b7cd9ed56ca2f8547
│  │  ├─ 14
│  │  │  └─ 8cc6dd3eae1482493ef5e4828f986b41090e2f
│  │  ├─ 18
│  │  │  ├─ 32d7ea2464ecb2dc81fd0cddae129a35a533d5
│  │  │  └─ 6a04a9c7f06f39e79f2c38cb2725c7feee6dc9
│  │  ├─ 1e
│  │  │  └─ 54f42f66845e5668c0d66567e90e298e8773b0
│  │  ├─ 21
│  │  │  └─ 0ec98e0af7702e9e6617b6ee20a7a60436fb22
│  │  ├─ 22
│  │  │  └─ 29b130ad5b73fdef7d59ff544abd4cb2377bef
│  │  ├─ 28
│  │  │  └─ d7ff717769d29e5d1f036bfa91eea660ce8a24
│  │  ├─ 30
│  │  │  └─ f37e3e3aeb36b8a9f414cad2587a5bbb8f9ff7
│  │  ├─ 31
│  │  │  └─ e891d3a68b11e938cfa9ff1f1af8a74e09eb33
│  │  ├─ 34
│  │  │  └─ 0cf04a0708d7643d56321a8618982e4e984972
│  │  ├─ 38
│  │  │  └─ d8ec7b5140a2c1e740e97f274c4329d89782fe
│  │  ├─ 39
│  │  │  └─ dd39db36c2931dafb4956942a2bc1ed1da8158
│  │  ├─ 3c
│  │  │  └─ 320dce8ce3e5007864eb60fbb9576d4b570706
│  │  ├─ 3f
│  │  │  ├─ 58bdccaac5970c1debcd10d1bfbe158f39232e
│  │  │  └─ f0ab3ee34893d6e687758c290799b8a1b42606
│  │  ├─ 42
│  │  │  └─ cf85ed7f5cc4ed3ef213b9ba2b5cc500dc6a7d
│  │  ├─ 44
│  │  │  └─ 1527417ee076cf884e808939e214eb49569cdf
│  │  ├─ 47
│  │  │  └─ b4b3196b7abaa85fc114f8b5442d3836fb6ef1
│  │  ├─ 49
│  │  │  └─ 623daa27284b353564f72c172eb1a9685cb19a
│  │  ├─ 4b
│  │  │  └─ 639779cb77ca7dce0ab84c13dcfae714306a72
│  │  ├─ 50
│  │  │  ├─ 7c3af6c5b3d1174f0653c04ab0b47e3339ba62
│  │  │  └─ 7dd22d8de95c3361772822a256600f63f5c6a2
│  │  ├─ 53
│  │  │  └─ aba91108ce067f0dd410be1ff1cf83e2b02d21
│  │  ├─ 55
│  │  │  ├─ 3d193b978956b4c259bd675755062a5ef7175d
│  │  │  ├─ 739aec80edf95d22b061a4b9803dd03d128b0e
│  │  │  └─ 9473da8730eb07bc65b769c70a1c6624437403
│  │  ├─ 56
│  │  │  └─ 3f376aa426c3d5cd648b11fe27bdd7bb7c47be
│  │  ├─ 59
│  │  │  ├─ 3cdce581dbb17fe097650ff3484a36815aa09b
│  │  │  ├─ 7ce33308516a509c1c03d742ed29c7508d9f7d
│  │  │  └─ b3e6681f522503c927a43877d7023e513c30e0
│  │  ├─ 5c
│  │  │  └─ 7b976c6855bf6b5a162e92297ecb3add075b42
│  │  ├─ 5e
│  │  │  └─ 8572edbe39c7f673308fa712beb2ba16b41639
│  │  ├─ 66
│  │  │  ├─ c935bd79d0a20989d3c869baeb6940b01ca466
│  │  │  └─ fd9570e4fac42bca15352def191c563100b2ed
│  │  ├─ 68
│  │  │  └─ 8412619150fb1753ecb17e09d0439655f30563
│  │  ├─ 6a
│  │  │  └─ 29fa6768da8628734f9832712a413b8473985a
│  │  ├─ 6e
│  │  │  └─ df4b0ebddb94405c4c8186a4e72a9e66d51715
│  │  ├─ 71
│  │  │  └─ b149a952818404772c0e9d35e8ca4282aaeb2c
│  │  ├─ 7b
│  │  │  └─ c80f04ef5aff1a143860a786363a346ac37fc3
│  │  ├─ 7c
│  │  │  ├─ a396845dfbf32bcf47b8a0e344cab080bf3e65
│  │  │  ├─ e208bb8e500d8b66e6095c964b04823b8d64d6
│  │  │  └─ f4e877a1af9927b2c26579dc8a6645a6e63373
│  │  ├─ 7d
│  │  │  └─ d0ea87f4ccb82ed61ec5a259494633b0fb6b1b
│  │  ├─ 83
│  │  │  └─ cb12ac08ea4e38f7e85a7c080208525354e632
│  │  ├─ 84
│  │  │  ├─ 707c8550952f12438a70d88aadfe53f49cc3dd
│  │  │  └─ fa56fd9302ba1dc8f2308e25c86002a13bf87b
│  │  ├─ 85
│  │  │  └─ 47f176ab173f2fe2db974395fb7ec592ae7739
│  │  ├─ 87
│  │  │  └─ eb401404b951bb89dee073fe3c72093c694791
│  │  ├─ 8a
│  │  │  ├─ 16b8e94caf694776f63e2ee525685d902ef0e9
│  │  │  └─ 7bb6feabfaaa3f6c6878a91b3caee9aa1d9f60
│  │  ├─ 8b
│  │  │  └─ 284d658c91a4f081aa4eafcd43f2f8c582c43e
│  │  ├─ 8c
│  │  │  └─ d022236990b169762fc606a3b233f5b7118181
│  │  ├─ 90
│  │  │  └─ 9e9010867004d96567d0a03ef3dceea154eff6
│  │  ├─ 95
│  │  │  └─ 3327d509fd30784c1e069864e8d89a8dd9b77a
│  │  ├─ 96
│  │  │  └─ 9fbcef98628d4f8e5ab3c6cc68fa0cbbb89b18
│  │  ├─ 9a
│  │  │  └─ f5e9236f6c0389bb48d95d39ad25f31521116a
│  │  ├─ 9b
│  │  │  └─ c1858cef9dc40c5824cad7dda98b907c916c76
│  │  ├─ 9d
│  │  │  └─ 72a9ffcbb39d89709073e1a7edd8ba414932c1
│  │  ├─ 9e
│  │  │  ├─ 38c158ad5cd2e12c4dcfe730a7ca6d2baf6ae7
│  │  │  ├─ aab333fb045fd747c1870090ed32f74bc727a7
│  │  │  └─ c0f03ffa25cb1ccc23857fb54b6ffdf28cd432
│  │  ├─ 9f
│  │  │  └─ 71f3a2352a219780093d41541c8bd8d2cfdad8
│  │  ├─ a0
│  │  │  ├─ 188519dd94cfff6efc32de2e5c088a3c21da1d
│  │  │  └─ b1526fc7b78680fd8d733dbc6113e1af695487
│  │  ├─ a7
│  │  │  └─ 8a8b0802961d35c91f643d7668680525b8f424
│  │  ├─ a9
│  │  │  ├─ 9b2032221d57c88b6c44e7e22d93ddda78e008
│  │  │  └─ c39c68cc7552e169f532426d8f8c40084b3034
│  │  ├─ aa
│  │  │  └─ 0bb0eb2283b5f993833cf5bea45ab433fff75c
│  │  ├─ ae
│  │  │  └─ c05e97cb4456b682ad609ad0fcb055d8985dbe
│  │  ├─ b0
│  │  │  └─ f7ec638fdf055f841158d210824207213d1d0c
│  │  ├─ b1
│  │  │  └─ 38ed486771e8417e51b8a03f35c83eaf328850
│  │  ├─ be
│  │  │  └─ 2fa1610997f9f9653b1b992a4f97a6c7e6e92a
│  │  ├─ bf
│  │  │  └─ a695f5777cac9a7b64fb22ced7aaf6f11f477c
│  │  ├─ c8
│  │  │  └─ cd5dc39a338fcb045e78599de8c64f4ab92b40
│  │  ├─ c9
│  │  │  ├─ 0509e83d8057d7ce89a956fcaf4d9e43541e76
│  │  │  └─ d575d70c202dfbb9d63a14c385b75873a56fe8
│  │  ├─ cd
│  │  │  └─ 802ca098914538c70b5adf834084ef67916bdb
│  │  ├─ d9
│  │  │  └─ 90107efab07d5d01581484ed9edcd541f7ac5e
│  │  ├─ de
│  │  │  ├─ 4b26a62b12d9eba00dc44c2eaec3a76e5f9ea8
│  │  │  └─ e3a2e092b48975d441fd13d79aa11f5507eb28
│  │  ├─ e1
│  │  │  └─ 2e6d65327b72ec7e85794514cd3aaa24179f12
│  │  ├─ e3
│  │  │  ├─ 558a9643549b1207f542dc8b3d80edfcf2a33e
│  │  │  └─ 5c1284f6d9ea8fd5f63fc152cb32d3cf9477f6
│  │  ├─ e5
│  │  │  ├─ 88b032c1d819a669fb57061f5b097105e3ec99
│  │  │  └─ cd9ba9bd7f3c4286ae65c91094f7afecabab00
│  │  ├─ e6
│  │  │  └─ 9de29bb2d1d6434b8b29ae775ad8c2e48c5391
│  │  ├─ e7
│  │  │  ├─ 5f697b1801871ad8cd9309b05e8ffe8c6b6d01
│  │  │  └─ d11c00f1b8f793aff13f9008727a6c127fa99f
│  │  ├─ f3
│  │  │  └─ 4022e67944fa19e661865755199e159da392ea
│  │  ├─ f5
│  │  │  └─ f106ce36f12a7f87b484b4ddce93a1c9a9e780
│  │  ├─ f7
│  │  │  └─ 19086a0c83323b30c04327d598ff9c56734d94
│  │  ├─ fc
│  │  │  └─ 9eeab71d5848dc7c7ed3a3db315acd73fbbbb0
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
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ LICENSE
├─ README.md
├─ app
│  ├─ +not-found.tsx
│  ├─ _layout.tsx
│  ├─ auth
│  │  ├─ login.tsx
│  │  └─ onboarding.tsx
│  ├─ home.tsx
│  ├─ index.tsx
│  ├─ language
│  │  ├─ [iso].tsx
│  │  ├─ add_word.tsx
│  │  ├─ list.tsx
│  │  ├─ memorize.tsx
│  │  └─ study.tsx
│  ├─ language.tsx
│  ├─ profile.tsx
│  └─ settings.tsx
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
│     ├─ quicklearner_logo.png
│     ├─ quicklearner_logo.webp
│     ├─ quicklearner_logo2.webp
│     ├─ quicklearner_logo3.webp
│     ├─ quicklearner_logo4.webp
│     ├─ quicklearner_logo5.webp
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     ├─ splash-icon.png
│     └─ splash.png
├─ babel.config.js
├─ components
│  ├─ AppHeader.tsx
│  ├─ BigCircle.tsx
│  ├─ BottomBar.tsx
│  ├─ Category.tsx
│  ├─ Flag.tsx
│  ├─ LanguageSelector.tsx
│  ├─ Lists.tsx
│  ├─ ProfileMetaData.tsx
│  ├─ RoundLogo.tsx
│  └─ TopBar.tsx
├─ hooks
│  ├─ useDatabase.ts
│  └─ useNavigation.ts
├─ package-lock.json
├─ package.json
├─ tailwind.config.js
└─ tsconfig.json

```