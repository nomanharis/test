#!/usr/bin/env bash
# Builds AlltagB1.apk without Gradle, straight from the Android SDK command-line tools.
#
#   ANDROID_SDK=/path/with/build-tools-and-platform  KEYSTORE=release.jks  KEY_PASS=...  ./build.sh
#
# ANDROID_SDK must contain build-tools 35+ (aapt2, d8, zipalign, apksigner) and platforms/android-34/android.jar,
# either in the normal SDK layout or unpacked side by side. The web app is copied from ../deutsch.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SDK="${ANDROID_SDK:?set ANDROID_SDK}"
# Newest build-tools found (35+ needed: older d8 can't read classes compiled by JDK 21).
BT="${BUILD_TOOLS:-}"
for d in "$SDK"/build-tools/3[5-9]* "$SDK"/android-1[5-9]; do [ -x "$d/d8" ] && BT="$d"; done
[ -n "$BT" ] || { echo "build-tools 35 or newer not found in $SDK" >&2; exit 1; }
JAR="$( [ -f "$SDK/platforms/android-34/android.jar" ] && echo "$SDK/platforms/android-34/android.jar" || echo "$SDK/android-34/android.jar" )"
KEYSTORE="${KEYSTORE:?set KEYSTORE}"
KEY_PASS="${KEY_PASS:?set KEY_PASS}"
OUT="${OUT:-$HERE/build}"
APK_NAME="${APK_NAME:-AlltagB1.apk}"

work="$OUT/tmp"
mkdir -p "$work"
find "$work" -mindepth 1 -delete

echo "• Copying web app into assets"
mkdir -p "$work/assets/www"
cp -r "$HERE/../deutsch/." "$work/assets/www/"
find "$work/assets/www" -name 'README.md' -delete

echo "• Compiling resources"
"$BT/aapt2" compile --dir "$HERE/res" -o "$work/res.zip"
"$BT/aapt2" link -o "$work/base.apk" -I "$JAR" \
  --manifest "$HERE/AndroidManifest.xml" -A "$work/assets" \
  --min-sdk-version 24 --target-sdk-version 34 \
  "$work/res.zip"

echo "• Compiling Java"
mkdir -p "$work/classes"
javac -source 8 -target 8 -encoding UTF-8 -Xlint:-options -classpath "$JAR" -d "$work/classes" \
  $(find "$HERE/src" -name '*.java')

echo "• Dexing"
"$BT/d8" --release --min-api 24 --lib "$JAR" --output "$work" $(find "$work/classes" -name '*.class')

echo "• Packaging, aligning, signing"
cp "$work/base.apk" "$work/unaligned.apk"
(cd "$work" && zip -q unaligned.apk classes.dex)
"$BT/zipalign" -f -p 4 "$work/unaligned.apk" "$work/aligned.apk"
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-pass "pass:$KEY_PASS" --key-pass "pass:$KEY_PASS" \
  --out "$OUT/$APK_NAME" "$work/aligned.apk"
"$BT/apksigner" verify "$OUT/$APK_NAME"
echo "✓ $OUT/$APK_NAME"
