package com.nomanharis.urdureader.ui

import android.graphics.Bitmap
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import com.nomanharis.urdureader.data.Passage
import com.nomanharis.urdureader.data.Store
import com.nomanharis.urdureader.ocr.UrduOcr
import com.nomanharis.urdureader.reading.UrduText
import kotlinx.coroutines.launch
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddPassageScreen(store: Store, onBack: () -> Unit, onSaved: (Passage) -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var title by rememberSaveable { mutableStateOf("") }
    var text by rememberSaveable { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }
    var photo by remember { mutableStateOf<Bitmap?>(null) }

    val photoUri = remember {
        val dir = File(context.cacheDir, "photos").apply { mkdirs() }
        FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", File(dir, "page.jpg"))
    }

    fun readImage(uri: Uri) {
        busy = true
        message = null
        scope.launch {
            try {
                val bmp = UrduOcr.loadBitmap(context, uri)
                if (bmp == null) {
                    message = "Couldn't open that picture."
                } else {
                    photo = bmp
                    val found = UrduOcr.recognize(context, bmp)
                    if (found.isBlank()) {
                        message = "No Urdu text found. Try a sharper, well-lit photo held straight above the page."
                    } else {
                        text = if (text.isBlank()) found else text.trimEnd() + "\n" + found
                        message = "Check the text below and fix any mistakes before saving."
                    }
                }
            } catch (e: Exception) {
                message = "Reading the picture failed: ${e.message}"
            } finally {
                busy = false
            }
        }
    }

    val takePicture = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { ok ->
        if (ok) readImage(photoUri)
    }
    val pickImage = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri != null) readImage(uri)
    }

    val wordCount = remember(text) { UrduText.tokenize(text).size }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("New lesson") },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                },
            )
        },
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("Take a photo of a page from a book, or type / paste Urdu text.", fontSize = 16.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(onClick = { takePicture.launch(photoUri) }, enabled = !busy, modifier = Modifier.weight(1f)) {
                    Text("📷  Take photo")
                }
                FilledTonalButton(onClick = { pickImage.launch("image/*") }, enabled = !busy, modifier = Modifier.weight(1f)) {
                    Text("🖼  From gallery")
                }
            }

            if (busy) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(Modifier.size(28.dp))
                    Spacer(Modifier.size(12.dp))
                    Text("Reading the picture…")
                }
            }
            message?.let { Text(it, color = Palette.GreenDark) }

            photo?.let {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = "Photo of the page",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxWidth().heightIn(max = 220.dp).clip(RoundedCornerShape(12.dp)),
                )
            }

            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Title (optional)") },
                singleLine = true,
                textStyle = urduStyle(20.sp),
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                label = { Text("Urdu text") },
                textStyle = urduStyle(24.sp),
                minLines = 5,
                modifier = Modifier.fillMaxWidth().heightIn(min = 200.dp),
            )
            Text("$wordCount words", color = Color.Gray)

            Button(
                onClick = { onSaved(store.addPassage(title.trim(), text)) },
                enabled = wordCount > 0 && !busy,
                modifier = Modifier.fillMaxWidth().height(56.dp),
            ) {
                Text("Save and start reading", fontSize = 18.sp)
            }
        }
    }
}
