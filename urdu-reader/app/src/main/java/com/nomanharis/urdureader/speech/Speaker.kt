package com.nomanharis.urdureader.speech

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

/** Says a word out loud in Urdu when it is tapped, if an Urdu voice is installed. */
class Speaker(context: Context) {
    private var ready = false
    var hasUrdu = false
        private set

    private lateinit var tts: TextToSpeech

    init {
        // The init callback arrives later on the main thread, after `tts` is assigned.
        tts = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                ready = true
                val result = tts.setLanguage(Locale("ur", "PK"))
                hasUrdu = result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED
            }
        }
    }

    /** Returns false if the word could not be spoken (no Urdu voice). */
    fun say(text: String): Boolean {
        if (!ready || !hasUrdu) return false
        tts.setSpeechRate(0.8f)
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "word")
        return true
    }

    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
