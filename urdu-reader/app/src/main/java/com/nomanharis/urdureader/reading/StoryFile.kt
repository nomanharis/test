package com.nomanharis.urdureader.reading

/**
 * Reads the bundled `assets/stories.txt`: each story starts with a line `# title`,
 * followed by its text. Blank lines are ignored.
 */
object StoryFile {
    data class Story(val title: String, val text: String)

    fun parse(content: String): List<Story> {
        val stories = mutableListOf<Story>()
        var title: String? = null
        val body = StringBuilder()
        fun flush() {
            val t = title ?: return
            val text = body.toString().trim()
            if (text.isNotEmpty()) stories.add(Story(t, text))
            body.clear()
        }
        for (line in content.lines()) {
            if (line.startsWith("# ")) {
                flush()
                title = line.removePrefix("# ").trim()
            } else if (line.isNotBlank() && title != null) {
                if (body.isNotEmpty()) body.append('\n')
                body.append(line.trim())
            }
        }
        flush()
        return stories
    }
}
