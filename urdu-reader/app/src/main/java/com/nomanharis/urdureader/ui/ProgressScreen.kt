package com.nomanharis.urdureader.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nomanharis.urdureader.data.DayStats
import com.nomanharis.urdureader.data.Store
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProgressScreen(store: Store, onBack: () -> Unit) {
    val days by store.days.collectAsState()
    val streak = remember(days) { store.streak() }
    val today = LocalDate.now()
    val last14 = remember(days) { (13 downTo 0).map { today.minusDays(it.toLong()) }.map { days[it] ?: DayStats(it) } }
    val totalWords = days.values.sumOf { it.wordsRead }
    val totalStars = days.values.sumOf { it.stars }
    val daysPracticed = days.values.count { it.wordsRead > 0 }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Progress") },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                },
            )
        },
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatTile("🔥", "$streak", "day streak", Modifier.weight(1f))
                StatTile("📖", "$totalWords", "words read", Modifier.weight(1f))
                StatTile("⭐", "$totalStars", "stars", Modifier.weight(1f))
            }

            Card(shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                Column(Modifier.padding(16.dp)) {
                    Text("Words read — last 14 days", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Dashed line = daily goal (${Store.DAILY_GOAL_WORDS} words)", fontSize = 12.sp, color = Color.Gray)
                    WordsChart(last14, Modifier.fillMaxWidth().height(180.dp).padding(top = 12.dp))
                    Row(Modifier.fillMaxWidth()) {
                        last14.forEach {
                            Text(
                                "${it.date.dayOfMonth}",
                                fontSize = 10.sp,
                                color = if (it.date == today) Palette.GreenDark else Color.Gray,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }

            Card(shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                Column(Modifier.padding(16.dp)) {
                    Text("Daily scores", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("$daysPracticed days practised in total", fontSize = 12.sp, color = Color.Gray)
                    val fmt = remember { DateTimeFormatter.ofPattern("EEE d MMM") }
                    val rows = days.values.filter { it.wordsRead > 0 }.sortedByDescending { it.date }.take(30)
                    if (rows.isEmpty()) {
                        Text("No reading yet — pick a lesson and press 🎤", modifier = Modifier.padding(top = 12.dp))
                    }
                    rows.forEach { d ->
                        HorizontalDivider(Modifier.padding(vertical = 8.dp))
                        Row {
                            Text(d.date.format(fmt), modifier = Modifier.weight(1f))
                            Text("${d.wordsRead} words", modifier = Modifier.weight(1f))
                            val accuracy = if (d.wordsTried > 0) (100.0 * d.wordsRead / d.wordsTried).roundToInt() else 0
                            Text("$accuracy%", modifier = Modifier.weight(0.6f))
                            Text("⭐ ${d.stars}", modifier = Modifier.weight(0.6f), textAlign = TextAlign.End)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatTile(emoji: String, value: String, label: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Palette.SunLight),
    ) {
        Column(Modifier.padding(12.dp).fillMaxWidth()) {
            Text(emoji, fontSize = 22.sp)
            Text(value, fontSize = 26.sp, fontWeight = FontWeight.Black, color = Palette.GreenDark)
            Text(label, fontSize = 12.sp)
        }
    }
}

@Composable
private fun WordsChart(data: List<DayStats>, modifier: Modifier) {
    val goal = Store.DAILY_GOAL_WORDS
    val max = maxOf(goal, data.maxOfOrNull { it.wordsRead } ?: 0).toFloat() * 1.1f
    Canvas(modifier) {
        val slot = size.width / data.size
        val barWidth = slot * 0.6f
        data.forEachIndexed { i, d ->
            val h = size.height * (d.wordsRead / max)
            val color = if (d.wordsRead >= goal) Palette.Green else Palette.Sun
            drawRoundRect(
                color = if (d.wordsRead == 0) Color(0xFFEDEDED) else color,
                topLeft = Offset(i * slot + (slot - barWidth) / 2, size.height - maxOf(h, 4f)),
                size = Size(barWidth, maxOf(h, 4f)),
                cornerRadius = CornerRadius(8f, 8f),
            )
        }
        val goalY = size.height * (1 - goal / max)
        drawLine(
            color = Palette.Coral,
            start = Offset(0f, goalY),
            end = Offset(size.width, goalY),
            strokeWidth = 3f,
            pathEffect = PathEffect.dashPathEffect(floatArrayOf(14f, 10f)),
        )
    }
}
