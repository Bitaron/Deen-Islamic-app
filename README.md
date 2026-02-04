
# 🌿 Nur AI: Your Spiritual Deen Companion

Nur AI is an elegant, privacy-focused Islamic companion application designed for Ramadan 2026.

## 🚀 Android Deployment using Bubblewrap

Bubblewrap is the recommended CLI tool to package your PWA into a high-performance Android App (Trusted Web Activity).

### 1. Install Bubblewrap
Ensure you have Node.js installed, then run:
```bash
npm install -g @bubblewrap/cli
```

### 2. Initialize the Project
Bubblewrap reads your live PWA manifest to generate the Android project.
```bash
bubblewrap init --manifest https://bitaron.github.io/Deen-Islamic-app/manifest.json
```
Follow the prompts. Use `com.nur.deenai` as the Package ID.

### 3. Build the APK/Bundle
```bash
bubblewrap build
```
This will generate an `.apk` and `.aab` file in your directory.

### 4. Setup Digital Asset Links
Bubblewrap will generate a `assetlinks.json` file for you. 
1. Copy the contents of the generated `assetlinks.json`.
2. Update the file in this repository at `public/.well-known/assetlinks.json`.
3. Push to GitHub.
4. Once verified, the browser address bar will disappear in your Android app, giving it a 100% native look.

## 🛠️ Local Development
1. `npm install`
2. `npm run dev` (Vite)

## 📜 License
MIT - Developed for the Ummah by Bitaron.
