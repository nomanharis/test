package com.nomanharis.urdureader.ui

import android.Manifest
import android.content.pm.PackageManager
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInParent
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.nomanharis.urdureader.data.Passage
import com.nomanharis.urdureader.data.Store
import com.nomanharis.urdureader.reading.ReadingEngine
import com.nomanharis.urdureader.reading.Word
import com.nomanharis.urdureader.reading.WordState
import com.nomanharis.urdureader.speech.Speaker
import com.nomanharis.urdureader.speech.UrduSpeechListener

private class SessionBook {
    var recorded = false
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ReadScreen(passage: Passage, store: Store, onBack: () -> Unit) {
    val context = LocalContext.current
    val engine = remember(passage.id) { ReadingEngine(passage.text) }
    val states = remember(passage.id) {
        mutableStateListOf<WordState>().apply { repeat(engine.words.size) { add(WordState.PENDING) } }
    }
    var cursor by remember { mutableIntStateOf(0) }
    var listening by remember { mutableStateOf(false) }
    var heard by remember { mutableStateOf("") }
    var problem by remember { mutableStateOf<String?>(null) }
    var celebrate by remember { mutableStateOf(false) }
    val book = remember { SessionBook() }
    val speaker = remember { Speaker(context) }

    fun sync() {
        val t = engine.tracker
        for (i in states.indices) if (states[i] != t.state(i)) states[i] = t.state(i)
        cursor = t.cursor
    }

    fun finishSession() {
        val t = engine.tracker
        if (!book.recorded && t.readCount > 0) {
            store.recordSession(passage.id, t.readCount, t.size, ReadingEngine.stars(t.readCount, t.size))
            book.recorded = true
        }
    }

    val listener = remember {
        lateinit var self: UrduSpeechListener
        self = UrduSpeechListener(context, object : UrduSpeechListener.Callbacks {
            override fun onPartial(text: String) {
                heard = text
                if (engine.onPartial(text)) sync()
            }

            override fun onFinal(alternatives: List<String>) {
                heard = alternatives.first()
                if (engine.onFinal(alternatives)) sync()
                if (engine.tracker.isComplete) {
                    self.stop()
                    finishSession()
                    celebrate = true
                }
            }

            override fun onListeningChanged(active: Boolean) {
                if (!active) engine.endUtterance()
                listening = active
            }

            override fun onProblem(message: String) {
                problem = message
            }
        })
        self
    }

    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) listener.start() else problem = "Please allow the microphone so the app can hear you read."
    }

    fun toggleListening() {
        problem = null
        when {
            listening -> listener.stop()
            !listener.isAvailable() -> problem =
                "No speech recogniser found. Install or update the Google app from the Play Store."
            ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) ==
                PackageManager.PERMISSION_GRANTED -> listener.start()
            else -> permission.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    fun restart() {
        listener.stop()
        finishSession()
        engine.restart()
        book.recorded = false
        celebrate = false
        heard = ""
        sync()
    }

    // Keep the screen on while reading; clean up when leaving.
    DisposableEffect(Unit) {
        val window = (context as? ComponentActivity)?.window
        window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        onDispose {
            window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            listener.destroy()
            speaker.shutdown()
            finishSession()
        }
    }

    val readCount = states.count { it == WordState.READ }
    val total = states.size
    val scroll = rememberScrollState()
    var currentWordY by remember { mutableIntStateOf(0) }
    LaunchedEffect(currentWordY) {
        scroll.animateScrollTo((currentWordY - 200).coerceAtLeast(0))
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(passage.title, style = urduStyle(22.sp).copy(lineHeight = 40.sp)) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                },
            )
        },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            // Score strip
            Column(Modifier.padding(horizontal = 16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("$readCount / $total words", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.weight(1f))
                    val stars = ReadingEngine.stars(readCount, total)
                    Text("⭐".repeat(stars) + "☆".repeat(3 - stars), fontSize = 22.sp, color = Color(0xFFE0A100))
                }
                LinearProgressIndicator(
                    progress = { if (total == 0) 0f else readCount.toFloat() / total },
                    modifier = Modifier.fillMaxWidth().height(10.dp).padding(top = 4.dp),
                    color = Palette.Green,
                )
            }

            // The passage, right-to-left, one chip per word
            Surface(
                modifier = Modifier.weight(1f).fillMaxWidth().padding(12.dp),
                shape = RoundedCornerShape(24.dp),
                color = Color.White,
                shadowElevation = 2.dp,
            ) {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    FlowRow(
                        modifier = Modifier.verticalScroll(scroll).padding(12.dp),
                        horizontalArrangement = Arrangement.Start,
                    ) {
                        engine.words.forEachIndexed { i, word ->
                            WordChip(
                                word = word,
                                state = states[i],
                                isCurrent = i == cursor,
                                onTap = {
                                    if (!speaker.say(word.display)) {
                                        problem = "No Urdu voice installed for read-aloud. You can add one in " +
                                            "Settings → Text-to-speech."
                                    }
                                },
                                modifier = if (i == cursor) Modifier.onGloballyPositioned {
                                    currentWordY = it.positionInParent().y.toInt()
                                } else Modifier,
                            )
                        }
                    }
                }
            }

            // Messages
            problem?.let {
                Text(
                    it,
                    color = Color(0xFFB3261E),
                    fontSize = 14.sp,
                    modifier = Modifier.padding(horizontal = 16.dp),
                )
            }
            if (engine.tracker.reachedEnd && !engine.tracker.isComplete && readCount > 0) {
                Text(
                    "Almost there! Try the orange words again.",
                    color = Color(0xFFBF5B00),
                    fontSize = 15.sp,
                    modifier = Modifier.padding(horizontal = 16.dp),
                )
            }
            if (heard.isNotBlank()) {
                Text(
                    "I heard: $heard",
                    style = urduStyle(15.sp),
                    color = Color.Gray,
                    maxLines = 1,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                )
            }

            // Controls
            Row(
                Modifier.fillMaxWidth().navigationBarsPadding().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                OutlinedButton(onClick = { restart() }) { Text("🔄 Again") }
                MicButton(listening = listening, onClick = { toggleListening() })
                Button(onClick = {
                    listener.stop()
                    finishSession()
                    celebrate = true
                }) { Text("✅ Done") }
            }
        }
    }

    if (celebrate) {
        val stars = ReadingEngine.stars(readCount, total)
        AlertDialog(
            onDismissRequest = { celebrate = false },
            title = {
                Text(
                    if (stars == 3) "شاباش! 🎉" else if (stars > 0) "بہت اچھے! 👏" else "Keep practising! 💪",
                    style = urduStyle(30.sp),
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Text("⭐".repeat(stars) + "☆".repeat(3 - stars), fontSize = 44.sp, color = Color(0xFFE0A100))
                    Spacer(Modifier.height(8.dp))
                    Text("You read $readCount of $total words.", fontSize = 18.sp)
                }
            },
            confirmButton = { TextButton(onClick = { celebrate = false; onBack() }) { Text("Back to lessons") } },
            dismissButton = { TextButton(onClick = { restart() }) { Text("Read again") } },
        )
    }
}

@Composable
private fun WordChip(
    word: Word,
    state: WordState,
    isCurrent: Boolean,
    onTap: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bg by animateColorAsState(
        when (state) {
            WordState.READ -> Palette.Green
            WordState.SKIPPED -> Palette.CoralLight
            WordState.PENDING -> if (isCurrent) Palette.SunLight else Color.Transparent
        },
        label = "wordBg",
    )
    val fg = if (state == WordState.READ) Color.White else Color(0xFF222222)
    val scale by animateFloatAsState(
        if (state == WordState.READ) 1.06f else 1f,
        animationSpec = spring(dampingRatio = 0.4f),
        label = "wordScale",
    )
    Box(
        modifier
            .padding(3.dp)
            .graphicsLayer { scaleX = scale; scaleY = scale }
            .background(bg, RoundedCornerShape(14.dp))
            .border(
                width = if (isCurrent && state != WordState.READ) 2.dp else 0.dp,
                color = if (isCurrent && state != WordState.READ) Palette.Sun else Color.Transparent,
                shape = RoundedCornerShape(14.dp),
            )
            .clickable(onClick = onTap)
            .padding(horizontal = 10.dp),
    ) {
        Text(word.display, style = urduStyle(32.sp), color = fg)
    }
}

@Composable
private fun MicButton(listening: Boolean, onClick: () -> Unit) {
    val color by animateColorAsState(if (listening) Palette.Coral else Palette.Green, label = "mic")
    Box(
        Modifier
            .size(84.dp)
            .background(color, CircleShape)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(if (listening) "⏹" else "🎤", fontSize = 36.sp)
    }
}
