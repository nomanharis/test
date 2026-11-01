package com.nomanharis.urdureader.data

/** A few lessons so the app is useful before any photo has been taken. */
object StarterPassages {
    val all: List<Passage> = listOf(
        starter(
            "starter-alphabet", "حروفِ تہجی کے لفظ",
            "آم بکری پتنگ تتلی ٹماٹر جہاز چڑیا حلوہ خرگوش دوات ڈھول رسی زرافہ سیب شیر " +
                "صابن طوطا عینک غبارہ فوارہ قلم کتاب گھوڑا لٹو مچھلی ناشپاتی ہاتھی"
        ),
        starter("starter-colors", "رنگ", "لال نیلا پیلا ہرا کالا سفید نارنجی گلابی جامنی بھورا"),
        starter("starter-numbers", "گنتی", "ایک دو تین چار پانچ چھ سات آٹھ نو دس"),
        starter(
            "starter-family", "میرا گھر",
            "یہ میرا گھر ہے۔ میرے گھر میں امی اور ابو رہتے ہیں۔ میری ایک چھوٹی بہن ہے۔ " +
                "ہم سب مل کر کھانا کھاتے ہیں۔ مجھے اپنا گھر بہت اچھا لگتا ہے۔"
        ),
        starter(
            "starter-crow", "پیاسا کوا",
            "ایک کوا بہت پیاسا تھا۔ وہ پانی کی تلاش میں اڑتا رہا۔ اسے ایک گھڑا نظر آیا۔ " +
                "گھڑے میں تھوڑا سا پانی تھا۔ کوے نے کنکر اٹھا کر گھڑے میں ڈالے۔ " +
                "پانی اوپر آ گیا۔ کوے نے پانی پیا اور خوشی سے اڑ گیا۔"
        ),
    )

    private fun starter(id: String, title: String, text: String) =
        Passage(id = id, title = title, text = text, builtIn = true, createdAt = 0L)
}
