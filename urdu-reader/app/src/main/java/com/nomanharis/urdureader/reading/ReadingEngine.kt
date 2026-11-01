package com.nomanharis.urdureader.reading

import kotlin.math.max
import kotlin.math.min

enum class WordState { PENDING, READ, SKIPPED }

/**
 * Follows the reader through a passage. Each heard word is matched against the next few
 * words on screen; a match lights that word up. Words jumped over turn "skipped" and can
 * still be lit later by going back and reading them.
 */
class WordTracker private constructor(
    val words: List<Word>,
    private val states: MutableList<WordState>,
    cursor: Int,
) {
    constructor(words: List<Word>) : this(words, MutableList(words.size) { WordState.PENDING }, 0)

    /** Index of the next word the reader is expected to say. Equals size at the end. */
    var cursor: Int = cursor
        private set

    val size: Int get() = words.size
    fun state(i: Int): WordState = states[i]
    val readCount: Int get() = states.count { it == WordState.READ }
    val isComplete: Boolean get() = states.all { it == WordState.READ }
    val reachedEnd: Boolean get() = cursor >= size

    fun copy(): WordTracker = WordTracker(words, states.toMutableList(), cursor)

    /** Feeds normalised heard words; returns how many passage words were newly lit. */
    fun feed(heard: List<String>): Int {
        var lit = 0
        var j = 0
        while (j < heard.size) {
            val single = tryMatch(heard[j])
            if (single > 0) {
                lit += single; j++; continue
            }
            // The recogniser may split one written word in two ("کے لیے" / "کیلئے").
            if (j + 1 < heard.size) {
                val joined = tryMatch(heard[j] + heard[j + 1])
                if (joined > 0) {
                    lit += joined; j += 2; continue
                }
            }
            j++
        }
        return lit
    }

    private fun candidates(heardLen: Int): List<Int> {
        if (reachedEnd) {
            // Finished the passage: any skipped word can be picked up again.
            return states.indices.filter { states[it] == WordState.SKIPPED }
        }
        // Short, common words (ہے، کے، میں) appear everywhere, so don't let them jump far.
        val ahead = if (heardLen <= 2) SHORT_LOOKAHEAD else LOOKAHEAD
        val list = mutableListOf<Int>()
        for (i in cursor until min(size, cursor + ahead)) list.add(i)
        for (i in cursor - 1 downTo max(0, cursor - LOOKBACK)) list.add(i)
        return list
    }

    private fun tryMatch(heard: String): Int {
        for (i in candidates(heard.length)) {
            if (states[i] == WordState.READ) continue
            if (UrduText.matches(words[i].key, heard)) {
                mark(i); return 1
            }
            // One heard word covering two written words ("کیلئے" for "کے لیے").
            if (i + 1 < size && states[i + 1] != WordState.READ &&
                UrduText.matches(words[i].key + words[i + 1].key, heard)
            ) {
                mark(i); mark(i + 1); return 2
            }
        }
        return 0
    }

    private fun mark(i: Int) {
        if (i >= cursor) {
            for (k in cursor until i) if (states[k] == WordState.PENDING) states[k] = WordState.SKIPPED
            cursor = i + 1
        }
        states[i] = WordState.READ
        while (cursor < size && states[cursor] == WordState.READ) cursor++
    }

    companion object {
        const val LOOKAHEAD = 4
        const val SHORT_LOOKAHEAD = 2
        const val LOOKBACK = 3
    }
}

/**
 * Glue between the speech recogniser and [WordTracker].
 *
 * Partial results grow word by word while the child speaks, and the recogniser may still
 * revise the last word, so only the words before the last one are taken from a partial.
 * The final result settles the rest of the utterance, using whichever alternative
 * transcription lights the most words.
 */
class ReadingEngine(text: String) {
    val words: List<Word> = UrduText.tokenize(text)
    var tracker = WordTracker(words)
        private set
    private var consumed = 0

    /** Returns true if any word changed state. */
    fun onPartial(hypothesis: String): Boolean {
        val keys = UrduText.heardKeys(hypothesis)
        val stable = keys.size - 1
        if (stable < consumed) consumed = max(0, stable)
        if (stable <= consumed) return false
        val lit = tracker.feed(keys.subList(consumed, stable))
        consumed = stable
        return lit > 0
    }

    fun onFinal(alternatives: List<String>): Boolean {
        var best: WordTracker? = null
        var bestLit = 0
        for (alt in alternatives) {
            val keys = UrduText.heardKeys(alt)
            if (keys.size <= consumed) continue
            val trial = tracker.copy()
            val lit = trial.feed(keys.subList(consumed, keys.size))
            if (lit > bestLit) {
                best = trial; bestLit = lit
            }
        }
        consumed = 0
        best?.let { tracker = it }
        return bestLit > 0
    }

    /** Drops any half-heard utterance (e.g. when listening stops). */
    fun endUtterance() {
        consumed = 0
    }

    fun restart() {
        tracker = WordTracker(words)
        consumed = 0
    }

    companion object {
        fun stars(read: Int, total: Int): Int {
            if (total <= 0) return 0
            val ratio = read.toDouble() / total
            return when {
                ratio >= 0.9 -> 3
                ratio >= 0.7 -> 2
                ratio >= 0.4 -> 1
                else -> 0
            }
        }
    }
}
