# Alltag B1: Deutsch jeden Tag

A daily B1 German course built around real-life situations instead of word lists.
Every day the app picks one **scene**, such as viewing a flat in Leipzig, calling the doctor's
surgery, registering at the Bürgeramt or a job interview in Münster. You work through it in five parts:

| Part | What you do |
| --- | --- |
| **Lesen** | Read an authentic-style e-mail, notice, article, ad or review. Tap underlined words for their meaning. |
| **Hören** | Listen to a dialogue without the text (two voices, slow mode). The transcript appears once you have answered. |
| **Schreiben** | Write an e-mail or forum post, as in the Goethe/telc B1 exam. The required content points light up as you cover them. You get feedback on content, length, connectors and the greeting and sign-off, then a model answer. |
| **Sprechen** | A role play: the partner speaks, you answer out loud (speech recognition, or type if it isn't available). Each answer is checked against the task, then you repeat three key sentences for pronunciation. |
| **Grammatik** | One B1 grammar point in context, with references to the course books. |

### Progress tracker

The **Fortschritt** tab shows your day streak, minutes practised (counted only while you are actively
working), a 16-week calendar, the last seven days against your daily goal, your average
score per skill and the texts you've written. You can set a daily goal (10–30 min) and the speaking
speed. You can save and load a backup.

### Camera

The **Kamera** tab lets you photograph or pick an image:

- **German text** (signs, letters, labels): the text is recognised on the phone, read aloud, and
  every word can be tapped for a meaning. Your task is to explain to a friend in German what it says.
- **English text**: translate it into German yourself, then compare with DeepL.
- **A situation** (no text): describe the picture using guided questions and phrases. You can dictate.

Photos and answers are kept in a polaroid album on your device.

Text recognition uses [Tesseract.js](https://github.com/naptha/tesseract.js), loaded from a CDN the
first time you use it, so that first time needs internet. After that the language data stays cached.
If recognition fails, you can type the text yourself.

## Sources

The grammar focus of each scene maps to the course books in the shared Drive folder:

- Durrell, Kohl, Kaiser & Loftus: *Essential German Grammar* (2nd ed., Routledge)
- Ed Swick: *German Grammar Drills*

Each lesson cites the matching sections (for example *Durrell 10.5 · Swick Kap. 23* for relative clauses).
All texts, dialogues and exercises are original and written for this app. Nothing is copied from the books.

| # | Scene | Grammar |
| --- | --- | --- |
| 1 | Die Wohnungsbesichtigung (Leipzig) | Relativsätze |
| 2 | Beim Hausarzt (Köln) | Modalverben |
| 3 | Anmeldung im Bürgeramt (Hamburg) | Passiv |
| 4 | Neues Büro, neue Regeln (Frankfurt) | weil / obwohl / deshalb / trotzdem |
| 5 | Die kaputte Kaffeemaschine (Stuttgart) | Konjunktiv II (höflich) |
| 6 | Verspätung im ICE (Hannover) | Perfekt mit haben / sein |
| 7 | Neue Nachbarn (Dresden) | Reflexive Verben |
| 8 | Essen gehen (München) | Adjektivendungen |
| 9 | Handyvertrag und Bankkonto (Düsseldorf) | Verben mit Präpositionen, da-/wo- |
| 10 | Leute kennenlernen im Verein (Freiburg) | Infinitiv mit zu, um … zu |
| 11 | Das Vorstellungsgespräch (Münster) | Indirekte Fragen |
| 12 | Der Umzugstag (Nürnberg) | Wechselpräpositionen |

Once all twelve scenes are done, the daily scene becomes a review of your weakest one.

## Run it

It is a static site with no build step:

```sh
cd deutsch
python3 -m http.server 8000
# open http://localhost:8000
```

To install it on your phone, serve it over HTTPS (for example GitHub Pages). Then use
*Add to Home Screen* (Safari) or *Install app* (Chrome). It works offline after the first visit.

**Browser support:** listening needs speech synthesis (all modern browsers). Speaking uses the Web Speech
API's speech recognition, available in Chrome, Edge and Safari but not Firefox, where you type instead.
The camera works through the phone's normal photo picker.

All data (progress, texts, photos) stays in the browser on your device.

## Adding lessons

Lessons live in `lessons-1.js` and `lessons-2.js`. Copy one lesson object and change the content.
In reading texts, `[[Wort|gloss]]` makes a tappable word. Writing points use a regular expression (`re`) to
detect each content point, and speaking `keys` are groups of words or phrases, where each group needs one match.
After any change, bump `VERSION` in `sw.js` so installed copies update.
