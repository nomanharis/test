package de.alltagb1.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Alltag B1 for Android: the web app (in assets/www) inside a WebView, plus native
 * text-to-speech, speech recognition, camera/gallery picking and file saving.
 */
public class MainActivity extends Activity {

    // Assets are served from this https origin so localStorage and IndexedDB behave like on the web.
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";

    private static final int REQ_FILE = 1;
    private static final int REQ_SAVE = 2;
    private static final int REQ_MIC = 3;

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady;
    private SpeechRecognizer recognizer;
    private boolean recognitionFinished;
    private String pendingLang;

    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;
    private String pendingSave;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setTextZoom(100);

        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new Chrome());

        tts = new TextToSpeech(this, status -> {
            if (status != TextToSpeech.SUCCESS) return;
            int r = tts.setLanguage(Locale.GERMANY);
            ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { }
                @Override public void onDone(String id) { ttsDone(id, true); }
                @Override public void onError(String id) { ttsDone(id, false); }
                @Override public void onStop(String id, boolean interrupted) { ttsDone(id, false); }
            });
        });

        if (state != null) web.restoreState(state);
        else web.loadUrl(START_URL + "#/heute");
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        if (recognizer != null) recognizer.destroy();
        web.destroy();
        super.onDestroy();
    }

    // ---------- JS helpers ----------
    private void js(String code) {
        runOnUiThread(() -> web.evaluateJavascript(code, null));
    }

    private void ttsDone(String id, boolean ok) {
        js("window.__abTtsDone && window.__abTtsDone(" + JSONObject.quote(id) + "," + ok + ")");
    }

    private void sr(String type, String text) {
        js("window.__abSr && window.__abSr(" + JSONObject.quote(type) + "," + JSONObject.quote(text == null ? "" : text) + ")");
    }

    // ---------- serving the app from assets ----------
    private class Client extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (!HOST.equals(u.getHost())) return null;
            String path = u.getPath();
            if (path == null || path.isEmpty() || path.equals("/")) path = "/index.html";
            try {
                InputStream in = getAssets().open("www" + path);
                String mime = mimeFor(path);
                return new WebResourceResponse(mime, mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json") ? "utf-8" : null, in);
            } catch (IOException e) {
                return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, new ByteArrayInputStream(new byte[0]));
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (HOST.equals(u.getHost())) return false;
            // DeepL and other outside links open in the phone's browser.
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, u));
            } catch (ActivityNotFoundException e) {
                Toast.makeText(MainActivity.this, "Kein Browser gefunden.", Toast.LENGTH_SHORT).show();
            }
            return true;
        }
    }

    private static String mimeFor(String path) {
        String p = path.toLowerCase(Locale.ROOT);
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js")) return "application/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".md")) return "text/plain";
        return "application/octet-stream";
    }

    // ---------- camera & gallery ----------
    private class Chrome extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;

            String[] types = params.getAcceptTypes();
            boolean image = types != null && types.length > 0 && types[0] != null && types[0].startsWith("image");

            Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
            pick.addCategory(Intent.CATEGORY_OPENABLE);
            pick.setType(image ? "image/*" : "*/*");

            Intent launch = pick;
            if (image) {
                Intent camera = cameraIntent();
                if (params.isCaptureEnabled() && camera != null) {
                    launch = camera;
                } else if (camera != null) {
                    launch = Intent.createChooser(pick, "Bild auswählen");
                    launch.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
                }
            }
            try {
                startActivityForResult(launch, REQ_FILE);
            } catch (ActivityNotFoundException e) {
                fileCallback.onReceiveValue(null);
                fileCallback = null;
                Toast.makeText(MainActivity.this, "Keine passende App gefunden.", Toast.LENGTH_SHORT).show();
            }
            return true;
        }
    }

    private Intent cameraIntent() {
        cameraUri = PhotoProvider.newPhotoUri(this);
        Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cam.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
        cam.setClipData(ClipData.newRawUri("photo", cameraUri));
        cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        List<ResolveInfo> apps = getPackageManager().queryIntentActivities(cam, PackageManager.MATCH_DEFAULT_ONLY);
        if (apps.isEmpty()) return null;
        for (ResolveInfo ri : apps) {
            grantUriPermission(ri.activityInfo.packageName, cameraUri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        return cam;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE) {
            Uri[] result = null;
            if (resultCode == RESULT_OK) {
                if (data != null && data.getData() != null) result = new Uri[]{data.getData()};
                else if (cameraUri != null && PhotoProvider.hasPhoto(this, cameraUri)) result = new Uri[]{cameraUri};
            }
            if (fileCallback != null) fileCallback.onReceiveValue(result);
            fileCallback = null;
        } else if (requestCode == REQ_SAVE) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingSave != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    out.write(pendingSave.getBytes(StandardCharsets.UTF_8));
                    Toast.makeText(this, "Sicherung gespeichert.", Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    Toast.makeText(this, "Speichern fehlgeschlagen.", Toast.LENGTH_SHORT).show();
                }
            }
            pendingSave = null;
        }
    }

    // ---------- speech recognition ----------
    private void startRecognition(String lang) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingLang = lang;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
            return;
        }
        if (recognizer == null) {
            recognizer = SpeechRecognizer.createSpeechRecognizer(this);
            recognizer.setRecognitionListener(new Listener());
        }
        recognitionFinished = false;
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        try {
            recognizer.startListening(i);
        } catch (Exception e) {
            finishRecognition("error", "network");
        }
    }

    private void finishRecognition(String type, String text) {
        if (recognitionFinished) return;
        recognitionFinished = true;
        sr(type, text);
        sr("end", "");
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode != REQ_MIC) return;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED && pendingLang != null) {
            startRecognition(pendingLang);
        } else {
            recognitionFinished = false;
            finishRecognition("error", "not-allowed");
        }
        pendingLang = null;
    }

    private static String first(Bundle b) {
        ArrayList<String> list = b == null ? null : b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        return list == null || list.isEmpty() ? "" : list.get(0);
    }

    private class Listener implements RecognitionListener {
        @Override public void onReadyForSpeech(Bundle params) { }
        @Override public void onBeginningOfSpeech() { }
        @Override public void onRmsChanged(float rmsdB) { }
        @Override public void onBufferReceived(byte[] buffer) { }
        @Override public void onEndOfSpeech() { }
        @Override public void onEvent(int eventType, Bundle params) { }

        @Override
        public void onPartialResults(Bundle partial) {
            String t = first(partial);
            if (!t.isEmpty() && !recognitionFinished) sr("partial", t);
        }

        @Override
        public void onResults(Bundle results) {
            finishRecognition("final", first(results));
        }

        @Override
        public void onError(int error) {
            String code;
            switch (error) {
                case SpeechRecognizer.ERROR_NO_MATCH:
                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: code = "no-speech"; break;
                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: code = "not-allowed"; break;
                case SpeechRecognizer.ERROR_AUDIO: code = "audio-capture"; break;
                default: code = "network";
            }
            finishRecognition("error", code);
        }
    }

    // ---------- the bridge the web app talks to ----------
    private class Bridge {
        @JavascriptInterface
        public boolean ttsAvailable() { return ttsReady; }

        @JavascriptInterface
        public void speak(String text, float rate, float pitch, String id) {
            if (!ttsReady) { ttsDone(id, false); return; }
            tts.setSpeechRate(rate);
            tts.setPitch(pitch);
            tts.speak(text, TextToSpeech.QUEUE_ADD, null, id);
        }

        @JavascriptInterface
        public void stopSpeaking() { if (tts != null) tts.stop(); }

        @JavascriptInterface
        public boolean recognitionAvailable() {
            return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);
        }

        @JavascriptInterface
        public void startListening(String lang) {
            runOnUiThread(() -> startRecognition(lang == null || lang.isEmpty() ? "de-DE" : lang));
        }

        @JavascriptInterface
        public void stopListening() {
            runOnUiThread(() -> { if (recognizer != null) recognizer.stopListening(); });
        }

        @JavascriptInterface
        public void saveText(String filename, String content) {
            runOnUiThread(() -> {
                pendingSave = content;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("application/json");
                i.putExtra(Intent.EXTRA_TITLE, filename);
                try {
                    startActivityForResult(i, REQ_SAVE);
                } catch (ActivityNotFoundException e) {
                    pendingSave = null;
                    Toast.makeText(MainActivity.this, "Speichern ist auf diesem Gerät nicht möglich.", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
}
