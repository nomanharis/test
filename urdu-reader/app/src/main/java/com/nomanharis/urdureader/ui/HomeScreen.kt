package com.nomanharis.urdureader.ui

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nomanharis.urdureader.data.Passage
import com.nomanharis.urdureader.data.PassageKind
import com.nomanharis.urdureader.data.Store
import com.nomanharis.urdureader.reading.UrduText

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    store: Store,
    onRead: (Passage) -> Unit,
    onAdd: () -> Unit,
    onProgress: () -> Unit,
) {
    val passages by store.passages.collectAsState()
    val days by store.days.collectAsState()
    val best by store.bestStars.collectAsState()
    val today = remember(days) { store.today() }
    val streak = remember(days) { store.streak() }
    var toDelete by remember { mutableStateOf<Passage?>(null) }
    var tab by rememberSaveable { mutableStateOf(PassageKind.STORY) }
    val shown = remember(passages, tab) { passages.filter { it.kind == tab } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("اردو پڑھو", style = urduStyle(24.sp).copy(lineHeight = 40.sp)) },
                actions = {
                    TextButton(onClick = onProgress) { Text("📊 Progress", fontSize = 16.sp) }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Palette.Green,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White,
                ),
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onAdd,
                containerColor = Palette.Sun,
                text = { Text("New lesson", fontWeight = FontWeight.Bold) },
                icon = { Text("📷", fontSize = 22.sp) },
            )
        },
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 96.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                TodayCard(wordsToday = today.wordsRead, starsToday = today.stars, streak = streak)
            }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(
                        PassageKind.STORY to "📚 Stories",
                        PassageKind.LESSON to "🔤 Words",
                        PassageKind.MINE to "📷 Mine",
                    ).forEach { (kind, label) ->
                        val count = passages.count { it.kind == kind }
                        FilterChip(
                            selected = tab == kind,
                            onClick = { tab = kind },
                            label = { Text("$label ($count)") },
                        )
                    }
                }
            }
            item {
                Text(
                    when (tab) {
                        PassageKind.MINE ->
                            if (shown.isEmpty()) "No photo lessons yet. Tap 📷 New lesson to add a page from a book."
                            else "Your own lessons. Long-press one to delete it."
                        else -> "Pick one and read it out loud. Words light up as you say them!"
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 4.dp),
                )
            }
            items(shown, key = { it.id }) { p ->
                PassageCard(
                    passage = p,
                    stars = best[p.id] ?: 0,
                    onClick = { onRead(p) },
                    onLongClick = { if (!p.builtIn) toDelete = p },
                )
            }
        }
    }

    toDelete?.let { p ->
        AlertDialog(
            onDismissRequest = { toDelete = null },
            title = { Text("Delete this lesson?") },
            text = { Text(p.title, style = urduStyle(22.sp)) },
            confirmButton = {
                TextButton(onClick = { store.deletePassage(p.id); toDelete = null }) { Text("Delete") }
            },
            dismissButton = { TextButton(onClick = { toDelete = null }) { Text("Keep") } },
        )
    }
}

@Composable
private fun TodayCard(wordsToday: Int, starsToday: Int, streak: Int) {
    val goal = Store.DAILY_GOAL_WORDS
    Card(
        colors = CardDefaults.cardColors(containerColor = Palette.SunLight),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Today", fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                if (streak > 0) Text("🔥 $streak day${if (streak == 1) "" else "s"}", fontSize = 18.sp)
            }
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text("$wordsToday", fontSize = 44.sp, fontWeight = FontWeight.Black, color = Palette.GreenDark)
                Text("  / $goal words", fontSize = 18.sp, modifier = Modifier.padding(bottom = 8.dp))
                Spacer(Modifier.weight(1f))
                Text("⭐ $starsToday", fontSize = 26.sp, modifier = Modifier.padding(bottom = 4.dp))
            }
            Spacer(Modifier.height(8.dp))
            LinearProgressIndicator(
                progress = { (wordsToday.toFloat() / goal).coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxWidth().height(14.dp),
                color = Palette.Green,
                trackColor = Color.White,
                strokeCap = androidx.compose.ui.graphics.StrokeCap.Round,
            )
            if (wordsToday >= goal) {
                Spacer(Modifier.height(8.dp))
                Text("🎉 Goal reached! شاباش!", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun PassageCard(passage: Passage, stars: Int, onClick: () -> Unit, onLongClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = if (passage.builtIn) Palette.Sky else Color(0xFFF1ECFF)),
        modifier = Modifier.fillMaxWidth().combinedClickable(onClick = onClick, onLongClick = onLongClick),
    ) {
        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    "⭐".repeat(stars) + "☆".repeat(3 - stars),
                    fontSize = 20.sp,
                    color = Color(0xFFE0A100),
                )
                Text(
                    "${remember(passage.text) { UrduText.tokenize(passage.text).size }} words",
                    fontSize = 12.sp,
                    color = Color.Gray,
                )
            }
            Spacer(Modifier.width(12.dp))
            Column(horizontalAlignment = Alignment.End, modifier = Modifier.weight(2f)) {
                Text(passage.title, style = urduStyle(24.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(
                    passage.text.replace('\n', ' '),
                    style = urduStyle(16.sp),
                    color = Color.DarkGray,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}
