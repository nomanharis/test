# Urdu Parho (اردو پڑھو)

An Android app that helps a child learn to read Urdu out loud.

- **Read aloud, words light up.** A lesson is shown in Nastaliq script, right to left. Press 🎤 and
  read; every word you say correctly turns green. Words that get jumped over turn orange and can
  still be lit up by going back to them. Tap any word to hear it (if an Urdu voice is installed).
- **Daily score and progress.** Each reading session adds the words read and the stars earned
  (⭐⭐⭐ for 90%+, ⭐⭐ for 70%+, ⭐ for 40%+) to today's score. The home screen shows today's
  words against a daily goal of 30 and the current streak. The 📊 Progress screen has a 14-day
  chart and a list of daily scores with accuracy.
- **Photo → lesson.** Press *New lesson*, take a photo of a page (or pick one from the gallery) and
  the app reads the Urdu text from it **offline**. Correct any OCR mistakes in the text box and
  save; the passage becomes a new lesson. Text can also be typed or pasted.
- **53 stories for around age 9** (📚 Stories tab): classic fables (Aesop, Panchatantra, Sheikh
  Chilli, Mulla Nasruddin) and everyday stories about Eid, Ramadan, school, cricket, rain, family
  trips, Pakistan, Quaid-e-Azam and Allama Iqbal, 70–110 words each. To add more, edit
  `app/src/main/assets/stories.txt`: a `# title` line followed by the story text.
- Word lessons (🔤 Words tab): alphabet words, colours, counting and "My home". Photo lessons go
  under 📷 Mine.
- Everything is stored on the phone. Nothing is uploaded except the audio that Android's speech
  recogniser sends to Google while listening.

## Getting the APK

On the Android phone, open **https://github.com/nomanharis/test/releases/latest** and tap
`urdu-parho.apk`. Allow "install unknown apps" for the browser when asked, then install.

**Updates.** To let a new build install over the old one (keeping her scores), every build must
be signed with the same key. Add two repository secrets under *Settings → Secrets and variables →
Actions*: `URDU_KEYSTORE_BASE64` (the keystore file, base64-encoded) and `URDU_KEYSTORE_PASSWORD`
(alias `urduparho`). Without them each build gets a new random key and has to be uninstalled
before installing the next one.

Every push that touches `urdu-reader/` runs the **Urdu Parho Android build** workflow in GitHub
Actions, which tests the app, builds the APK and publishes it as a new release.

Or build it yourself with Android Studio (open the `urdu-reader` folder) or:

```sh
cd urdu-reader
./gradlew assembleDebug      # → app/build/outputs/apk/debug/app-debug.apk
./gradlew testDebugUnitTest  # word-matching tests
```

Requires Android 8.0 (API 26) or newer.

## Setting up the phone

1. **Urdu speech recognition** comes from the Google app. If the app says Urdu isn't available,
   open the *Google* app → *Settings* → *Voice* → *Languages*, and add **اردو (پاکستان)**.
   Recognition normally needs an internet connection.
2. **Optional: hear words when tapped.** Install an Urdu voice under *Settings* → *Text-to-speech*
   (Speech Services by Google → install voice data → Urdu).

## How the word matching works

Speech recognisers and books spell the same Urdu word in different ways (Arabic vs. Urdu forms
of ی ک ہ, with or without zer/zabar/pesh, digits instead of number words...). Before comparing,
both sides are normalised (`reading/UrduText.kt`). The tracker (`reading/ReadingEngine.kt`) then
matches each heard word against the next few words on screen:

- short words (2 letters) must match exactly, longer words forgive 1–3 letters;
- a match a little ahead lights that word and marks the skipped words orange;
- the recogniser's partial results light words while the child is still speaking, and the final
  result chooses whichever of its alternative transcriptions fits the passage best.

## Photo reading (OCR)

Google ML Kit has no Urdu model, so the app uses [Tesseract](https://github.com/tesseract-ocr/tesseract)
through [Tesseract4Android](https://github.com/adaptech-cz/Tesseract4Android), with the
`urd.traineddata` model from `tessdata_fast` bundled in `app/src/main/assets/tessdata`. It works
best on clear printed text: photograph the page flat, in good light, filling the frame.
Nastaliq print is harder than Naskh, so expect to correct a few words.

## Credits

- Font: [Noto Nastaliq Urdu](https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu), SIL Open Font License 1.1.
- OCR model: [tesseract-ocr/tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast), Apache License 2.0.
