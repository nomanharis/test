package com.nomanharis.urdureader.speech

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

/**
 * Keeps Android's speech recogniser listening in Urdu until [stop] is called.
 *
 * The platform recogniser ends after every pause, so this restarts it after each result
 * or "nothing heard" timeout. All calls must happen on the main thread.
 */
class UrduSpeechListener(
    private val context: Context,
    private val callbacks: Callbacks,
) : RecognitionListener {

    interface Callbacks {
        fun onPartial(text: String)
        fun onFinal(alternatives: List<String>)
        fun onListeningChanged(listening: Boolean)
        fun onProblem(message: String)
    }

    private val handler = Handler(Looper.getMainLooper())
    private var recognizer: SpeechRecognizer? = null
    private var wanted = false
    private var errorsInARow = 0

    fun isAvailable(): Boolean = SpeechRecognizer.isRecognitionAvailable(context)

    fun start() {
        if (wanted) return
        wanted = true
        errorsInARow = 0
        if (recognizer == null) {
            recognizer = SpeechRecognizer.createSpeechRecognizer(context).also { it.setRecognitionListener(this) }
        }
        begin()
    }

    fun stop() {
        wanted = false
        handler.removeCallbacksAndMessages(null)
        recognizer?.cancel()
        callbacks.onListeningChanged(false)
    }

    fun destroy() {
        stop()
        recognizer?.destroy()
        recognizer = null
    }

    private fun begin() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, LANGUAGE)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, LANGUAGE)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2500L)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L)
            putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, context.packageName)
        }
        try {
            recognizer?.startListening(intent)
            callbacks.onListeningChanged(true)
        } catch (e: Exception) {
            restart(800)
        }
    }

    private fun restart(delayMs: Long) {
        if (!wanted) return
        handler.removeCallbacksAndMessages(null)
        handler.postDelayed({ if (wanted) begin() }, delayMs)
    }

    private fun giveUp(message: String) {
        stop()
        callbacks.onProblem(message)
    }

    override fun onPartialResults(partialResults: Bundle?) {
        val text = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()
        if (!text.isNullOrBlank()) {
            errorsInARow = 0
            callbacks.onPartial(text)
        }
    }

    override fun onResults(results: Bundle?) {
        errorsInARow = 0
        val list = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty()
        if (list.isNotEmpty()) callbacks.onFinal(list)
        restart(150)
    }

    override fun onError(error: Int) {
        if (!wanted) return
        when (error) {
            SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> {
                // Silence or mumbling: just keep listening.
                restart(150)
                return
            }
            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> {
                giveUp("مائیکروفون کی اجازت چاہیے۔ (Microphone permission is needed.)")
                return
            }
            ERROR_LANGUAGE_NOT_SUPPORTED, ERROR_LANGUAGE_UNAVAILABLE -> {
                giveUp(
                    "Urdu speech recognition isn't available on this phone yet. Open the Google app → " +
                        "Settings → Voice → Languages / Offline speech recognition and add Urdu (Pakistan)."
                )
                return
            }
        }
        errorsInARow++
        if (errorsInARow >= 6) {
            val hint = if (error == SpeechRecognizer.ERROR_NETWORK || error == SpeechRecognizer.ERROR_NETWORK_TIMEOUT ||
                error == SpeechRecognizer.ERROR_SERVER
            ) "Check the internet connection — Urdu recognition usually needs it." else "The speech recogniser keeps failing (code $error)."
            giveUp(hint)
            return
        }
        if (error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || error == SpeechRecognizer.ERROR_CLIENT) {
            recognizer?.cancel()
        }
        restart(400L * errorsInARow)
    }

    override fun onReadyForSpeech(params: Bundle?) {}
    override fun onBeginningOfSpeech() {}
    override fun onRmsChanged(rmsdB: Float) {}
    override fun onBufferReceived(buffer: ByteArray?) {}
    override fun onEndOfSpeech() {}
    override fun onEvent(eventType: Int, params: Bundle?) {}

    companion object {
        const val LANGUAGE = "ur-PK"
        // SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED / _UNAVAILABLE (API 31)
        private const val ERROR_LANGUAGE_NOT_SUPPORTED = 12
        private const val ERROR_LANGUAGE_UNAVAILABLE = 13
    }
}
