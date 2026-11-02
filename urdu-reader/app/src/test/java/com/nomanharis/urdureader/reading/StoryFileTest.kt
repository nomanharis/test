package com.nomanharis.urdureader.reading

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class StoryFileTest {
    @Test
    fun parsesTitlesAndBodies() {
        val s = StoryFile.parse("# پہلی\nایک دو\n\n# دوسری\nتین\nچار\n")
        assertEquals(listOf("پہلی", "دوسری"), s.map { it.title })
        assertEquals("تین\nچار", s[1].text)
    }

    @Test
    fun bundledStoriesAreWellFormed() {
        val file = listOf("src/main/assets/stories.txt", "app/src/main/assets/stories.txt", "urdu-reader/app/src/main/assets/stories.txt")
            .map(::File).first { it.exists() }
        val stories = StoryFile.parse(file.readText())
        assertTrue("expected about 50 stories, got ${stories.size}", stories.size >= 50)
        assertEquals("titles must be unique", stories.size, stories.map { it.title }.toSet().size)
        for (story in stories) {
            val words = UrduText.tokenize(story.text)
            assertTrue("${story.title}: ${words.size} words", words.size in 40..160)
            // Every word must be readable (no Latin letters or stray symbols left over).
            assertTrue(story.title, words.all { w -> w.key.all { it in '\u0600'..'\u06FF' || it.isDigit() } })
        }
    }

    @Test
    fun everyStoryCanBeReadToTheEnd() {
        val file = listOf("src/main/assets/stories.txt", "app/src/main/assets/stories.txt")
            .map(::File).first { it.exists() }
        for (story in StoryFile.parse(file.readText())) {
            val engine = ReadingEngine(story.text)
            // Read it sentence by sentence, as the recogniser would deliver it.
            story.text.split('۔', '!', '؟').filter { it.isNotBlank() }.forEach { engine.onFinal(listOf(it)) }
            assertTrue("${story.title}: ${engine.tracker.readCount}/${engine.tracker.size}", engine.tracker.isComplete)
        }
    }
}
