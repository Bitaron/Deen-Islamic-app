# 🌿 Nur AI: Your Spiritual Deen Companion

Nur AI is an elegant, privacy-focused Islamic companion application designed for Ramadan 2026.

## 🚀 Android Deployment using Bubblewrap

Bubblewrap is the recommended CLI tool to package your PWA into a high-performance Android App (Trusted Web Activity).

### 1. Install Bubblewrap
Ensure you have Node.js installed, then run:
```bash
npm install -g @bubblewrap/cli
```

### 2. Configure the Build
The `twa-manifest.json` is already included in this repository. If you are building for the first time on a new machine:
```bash
bubblewrap update
```

### 3. Build the APK/Bundle
```bash
bubblewrap build
```
This will generate an `.apk` and `.aab` file in your directory. You will need your `android.keystore` file present in the root directory to sign the build.

### 4. Setup Digital Asset Links
1. Copy the contents of the generated `assetlinks.json`.
2. Update the file in this repository at `public/.well-known/assetlinks.json`.
3. Push to GitHub.
4. Once verified, the browser address bar will disappear in your Android app.

## 🛠️ Local Development
1. `npm install`
2. `npm run dev` (Vite)

## 📜 License
MIT - Developed for the Ummah by Bitaron.