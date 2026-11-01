package com.nomanharis.urdureader.reading

import java.text.Normalizer
import kotlin.math.max
import kotlin.math.min

/** One word of a passage: what is shown on screen and the key used for matching speech. */
data class Word(val display: String, val key: String)

/**
 * Text helpers for comparing what the speech recogniser heard with the words on screen.
 *
 * Urdu text arrives from three places (built-in lessons, OCR, speech recognition) and each
 * one spells the same word slightly differently: Arabic vs Urdu letter forms, with or
 * without zer/zabar/pesh, presentation forms from OCR, digits instead of number words...
 * [normalize] folds all of that into one comparable key.
 */
object UrduText {

    private val numberWords = mapOf(
        "0" to "صفر", "1" to "ایک", "2" to "دو", "3" to "تین", "4" to "چار", "5" to "پانچ",
        "6" to "چھ", "7" to "سات", "8" to "آٹھ", "9" to "نو", "10" to "دس",
        "11" to "گیارہ", "12" to "بارہ", "20" to "بیس", "100" to "سو",
    )

    private fun isIgnorable(c: Char): Boolean =
        c in 'ؐ'..'ؚ' ||   // small high marks
            c in 'ً'..'ٟ' || // harakat: zabar, zer, pesh, shadda, sukun, hamza above/below...
            c == 'ٰ' ||           // khari zabar
            c in 'ۖ'..'ۭ' || // Quranic annotation marks
            c == 'ـ' ||           // tatweel
            c in '​'..'‏' || // zero-width (non-)joiners, LRM/RLM
            c in '‪'..'‮' ||
            c in '⁦'..'⁩' ||
            c == '﻿'

    private fun fold(c: Char): Char = when (c) {
        'ي', 'ى', 'ې', 'ئ' -> 'ی' // ي ى ې ئ  -> ی
        'ۓ' -> 'ے'                               // ۓ -> ے
        'ك' -> 'ک'                               // ك -> ک
        'ه', 'ۀ', 'ۂ', 'ە', 'ة', 'ھ' -> 'ہ' // ه ۀ ۂ ە ة ھ -> ہ
        'آ', 'أ', 'إ', 'ٱ' -> 'ا' // آ أ إ ٱ -> ا
        'ؤ' -> 'و'                               // ؤ -> و
        in '۰'..'۹' -> '0' + (c - '۰')      // Urdu digits
        in '٠'..'٩' -> '0' + (c - '٠')      // Arabic-Indic digits
        else -> c.lowercaseChar()
    }

    /** Matching key for a word: no diacritics, no punctuation, unified letter forms. */
    fun normalize(word: String): String {
        // NFKC turns OCR presentation forms (U+FB50..U+FEFF) back into normal letters.
        val nfkc = Normalizer.normalize(word, Normalizer.Form.NFKC)
        val sb = StringBuilder(nfkc.length)
        for (raw in nfkc) {
            if (isIgnorable(raw)) continue
            val c = fold(raw)
            if (Character.isLetterOrDigit(c)) sb.append(c)
        }
        val key = sb.toString()
        // Recognisers often write "3" for "تین".
        numberWords[key]?.let { return normalize(it) }
        return key
    }

    /** Splits a passage into words. Punctuation-only pieces stick to the neighbouring word. */
    fun tokenize(text: String): List<Word> {
        val result = mutableListOf<Word>()
        var pendingPrefix = ""
        for (piece in text.split(Regex("\\s+"))) {
            if (piece.isEmpty()) continue
            val key = normalize(piece)
            if (key.isEmpty()) {
                if (result.isEmpty()) {
                    pendingPrefix += piece
                } else {
                    val last = result.removeAt(result.size - 1)
                    result.add(last.copy(display = last.display + " " + piece))
                }
            } else {
                result.add(Word(pendingPrefix + piece, key))
                pendingPrefix = ""
            }
        }
        return result
    }

    /** Splits a recogniser hypothesis into matching keys. */
    fun heardKeys(text: String): List<String> =
        text.split(Regex("\\s+")).map(::normalize).filter { it.isNotEmpty() }

    fun editDistance(a: String, b: String): Int {
        if (a == b) return 0
        if (a.isEmpty()) return b.length
        if (b.isEmpty()) return a.length
        var prev = IntArray(b.length + 1) { it }
        var cur = IntArray(b.length + 1)
        for (i in 1..a.length) {
            cur[0] = i
            for (j in 1..b.length) {
                val cost = if (a[i - 1] == b[j - 1]) 0 else 1
                cur[j] = min(min(cur[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost)
            }
            val t = prev; prev = cur; cur = t
        }
        return prev[b.length]
    }

    /**
     * Is [heard] close enough to [target] to count as reading it? Short words must be exact
     * (کے and کی are different words); longer words forgive a letter or two, because the
     * recogniser and young readers both slip.
     */
    fun matches(target: String, heard: String): Boolean {
        if (target.isEmpty() || heard.isEmpty()) return false
        if (target == heard) return true
        val len = max(target.length, heard.length)
        val allowed = when {
            len <= 2 -> 0
            len <= 5 -> 1
            len <= 9 -> 2
            else -> 3
        }
        return allowed > 0 && editDistance(target, heard) <= allowed
    }
}
