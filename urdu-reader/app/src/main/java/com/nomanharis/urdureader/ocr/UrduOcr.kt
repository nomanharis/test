package com.nomanharis.urdureader.ocr

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import androidx.exifinterface.media.ExifInterface
import com.googlecode.tesseract.android.TessBaseAPI
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

/**
 * Turns a photo of a page into Urdu text, fully offline, with Tesseract and the bundled
 * `urd.traineddata` model.
 */
object UrduOcr {

    private const val LANG = "urd"

    suspend fun recognize(context: Context, bitmap: Bitmap): String = withContext(Dispatchers.Default) {
        val dataDir = prepareData(context)
        val api = TessBaseAPI()
        try {
            check(api.init(dataDir.absolutePath, LANG)) { "Could not load the Urdu OCR model" }
            api.pageSegMode = TessBaseAPI.PageSegMode.PSM_AUTO
            api.setImage(bitmap)
            cleanUp(api.utF8Text.orEmpty())
        } finally {
            api.recycle()
        }
    }

    /** Copies the model out of the APK once; Tesseract needs it as a real file. */
    private fun prepareData(context: Context): File {
        val root = File(context.filesDir, "tesseract")
        val tessdata = File(root, "tessdata").apply { mkdirs() }
        val model = File(tessdata, "$LANG.traineddata")
        if (!model.exists() || model.length() == 0L) {
            val tmp = File(tessdata, "$LANG.traineddata.tmp")
            context.assets.open("tessdata/$LANG.traineddata").use { input ->
                tmp.outputStream().use { input.copyTo(it) }
            }
            tmp.renameTo(model)
        }
        return root
    }

    /** Drops stray Latin noise and tidies whitespace, keeping line breaks. */
    private fun cleanUp(raw: String): String =
        raw.lines()
            .map { line -> line.replace(Regex("[|_~`^<>{}\\[\\]\\\\]"), " ").replace(Regex("[ \\t]+"), " ").trim() }
            .filter { line -> line.any { it in '؀'..'ۿ' } }
            .joinToString("\n")

    /** Loads a photo upright and at a size Tesseract handles well. */
    suspend fun loadBitmap(context: Context, uri: Uri, maxSide: Int = 2400): Bitmap? = withContext(Dispatchers.IO) {
        runCatching {
            val resolver = context.contentResolver
            val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            resolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
            var sample = 1
            while (bounds.outWidth / (sample * 2) >= maxSide || bounds.outHeight / (sample * 2) >= maxSide) sample *= 2
            val opts = BitmapFactory.Options().apply {
                inSampleSize = sample
                inPreferredConfig = Bitmap.Config.ARGB_8888
            }
            val decoded = resolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, opts) }
                ?: return@runCatching null
            val rotation = resolver.openInputStream(uri)?.use {
                when (ExifInterface(it).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
                    ExifInterface.ORIENTATION_ROTATE_90 -> 90f
                    ExifInterface.ORIENTATION_ROTATE_180 -> 180f
                    ExifInterface.ORIENTATION_ROTATE_270 -> 270f
                    else -> 0f
                }
            } ?: 0f
            if (rotation == 0f) decoded
            else Bitmap.createBitmap(decoded, 0, 0, decoded.width, decoded.height, Matrix().apply { postRotate(rotation) }, true)
        }.getOrNull()
    }
}
