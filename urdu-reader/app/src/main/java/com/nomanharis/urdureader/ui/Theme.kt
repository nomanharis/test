package com.nomanharis.urdureader.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.PlatformTextStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import com.nomanharis.urdureader.R

/** Noto Nastaliq Urdu: the script children see in Pakistani school books. */
val UrduFont = FontFamily(Font(R.font.noto_nastaliq_urdu))

/** Nastaliq needs a lot of vertical room or the tall letters get clipped. */
fun urduStyle(size: TextUnit = 28.sp) = TextStyle(
    fontFamily = UrduFont,
    fontSize = size,
    lineHeight = size * 2.2f,
    textDirection = TextDirection.Rtl,
    platformStyle = PlatformTextStyle(includeFontPadding = true),
)

object Palette {
    val Green = Color(0xFF2E9E6B)
    val GreenDark = Color(0xFF1F6F4B)
    val Sun = Color(0xFFFFC93C)
    val SunLight = Color(0xFFFFF3C4)
    val Coral = Color(0xFFFF8A65)
    val CoralLight = Color(0xFFFFE0D3)
    val Sky = Color(0xFFE8F6FF)
    val Paper = Color(0xFFFFFDF7)
}

@Composable
fun UrduReaderTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Palette.Green,
            onPrimary = Color.White,
            primaryContainer = Color(0xFFCDEFDD),
            onPrimaryContainer = Palette.GreenDark,
            secondary = Palette.Sun,
            onSecondary = Color(0xFF3D2E00),
            tertiary = Palette.Coral,
            background = Palette.Paper,
            surface = Palette.Paper,
            surfaceVariant = Palette.Sky,
        ),
        content = content,
    )
}
