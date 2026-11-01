package com.nomanharis.urdureader.reading

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class UrduTextTest {
    @Test
    fun normalizeFoldsArabicFormsAndDiacritics() {
        // Arabic yeh / kaf / heh vs Urdu forms
        assertEquals(UrduText.normalize("کتاب"), UrduText.normalize("كتاب"))
        assertEquals(UrduText.normalize("ہے"), UrduText.normalize("هے"))
        assertEquals(UrduText.normalize("پانی"), UrduText.normalize("پاني"))
        // zabar / zer / pesh are ignored
        assertEquals(UrduText.normalize("قلم"), UrduText.normalize("قَلَم"))
        // punctuation is dropped
        assertEquals(UrduText.normalize("تھا"), UrduText.normalize("تھا۔"))
        assertEquals(UrduText.normalize("ایک"), UrduText.normalize("1"))
        assertEquals(UrduText.normalize("تین"), UrduText.normalize("۳"))
    }

    @Test
    fun tokenizeAttachesLoosePunctuation() {
        val words = UrduText.tokenize("ایک کوا بہت پیاسا تھا ۔\nوہ اڑ گیا")
        assertEquals(listOf("ایک", "کوا", "بہت", "پیاسا", "تھا ۔", "وہ", "اڑ", "گیا"), words.map { it.display })
    }

    @Test
    fun matchingIsStrictForShortWordsAndForgivingForLongOnes() {
        assertFalse(UrduText.matches(UrduText.normalize("کے"), UrduText.normalize("کی")))
        assertTrue(UrduText.matches(UrduText.normalize("خرگوش"), UrduText.normalize("خرگش")))
        assertFalse(UrduText.matches(UrduText.normalize("خرگوش"), UrduText.normalize("ٹماٹر")))
    }
}

class ReadingEngineTest {
    private val story = "ایک کوا بہت پیاسا تھا۔ وہ پانی کی تلاش میں اڑتا رہا۔"

    @Test
    fun wordsLightUpAsTheyAreHeard() {
        val e = ReadingEngine(story)
        e.onPartial("ایک")              // last word is tentative -> nothing yet
        assertEquals(0, e.tracker.readCount)
        e.onPartial("ایک کوا")
        assertEquals(1, e.tracker.readCount)
        e.onPartial("ایک کوا بہت")
        assertEquals(2, e.tracker.readCount)
        e.onFinal(listOf("ایک کوا بہت پیاسا تھا"))
        assertEquals(5, e.tracker.readCount)
        assertEquals(5, e.tracker.cursor)
    }

    @Test
    fun skippedWordsCanBeReadLater() {
        val e = ReadingEngine(story)
        e.onFinal(listOf("ایک کوا پیاسا"))
        assertEquals(WordState.SKIPPED, e.tracker.state(2))
        assertEquals(WordState.READ, e.tracker.state(3))
        e.onFinal(listOf("بہت"))
        assertEquals(WordState.READ, e.tracker.state(2))
    }

    @Test
    fun picksTheAlternativeThatFitsBest() {
        val e = ReadingEngine(story)
        e.onFinal(listOf("ایک کو بات", "ایک کوا بہت"))
        assertEquals(3, e.tracker.readCount)
    }

    @Test
    fun wholeStoryCompletes() {
        val e = ReadingEngine(story)
        e.onFinal(listOf("ایک کوا بہت پیاسا تھا"))
        e.onFinal(listOf("وہ پانی کی تلاش میں اڑتا رہا"))
        assertTrue(e.tracker.isComplete)
        assertEquals(3, ReadingEngine.stars(e.tracker.readCount, e.tracker.size))
    }

    @Test
    fun recogniserSpellingVariantsStillMatch() {
        val e = ReadingEngine("ٹماٹر کتاب ہے")
        e.onFinal(listOf("ٹماٹر كتاب هے"))
        assertTrue(e.tracker.isComplete)
    }

    @Test
    fun unrelatedSpeechLightsNothing() {
        val e = ReadingEngine(story)
        e.onFinal(listOf("آج موسم اچھا ہے"))
        assertEquals(0, e.tracker.readCount)
    }

    @Test
    fun numbersSpokenAsDigits() {
        val e = ReadingEngine("ایک دو تین چار")
        e.onFinal(listOf("1 2 3 4"))
        assertTrue(e.tracker.isComplete)
    }
}
