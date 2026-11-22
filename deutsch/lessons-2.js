// Alltag B1 – lessons 7–12. See lessons-1.js for the format.
window.LESSONS = window.LESSONS || [];
window.LESSONS.push(
{
  id: "nachbarn",
  title: "Neue Nachbarn",
  place: "Dresden-Neustadt",
  color: "#4f8a3c",
  scene: "In Ihrem Haus ist eine Familie eingezogen, und im Treppenhaus hängt ein Brief. Sie hören, wie ein Streit unter Nachbarn freundlich gelöst wird, und bitten selbst einen Nachbarn um einen Gefallen.",
  grammar: {
    title: "Reflexive Verben",
    ref: "Durrell 3.8, 8.2 · Swick Kap. 18",
    explain: "Many everyday verbs are reflexive: <i>sich freuen, sich entschuldigen, sich treffen, sich einleben</i>. The pronoun matches the subject: <b>mich, dich, sich, uns, euch, sich</b>. If the verb already has an accusative object, the pronoun is dative: <i>Ich putze <b>mir</b> die Zähne.</i>",
    items: [
      { q: "Wir freuen ___ auf das Hoffest.", a: ["uns"], hint: "wir" },
      { q: "Ich möchte ___ für den Lärm entschuldigen.", a: ["mich"], hint: "ich, Akkusativ" },
      { q: "Hast du ___ schon gut eingelebt?", a: ["dich"], hint: "du, Akkusativ" },
      { q: "Die Nachbarn treffen ___ im Hof.", a: ["sich"], hint: "sie (Plural)" },
      { q: "Ich wasche ___ schnell die Hände.", a: ["mir"], hint: "ich, Dativ" }
    ]
  },
  reading: {
    kind: "notice",
    from: "Brief im Treppenhaus",
    subject: "Hallo aus dem 2. Stock!",
    text: "Liebe Nachbarinnen und Nachbarn,\n\nwir sind Familie Petrović aus dem 2. Stock und haben uns schon ein bisschen eingelebt. Wir möchten uns für den Lärm in den letzten Wochen entschuldigen: Unser Umzug hat länger gedauert als geplant, und unsere Handwerker haben sich leider nicht immer an die [[Ruhezeiten|quiet hours]] gehalten.\n\nGleichzeitig möchten wir uns für Ihre Geduld bedanken – besonders bei Herrn Hoffmann aus dem Erdgeschoss, der uns beim Tragen des Sofas geholfen hat!\n\nAm Samstag, dem 14., um 16 Uhr laden wir alle zu Kaffee und Kuchen in den Hof ein. Wir würden uns freuen, Sie kennenzulernen. Bei Regen treffen wir uns im [[Fahrradkeller|bike room]] – der ist groß genug.\n\nNoch eine Bitte: Seit einiger Zeit stehen im Treppenhaus oft Kinderwagen und Schuhe. Laut [[Hausordnung|house rules]] muss der [[Fluchtweg|escape route]] frei bleiben. Könnten wir uns darauf einigen, dass Kinderwagen im Fahrradkeller abgestellt werden?\n\nHerzliche Grüße\nMilena und Dario Petrović mit Luka und Ana",
    questions: [
      { type: "rf", q: "Familie Petrović wohnt schon seit vielen Jahren im Haus.", a: false },
      { type: "mc", q: "Wofür entschuldigt sich die Familie?", options: ["für ihre laute Musik", "für den Lärm beim Umzug und durch die Handwerker", "für ihren Hund"], a: 1 },
      { type: "mc", q: "Wo findet das Treffen statt, wenn es regnet?", options: ["im Hof", "in der Wohnung der Familie", "im Fahrradkeller"], a: 2 },
      { type: "rf", q: "Die Familie möchte, dass keine Kinderwagen mehr im Treppenhaus stehen.", a: true }
    ]
  },
  listening: {
    intro: "Herr Hoffmann klingelt am Abend bei seiner Nachbarin Lea.",
    lines: [
      ["m", "Herr Hoffmann", "Guten Abend. Entschuldigen Sie, haben Sie kurz Zeit?"],
      ["f", "Lea", "Ja, klar. Worum geht's?"],
      ["m", "Herr Hoffmann", "Ich wohne direkt unter Ihnen. Gestern Nacht war es bis halb zwei sehr laut bei Ihnen. Ich muss um fünf aufstehen, weil ich früh zur Arbeit fahre."],
      ["f", "Lea", "Oh nein, das tut mir wirklich leid. Ich hatte Geburtstag und habe mich mit Freunden getroffen. Ich habe gar nicht gemerkt, wie spät es war."],
      ["m", "Herr Hoffmann", "Ich verstehe das ja, man feiert nicht jeden Tag. Aber ab 22 Uhr ist Nachtruhe."],
      ["f", "Lea", "Sie haben recht. Wissen Sie was? Nächstes Mal sage ich Ihnen vorher Bescheid, und um zehn gehen wir in eine Bar."],
      ["m", "Herr Hoffmann", "Das wäre nett. Und herzlichen Glückwunsch nachträglich!"],
      ["f", "Lea", "Danke! Ich habe noch Kuchen übrig. Möchten Sie ein Stück?"],
      ["m", "Herr Hoffmann", "Da sage ich nicht Nein."]
    ],
    questions: [
      { type: "mc", q: "Warum beschwert sich Herr Hoffmann?", options: ["Die Musik war am Nachmittag zu laut.", "Es war in der Nacht bis halb zwei laut.", "Lea hat ihr Fahrrad in den Flur gestellt."], a: 1 },
      { type: "rf", q: "Herr Hoffmann muss früh aufstehen.", a: true },
      { type: "mc", q: "Was schlägt Lea für das nächste Mal vor?", options: ["Sie feiert nicht mehr zu Hause.", "Sie sagt vorher Bescheid und geht um 22 Uhr mit den Gästen in eine Bar.", "Sie lädt ihn zur Party ein."], a: 1 },
      { type: "rf", q: "Am Ende ist Herr Hoffmann immer noch sehr böse.", a: false }
    ]
  },
  writing: {
    task: "Antworten Sie Familie Petrović auf ihren Brief (circa 80 Wörter).",
    format: "informal",
    minWords: 70,
    points: [
      { t: "Bedanken Sie sich für die Einladung.", re: "dank" },
      { t: "Sagen Sie, ob Sie kommen können.", re: "komme|kommen|leider|dabei" },
      { t: "Bieten Sie an, etwas mitzubringen.", re: "mitbring|bringe|backe|kuchen|salat|getränk" },
      { t: "Stellen Sie sich kurz vor (wo Sie wohnen, was Sie machen).", re: "wohne|stock|arbeite|studiere|heiße" }
    ],
    model: "Liebe Familie Petrović,\n\nvielen Dank für Ihren netten Brief und die Einladung! Ich wohne im 4. Stock links, schon seit drei Jahren, und arbeite als Pflegekraft im Uniklinikum.\n\nAm Samstag komme ich sehr gern, allerdings erst gegen 17 Uhr, weil ich bis mittags Dienst habe. Soll ich etwas mitbringen? Ich könnte zum Beispiel einen Apfelkuchen backen.\n\nUnd machen Sie sich wegen des Lärms keine Sorgen – ein Umzug ist nun mal laut. Ich freue mich darauf, Sie kennenzulernen!\n\nHerzliche Grüße\n[Ihr Name]"
  },
  speaking: {
    intro: "Sie fahren in den Urlaub und treffen Ihren Nachbarn Herrn Hoffmann im Treppenhaus.",
    partner: "Herr Hoffmann",
    voice: "m",
    turns: [
      { say: "Ach, hallo! Na, wie geht's?", goal: "Begrüßen Sie ihn und fragen Sie, ob er kurz Zeit hat.", keys: [["hallo", "guten", "gut"], ["zeit", "kurz", "moment", "frage"]], model: "Hallo Herr Hoffmann, gut, danke! Haben Sie kurz Zeit? Ich hätte eine Frage." },
      { say: "Na klar, worum geht's?", goal: "Erklären Sie, dass Sie zwei Wochen verreisen.", keys: [["verreise", "urlaub", "weg", "reise", "fahre", "fliege"], ["woche", "tage"]], model: "Ich fahre ab Samstag für zwei Wochen in den Urlaub, nach Portugal." },
      { say: "Schön! Und wie kann ich helfen?", goal: "Bitten Sie ihn, Ihre Pflanzen zu gießen und den Briefkasten zu leeren.", keys: [["pflanze", "blumen", "gießen"], ["post", "briefkasten", "paket"]], model: "Könnten Sie vielleicht meine Pflanzen gießen und meinen Briefkasten leeren?" },
      { say: "Das mache ich gern. Wo ist der Schlüssel?", goal: "Sagen Sie, dass Sie ihm den Schlüssel am Freitag bringen.", keys: [["schlüssel"], ["freitag", "bringe", "gebe", "vorbei"]], model: "Ich bringe Ihnen den Schlüssel am Freitagabend vorbei." },
      { say: "Prima. Und wenn etwas ist, rufe ich Sie an.", goal: "Bedanken Sie sich und versprechen Sie ihm eine Kleinigkeit.", keys: [["danke", "dank"], ["mitbringen", "bringe", "revanchier", "einladen", "lade"]], model: "Vielen Dank, das ist wirklich nett! Ich bringe Ihnen etwas aus Portugal mit." }
    ],
    shadow: [
      "Ich habe mich schon gut eingelebt.",
      "Wir freuen uns darauf, Sie kennenzulernen.",
      "Könnten wir uns darauf einigen?"
    ]
  }
},
{
  id: "restaurant",
  title: "Essen gehen",
  place: "München-Westend",
  color: "#b2476f",
  scene: "Sie gehen mit Freunden in ein bayerisches Gasthaus. Vorher lesen Sie eine Bewertung, im Restaurant bestellen Sie, reklamieren höflich – und am Ende diskutieren Sie im Forum: Restaurant oder lieber selbst kochen?",
  grammar: {
    title: "Adjektivendungen",
    ref: "Durrell 4.1–4.2 · Swick Kap. 10",
    explain: "Adjectives before a noun need an ending. After <i>der/die/das</i> it is <b>-e</b> or <b>-en</b>. After <i>ein/kein/mein</i> the adjective shows the gender where the article doesn't: <i>ein großer Tisch, ein kleines Lokal</i>. With no article at all, the adjective takes the article's ending: <i>mit frischem Ingwer</i>. Type only the ending.",
    items: [
      { q: "ein gemütlich___ Lokal (Nominativ)", a: ["es"], hint: "das Lokal" },
      { q: "neben dem groß___ Kachelofen", a: ["en"], hint: "Dativ" },
      { q: "Ich nehme den gebraten___ Lachs.", a: ["en"], hint: "Akkusativ, maskulin" },
      { q: "Ein groß___ Wasser, bitte.", a: ["es"], hint: "das Wasser, Akkusativ" },
      { q: "Suppe mit frisch___ Ingwer", a: ["em"], hint: "Dativ, ohne Artikel" }
    ]
  },
  reading: {
    kind: "review",
    from: "Bewertung auf einem Restaurantportal · 4 von 5 Sternen",
    subject: "Gemütlicher Abend mit kleinen Schwächen",
    text: "Am Freitag waren wir zu viert im „Gasthaus zur Linde“ im Westend. Das alte Haus mit den dunklen Holzmöbeln und dem großen [[Kachelofen|tiled stove]] hat uns sofort gefallen. Weil wir ohne Reservierung kamen, mussten wir zwanzig Minuten an der kleinen Bar warten – am Wochenende sollte man also unbedingt vorher anrufen.\n\nDas Essen war ausgezeichnet. Mein Mann hatte einen knusprigen Schweinebraten mit hausgemachten Knödeln, ich habe die vegetarischen [[Kässpätzle|cheese noodles]] mit gerösteten Zwiebeln probiert. Die Portionen waren so groß, dass wir keinen Nachtisch mehr geschafft haben.\n\nWeniger gut: Die junge Kellnerin war zwar freundlich, aber offensichtlich allein für den ganzen Raum [[zuständig|responsible]]. Auf unsere zweite Runde Getränke haben wir fast eine halbe Stunde gewartet. Außerdem kann man nur bar bezahlen, was heute eher ungewöhnlich ist.\n\n[[Fazit|conclusion]]: ein gemütliches Lokal mit leckerer bayerischer Küche zu fairen Preisen. Mit etwas mehr Personal wären es fünf Sterne.",
    questions: [
      { type: "rf", q: "Die Gruppe hatte einen Tisch reserviert.", a: false },
      { type: "mc", q: "Was war an diesem Abend besonders gut?", options: ["das Essen", "der Service", "die kurze Wartezeit"], a: 0 },
      { type: "mc", q: "Warum gab es keinen Nachtisch?", options: ["Er war ausverkauft.", "Die Portionen waren zu groß.", "Die Küche hatte schon geschlossen."], a: 1 },
      { type: "rf", q: "Im Gasthaus kann man nicht mit Karte bezahlen.", a: true }
    ]
  },
  listening: {
    intro: "Frau Haddad und Jan bestellen im Restaurant.",
    lines: [
      ["m", "Kellner", "Guten Abend! Haben Sie schon gewählt?"],
      ["f", "Frau Haddad", "Ja. Ich hätte gern die Kürbissuppe als Vorspeise. Ist die scharf?"],
      ["m", "Kellner", "Ein bisschen, mit frischem Ingwer. Aber nicht zu scharf."],
      ["f", "Frau Haddad", "Gut. Und als Hauptgericht nehme ich den gebratenen Lachs. Kann ich statt der Kartoffeln einen grünen Salat haben?"],
      ["m", "Kellner", "Natürlich, kein Problem. Und zu trinken?"],
      ["f", "Frau Haddad", "Ein großes Wasser ohne Kohlensäure, bitte."],
      ["m", "Jan", "Für mich das Wiener Schnitzel mit Pommes. Ach, und ich bin allergisch gegen Nüsse. Ist in der Panade etwas drin?"],
      ["m", "Kellner", "Nein, aber im Dessert sind Haselnüsse. Ich sage der Küche Bescheid."],
      ["m", "Jan", "Danke. Und ein kleines Bier, bitte."],
      ["f", "Frau Haddad", "Entschuldigung, wir möchten bitte zahlen."],
      ["m", "Kellner", "Zusammen oder getrennt?"],
      ["m", "Jan", "Zusammen, bitte."],
      ["m", "Kellner", "Das macht 58 Euro 40."],
      ["m", "Jan", "Machen Sie 62. Stimmt so."]
    ],
    questions: [
      { type: "mc", q: "Was bestellt Frau Haddad als Hauptgericht?", options: ["Wiener Schnitzel", "gebratenen Lachs mit Salat", "Kürbissuppe"], a: 1 },
      { type: "rf", q: "Die Kürbissuppe ist sehr scharf.", a: false },
      { type: "mc", q: "Wogegen ist Jan allergisch?", options: ["gegen Nüsse", "gegen Milch", "gegen Fisch"], a: 0 },
      { type: "mc", q: "Wie viel Trinkgeld gibt Jan?", options: ["2,40 Euro", "3,60 Euro", "4 Euro"], a: 1 }
    ]
  },
  writing: {
    task: "Im Online-Forum einer Stadtzeitung wird gefragt: „Gehen Sie lieber ins Restaurant oder kochen Sie lieber zu Hause?“ Schreiben Sie Ihre Meinung (circa 80 Wörter).",
    format: "forum",
    minWords: 70,
    points: [
      { t: "Sagen Sie Ihre Meinung.", re: "meiner meinung|ich finde|ich denke|ich glaube|für mich|lieber" },
      { t: "Geben Sie ein Beispiel aus Ihrem Leben.", re: "zum beispiel|z\\. ?b\\.|neulich|letzte|letzten|einmal|wenn ich" },
      { t: "Nennen Sie einen Vorteil und einen Nachteil.", re: "vorteil|nachteil|teuer|günstig|gesund|zeit|aber" },
      { t: "Beschreiben Sie Essen oder Orte mit Adjektiven (z. B. „ein gemütliches Lokal“).", re: "(gemütlich|frisch|lecker|teur|günstig|gesund|klein|groß|warm|italienisch|hausgemacht)(e|es|er|en|em)\\b" }
    ],
    model: "Ich koche eigentlich lieber zu Hause, weil ich dann genau weiß, was im Essen ist. Frisches Gemüse vom Wochenmarkt ist günstiger und gesünder als ein großes Menü im Restaurant. Außerdem macht mir das Kochen nach einem langen Arbeitstag Spaß.\n\nTrotzdem gehe ich ab und zu gern essen. Letzten Monat habe ich zum Beispiel mit Freunden in einem kleinen italienischen Lokal gefeiert. Der Vorteil: Niemand musste abwaschen! Der Nachteil ist natürlich der hohe Preis. Für besondere Anlässe ist ein Restaurant aber eine schöne Abwechslung."
  },
  speaking: {
    intro: "Sie sind allein im Restaurant und bestellen bei der Kellnerin.",
    partner: "Kellnerin",
    voice: "f",
    turns: [
      { say: "Guten Abend, was darf ich Ihnen bringen?", goal: "Bestellen Sie ein Getränk und ein Hauptgericht.", keys: [["hätte gern", "nehme", "möchte", "bitte", "für mich"], ["wasser", "bier", "wein", "saft", "cola", "tee", "schnitzel", "salat", "suppe", "pizza", "nudeln", "fisch", "lachs", "braten"]], model: "Ich hätte gern ein Glas Weißwein und den gebratenen Lachs, bitte." },
      { say: "Gern. Möchten Sie dazu Kartoffeln oder Reis?", goal: "Wählen Sie eine Beilage.", keys: [["kartoffel", "reis", "salat", "pommes"]], model: "Reis, bitte." },
      { say: "So, bitte schön. … Ist bei Ihnen alles in Ordnung?", goal: "Beschweren Sie sich höflich: Das Essen ist kalt.", keys: [["kalt", "lauwarm", "nicht warm", "nicht heiß"]], model: "Leider nicht ganz. Der Fisch ist kalt. Könnten Sie ihn bitte noch einmal warm machen?" },
      { say: "Oh, das tut mir leid! Ich bringe Ihnen sofort einen neuen.", goal: "Bedanken Sie sich.", keys: [["danke", "dank", "nett", "freundlich"]], model: "Danke, das ist sehr nett." },
      { say: "Darf es noch ein Dessert sein?", goal: "Lehnen Sie ab und bitten Sie um die Rechnung.", keys: [["nein", "satt", "nichts"], ["rechnung", "zahlen", "bezahlen"]], model: "Nein danke, ich bin satt. Ich würde gern bezahlen." }
    ],
    shadow: [
      "Ich hätte gern einen grünen Salat statt der Pommes.",
      "Ich bin allergisch gegen Nüsse.",
      "Zusammen oder getrennt? – Getrennt, bitte."
    ]
  }
},
{
  id: "vertrag",
  title: "Handyvertrag und Bankkonto",
  place: "Düsseldorf-Bilk",
  color: "#2f6f9f",
  scene: "Ihre Handyrechnung ist plötzlich viel zu hoch, und Sie wollen den Anbieter wechseln. Außerdem eröffnen Sie ein neues Konto. Heute geht es um Verträge, Rechnungen und Kündigungen.",
  grammar: {
    title: "Verben mit Präpositionen · da(r)- und wo(r)-",
    ref: "Durrell 5.5, 8.6",
    explain: "Many verbs need a fixed preposition: <i>sich ärgern über, sich kümmern um, achten auf, bitten um, sich interessieren für, warten auf</i>. For things, <i>preposition + it</i> becomes <b>da(r)- + preposition</b> (darauf, darüber); questions use <b>wo(r)-</b> (Worauf? Worüber?). For people: <i>Auf wen wartest du?</i>",
    items: [
      { q: "Ich ärgere mich ___ die hohe Rechnung.", a: ["über"], hint: "sich ärgern …" },
      { q: "Kümmern Sie sich rechtzeitig ___ die Kündigung!", a: ["um"], hint: "sich kümmern …" },
      { q: "___ wartest du? – Auf die Bestätigung.", a: ["worauf"], hint: "Frage nach einer Sache" },
      { q: "Achten Sie ___, im Ausland die Daten auszuschalten.", a: ["darauf"], hint: "achten auf + es" },
      { q: "Ich interessiere mich ___ das Online-Konto.", a: ["für"], hint: "sich interessieren …" }
    ]
  },
  reading: {
    kind: "article",
    from: "Verbraucherratgeber",
    subject: "Handyvertrag kündigen: Darauf sollten Sie achten",
    text: "Viele Menschen ärgern sich über ihren Handyvertrag, aber nur wenige kümmern sich rechtzeitig um die Kündigung. Dabei ist es in den letzten Jahren deutlich einfacher geworden.\n\nNach der [[Mindestlaufzeit|minimum term]] von meistens 24 Monaten können Sie Ihren Vertrag jederzeit mit einer [[Frist|notice period]] von einem Monat kündigen. Früher verlängerte sich der Vertrag automatisch um ein ganzes Jahr – darauf müssen Sie heute nicht mehr achten.\n\nAchten Sie aber darauf, schriftlich zu kündigen, also per Brief, per E-Mail oder über den [[Kündigungsbutton|cancel button]] auf der Webseite des Anbieters. Bitten Sie um eine [[Kündigungsbestätigung|confirmation]] und heben Sie sie gut auf.\n\nWenn Sie Ihre Handynummer behalten möchten, müssen Sie Ihren neuen Anbieter darum bitten, die Nummer mitzunehmen. Das kostet meist nichts, weil viele Anbieter die Gebühr übernehmen.\n\nUnd wenn der Anbieter die Preise erhöht? Dann haben Sie ein [[Sonderkündigungsrecht|special right to cancel]] und können sofort aus dem Vertrag aussteigen. Viele Kunden wissen nichts davon und zahlen jahrelang zu viel.",
    questions: [
      { type: "rf", q: "Nach 24 Monaten verlängert sich ein Handyvertrag heute automatisch um ein Jahr.", a: false },
      { type: "mc", q: "Wie kann man kündigen?", options: ["nur telefonisch", "schriftlich: per Brief, E-Mail oder Kündigungsbutton", "nur persönlich im Laden"], a: 1 },
      { type: "rf", q: "Wer seine Nummer behalten will, muss den neuen Anbieter darum bitten.", a: true },
      { type: "mc", q: "Was ist ein Sonderkündigungsrecht?", options: ["das Recht, nach einer Preiserhöhung sofort zu kündigen", "ein Rabatt für Neukunden", "eine Gebühr für die Kündigung"], a: 0 }
    ]
  },
  listening: {
    intro: "Frau Popescu ruft bei der Hotline ihres Mobilfunkanbieters an.",
    lines: [
      ["m", "Herr Klein", "Willkommen beim Kundenservice, Sie sprechen mit Herrn Klein. Wie kann ich Ihnen helfen?"],
      ["f", "Frau Popescu", "Guten Tag. Ich rufe wegen meiner letzten Rechnung an. Ich soll 89 Euro bezahlen, aber mein Tarif kostet nur 25 Euro im Monat."],
      ["m", "Herr Klein", "Darf ich Ihre Kundennummer haben?"],
      ["f", "Frau Popescu", "Ja, das ist 4 4 7 1 9 2 0."],
      ["m", "Herr Klein", "Danke. Ich sehe hier Gebühren für Roaming in der Schweiz. Waren Sie im Oktober in der Schweiz?"],
      ["f", "Frau Popescu", "Ja, aber nur ein Wochenende, und ich habe kaum telefoniert! Ich dachte, Roaming ist in Europa kostenlos."],
      ["m", "Herr Klein", "In der EU ja, aber die Schweiz gehört nicht zur EU. Dort gelten andere Preise. Sie haben wahrscheinlich mobile Daten benutzt."],
      ["f", "Frau Popescu", "Darüber hat mich niemand informiert. Ich habe keine SMS bekommen."],
      ["m", "Herr Klein", "Eigentlich müssten Sie eine SMS bekommen haben. Ich kann Ihnen aber aus Kulanz die Hälfte gutschreiben."],
      ["f", "Frau Popescu", "Das ist immerhin etwas. Und wie kann ich das in Zukunft vermeiden?"],
      ["m", "Herr Klein", "Schalten Sie außerhalb der EU einfach die mobilen Daten aus."],
      ["f", "Frau Popescu", "Gut, darauf achte ich. Danke."]
    ],
    questions: [
      { type: "mc", q: "Warum ruft Frau Popescu an?", options: ["Sie will ihren Vertrag kündigen.", "Ihre Rechnung ist viel höher als normal.", "Ihr Handy ist kaputt."], a: 1 },
      { type: "rf", q: "Die Schweiz gehört zur EU.", a: false },
      { type: "mc", q: "Was bietet Herr Klein an?", options: ["Er erstattet die ganze Summe.", "Er schreibt die Hälfte der Gebühren gut.", "Er schickt ein neues Handy."], a: 1 },
      { type: "rf", q: "Frau Popescu soll außerhalb der EU die mobilen Daten ausschalten.", a: true }
    ]
  },
  writing: {
    task: "Ihr Anbieter erhöht ab Januar den Preis Ihres Handyvertrags. Kündigen Sie den Vertrag per E-Mail (circa 80 Wörter).",
    format: "formal",
    minWords: 60,
    points: [
      { t: "Nennen Sie Ihre Kundennummer.", re: "kundennummer|vertragsnummer" },
      { t: "Kündigen Sie und nennen Sie den Grund.", re: "kündig" },
      { t: "Bitten Sie um eine schriftliche Bestätigung.", re: "bestätig" },
      { t: "Sagen Sie, dass Sie Ihre Rufnummer mitnehmen möchten.", re: "nummer|mitnehmen|behalten|portier" }
    ],
    model: "Sehr geehrte Damen und Herren,\n\nhiermit kündige ich meinen Mobilfunkvertrag (Kundennummer 4471920) zum nächstmöglichen Zeitpunkt. Sie haben mir mitgeteilt, dass der Preis ab Januar von 25 auf 30 Euro steigt. Damit bin ich nicht einverstanden, deshalb nutze ich mein Sonderkündigungsrecht.\n\nIch möchte meine Rufnummer zu meinem neuen Anbieter mitnehmen. Bitte geben Sie die Nummer dafür frei.\n\nBitte schicken Sie mir eine schriftliche Bestätigung der Kündigung mit dem genauen Vertragsende.\n\nMit freundlichen Grüßen\n[Ihr Name]"
  },
  speaking: {
    intro: "Sie sitzen in der Bank bei Frau Schuster und möchten ein Konto eröffnen.",
    partner: "Frau Schuster",
    voice: "f",
    turns: [
      { say: "Guten Tag, was kann ich für Sie tun?", goal: "Sagen Sie, dass Sie ein Girokonto eröffnen möchten.", keys: [["konto"], ["eröffnen", "aufmachen", "möchte", "brauche", "hätte gern"]], model: "Guten Tag, ich möchte gern ein Girokonto eröffnen." },
      { say: "Sehr gern. Haben Sie Ihren Ausweis und die Meldebescheinigung dabei?", goal: "Antworten Sie und geben Sie ihr die Dokumente.", keys: [["ja", "hier", "bitte"]], model: "Ja, hier sind mein Pass und die Meldebescheinigung." },
      { say: "Danke. Wir haben ein Konto für 4,90 Euro im Monat oder ein Online-Konto ohne Gebühren.", goal: "Fragen Sie nach dem Unterschied.", keys: [["unterschied", "was ist", "vorteil", "unterscheid", "was bekomme"]], model: "Was ist denn der Unterschied zwischen den beiden Konten?" },
      { say: "Beim Online-Konto erledigen Sie alles in der App. Bargeld abheben ist nur an unseren eigenen Automaten kostenlos.", goal: "Entscheiden Sie sich und begründen Sie Ihre Wahl.", keys: [["nehme", "entscheide", "lieber", "möchte"], ["weil", "denn", "deshalb", "da "]], model: "Dann nehme ich das Online-Konto, weil ich fast immer mit Karte bezahle." },
      { say: "Gut. Ihre Karte kommt in etwa einer Woche per Post.", goal: "Fragen Sie, wie Sie die PIN bekommen.", keys: [["pin", "geheimzahl"]], model: "Und wie bekomme ich die PIN? Kommt die auch per Post?" }
    ],
    shadow: [
      "Ich interessiere mich für ein Konto ohne Gebühren.",
      "Darüber hat mich niemand informiert.",
      "Worauf muss ich bei der Kündigung achten?"
    ]
  }
},
{
  id: "verein",
  title: "Leute kennenlernen im Verein",
  place: "Freiburg im Breisgau",
  color: "#2a8a80",
  scene: "Sie wohnen seit ein paar Monaten in Freiburg und möchten neue Leute kennenlernen. Sie lesen über Vereine, rufen in einer Kletterhalle an und laden einen Freund zum Lauftreff ein.",
  grammar: {
    title: "Infinitiv mit zu · um … zu",
    ref: "Durrell 10.6–10.7 · Swick Kap. 27",
    explain: "After many verbs and expressions (<i>Lust haben, vergessen, versuchen, vorschlagen, es ist wichtig</i>) the second verb comes as <b>zu + infinitive</b> at the end. With separable verbs <i>zu</i> goes inside: <i>mit<b>zu</b>kommen, an<b>zu</b>melden</i>. <b>um … zu</b> means \"in order to\" when the subject stays the same.",
    items: [
      { q: "Ich habe keine Lust, abends allein zu Hause ___ sitzen.", a: ["zu"], hint: "" },
      { q: "Hast du Lust, nächsten Dienstag ___?", a: ["mitzukommen"], hint: "mitkommen" },
      { q: "Ich laufe, ___ fit zu bleiben.", a: ["um"], hint: "Zweck" },
      { q: "Vergiss nicht, dich online ___.", a: ["anzumelden"], hint: "anmelden" },
      { q: "Es ist wichtig, regelmäßig ___ trainieren.", a: ["zu"], hint: "" }
    ]
  },
  reading: {
    kind: "article",
    from: "Stadtmagazin, Rubrik „Neu hier“",
    subject: "Mitmachen statt allein zu Hause sitzen",
    text: "Rund 24 Millionen Menschen in Deutschland sind Mitglied in einem Sportverein. Aber Vereine gibt es nicht nur für Sport: Man kann sich auch im Chor, in der freiwilligen Feuerwehr oder im Kleingartenverein [[engagieren|get involved]].\n\nFür viele Neu-Freiburger ist ein Verein der beste Weg, um Leute kennenzulernen. „Ich bin vor zwei Jahren aus Spanien hierhergezogen und hatte keine Lust, abends allein zu Hause zu sitzen“, erzählt Lucía, 31. „Eine Kollegin hat mir vorgeschlagen, mit zum Lauftreff zu kommen. Heute laufe ich zweimal pro Woche mit der Gruppe, und danach gehen wir oft zusammen etwas trinken.“\n\nDer [[Mitgliedsbeitrag|membership fee]] ist meistens günstig, oft zwischen 5 und 20 Euro im Monat. Viele Vereine bieten ein [[Probetraining|trial session]] an, ohne dass man gleich Mitglied werden muss. Es lohnt sich also, verschiedene Angebote auszuprobieren.\n\nWer keine Zeit hat, regelmäßig zu trainieren, kann [[ehrenamtlich|as a volunteer]] helfen, zum Beispiel beim Stadtlauf im Mai. „Man braucht keine Erfahrung, um mitzuhelfen“, sagt der Vereinsvorsitzende Peter Maurer. „Wir freuen uns über jede Hand.“",
    questions: [
      { type: "mc", q: "Warum ist Lucía zum Lauftreff gegangen?", options: ["Sie wollte abnehmen.", "Sie wollte abends nicht allein zu Hause sitzen.", "Ihr Arzt hat es empfohlen."], a: 1 },
      { type: "rf", q: "Lucía trainiert dreimal pro Woche.", a: false },
      { type: "rf", q: "Bei vielen Vereinen kann man ein Probetraining machen, ohne Mitglied zu sein.", a: true },
      { type: "mc", q: "Was braucht man, um beim Stadtlauf zu helfen?", options: ["viel Erfahrung", "eine Mitgliedschaft", "nichts Besonderes"], a: 2 }
    ]
  },
  listening: {
    intro: "Herr Silva ruft in einer Kletterhalle an.",
    lines: [
      ["f", "Frau Lang", "Kletterhalle Nord, Lang am Telefon."],
      ["m", "Herr Silva", "Hallo, ich habe eine Frage zu Ihren Kursen. Ich würde gern klettern lernen, habe aber überhaupt keine Erfahrung."],
      ["f", "Frau Lang", "Kein Problem. Wir haben einen Anfängerkurs, der jeden Mittwoch von 19 bis 21 Uhr stattfindet. Der nächste beginnt am 8. Januar."],
      ["m", "Herr Silva", "Wie lange dauert der Kurs?"],
      ["f", "Frau Lang", "Sechs Wochen. Danach dürfen Sie selbstständig in der Halle klettern."],
      ["m", "Herr Silva", "Und was kostet das?"],
      ["f", "Frau Lang", "Für Mitglieder 90 Euro, für Nichtmitglieder 130 Euro. Die Ausrüstung, also Schuhe und Gurt, können Sie bei uns ausleihen."],
      ["m", "Herr Silva", "Lohnt es sich denn, gleich Mitglied zu werden?"],
      ["f", "Frau Lang", "Wenn Sie nach dem Kurs weiterklettern möchten, auf jeden Fall. Der Beitrag beträgt 12 Euro im Monat."],
      ["m", "Herr Silva", "Okay. Muss ich mich vorher anmelden?"],
      ["f", "Frau Lang", "Ja, am besten online. Es gibt nur zehn Plätze, und die sind schnell weg."],
      ["m", "Herr Silva", "Dann melde ich mich heute noch an. Vielen Dank!"]
    ],
    questions: [
      { type: "mc", q: "Wann findet der Anfängerkurs statt?", options: ["montags von 18 bis 20 Uhr", "mittwochs von 19 bis 21 Uhr", "samstags vormittags"], a: 1 },
      { type: "mc", q: "Was kostet der Kurs für Nichtmitglieder?", options: ["90 Euro", "120 Euro", "130 Euro"], a: 2 },
      { type: "rf", q: "Herr Silva muss Kletterschuhe kaufen.", a: false },
      { type: "rf", q: "Im Kurs gibt es nur zehn Plätze.", a: true }
    ]
  },
  writing: {
    task: "Sie haben einen Lauftreff gefunden. Schreiben Sie Ihrem Freund Malik und laden Sie ihn ein mitzukommen (circa 80 Wörter).",
    format: "informal",
    minWords: 70,
    points: [
      { t: "Beschreiben Sie den Lauftreff oder Verein.", re: "verein|kurs|training|treff|gruppe|laufen|kilometer" },
      { t: "Erklären Sie, warum Sie mitmachen (um … zu).", re: "\\bum\\b[^.!?]*\\bzu\\b|\\bum\\b[^.!?]*zu[a-zäöüß]+en\\b" },
      { t: "Laden Sie Malik ein und sagen Sie, wann.", re: "lust|komm doch|möchtest du|mitzukommen|mitkommen" },
      { t: "Sagen Sie, was er mitbringen muss.", re: "mitbring|brauchst|bring" }
    ],
    model: "Hallo Malik,\n\nstell dir vor, ich habe endlich einen Verein gefunden! Ich gehe seit drei Wochen zum Lauftreff im Seepark. Wir laufen dienstags und donnerstags um 18:30 Uhr zusammen etwa acht Kilometer. Ich mache mit, um fitter zu werden und um neue Leute kennenzulernen – die Gruppe ist echt nett.\n\nHast du Lust, nächsten Dienstag mitzukommen? Das erste Training ist kostenlos. Du brauchst nur Laufschuhe und eine Stirnlampe, weil es abends schon dunkel ist.\n\nSag mir einfach Bescheid!\nViele Grüße\n[Ihr Name]"
  },
  speaking: {
    intro: "Ihr erster Abend beim Lauftreff. Eine Läuferin spricht Sie an.",
    partner: "Lucía",
    voice: "f",
    turns: [
      { say: "Hi, bist du neu hier? Ich bin Lucía.", goal: "Stellen Sie sich vor und sagen Sie, dass Sie zum ersten Mal da sind.", keys: [["ich bin", "ich heiße", "mein name"], ["erste", "neu"]], model: "Hi, ich bin Sam. Ja, ich bin heute zum ersten Mal dabei." },
      { say: "Schön! Wie hast du vom Lauftreff erfahren?", goal: "Erzählen Sie, wie Sie davon gehört haben.", keys: [["kollege", "kollegin", "freund", "internet", "zeitung", "instagram", "webseite", "gelesen", "gehört", "erzählt"]], model: "Ein Kollege hat mir davon erzählt, und dann habe ich auf der Webseite nachgesehen." },
      { say: "Läufst du schon lange?", goal: "Antworten Sie und sagen Sie, warum Sie angefangen haben (um … zu).", keys: [["um"], ["zu"]], model: "Nein, erst seit ein paar Monaten. Ich habe angefangen, um nach der Arbeit abzuschalten." },
      { say: "Wir gehen nach dem Training immer noch etwas trinken. Kommst du mit?", goal: "Sagen Sie zu, oder sagen Sie höflich ab und nennen Sie einen Grund.", keys: [["gern", "ja", "klar", "leider", "heute nicht"]], model: "Gern! Heute habe ich Zeit." },
      { say: "Super. Hast du eigentlich Lust, beim Stadtlauf im Mai zu helfen?", goal: "Fragen Sie, was man da machen muss.", keys: [["was", "wie"], ["machen", "helfen", "muss", "aufgabe", "tun"]], model: "Vielleicht. Was müsste ich da denn machen?" }
    ],
    shadow: [
      "Ich habe keine Lust, abends allein zu Hause zu sitzen.",
      "Ich trainiere, um fit zu bleiben.",
      "Es lohnt sich, verschiedene Angebote auszuprobieren."
    ]
  }
},
{
  id: "bewerbung",
  title: "Das Vorstellungsgespräch",
  place: "Münster",
  color: "#c0533a",
  scene: "Eine Firma, die E-Bikes baut, sucht Verstärkung im Kundenservice. Sie lesen die Stellenanzeige, hören ein Vorstellungsgespräch, schreiben Ihre Bewerbung und üben selbst das Gespräch.",
  grammar: {
    title: "Indirekte Fragen mit ob und W-Wörtern",
    ref: "Durrell 10.3 · Swick Kap. 12",
    explain: "Polite questions are often embedded: <i>Können Sie mir sagen, <b>wann</b> der Kurs <b>beginnt</b>?</i> W-questions keep their question word; yes/no questions use <b>ob</b>. In both, the conjugated verb moves to the end.",
    items: [
      { q: "Ich möchte wissen, ___ die Stelle noch frei ist.", a: ["ob"], hint: "Ja/Nein-Frage" },
      { q: "Können Sie mir sagen, wann das Gespräch ___?", a: ["beginnt"], hint: "beginnen" },
      { q: "Wissen Sie, ___ viele Urlaubstage man bekommt?", a: ["wie"], hint: "W-Wort" },
      { q: "Ich wollte fragen, ___ ich ein Dienstrad leasen kann.", a: ["ob"], hint: "Ja/Nein-Frage" },
      { q: "Könnten Sie mir erklären, was ich mitbringen ___?", a: ["muss"], hint: "müssen" }
    ]
  },
  reading: {
    kind: "ad",
    from: "Stellenanzeige",
    subject: "Sachbearbeiter/in im Kundenservice (Teilzeit, 30 Std./Woche)",
    text: "Velowerk Münster ist ein junges Unternehmen mit 60 Mitarbeitenden, das E-Bikes für den Stadtverkehr entwickelt. Zur Verstärkung unseres Teams suchen wir ab März eine Sachbearbeiterin oder einen Sachbearbeiter im Kundenservice.\n\nSie beantworten Anfragen unserer Kundinnen und Kunden per Telefon, E-Mail und Chat, kümmern sich um Reklamationen und arbeiten eng mit unserer Werkstatt zusammen. Sie haben eine kaufmännische Ausbildung oder Erfahrung im Kundenservice und sprechen Deutsch mindestens auf B1-Niveau; gute Englischkenntnisse sind von Vorteil. Wichtig ist uns, dass Sie auch in stressigen Situationen freundlich bleiben.\n\nWir bieten Ihnen [[Gleitzeit|flexitime]], 30 Tage Urlaub, ein [[Dienstrad|company bike]] zum Leasen und ein Team, das gern zusammen lacht. Eine [[Einarbeitung|induction]] von vier Wochen ist selbstverständlich.\n\nBitte schicken Sie uns Ihre [[Bewerbungsunterlagen|application documents]] mit Lebenslauf, Zeugnissen und Ihrer [[Gehaltsvorstellung|salary expectation]] bis zum 31. Januar per E-Mail. Ein Anschreiben ist nicht nötig – erzählen Sie uns lieber in drei Sätzen, warum Sie zu uns passen.",
    questions: [
      { type: "rf", q: "Die Stelle ist eine Vollzeitstelle.", a: false },
      { type: "mc", q: "Was gehört NICHT zu den Aufgaben?", options: ["Kundenanfragen beantworten", "Reklamationen bearbeiten", "E-Bikes reparieren"], a: 2 },
      { type: "rf", q: "Für die Stelle braucht man perfekte Deutschkenntnisse.", a: false },
      { type: "mc", q: "Was sollen die Bewerber statt eines Anschreibens schicken?", options: ["ein Video", "drei Sätze, warum sie passen", "ein Foto"], a: 1 }
    ]
  },
  listening: {
    intro: "Herr Rahimi hat ein Vorstellungsgespräch bei Frau Engel.",
    lines: [
      ["f", "Frau Engel", "Guten Tag, schön, dass Sie da sind. Hatten Sie eine gute Anreise?"],
      ["m", "Herr Rahimi", "Ja, danke. Ich bin mit dem Fahrrad gekommen – passend zu Ihrer Firma."],
      ["f", "Frau Engel", "Sehr gut. Erzählen Sie doch mal: Warum haben Sie sich bei uns beworben?"],
      ["m", "Herr Rahimi", "Ich habe drei Jahre im Kundenservice eines Online-Shops gearbeitet. Das hat mir Spaß gemacht, aber ich möchte gern für ein Produkt arbeiten, von dem ich wirklich überzeugt bin. Und ich fahre selbst jeden Tag Rad."],
      ["f", "Frau Engel", "Wie gehen Sie mit unfreundlichen Kunden um?"],
      ["m", "Herr Rahimi", "Ich höre erst einmal zu und versuche zu verstehen, was das eigentliche Problem ist. Meistens beruhigen sich die Leute, wenn sie merken, dass man ihnen helfen will."],
      ["f", "Frau Engel", "Haben Sie noch Fragen an uns?"],
      ["m", "Herr Rahimi", "Ja. Ich wollte fragen, ob man die 30 Stunden auf vier Tage verteilen kann. Und könnten Sie mir sagen, wann ich mit einer Entscheidung rechnen kann?"],
      ["f", "Frau Engel", "Vier Tage sind grundsätzlich möglich. Wir melden uns bis Ende nächster Woche bei Ihnen."]
    ],
    questions: [
      { type: "mc", q: "Wie ist Herr Rahimi zum Gespräch gekommen?", options: ["mit dem Bus", "mit dem Fahrrad", "mit dem Auto"], a: 1 },
      { type: "rf", q: "Herr Rahimi hat noch keine Erfahrung im Kundenservice.", a: false },
      { type: "mc", q: "Was macht er zuerst bei unfreundlichen Kunden?", options: ["Er ruft seinen Chef.", "Er hört zu.", "Er beendet das Gespräch."], a: 1 },
      { type: "rf", q: "Die Firma meldet sich bis Ende nächster Woche.", a: true }
    ]
  },
  writing: {
    task: "Bewerben Sie sich per E-Mail bei Frau Engel auf die Stelle im Kundenservice (circa 80 Wörter).",
    format: "formal",
    minWords: 70,
    points: [
      { t: "Sagen Sie, auf welche Stelle Sie sich bewerben.", re: "bewerbe|stelle|sachbearbeiter|kundenservice" },
      { t: "Beschreiben Sie Ihre Erfahrung.", re: "erfahrung|gearbeitet|jahre|ausbildung" },
      { t: "Erklären Sie, warum Sie zur Firma passen.", re: "passe|weil|interess|begeister|fahrrad|motiviert" },
      { t: "Stellen Sie eine indirekte Frage (… wissen, ob … / … fragen, wann …).", re: "(wissen|fragen|sagen|erklären|mitteilen),? (ob|wann|wie|welche|wo|was)\\b" }
    ],
    model: "Sehr geehrte Frau Engel,\n\nhiermit bewerbe ich mich auf die Stelle als Sachbearbeiter im Kundenservice (Teilzeit). Meinen Lebenslauf und meine Zeugnisse finden Sie im Anhang.\n\nIch habe drei Jahre im Kundenservice eines Online-Shops gearbeitet und dort täglich Anfragen per Telefon, E-Mail und Chat beantwortet. Ich passe gut zu Ihnen, weil ich selbst jeden Tag Fahrrad fahre und Ihre Produkte gern erklären möchte. Auch wenn es stressig wird, bleibe ich ruhig und freundlich.\n\nIch würde gern wissen, ob man die 30 Stunden auch auf vier Tage verteilen kann.\n\nMit freundlichen Grüßen\n[Ihr Name]"
  },
  speaking: {
    intro: "Jetzt sind Sie im Vorstellungsgespräch bei Frau Engel.",
    partner: "Frau Engel",
    voice: "f",
    turns: [
      { say: "Erzählen Sie doch kurz etwas über sich.", goal: "Stellen Sie sich vor: Name, Herkunft, Beruf.", keys: [["ich bin", "ich heiße", "mein name", "komme aus"], ["arbeite", "beruf", "studiert", "ausbildung", "als"]], model: "Gern. Ich heiße Sam Ortiz, komme aus Chile und arbeite seit drei Jahren im Kundenservice." },
      { say: "Was sind Ihre Stärken?", goal: "Nennen Sie eine Stärke und geben Sie ein Beispiel.", keys: [["stärke", "geduldig", "zuverlässig", "freundlich", "organis", "teamfähig", "gut"], ["beispiel", "einmal", "letzte", "als ich"]], model: "Ich bin sehr geduldig. Zum Beispiel habe ich einmal einer Kundin eine Stunde lang am Telefon geholfen, ihre Bestellung zu finden." },
      { say: "Und Ihre Schwächen?", goal: "Nennen Sie eine Schwäche und was Sie dagegen tun.", keys: [["schwäche", "manchmal", "zu "], ["deshalb", "versuche", "lerne", "arbeite daran", "übe"]], model: "Manchmal bin ich zu perfektionistisch. Deshalb versuche ich, mir feste Zeitlimits zu setzen." },
      { say: "Wo sehen Sie sich in fünf Jahren?", goal: "Antworten Sie mit einem realistischen Ziel.", keys: [["möchte", "würde gern", "hoffe", "gern", "ziel"]], model: "In fünf Jahren würde ich gern ein kleines Team im Kundenservice leiten." },
      { say: "Haben Sie noch Fragen an uns?", goal: "Stellen Sie eine indirekte Frage (Ich würde gern wissen, ob/wie …).", keys: [["wissen", "fragen", "sagen"], ["ob", "wann", "wie", "welche", "was"]], model: "Ja, ich würde gern wissen, wie die Einarbeitung genau aussieht." }
    ],
    shadow: [
      "Könnten Sie mir sagen, wann ich mit einer Entscheidung rechnen kann?",
      "Ich wollte fragen, ob man die Stunden auf vier Tage verteilen kann.",
      "Ich möchte für ein Produkt arbeiten, von dem ich überzeugt bin."
    ]
  }
},
{
  id: "umzug",
  title: "Der Umzugstag",
  place: "Nürnberg-Gostenhof",
  color: "#7a4f9a",
  scene: "Endlich ist es so weit: Sie ziehen um. Sie lesen Tipps einer Umzugsfirma, sagen Ihren Helfern, wohin die Möbel kommen, und laden alle zur Einweihungsparty ein.",
  grammar: {
    title: "Wechselpräpositionen: Wo? oder Wohin?",
    ref: "Durrell 5.3 · Swick Kap. 8",
    explain: "<i>an, auf, hinter, in, neben, über, unter, vor, zwischen</i> take the <b>accusative</b> for movement to a place (Wohin? – stellen, legen, hängen) and the <b>dative</b> for a location (Wo? – stehen, liegen, hängen). Type the missing article.",
    items: [
      { q: "Stell den Schrank bitte an ___ Wand.", a: ["die"], hint: "Wohin? die Wand" },
      { q: "Der Werkzeugkasten liegt unter ___ Sitz.", a: ["dem"], hint: "Wo? der Sitz" },
      { q: "Bring die Kiste in ___ Küche.", a: ["die"], hint: "Wohin? die Küche" },
      { q: "Die Lampe hängt über ___ Tisch.", a: ["dem"], hint: "Wo? der Tisch" },
      { q: "Leg den Teppich unter ___ Tisch.", a: ["den"], hint: "Wohin? der Tisch" }
    ]
  },
  reading: {
    kind: "article",
    from: "Ratgeber Wohnen",
    subject: "Umziehen ohne Stress – Tipps vom Profi",
    text: "Wer schon einmal umgezogen ist, weiß: Am Ende steht man zwischen hundert Kartons und findet die Kaffeemaschine nicht. Damit Ihnen das nicht passiert, hat uns Umzugsprofi Kerstin Bauer ein paar Tipps verraten.\n\n„Schreiben Sie auf jeden Karton, in welches Zimmer er kommt“, rät sie. „Dann können die Helfer die Kisten direkt in die richtigen Räume stellen, und sie stehen nicht alle im Flur.“ Schwere Bücher gehören in kleine Kartons, leichte Kissen und Decken in große.\n\nEinen Karton sollte man als Letztes packen: die „Erste-Nacht-Kiste“. In diese Kiste kommen Bettwäsche, Zahnbürste, Ladekabel, Werkzeug und natürlich die Kaffeemaschine. „Stellen Sie diese Kiste nicht in den Lkw, sondern in Ihr eigenes Auto“, sagt Bauer.\n\nAußerdem wichtig: Beantragen Sie rechtzeitig eine [[Halteverbotszone|no-parking zone]] vor dem Haus. Wenn der Umzugswagen in der zweiten Reihe steht, kann das teuer werden. Und vergessen Sie nicht, einen [[Nachsendeauftrag|mail forwarding order]] bei der Post einzurichten, damit Ihre Briefe an die neue Adresse kommen.",
    questions: [
      { type: "rf", q: "Man soll auf jeden Karton schreiben, in welches Zimmer er gehört.", a: true },
      { type: "mc", q: "Was gehört in große Kartons?", options: ["schwere Bücher", "leichte Kissen und Decken", "Geschirr"], a: 1 },
      { type: "mc", q: "Wo soll die „Erste-Nacht-Kiste“ transportiert werden?", options: ["im Lkw", "im eigenen Auto", "bei den Nachbarn"], a: 1 },
      { type: "rf", q: "Mit einem Nachsendeauftrag kommen Briefe an die neue Adresse.", a: true }
    ]
  },
  listening: {
    intro: "Ayşe und ihr Freund Jakob räumen die neue Wohnung ein.",
    lines: [
      ["f", "Ayşe", "So, Jakob, der Schrank kommt ins Schlafzimmer, an die Wand neben dem Fenster."],
      ["m", "Jakob", "Neben das Fenster? Dann geht die Tür nicht mehr richtig auf."],
      ["f", "Ayşe", "Stimmt. Dann stell ihn lieber gegenüber vom Bett, zwischen die beiden Türen."],
      ["m", "Jakob", "Okay. Und die Kiste mit „Küche“? Die steht schon im Bad."],
      ["f", "Ayşe", "Oh nein, wer hat sie denn dahin gestellt? Bring sie bitte in die Küche, auf die Arbeitsplatte."],
      ["m", "Jakob", "Mach ich. Wo ist eigentlich der Werkzeugkasten? Ich will die Lampe aufhängen."],
      ["f", "Ayşe", "Der liegt im Auto, unter dem Beifahrersitz."],
      ["m", "Jakob", "Und die Lampe soll über den Esstisch, oder?"],
      ["f", "Ayşe", "Genau, über den Tisch im Wohnzimmer. Danke dir, ohne dich hätte ich das nie geschafft!"],
      ["m", "Jakob", "Dafür bekomme ich aber eine Pizza."]
    ],
    questions: [
      { type: "mc", q: "Wohin stellt Jakob den Schrank am Ende?", options: ["neben das Fenster", "gegenüber vom Bett, zwischen die Türen", "in den Flur"], a: 1 },
      { type: "mc", q: "Wo steht die Küchenkiste zuerst?", options: ["im Bad", "in der Küche", "im Auto"], a: 0 },
      { type: "mc", q: "Wo liegt der Werkzeugkasten?", options: ["im Keller", "unter dem Beifahrersitz", "auf dem Esstisch"], a: 1 },
      { type: "rf", q: "Die Lampe kommt über den Esstisch.", a: true }
    ]
  },
  writing: {
    task: "Bedanken Sie sich bei Ihren Umzugshelfern und laden Sie sie zur Einweihungsparty ein (circa 80 Wörter).",
    format: "informal",
    minWords: 70,
    points: [
      { t: "Bedanken Sie sich für die Hilfe beim Umzug.", re: "dank" },
      { t: "Laden Sie zur Party ein (Tag und Uhrzeit).", re: "einweihung|party|feier|einladen|lade" },
      { t: "Beschreiben Sie den Weg (z. B. „neben der Bäckerei“, „in den dritten Stock“).", re: "\\b(neben|über|unter|vor|hinter|zwischen|gegenüber)\\b|in den .*stock|im .*stock" },
      { t: "Bitten Sie die Gäste, etwas mitzubringen.", re: "mitbring|bringt|bring" }
    ],
    model: "Hallo ihr Lieben,\n\nnoch einmal tausend Dank für eure Hilfe am Samstag! Ohne euch würden die Kartons immer noch im Flur stehen. Inzwischen hängen sogar die Bilder an der Wand.\n\nDeshalb möchte ich euch zu meiner Einweihungsparty am Freitag, dem 12., ab 19 Uhr einladen. Die Wohnung liegt in der Fürther Straße 22, direkt neben der Bäckerei. Klingelt bei „Yılmaz“ und kommt in den dritten Stock – leider ohne Aufzug.\n\nFür Getränke sorge ich. Wer möchte, kann gern einen Salat oder einen Nachtisch mitbringen.\n\nBis Freitag!\n[Ihr Name]"
  },
  speaking: {
    intro: "Ein Umzugshelfer fragt Sie, wohin die Sachen kommen.",
    partner: "Umzugshelfer",
    voice: "m",
    turns: [
      { say: "Wohin kommt das Sofa?", goal: "Sagen Sie: ins Wohnzimmer, vor das Fenster.", keys: [["wohnzimmer"], ["vor", "neben", "an die", "unter", "zwischen", "gegenüber"]], model: "Das Sofa kommt ins Wohnzimmer, vor das große Fenster." },
      { say: "Und der Teppich?", goal: "Sagen Sie, dass er unter den Esstisch kommt.", keys: [["unter"], ["tisch"]], model: "Den Teppich legen wir bitte unter den Esstisch." },
      { say: "Wo stehen eigentlich die Bücherkisten?", goal: "Sagen Sie, wo sie stehen (Dativ!).", keys: [["im ", "in der", "auf dem", "neben dem", "neben der", "unter dem", "vor dem", "hinter dem", "an der", "flur", "keller"]], model: "Die stehen noch im Flur, neben der Garderobe." },
      { say: "Soll ich das Bild schon aufhängen?", goal: "Ja – an die Wand über dem Sofa.", keys: [["wand"], ["über"]], model: "Ja, gern. Hängen Sie es bitte an die Wand über dem Sofa." },
      { say: "Fertig! Brauchen Sie noch etwas?", goal: "Bedanken Sie sich und bieten Sie etwas zu trinken an.", keys: [["danke", "dank"], ["trinken", "kaffee", "wasser", "bier", "pizza", "essen"]], model: "Nein, das war's. Vielen Dank! Möchten Sie noch etwas trinken?" }
    ],
    shadow: [
      "Stellen Sie den Karton bitte in die Küche.",
      "Der Karton steht schon in der Küche.",
      "Hängen Sie das Bild an die Wand über dem Sofa."
    ]
  }
}
);
