package com.nomanharis.urdureader.data

import android.content.Context
import android.util.AtomicFile
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.LocalDate
import java.util.UUID

enum class PassageKind { LESSON, STORY, MINE }

data class Passage(
    val id: String,
    val title: String,
    val text: String,
    val kind: PassageKind,
    val createdAt: Long,
) {
    val builtIn: Boolean get() = kind != PassageKind.MINE
}

data class DayStats(
    val date: LocalDate,
    val wordsRead: Int = 0,
    val wordsTried: Int = 0,
    val sessions: Int = 0,
    val stars: Int = 0,
)

/**
 * Everything the app remembers, kept as two small JSON files in the app's private storage.
 * Nothing leaves the phone.
 */
class Store private constructor(context: Context) {

    private val passagesFile = AtomicFile(File(context.filesDir, "passages.json"))
    private val progressFile = AtomicFile(File(context.filesDir, "progress.json"))

    private val _passages = MutableStateFlow(StarterPassages.load(context) + loadPassages())
    val passages: StateFlow<List<Passage>> = _passages.asStateFlow()

    private val _days = MutableStateFlow<Map<LocalDate, DayStats>>(emptyMap())
    val days: StateFlow<Map<LocalDate, DayStats>> = _days.asStateFlow()

    private val _bestStars = MutableStateFlow<Map<String, Int>>(emptyMap())
    val bestStars: StateFlow<Map<String, Int>> = _bestStars.asStateFlow()

    init {
        loadProgress()
    }

    fun passage(id: String): Passage? = _passages.value.firstOrNull { it.id == id }

    fun addPassage(title: String, text: String): Passage {
        val p = Passage(
            id = UUID.randomUUID().toString(),
            title = title.ifBlank { "میرا سبق" },
            text = text.trim(),
            kind = PassageKind.MINE,
            createdAt = System.currentTimeMillis(),
        )
        _passages.value = _passages.value + p
        savePassages()
        return p
    }

    fun deletePassage(id: String) {
        _passages.value = _passages.value.filterNot { it.id == id && !it.builtIn }
        savePassages()
    }

    fun recordSession(passageId: String, wordsRead: Int, wordsTotal: Int, stars: Int) {
        if (wordsRead <= 0) return
        val today = LocalDate.now()
        val old = _days.value[today] ?: DayStats(today)
        val updated = old.copy(
            wordsRead = old.wordsRead + wordsRead,
            wordsTried = old.wordsTried + wordsTotal,
            sessions = old.sessions + 1,
            stars = old.stars + stars,
        )
        _days.value = _days.value + (today to updated)
        if (stars > (_bestStars.value[passageId] ?: 0)) {
            _bestStars.value = _bestStars.value + (passageId to stars)
        }
        saveProgress()
    }

    fun today(): DayStats = _days.value[LocalDate.now()] ?: DayStats(LocalDate.now())

    /** Days in a row with some reading, counting back from today (or yesterday). */
    fun streak(): Int {
        val days = _days.value
        var d = LocalDate.now()
        if ((days[d]?.wordsRead ?: 0) == 0) d = d.minusDays(1)
        var n = 0
        while ((days[d]?.wordsRead ?: 0) > 0) {
            n++; d = d.minusDays(1)
        }
        return n
    }

    // ---- persistence ----

    private fun loadPassages(): List<Passage> = runCatching {
        if (!passagesFile.baseFile.exists()) return emptyList()
        val arr = JSONArray(String(passagesFile.readFully(), Charsets.UTF_8))
        (0 until arr.length()).map { i ->
            val o = arr.getJSONObject(i)
            Passage(o.getString("id"), o.getString("title"), o.getString("text"), PassageKind.MINE, o.optLong("createdAt"))
        }
    }.getOrDefault(emptyList())

    private fun savePassages() {
        val arr = JSONArray()
        _passages.value.filterNot { it.builtIn }.forEach {
            arr.put(JSONObject().put("id", it.id).put("title", it.title).put("text", it.text).put("createdAt", it.createdAt))
        }
        write(passagesFile, arr.toString())
    }

    private fun loadProgress() {
        runCatching {
            if (!progressFile.baseFile.exists()) return
            val o = JSONObject(String(progressFile.readFully(), Charsets.UTF_8))
            val days = o.optJSONArray("days") ?: JSONArray()
            _days.value = (0 until days.length()).associate { i ->
                val d = days.getJSONObject(i)
                val date = LocalDate.parse(d.getString("date"))
                date to DayStats(date, d.optInt("wordsRead"), d.optInt("wordsTried"), d.optInt("sessions"), d.optInt("stars"))
            }
            val best = o.optJSONObject("bestStars") ?: JSONObject()
            _bestStars.value = best.keys().asSequence().associateWith { best.getInt(it) }
        }
    }

    private fun saveProgress() {
        val days = JSONArray()
        _days.value.values.sortedBy { it.date }.forEach {
            days.put(
                JSONObject().put("date", it.date.toString()).put("wordsRead", it.wordsRead)
                    .put("wordsTried", it.wordsTried).put("sessions", it.sessions).put("stars", it.stars)
            )
        }
        val best = JSONObject()
        _bestStars.value.forEach { (k, v) -> best.put(k, v) }
        write(progressFile, JSONObject().put("days", days).put("bestStars", best).toString())
    }

    private fun write(file: AtomicFile, content: String) {
        val out = file.startWrite()
        try {
            out.write(content.toByteArray(Charsets.UTF_8))
            file.finishWrite(out)
        } catch (e: Exception) {
            file.failWrite(out)
        }
    }

    companion object {
        const val DAILY_GOAL_WORDS = 30

        @Volatile
        private var instance: Store? = null

        fun get(context: Context): Store =
            instance ?: synchronized(this) {
                instance ?: Store(context.applicationContext).also { instance = it }
            }
    }
}
