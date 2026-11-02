package com.nomanharis.urdureader.data

import android.content.Context
import com.nomanharis.urdureader.reading.StoryFile

/** Built-in content: short word lessons, plus the stories in `assets/stories.txt`. */
object StarterPassages {
    private val lessons: List<Passage> = listOf(
        lesson(
            "starter-alphabet", "حروفِ تہجی کے لفظ",
            "آم بکری پتنگ تتلی ٹماٹر جہاز چڑیا حلوہ خرگوش دوات ڈھول رسی زرافہ سیب شیر " +
                "صابن طوطا عینک غبارہ فوارہ قلم کتاب گھوڑا لٹو مچھلی ناشپاتی ہاتھی"
        ),
        lesson("starter-colors", "رنگ", "لال نیلا پیلا ہرا کالا سفید نارنجی گلابی جامنی بھورا"),
        lesson("starter-numbers", "گنتی", "ایک دو تین چار پانچ چھ سات آٹھ نو دس"),
        lesson(
            "starter-family", "میرا گھر",
            "یہ میرا گھر ہے۔ میرے گھر میں امی اور ابو رہتے ہیں۔ میری ایک چھوٹی بہن ہے۔ " +
                "ہم سب مل کر کھانا کھاتے ہیں۔ مجھے اپنا گھر بہت اچھا لگتا ہے۔"
        ),
    )

    // Kept as a story (and with its old id) so earlier stars still count.
    private val crow = Passage(
        id = "starter-crow", title = "پیاسا کوا", kind = PassageKind.STORY, createdAt = 0L,
        text = "ایک کوا بہت پیاسا تھا۔ وہ پانی کی تلاش میں اڑتا رہا۔ اسے ایک گھڑا نظر آیا۔ " +
            "گھڑے میں تھوڑا سا پانی تھا۔ کوے نے کنکر اٹھا کر گھڑے میں ڈالے۔ " +
            "پانی اوپر آ گیا۔ کوے نے پانی پیا اور خوشی سے اڑ گیا۔",
    )

    fun load(context: Context): List<Passage> {
        val stories = runCatching {
            val content = context.assets.open("stories.txt").bufferedReader(Charsets.UTF_8).use { it.readText() }
            StoryFile.parse(content).map {
                // The title is the id, so stars survive reordering the file.
                Passage(id = "story:${it.title}", title = it.title, text = it.text, kind = PassageKind.STORY, createdAt = 0L)
            }
        }.getOrDefault(emptyList())
        return lessons + crow + stories
    }

    private fun lesson(id: String, title: String, text: String) =
        Passage(id = id, title = title, text = text, kind = PassageKind.LESSON, createdAt = 0L)
}
