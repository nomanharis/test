// When Alltag B1 runs inside the Android app, the WebView has no reliable speech synthesis and no
// speech recognition. The app exposes window.AndroidBridge (native TextToSpeech + SpeechRecognizer);
// this file maps it onto the standard Web Speech API so app.js works unchanged.
// In a normal browser AndroidBridge doesn't exist and this file does nothing.
(function () {
  'use strict';
  var B = window.AndroidBridge;
  if (!B) return;
  document.documentElement.classList.add('android-app');

  // ---------- speechSynthesis ----------
  var queue = {};
  var n = 0;
  function Utterance(text) {
    this.text = text || '';
    this.lang = 'de-DE';
    this.rate = 1;
    this.pitch = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
  }
  var voice = { name: 'Android Deutsch', lang: 'de-DE', default: true, localService: true, voiceURI: 'android-de' };
  var synth = {
    get speaking() { return Object.keys(queue).length > 0; },
    pending: false,
    paused: false,
    getVoices: function () { return B.ttsAvailable() ? [voice] : []; },
    speak: function (u) {
      var id = 'u' + (++n);
      queue[id] = u;
      B.speak(String(u.text), Number(u.rate) || 1, Number(u.pitch) || 1, id);
    },
    cancel: function () {
      var q = queue;
      queue = {};
      B.stopSpeaking();
      Object.keys(q).forEach(function (k) { if (q[k].onend) q[k].onend({}); });
    },
    pause: function () {},
    resume: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
  };
  window.__abTtsDone = function (id, ok) {
    var u = queue[id];
    if (!u) return;
    delete queue[id];
    var cb = ok ? u.onend : (u.onerror || u.onend);
    if (cb) cb({});
  };
  window.SpeechSynthesisUtterance = Utterance;
  try { Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true }); }
  catch (e) { window.speechSynthesis = synth; }

  // ---------- SpeechRecognition ----------
  var current = null;
  function Recognition() {
    this.lang = 'de-DE';
    this.interimResults = false;
    this.continuous = false;
    this.maxAlternatives = 1;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
  }
  Recognition.prototype.start = function () { current = this; B.startListening(this.lang || 'de-DE'); };
  Recognition.prototype.stop = function () { B.stopListening(); };
  Recognition.prototype.abort = Recognition.prototype.stop;
  function resultEvent(text, isFinal) {
    var alt = [{ transcript: text, confidence: 1 }];
    alt.isFinal = isFinal;
    return { resultIndex: 0, results: [alt] };
  }
  window.__abSr = function (type, text) {
    var r = current;
    if (!r) return;
    if (type === 'partial') { if (r.interimResults && r.onresult) r.onresult(resultEvent(text, false)); }
    else if (type === 'final') { if (r.onresult) r.onresult(resultEvent(text, true)); }
    else if (type === 'error') { if (r.onerror) r.onerror({ error: text }); }
    else if (type === 'end') { current = null; if (r.onend) r.onend({}); }
  };
  var available = false;
  try { available = B.recognitionAvailable(); } catch (e) { available = false; }
  window.SpeechRecognition = available ? Recognition : undefined;
  window.webkitSpeechRecognition = available ? Recognition : undefined;
})();
