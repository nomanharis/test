# Alltag B1 for Android

A native Android wrapper around the web app in [`../deutsch`](../deutsch). The finished, signed APK is in
[`../releases/AlltagB1-1.0.apk`](../releases/AlltagB1-1.0.apk).

## Install on your phone

1. Copy `AlltagB1-1.0.apk` to the phone, or download it there from GitHub (open the file, then *Download raw file*).
2. Tap it. Android asks you to allow installs from that app (Files, Chrome …). Allow it once.
3. Tap **Install**. Play Protect may warn that the app is from an unknown developer. Choose *Install anyway*.
   This happens with every app that doesn't come from the Play Store.

It needs Android 7.0 or newer.

## What's native in the app

The lessons, tracker and camera tasks are the same web app, bundled inside the APK so they work offline.
Android's WebView lacks a few browser features, so the app supplies them natively:

| Feature | How it works in the app |
| --- | --- |
| Voices in *Hören* and *Sprechen* | Android's text-to-speech in German. Install the German voice under *Settings → System → Languages → Text-to-speech* if the dialogues stay silent. |
| Speaking answers | Android's speech recognition (the Google app). Allow the microphone when asked. |
| *Foto aufnehmen* | Opens the camera app straight away. |
| *Bild auswählen* | Opens the gallery (or the camera). |
| Links (DeepL) | Open in your browser. |
| *Sicherung speichern* | Opens Android's "save file" dialog. |

Still needs internet: Google Fonts (without it you get the system font) and text recognition in the
camera (downloaded the first time, then cached).

Progress, texts and photos are stored inside the app. Uninstalling removes them, so save a backup first
(*Fortschritt → Sicherung speichern*).

## Build it yourself

No Gradle needed, just the Android SDK command-line pieces and a JDK:

```sh
# build-tools 35 (or newer) and platforms/android-34 must be in $ANDROID_SDK
keytool -genkeypair -keystore release.jks -alias alltagb1 -keyalg RSA -keysize 3072 -validity 10000
ANDROID_SDK=~/Android/Sdk KEYSTORE=release.jks KEY_PASS=… ./build.sh
# → build/AlltagB1.apk
```

`build.sh` copies `../deutsch` into the APK's assets, compiles the resources with `aapt2`, the Java code
with `javac`, dexes with `d8`, then aligns and signs.

To ship an update that installs over the old version (keeping your data), raise `versionCode` in
`AndroidManifest.xml` and sign with **the same keystore**. An APK signed with a different key can only
be installed after uninstalling the old app.

## Files

- `AndroidManifest.xml`: app id `de.alltagb1.app`, permissions (internet, microphone)
- `src/de/alltagb1/app/MainActivity.java`: the WebView, asset server, speech, camera and save bridge
- `src/de/alltagb1/app/PhotoProvider.java`: hands the camera app a place to save the photo
- `res/`: theme colours and launcher icons (`tools/make-icons.js` renders them)
- `../deutsch/android-bridge.js`: maps the native bridge onto the Web Speech API for `app.js`
