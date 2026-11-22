// Alltag B1 – lessons 1–6.
// Each lesson is one real-life situation. Grammar references point to the two books in the
// course folder: Durrell et al., "Essential German Grammar" (2nd ed.) and Swick, "German Grammar Drills".
// Reading texts mark glossed words as [[Wort|English gloss]].
window.LESSONS = window.LESSONS || [];
window.LESSONS.push(
{
  id: "wohnung",
  title: "Die Wohnungsbesichtigung",
  place: "Leipzig-Gohlis",
  color: "#2f6f9f",
  scene: "Sie sind neu in Leipzig und suchen eine Zweizimmerwohnung. Eine Hausverwaltung hat auf Ihre Anfrage geantwortet. Heute lesen Sie die E-Mail, gehen zur Besichtigung und bewerben sich um die Wohnung.",
  grammar: {
    title: "Relativsätze",
    ref: "Durrell 10.5 · Swick Kap. 23",
    explain: "A relative clause describes a noun: <i>die Wohnung, <b>die</b> ich gesehen habe</i>. The relative pronoun takes gender and number from the noun, but its case from its job inside the clause. The conjugated verb goes to the end.",
    items: [
      { q: "Das ist der Balkon, ___ zum Hof geht.", a: ["der"], hint: "Nominativ, maskulin" },
      { q: "Die Küche, ___ der Vormieter dagelassen hat, ist fast neu.", a: ["die"], hint: "Akkusativ, feminin" },
      { q: "Der Hausmeister, ___ ich den Schlüssel gegeben habe, wohnt im Erdgeschoss.", a: ["dem"], hint: "Dativ, maskulin" },
      { q: "Die Nachbarn, ___ Kinder im Hof spielen, sind sehr nett.", a: ["deren"], hint: "Genitiv, Plural" },
      { q: "Das Haus, in ___ ich wohne, wurde 2019 renoviert.", a: ["dem"], hint: "in + Dativ, neutral" }
    ]
  },
  reading: {
    kind: "email",
    from: "Sabine Albrecht <vermietung@albrecht-hv.de>",
    subject: "Besichtigung Zweizimmerwohnung, Gohliser Straße 14",
    text: "Guten Tag,\n\nvielen Dank für Ihr Interesse an der Wohnung, die wir auf unserer Webseite angeboten haben. Die Wohnung liegt im dritten Stock eines Altbaus, der 2019 renoviert wurde. Sie hat 58 Quadratmeter, einen Balkon zum Hof und eine [[Einbauküche|fitted kitchen]], die der Vormieter dagelassen hat.\n\nDie [[Kaltmiete|rent without utilities]] beträgt 620 Euro, dazu kommen 140 Euro [[Nebenkosten|service charges]]. Die [[Kaution|deposit]] beträgt drei Kaltmieten. Haustiere sind nach Absprache erlaubt, aber in der Wohnung darf nicht geraucht werden.\n\nDie Besichtigung findet am Donnerstag um 17:30 Uhr statt. Bitte bringen Sie eine [[Schufa-Auskunft|credit report]], Ihre letzten drei [[Gehaltsabrechnungen|payslips]] und eine Kopie Ihres Ausweises mit. Wenn Sie den Termin nicht wahrnehmen können, sagen Sie bitte bis Mittwochmittag ab, damit wir ihn an andere Interessenten vergeben können.\n\nDer Eingang ist im Hinterhof; klingeln Sie bitte bei „Hausverwaltung Albrecht“.\n\nMit freundlichen Grüßen\nSabine Albrecht\nHausverwaltung Albrecht & Söhne",
    questions: [
      { type: "rf", q: "Die Wohnung hat eine Küche mit Schränken und Geräten.", a: true },
      { type: "rf", q: "In der Wohnung darf man rauchen, wenn man das Fenster öffnet.", a: false },
      { type: "mc", q: "Wie viel kostet die Wohnung im Monat mit Nebenkosten?", options: ["620 Euro", "760 Euro", "1860 Euro"], a: 1 },
      { type: "mc", q: "Was sollen Sie zur Besichtigung mitbringen?", options: ["den Mietvertrag und die Kaution", "Gehaltsabrechnungen, Schufa-Auskunft und eine Ausweiskopie", "ein Foto und einen Lebenslauf"], a: 1 },
      { type: "rf", q: "Wenn Sie nicht kommen können, sollen Sie bis Mittwochmittag Bescheid sagen.", a: true }
    ]
  },
  listening: {
    intro: "Herr Demir besichtigt die Wohnung mit Frau Albrecht von der Hausverwaltung.",
    lines: [
      ["f", "Frau Albrecht", "So, kommen Sie rein. Das hier ist der Flur, und links ist das Bad, das letztes Jahr neu gefliest wurde."],
      ["m", "Herr Demir", "Oh, das ist ja hell. Hat das Bad ein Fenster?"],
      ["f", "Frau Albrecht", "Ja, ein kleines. Und hier geradeaus ist das Wohnzimmer mit dem Balkon."],
      ["m", "Herr Demir", "Der Balkon geht zum Hof, oder? Ist es dort ruhig?"],
      ["f", "Frau Albrecht", "Sehr ruhig. Nur samstags vormittags spielen die Kinder aus dem Erdgeschoss manchmal Fußball."],
      ["m", "Herr Demir", "Das stört mich nicht. Wie sieht es mit Internet aus? Ich arbeite zwei Tage pro Woche im Homeoffice."],
      ["f", "Frau Albrecht", "Im Haus gibt es Glasfaser. Den Vertrag müssen Sie aber selbst abschließen."],
      ["m", "Herr Demir", "Und die Heizung? Ist die in den Nebenkosten enthalten?"],
      ["f", "Frau Albrecht", "Ja, die Heizung ist dabei, der Strom nicht. Den zahlen Sie direkt an die Stadtwerke."],
      ["m", "Herr Demir", "Ab wann wäre die Wohnung frei?"],
      ["f", "Frau Albrecht", "Ab dem ersten März. Wenn Sie Interesse haben, schicken Sie mir bitte bis Freitag Ihre Unterlagen per E-Mail."],
      ["m", "Herr Demir", "Mache ich. Vielen Dank für die Führung!"]
    ],
    questions: [
      { type: "mc", q: "Wann ist es auf dem Balkon manchmal laut?", options: ["am Sonntagabend", "am Samstagvormittag", "jeden Abend"], a: 1 },
      { type: "rf", q: "Herr Demir arbeitet jeden Tag zu Hause.", a: false },
      { type: "rf", q: "Der Strom ist in den Nebenkosten enthalten.", a: false },
      { type: "mc", q: "Bis wann soll Herr Demir seine Unterlagen schicken?", options: ["bis Mittwoch", "bis Freitag", "bis zum ersten März"], a: 1 }
    ]
  },
  writing: {
    task: "Sie haben die Wohnung besichtigt und möchten sie mieten. Schreiben Sie eine E-Mail an Frau Albrecht (circa 80 Wörter).",
    format: "formal",
    minWords: 70,
    points: [
      { t: "Bedanken Sie sich für die Besichtigung.", re: "dank" },
      { t: "Sagen Sie, warum Ihnen die Wohnung gefällt.", re: "gefällt|gefallen|schön|hell|ruhig|balkon|lage" },
      { t: "Fragen Sie, wann Sie den Mietvertrag unterschreiben können.", re: "vertrag|unterschreib" },
      { t: "Nennen Sie die Unterlagen, die Sie mitschicken.", re: "anhang|anbei|unterlagen|gehalts|schufa|ausweis" }
    ],
    model: "Sehr geehrte Frau Albrecht,\n\nvielen Dank für die freundliche Besichtigung am Donnerstag. Die Wohnung, die Sie mir gezeigt haben, gefällt mir sehr gut. Besonders der Balkon, der zum ruhigen Hof geht, ist ideal für mich. Auch die Lage ist perfekt, weil ich mit der Straßenbahn schnell bei meiner Arbeit bin.\n\nIm Anhang finden Sie meine Schufa-Auskunft, meine letzten drei Gehaltsabrechnungen und eine Kopie meines Ausweises. Könnten Sie mir bitte mitteilen, wann ich den Mietvertrag unterschreiben kann?\n\nMit freundlichen Grüßen\n[Ihr Name]"
  },
  speaking: {
    intro: "Sie rufen bei der Hausverwaltung an, weil Sie die Anzeige gesehen haben.",
    partner: "Frau Albrecht",
    voice: "f",
    turns: [
      { say: "Hausverwaltung Albrecht, guten Tag. Was kann ich für Sie tun?", goal: "Stellen Sie sich vor und sagen Sie, warum Sie anrufen.", keys: [["name", "heiße", "ich bin"], ["wohnung", "anzeige", "gohliser"]], model: "Guten Tag, mein Name ist Alex Becker. Ich rufe wegen der Wohnung in der Gohliser Straße an." },
      { say: "Ah ja, die Zweizimmerwohnung. Was möchten Sie denn wissen?", goal: "Fragen Sie, ob Sie Ihre Katze mitbringen dürfen.", keys: [["katze", "haustier", "tier"], ["darf", "erlaubt", "kann", "möglich"]], model: "Ich habe eine Katze. Darf ich sie in die Wohnung mitbringen?" },
      { say: "Nach Absprache ist das möglich. Eine Katze ist kein Problem.", goal: "Fragen Sie nach einem Besichtigungstermin.", keys: [["besichtig", "anschauen", "ansehen", "termin", "sehen"]], model: "Super. Wann könnte ich mir die Wohnung ansehen?" },
      { say: "Am Donnerstag um halb sechs. Passt Ihnen das?", goal: "Sagen Sie, dass Sie am Donnerstag nicht können, und schlagen Sie einen anderen Tag vor.", keys: [["leider", "kann nicht", "geht nicht", "nicht kommen", "passt nicht"], ["montag", "dienstag", "mittwoch", "freitag", "samstag", "uhr", "vielleicht", "stattdessen"]], model: "Am Donnerstag kann ich leider nicht, da arbeite ich bis 19 Uhr. Ginge es vielleicht am Freitagnachmittag?" },
      { say: "Freitag um 16 Uhr ginge auch. Bringen Sie bitte Ihre Unterlagen mit.", goal: "Bestätigen Sie den Termin und verabschieden Sie sich.", keys: [["gerne", "gut", "passt", "perfekt", "einverstanden", "okay", "prima"], ["wiederhören", "tschüss", "wiedersehen", "bis freitag"]], model: "Freitag um 16 Uhr passt mir gut. Vielen Dank, auf Wiederhören!" }
    ],
    shadow: [
      "Die Wohnung, die Sie mir gezeigt haben, gefällt mir sehr gut.",
      "Ab wann wäre die Wohnung frei?",
      "Ist die Heizung in den Nebenkosten enthalten?"
    ]
  }
},
{
  id: "arzt",
  title: "Beim Hausarzt",
  place: "Köln-Ehrenfeld",
  color: "#2a8a80",
  scene: "Sie haben seit Tagen Fieber und Halsschmerzen. Sie lesen die Informationen Ihrer Hausarztpraxis, rufen dort an, sprechen mit der Ärztin und melden sich bei der Arbeit krank.",
  grammar: {
    title: "Modalverben",
    ref: "Durrell 7.13–7.19 · Swick Kap. 21",
    explain: "Modal verbs stand in position 2; the main verb goes to the end as an infinitive. <b>dürfen</b> = be allowed, <b>müssen</b> = have to, <b>sollen</b> = someone expects it of you. Careful: <i>nicht müssen</i> = don't need to, <i>nicht dürfen</i> = must not.",
    items: [
      { q: "Mit akuten Beschwerden ___ Sie ohne Termin kommen.", a: ["dürfen"], hint: "dürfen" },
      { q: "Ich ___ heute leider nicht arbeiten, ich habe Fieber.", a: ["kann"], hint: "können" },
      { q: "Die Ärztin sagt, ich ___ viel trinken.", a: ["soll"], hint: "sollen" },
      { q: "Für ein Folgerezept ___ Sie nicht in die Praxis kommen.", a: ["müssen"], hint: "müssen" },
      { q: "Im Wartezimmer ___ man nicht telefonieren.", a: ["darf"], hint: "dürfen" }
    ]
  },
  reading: {
    kind: "notice",
    from: "Aushang an der Praxistür",
    subject: "Neue Sprechzeiten ab 1. Dezember",
    text: "Liebe Patientinnen und Patienten,\n\nab dem 1. Dezember ändern sich unsere Sprechzeiten. Montags, dienstags und donnerstags sind wir von 8 bis 12 und von 15 bis 18 Uhr für Sie da, mittwochs und freitags nur vormittags.\n\nTermine können Sie ab sofort auch online über unsere Webseite buchen. Wer akute Beschwerden hat, darf ohne Termin in die [[offene Sprechstunde|walk-in hours]] kommen, die täglich von 8 bis 9:30 Uhr stattfindet. Bitte rechnen Sie dann mit längeren Wartezeiten.\n\nBringen Sie zu jedem Besuch Ihre [[Versichertenkarte|health insurance card]] mit. Wenn Sie ein [[Rezept|prescription]] für ein Medikament brauchen, das Sie regelmäßig nehmen, müssen Sie nicht in die Praxis kommen: Rufen Sie einfach unsere Rezepthotline an, dann können Sie das Rezept am nächsten Werktag abholen.\n\nEine [[Krankschreibung|sick note]] dürfen wir auch telefonisch ausstellen, wenn wir Sie bereits kennen und Sie nur leichte Symptome haben.\n\nWer einen Termin nicht wahrnehmen kann, soll bitte mindestens 24 Stunden vorher absagen. So können andere Patienten den Termin bekommen.\n\nIhr Praxisteam Dr. Yilmaz & Dr. Berger",
    questions: [
      { type: "rf", q: "Mittwochnachmittags ist die Praxis geschlossen.", a: true },
      { type: "mc", q: "Wer darf ohne Termin kommen?", options: ["alle Patienten, den ganzen Tag", "Patienten mit akuten Beschwerden zwischen 8 und 9:30 Uhr", "nur neue Patienten"], a: 1 },
      { type: "rf", q: "Für ein Folgerezept muss man immer persönlich in die Praxis kommen.", a: false },
      { type: "mc", q: "Wann bekommt man eine telefonische Krankschreibung?", options: ["wenn man neu in der Praxis ist", "wenn die Praxis einen kennt und die Symptome leicht sind", "nie"], a: 1 },
      { type: "rf", q: "Man soll Termine spätestens einen Tag vorher absagen.", a: true }
    ]
  },
  listening: {
    intro: "Herr Okafor ruft morgens in der Praxis an.",
    lines: [
      ["f", "Frau Kunz", "Praxis Dr. Yilmaz, Kunz am Apparat, guten Morgen."],
      ["m", "Herr Okafor", "Guten Morgen, Okafor hier. Ich habe seit drei Tagen starke Halsschmerzen und Fieber. Kann ich heute noch vorbeikommen?"],
      ["f", "Frau Kunz", "Wie hoch ist das Fieber denn?"],
      ["m", "Herr Okafor", "Heute Morgen waren es 38,5 Grad."],
      ["f", "Frau Kunz", "Waren Sie schon einmal bei uns in der Praxis?"],
      ["m", "Herr Okafor", "Ja, im Frühjahr, wegen meines Rückens."],
      ["f", "Frau Kunz", "Gut. Sie können heute um 11:15 Uhr kommen. Bitte tragen Sie im Wartezimmer eine Maske."],
      ["m", "Herr Okafor", "Mache ich. Ich bräuchte außerdem eine Krankschreibung für meinen Arbeitgeber."],
      ["f", "Frau Kunz", "Das bespricht die Ärztin direkt mit Ihnen. Brauchen Sie sonst noch etwas?"],
      ["m", "Herr Okafor", "Ja, mein Blutdruckmittel ist fast leer. Kann ich das Rezept gleich mitnehmen?"],
      ["f", "Frau Kunz", "Ich lege es Ihnen an die Anmeldung. Vergessen Sie Ihre Versichertenkarte nicht!"],
      ["m", "Herr Okafor", "Danke, bis später."]
    ],
    questions: [
      { type: "mc", q: "Welche Beschwerden hat Herr Okafor?", options: ["Rückenschmerzen", "Halsschmerzen und Fieber", "Kopfschmerzen"], a: 1 },
      { type: "mc", q: "Um wie viel Uhr ist sein Termin?", options: ["10:15 Uhr", "11:15 Uhr", "11:50 Uhr"], a: 1 },
      { type: "rf", q: "Herr Okafor war noch nie in dieser Praxis.", a: false },
      { type: "rf", q: "Er bekommt heute auch ein Rezept für sein Blutdruckmittel.", a: true }
    ]
  },
  writing: {
    task: "Sie sind krank und können nicht zu einer wichtigen Teambesprechung kommen. Schreiben Sie Ihrer Chefin, Frau Hartmann, eine E-Mail (circa 80 Wörter).",
    format: "formal",
    minWords: 70,
    points: [
      { t: "Entschuldigen Sie sich und erklären Sie, warum Sie nicht kommen können.", re: "krank|fieber|arzt|ärztin|leider|entschuldig" },
      { t: "Sagen Sie, wie lange Sie voraussichtlich fehlen.", re: "bis |tage|woche|voraussichtlich|freitag|montag|morgen" },
      { t: "Schlagen Sie vor, wer Ihre Aufgaben übernehmen kann.", re: "kollegin|kollege|übernehm|vertret" },
      { t: "Sagen Sie, was Sie von zu Hause aus erledigen können.", re: "e-mail|mail|erreichbar|zu hause|telefon|schicke" }
    ],
    model: "Sehr geehrte Frau Hartmann,\n\nleider muss ich mich heute krankmelden. Ich habe seit gestern hohes Fieber und war heute Morgen bei der Ärztin. Sie hat mich bis einschließlich Freitag krankgeschrieben, deshalb kann ich nicht an der Teambesprechung am Donnerstag teilnehmen.\n\nMeine Kollegin Frau Lehmann kennt das Projekt gut und könnte die Präsentation übernehmen. Ich schicke ihr heute noch die Folien. Für kurze Fragen bin ich per E-Mail erreichbar.\n\nDie Krankschreibung reiche ich so bald wie möglich nach.\n\nMit freundlichen Grüßen\n[Ihr Name]"
  },
  speaking: {
    intro: "Sie sitzen im Sprechzimmer bei Dr. Berger.",
    partner: "Dr. Berger",
    voice: "f",
    turns: [
      { say: "Guten Tag, nehmen Sie Platz. Was führt Sie zu mir?", goal: "Beschreiben Sie Ihre Beschwerden.", keys: [["schmerz", "weh", "fieber", "husten", "übel", "müde", "schnupfen"]], model: "Ich habe seit zwei Tagen Kopfschmerzen und mir ist ein bisschen übel." },
      { say: "Seit wann haben Sie die Beschwerden genau?", goal: "Sagen Sie, seit wann.", keys: [["seit", "gestern", "tag", "woche", "montag", "dienstag", "wochenende"]], model: "Seit Montagabend. Gestern ist es schlimmer geworden." },
      { say: "Nehmen Sie schon Medikamente?", goal: "Antworten Sie: Ja (welche?) oder nein.", keys: [["ja", "nein", "tablette", "ibuprofen", "paracetamol", "nichts", "keine"]], model: "Ich habe gestern eine Ibuprofen genommen, aber sie hat nicht viel geholfen." },
      { say: "Gut. Sie sollten zwei, drei Tage zu Hause bleiben und viel trinken.", goal: "Fragen Sie, ob Sie eine Krankschreibung bekommen.", keys: [["krankschreib", "attest", "bescheinigung", "arbeitgeber"]], model: "Könnten Sie mich bitte krankschreiben? Ich muss das meinem Arbeitgeber schicken." },
      { say: "Natürlich, bis Freitag. Haben Sie noch Fragen?", goal: "Fragen Sie, ob Sie Sport machen dürfen, und bedanken Sie sich.", keys: [["sport", "training", "joggen", "fitness", "schwimmen"], ["danke", "dank"]], model: "Darf ich diese Woche Sport machen? Und vielen Dank für Ihre Hilfe." }
    ],
    shadow: [
      "Ich hätte gern einen Termin, so früh wie möglich.",
      "Muss ich das Medikament vor oder nach dem Essen nehmen?",
      "Könnten Sie mich bitte bis Freitag krankschreiben?"
    ]
  }
},
{
  id: "amt",
  title: "Anmeldung im Bürgeramt",
  place: "Hamburg-Altona",
  color: "#7a4f9a",
  scene: "Sie sind nach Hamburg gezogen und müssen sich innerhalb von zwei Wochen anmelden. Sie informieren sich, gehen zum Termin und merken später, dass auf der Bescheinigung ein Fehler ist.",
  grammar: {
    title: "Das Passiv",
    ref: "Durrell 6.8, 7.4–7.9 · Swick Kap. 25",
    explain: "The passive (<b>werden + Partizip II</b>) puts the action in focus, not the person: <i>Der Termin <b>wird</b> online <b>vergeben</b>.</i> Past: <i>wurde vergeben</i>. With a modal verb: <i>Die Anmeldung kann nicht bearbeitet werden.</i> The person doing it, if mentioned, comes with <i>von</i> + Dativ.",
    items: [
      { q: "Die Bestätigung ___ vom Vermieter unterschrieben.", a: ["wird"], hint: "Präsens" },
      { q: "Die Steuer-ID ___ Ihnen per Post zugeschickt.", a: ["wird"], hint: "Präsens" },
      { q: "Mein Name ___ falsch geschrieben.", a: ["wurde"], hint: "Präteritum" },
      { q: "Termine können online ___ werden.", a: ["gebucht"], hint: "buchen" },
      { q: "Die Formulare ___ am Schalter abgegeben.", a: ["werden"], hint: "Präsens, Plural" }
    ]
  },
  reading: {
    kind: "article",
    from: "Ratgeber „Neu in der Stadt“",
    subject: "Wohnsitz anmelden – so geht's",
    text: "Wer in Deutschland umzieht, muss sich innerhalb von zwei Wochen bei der Meldebehörde anmelden. In Hamburg wird das in den [[Kundenzentren|citizen service centres]] der Bezirksämter erledigt. Termine werden online vergeben; ohne Termin werden Sie leider nur in Notfällen bedient.\n\nFür die Anmeldung werden zwei Dokumente benötigt: ein gültiger Personalausweis oder Reisepass und die [[Wohnungsgeberbestätigung|landlord's confirmation of move-in]]. Diese Bestätigung wird vom Vermieter ausgefüllt und unterschrieben. Ohne sie kann die Anmeldung nicht bearbeitet werden.\n\nNach der Anmeldung wird Ihnen eine [[Meldebescheinigung|registration certificate]] ausgehändigt. Bewahren Sie sie gut auf, denn sie wird oft gebraucht, zum Beispiel für ein Bankkonto, den Arbeitgeber oder die Krankenkasse. Ihre [[Steuer-ID|tax ID]] wird Ihnen einige Wochen später per Post zugeschickt, wenn Sie zum ersten Mal in Deutschland gemeldet sind.\n\nDie Anmeldung ist kostenlos. Wer sich zu spät anmeldet, kann allerdings ein [[Bußgeld|fine]] bekommen.",
    questions: [
      { type: "mc", q: "Wie viel Zeit hat man für die Anmeldung?", options: ["zwei Tage", "zwei Wochen", "zwei Monate"], a: 1 },
      { type: "rf", q: "Ohne Termin wird man im Kundenzentrum normalerweise nicht bedient.", a: true },
      { type: "mc", q: "Wer füllt die Wohnungsgeberbestätigung aus?", options: ["der neue Mieter", "das Bezirksamt", "der Vermieter"], a: 2 },
      { type: "rf", q: "Die Steuer-ID bekommt man sofort im Kundenzentrum.", a: false },
      { type: "rf", q: "Die Anmeldung kostet 15 Euro.", a: false }
    ]
  },
  listening: {
    intro: "Frau Rossi ist im Kundenzentrum am Schalter von Herrn Wolff.",
    lines: [
      ["m", "Herr Wolff", "Guten Tag. Sie haben die Wartenummer 214? Bitte setzen Sie sich."],
      ["f", "Frau Rossi", "Ja, genau. Ich möchte mich anmelden. Ich bin letzte Woche nach Altona gezogen."],
      ["m", "Herr Wolff", "Dann brauche ich Ihren Pass und die Wohnungsgeberbestätigung."],
      ["f", "Frau Rossi", "Hier ist mein Pass. Und das ist die Bestätigung, die hat meine Vermieterin gestern unterschrieben."],
      ["m", "Herr Wolff", "Danke. Sind Sie zum ersten Mal in Deutschland gemeldet?"],
      ["f", "Frau Rossi", "Nein, ich habe vorher zwei Jahre in München gewohnt."],
      ["m", "Herr Wolff", "Dann wird Ihre alte Adresse automatisch abgemeldet. Wohnen noch weitere Personen mit Ihnen in der Wohnung?"],
      ["f", "Frau Rossi", "Ja, mein Mann. Aber er hat heute keinen Urlaub bekommen. Kann ich ihn mit anmelden?"],
      ["m", "Herr Wolff", "Das geht nur mit einer Vollmacht und seinem Ausweis. Sonst muss er selbst einen Termin buchen."],
      ["f", "Frau Rossi", "Ach so. Dann bucht er einen eigenen Termin."],
      ["m", "Herr Wolff", "Gut. Hier ist Ihre Meldebescheinigung. Bitte prüfen Sie, ob alles richtig geschrieben ist."],
      ["f", "Frau Rossi", "Ja, alles korrekt. Vielen Dank!"]
    ],
    questions: [
      { type: "rf", q: "Frau Rossi ist vor einem Monat umgezogen.", a: false },
      { type: "mc", q: "Wo hat Frau Rossi vorher gewohnt?", options: ["in Hamburg", "in München", "in Italien"], a: 1 },
      { type: "mc", q: "Warum kann ihr Mann heute nicht mit angemeldet werden?", options: ["Er hat keinen Pass.", "Sie hat keine Vollmacht und seinen Ausweis nicht dabei.", "Er wohnt nicht in der Wohnung."], a: 1 },
      { type: "rf", q: "Ihre alte Adresse muss sie selbst in München abmelden.", a: false }
    ]
  },
  writing: {
    task: "Zu Hause sehen Sie: Ihr Name ist auf der Meldebescheinigung falsch geschrieben. Schreiben Sie dem Kundenzentrum eine E-Mail (circa 80 Wörter).",
    format: "formal",
    minWords: 70,
    points: [
      { t: "Sagen Sie, wann Sie sich angemeldet haben.", re: "angemeldet|anmeldung|termin" },
      { t: "Erklären Sie den Fehler.", re: "fehler|falsch|statt|geschrieben" },
      { t: "Bitten Sie darum, dass der Fehler korrigiert wird.", re: "korrigier|änder|berichtig|neue bescheinigung" },
      { t: "Fragen Sie, ob Sie noch einmal persönlich kommen müssen.", re: "persönlich|vorbeikommen|noch einmal kommen|post" }
    ],
    model: "Sehr geehrte Damen und Herren,\n\nam 14. November habe ich mich in Ihrem Kundenzentrum in Altona angemeldet. Leider habe ich erst zu Hause gesehen, dass mein Nachname auf der Meldebescheinigung falsch geschrieben wurde: Statt „Rossi“ steht dort „Rosi“.\n\nDa ich die Bescheinigung für meine Bank und meinen Arbeitgeber brauche, bitte ich Sie, den Fehler zu korrigieren. Können Sie mir eine neue Bescheinigung per Post schicken, oder muss ich noch einmal persönlich vorbeikommen? Eine Kopie meines Passes finden Sie im Anhang.\n\nMit freundlichen Grüßen\nGiulia Rossi"
  },
  speaking: {
    intro: "Sie rufen beim Bürgertelefon an, weil Sie online keinen Termin gefunden haben.",
    partner: "Herr Schulz",
    voice: "m",
    turns: [
      { say: "Behördennummer 115, mein Name ist Schulz. Wie kann ich Ihnen helfen?", goal: "Sagen Sie, dass Sie umgezogen sind und sich anmelden möchten.", keys: [["umgezogen", "umzug", "gezogen", "neue wohnung"], ["anmelden", "anmeldung"]], model: "Guten Tag, ich bin letzte Woche umgezogen und möchte mich anmelden." },
      { say: "Haben Sie schon einen Termin gebucht?", goal: "Sagen Sie, dass online kein Termin frei war.", keys: [["kein", "nicht"], ["termin", "online", "internet", "frei"]], model: "Nein, online war leider kein Termin mehr frei." },
      { say: "Neue Termine werden jeden Morgen um sieben Uhr freigeschaltet.", goal: "Fragen Sie, welche Dokumente Sie mitbringen müssen.", keys: [["dokument", "unterlagen", "mitbringen", "brauche", "papiere"]], model: "Okay, danke. Welche Dokumente muss ich mitbringen?" },
      { say: "Ihren Ausweis und die Wohnungsgeberbestätigung.", goal: "Fragen Sie, was eine Wohnungsgeberbestätigung ist.", keys: [["was ist", "was bedeutet", "erklären", "wohnungsgeber", "verstehe"]], model: "Entschuldigung, was ist eine Wohnungsgeberbestätigung genau?" },
      { say: "Das ist ein Formular, das Ihr Vermieter ausfüllt und unterschreibt.", goal: "Bedanken Sie sich und sagen Sie, was Sie jetzt tun.", keys: [["danke", "dank"], ["vermieter", "termin", "morgen", "buche", "frage"]], model: "Vielen Dank! Dann frage ich meinen Vermieter und buche morgen früh einen Termin." }
    ],
    shadow: [
      "Ich möchte meinen Wohnsitz anmelden.",
      "Welche Unterlagen werden benötigt?",
      "Wird mir die Steuer-ID per Post geschickt?"
    ]
  }
},
{
  id: "buero",
  title: "Neues Büro, neue Regeln",
  place: "Frankfurt am Main",
  color: "#c0533a",
  scene: "Ihre Firma zieht um, und im neuen Büro gibt es keine festen Schreibtische mehr. Sie lesen die Mail Ihres Teamleiters, hören ein Gespräch in der Kaffeeküche und planen mit einer Kollegin eine Abschiedsfeier.",
  grammar: {
    title: "weil, obwohl, deshalb, trotzdem",
    ref: "Durrell 10.2, 10.4 · Swick Kap. 22",
    explain: "<b>weil</b> (because) and <b>obwohl</b> (although) start a subordinate clause: the verb goes to the end. <b>deshalb</b> (that's why) and <b>trotzdem</b> (still) are adverbs: they stand in position 1 and the verb comes right after. <b>denn</b> (because) keeps normal word order.",
    items: [
      { q: "Ich arbeite gern im Büro, ___ ich dort meine Kollegen sehe.", a: ["weil"], hint: "Grund, Verb am Ende" },
      { q: "___ das Büro neu ist, ist es sehr laut.", a: ["obwohl"], hint: "Gegensatz, Verb am Ende" },
      { q: "Der Zug hatte Verspätung, ___ bin ich zu spät gekommen.", a: ["deshalb"], hint: "Folge, Verb direkt danach" },
      { q: "Ich war erkältet. ___ habe ich die Präsentation gehalten.", a: ["trotzdem"], hint: "Gegensatz, Verb direkt danach" },
      { q: "Tobias mag das Homeoffice, ___ er wohnt weit weg.", a: ["denn"], hint: "Grund, normale Wortstellung" }
    ]
  },
  reading: {
    kind: "email",
    from: "Jonas Keller <j.keller@firma.de>",
    subject: "Umzug ins neue Büro – eure Wünsche",
    text: "Liebes Team,\n\nwie ihr wisst, ziehen wir im Januar in das neue Büro in der Hanauer Landstraße. Weil dort weniger Schreibtische zur Verfügung stehen, führen wir ab Februar [[Desksharing|shared desks]] ein. Jeder darf dann bis zu drei Tage pro Woche im Homeoffice arbeiten. Dienstags sollen aber alle im Büro sein, denn an diesem Tag findet unser Teammeeting statt.\n\nObwohl viele von euch gern flexibel arbeiten, haben einige [[Bedenken|concerns]] geäußert. Deshalb möchte ich eure Wünsche vorher sammeln. Bitte tragt bis zum 15. Dezember in die Tabelle ein, an welchen Tagen ihr lieber ins Büro kommt.\n\nWer zu Hause keinen geeigneten Arbeitsplatz hat, kann natürlich weiterhin jeden Tag ins Büro kommen. Für das Homeoffice bekommt jeder einen Laptop und, wenn nötig, einen zweiten Bildschirm. Die Kosten für einen Bürostuhl [[übernimmt|covers]] die Firma bis 200 Euro.\n\nFalls ihr Fragen habt, sprecht mich gern an – am besten nach dem Meeting am Dienstag.\n\nViele Grüße\nJonas",
    questions: [
      { type: "rf", q: "Im neuen Büro hat jeder einen festen Schreibtisch.", a: false },
      { type: "mc", q: "Warum sollen dienstags alle im Büro sein?", options: ["Dann wird das Büro geputzt.", "Dann gibt es das Teammeeting.", "Dann ist das Internet zu Hause langsam."], a: 1 },
      { type: "rf", q: "Man muss mindestens drei Tage zu Hause arbeiten.", a: false },
      { type: "mc", q: "Was bezahlt die Firma?", options: ["einen Schreibtisch für zu Hause", "einen Bürostuhl bis 200 Euro", "die Internetkosten"], a: 1 },
      { type: "rf", q: "Alle sollen ihre Wünsche bis Mitte Dezember eintragen.", a: true }
    ]
  },
  listening: {
    intro: "Mira und Tobias unterhalten sich in der Kaffeeküche über die Mail.",
    lines: [
      ["f", "Mira", "Hast du die Mail von Jonas gelesen? Ich finde Desksharing ehrlich gesagt nicht so toll."],
      ["m", "Tobias", "Warum nicht? Du wolltest doch mehr Homeoffice."],
      ["f", "Mira", "Schon, aber ich habe zu Hause nur einen kleinen Küchentisch. Obwohl ich gern zu Hause arbeite, kann ich dort nicht gut telefonieren, weil meine Kinder mittags aus der Schule kommen."],
      ["m", "Tobias", "Das verstehe ich. Bei mir ist es umgekehrt: Ich wohne in Darmstadt und brauche jeden Tag fast eine Stunde mit dem Zug. Deshalb freue ich mich über jeden Tag zu Hause."],
      ["f", "Mira", "Dann tragen wir uns einfach für unterschiedliche Tage ein. Ich nehme Montag, Dienstag und Donnerstag im Büro."],
      ["m", "Tobias", "Und ich komme nur dienstags. Dann kannst du an den anderen Tagen meinen Platz am Fenster haben."],
      ["f", "Mira", "Echt? Das wäre super. Aber sag mal, gibt es im neuen Büro überhaupt eine richtige Küche?"],
      ["m", "Tobias", "Ja, sogar mit einer Kaffeemaschine für richtigen Espresso. Das hat Jonas mir gestern erzählt."],
      ["f", "Mira", "Na, wenigstens etwas Gutes!"]
    ],
    questions: [
      { type: "mc", q: "Warum telefoniert Mira zu Hause nicht gern?", options: ["Ihr Internet ist schlecht.", "Ihre Kinder kommen mittags nach Hause.", "Ihre Nachbarn sind laut."], a: 1 },
      { type: "rf", q: "Tobias braucht jeden Tag fast eine Stunde mit dem Zug ins Büro.", a: true },
      { type: "mc", q: "An welchen Tagen will Mira im Büro arbeiten?", options: ["Montag, Dienstag und Donnerstag", "nur Dienstag", "Montag bis Freitag"], a: 0 },
      { type: "rf", q: "Im neuen Büro gibt es keine Küche.", a: false }
    ]
  },
  writing: {
    task: "Antworten Sie Jonas. Schreiben Sie, an welchen Tagen Sie ins Büro kommen möchten und warum (circa 80 Wörter).",
    format: "informal",
    minWords: 70,
    points: [
      { t: "Sagen Sie, an welchen Tagen Sie ins Büro kommen.", re: "montag|dienstag|mittwoch|donnerstag|freitag" },
      { t: "Begründen Sie Ihre Wahl (weil, denn, deshalb).", re: "weil|denn|deshalb|\\bda\\b" },
      { t: "Äußern Sie eine Sorge oder einen Wunsch zum neuen Büro.", re: "obwohl|sorge|wünsch|hoffe|wäre|ruhig|laut" },
      { t: "Stellen Sie eine Frage zum Bürostuhl oder Bildschirm.", re: "stuhl|bildschirm|monitor|laptop" }
    ],
    model: "Hallo Jonas,\n\ndanke für die Infos zum Umzug! Ich würde gern montags, dienstags und donnerstags ins Büro kommen, weil ich dort besser mit unseren Kunden telefonieren kann. Mittwochs und freitags arbeite ich lieber zu Hause, denn an diesen Tagen habe ich kaum Termine.\n\nObwohl ich Desksharing grundsätzlich gut finde, mache ich mir ein bisschen Sorgen wegen der Lautstärke. Gibt es im neuen Büro ein paar ruhige Räume für Telefonate?\n\nNoch eine Frage: Muss ich den Bürostuhl selbst kaufen und dann die Rechnung einreichen?\n\nViele Grüße\n[Ihr Name]"
  },
  speaking: {
    intro: "Ihre Kollegin Mira möchte mit Ihnen etwas planen. Machen Sie Vorschläge und reagieren Sie auf ihre Ideen.",
    partner: "Mira",
    voice: "f",
    turns: [
      { say: "Du, Frau Weber geht Ende des Monats in Rente. Sollen wir eine kleine Abschiedsfeier organisieren?", goal: "Stimmen Sie zu und schlagen Sie einen Tag vor.", keys: [["ja", "gute idee", "gern", "klar", "unbedingt"], ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "woche"]], model: "Ja, gute Idee! Wie wäre es mit Donnerstag nach dem Mittagessen?" },
      { say: "Donnerstag ist gut. Wo sollen wir feiern – im Büro oder in einem Restaurant?", goal: "Sagen Sie Ihre Meinung und begründen Sie sie.", keys: [["weil", "denn", "deshalb", "da "]], model: "Ich finde das Büro besser, weil dann alle kommen können, auch die Kollegen im Homeoffice per Video." },
      { say: "Okay. Und was schenken wir ihr? Sie gärtnert doch so gern.", goal: "Machen Sie einen Vorschlag für ein Geschenk.", keys: [["schenken", "geschenk", "gutschein", "pflanze", "blumen", "buch", "wie wäre", "könnten"]], model: "Wir könnten ihr einen Gutschein für eine Gärtnerei schenken." },
      { say: "Schöne Idee. Wer sammelt das Geld?", goal: "Bieten Sie an, das Geld zu sammeln.", keys: [["ich"], ["kann", "übernehm", "mache", "sammle"]], model: "Das kann ich übernehmen. Ich schicke heute noch eine Mail an alle." },
      { say: "Super. Dann kümmere ich mich um den Kuchen.", goal: "Fassen Sie den Plan kurz zusammen.", keys: [["donnerstag"], ["gutschein", "geschenk", "kuchen", "geld"]], model: "Perfekt. Also: Donnerstag im Büro, ich sammle das Geld für den Gutschein und du bringst den Kuchen mit." }
    ],
    shadow: [
      "Obwohl ich gern zu Hause arbeite, komme ich dienstags ins Büro.",
      "Ich wohne weit weg, deshalb arbeite ich lieber im Homeoffice.",
      "Wie wäre es, wenn wir am Donnerstag feiern?"
    ]
  }
},
{
  id: "reklamation",
  title: "Die kaputte Kaffeemaschine",
  place: "Stuttgart-Mitte",
  color: "#8a6a3f",
  scene: "Ein Gerät, das Sie vor kurzem gekauft haben, ist kaputt, und ein Online-Shop hat Ihnen die falsche Jacke geschickt. Heute lernen Sie, wie man höflich, aber bestimmt reklamiert.",
  grammar: {
    title: "Konjunktiv II – höflich bitten",
    ref: "Durrell 6.9, 7.10–7.11 · Swick Kap. 26",
    explain: "For polite requests use Konjunktiv II: <i>Könnten Sie …? Ich hätte gern … Wäre es möglich …? Ich würde gern …</i>. Forms: haben → <b>hätte</b>, sein → <b>wäre</b>, können → <b>könnte</b>, werden → <b>würde</b> (+ infinitive for most other verbs), sollen → <b>sollte</b> (advice).",
    items: [
      { q: "___ Sie mir bitte helfen?", a: ["könnten"], hint: "können" },
      { q: "Ich ___ gern eine neue Maschine.", a: ["hätte"], hint: "haben" },
      { q: "___ es möglich, das Gerät direkt umzutauschen?", a: ["wäre"], hint: "sein" },
      { q: "Ich ___ das gern mit Ihrer Chefin besprechen.", a: ["würde"], hint: "werden" },
      { q: "Du ___ den Kassenbon immer aufheben.", a: ["solltest"], hint: "sollen – ein Rat" }
    ]
  },
  reading: {
    kind: "article",
    from: "Kundenservice-Seite eines Elektromarkts",
    subject: "Umtausch und Reklamation",
    text: "Sie sind mit Ihrem Einkauf nicht zufrieden? Kein Problem – hier erfahren Sie, was Sie tun können.\n\nUngeöffnete Artikel können Sie innerhalb von 30 Tagen mit [[Kassenbon|receipt]] in jeder Filiale umtauschen. Bei Artikeln, die Sie online bestellt haben, haben Sie außerdem ein gesetzliches [[Widerrufsrecht|right of withdrawal]] von 14 Tagen.\n\nWenn ein Gerät defekt ist, haben Sie zwei Jahre [[Gewährleistung|statutory warranty]]. In den ersten zwölf Monaten müssen Sie nicht beweisen, dass der Fehler schon beim Kauf da war. Wir reparieren das Gerät, oder Sie bekommen ein neues. Erst wenn die Reparatur zweimal nicht klappt, können Sie Ihr Geld zurückverlangen.\n\nBitte beachten Sie: Schäden, die durch falsche Benutzung entstanden sind – zum Beispiel bei einem Handy, das ins Wasser gefallen ist –, fallen nicht unter die Gewährleistung.\n\nFür eine schnelle Bearbeitung bringen Sie bitte das Gerät mit allem [[Zubehör|accessories]] und den Kassenbon mit. Ein Foto des Kassenbons auf dem Handy reicht auch.",
    questions: [
      { type: "mc", q: "Wie lange kann man ungeöffnete Artikel im Geschäft umtauschen?", options: ["14 Tage", "30 Tage", "zwei Jahre"], a: 1 },
      { type: "rf", q: "Bei einem defekten Gerät bekommt man sofort sein Geld zurück.", a: false },
      { type: "rf", q: "Ein Handy, das ins Wasser gefallen ist, wird nicht kostenlos repariert.", a: true },
      { type: "mc", q: "Was muss man zur Reklamation mitbringen?", options: ["nur das Gerät", "das Gerät mit Zubehör und den Kassenbon (auch als Foto)", "den Personalausweis"], a: 1 }
    ]
  },
  listening: {
    intro: "Frau Nguyen bringt ihre Kaffeemaschine zum Kundenservice.",
    lines: [
      ["m", "Herr Brandt", "Hallo, was kann ich für Sie tun?"],
      ["f", "Frau Nguyen", "Guten Tag. Ich habe vor drei Wochen diese Kaffeemaschine gekauft, und jetzt läuft unten Wasser heraus."],
      ["m", "Herr Brandt", "Oh, das ist ärgerlich. Haben Sie den Kassenbon dabei?"],
      ["f", "Frau Nguyen", "Ja, hier. Ich hätte gern eine neue Maschine. Ich trinke jeden Morgen Kaffee und möchte nicht wochenlang warten."],
      ["m", "Herr Brandt", "Das verstehe ich. Normalerweise schicken wir das Gerät zur Reparatur, das dauert etwa zwei Wochen."],
      ["f", "Frau Nguyen", "Zwei Wochen? Könnten Sie nicht eine Ausnahme machen? Die Maschine ist ja noch ganz neu."],
      ["m", "Herr Brandt", "Moment, ich frage kurz meine Kollegin. … Gut. Weil der Kauf weniger als 30 Tage her ist, können wir sie direkt umtauschen."],
      ["f", "Frau Nguyen", "Das ist wunderbar. Haben Sie das gleiche Modell noch da?"],
      ["m", "Herr Brandt", "Leider nicht in Schwarz, nur in Weiß. Wäre das auch in Ordnung?"],
      ["f", "Frau Nguyen", "Weiß ist auch okay. Hauptsache, sie funktioniert."],
      ["m", "Herr Brandt", "Dann hole ich sie Ihnen aus dem Lager. Einen Moment bitte."]
    ],
    questions: [
      { type: "mc", q: "Was ist das Problem mit der Maschine?", options: ["Der Kaffee wird nicht heiß.", "Unten läuft Wasser heraus.", "Sie lässt sich nicht einschalten."], a: 1 },
      { type: "rf", q: "Normalerweise dauert eine Reparatur etwa zwei Wochen.", a: true },
      { type: "mc", q: "Warum bekommt Frau Nguyen sofort eine neue Maschine?", options: ["Sie ist Stammkundin.", "Der Kauf ist weniger als 30 Tage her.", "Die Reparatur ist zu teuer."], a: 1 },
      { type: "rf", q: "Frau Nguyen bekommt das gleiche Modell in Schwarz.", a: false }
    ]
  },
  writing: {
    task: "Sie haben online eine Winterjacke bestellt, aber eine Jacke in der falschen Größe und Farbe bekommen. Schreiben Sie dem Shop eine E-Mail (circa 80 Wörter).",
    format: "formal",
    minWords: 70,
    points: [
      { t: "Beschreiben Sie, was Sie bestellt haben und was geliefert wurde.", re: "bestellt|geliefert|bekommen|erhalten" },
      { t: "Sagen Sie, warum das ein Problem ist.", re: "brauche|weil|problem|reise|urlaub|geschenk|passt nicht|ärgerlich" },
      { t: "Sagen Sie, was Sie jetzt erwarten (Umtausch oder Geld zurück).", re: "umtausch|umtauschen|geld|zurück|erstatt|richtige" },
      { t: "Fragen Sie, wer die Kosten für die Rücksendung trägt.", re: "rücksend|versand|kosten|porto|zurückschick" }
    ],
    model: "Sehr geehrte Damen und Herren,\n\nam 3. November habe ich bei Ihnen eine Winterjacke in Größe M und in Dunkelblau bestellt (Bestellnummer 48213). Gestern wurde mir jedoch eine Jacke in Größe XL und in Rot geliefert.\n\nDas ist sehr ärgerlich, weil ich die Jacke in zwei Wochen für eine Reise nach Norwegen brauche. Ich würde Sie deshalb bitten, mir so schnell wie möglich die richtige Jacke zu schicken. Falls sie nicht mehr lieferbar ist, hätte ich gern mein Geld zurück.\n\nKönnten Sie mir außerdem mitteilen, ob Sie die Kosten für die Rücksendung übernehmen?\n\nMit freundlichen Grüßen\n[Ihr Name]"
  },
  speaking: {
    intro: "Ihre neuen Kopfhörer funktionieren nur noch auf einer Seite. Sie gehen zurück in den Laden.",
    partner: "Verkäuferin",
    voice: "f",
    turns: [
      { say: "Guten Tag! Kann ich Ihnen helfen?", goal: "Erklären Sie das Problem mit Ihren Kopfhörern.", keys: [["kopfhörer"], ["funktioniert", "geht nicht", "kaputt", "defekt", "seite", "links", "rechts"]], model: "Ja, ich habe letzte Woche diese Kopfhörer gekauft, aber der linke funktioniert nicht mehr." },
      { say: "Oh. Haben Sie den Kassenbon dabei?", goal: "Sagen Sie, dass Sie ein Foto davon auf dem Handy haben.", keys: [["foto", "bild"], ["handy", "telefon"]], model: "Den Bon habe ich leider nicht dabei, aber hier ist ein Foto davon auf meinem Handy." },
      { say: "Das reicht. Wir können die Kopfhörer zur Reparatur schicken.", goal: "Fragen Sie höflich, ob ein Umtausch möglich wäre.", keys: [["könnten", "wäre", "würden", "hätte"], ["umtausch", "neue", "umtauschen", "austausch"]], model: "Könnten Sie die Kopfhörer nicht direkt umtauschen? Das wäre mir lieber." },
      { say: "Das Modell haben wir leider nicht mehr. Es gibt aber ein neueres Modell für 20 Euro mehr.", goal: "Fragen Sie, ob Sie den Aufpreis bezahlen müssen.", keys: [["aufpreis", "bezahlen", "zahlen", "mehr", "kosten"]], model: "Müsste ich die 20 Euro Aufpreis selbst bezahlen?" },
      { say: "Nein. Weil es eine Reklamation ist, bekommen Sie es ohne Aufpreis.", goal: "Bedanken Sie sich und nehmen Sie das Angebot an.", keys: [["danke", "dank"], ["nehme", "gern", "einverstanden", "super", "prima"]], model: "Das ist sehr nett, vielen Dank! Dann nehme ich das neue Modell." }
    ],
    shadow: [
      "Ich hätte gern mein Geld zurück.",
      "Könnten Sie mir bitte weiterhelfen?",
      "Wäre es möglich, das Gerät direkt umzutauschen?"
    ]
  }
},
{
  id: "bahn",
  title: "Verspätung im ICE",
  place: "Hannover Hbf",
  color: "#d39b2a",
  scene: "Bahnfahren gehört zum deutschen Alltag – Verspätungen leider auch. Sie lesen einen Erfahrungsbericht, verstehen eine Durchsage am Bahnsteig und erzählen einer Freundin von Ihrer chaotischen Reise.",
  grammar: {
    title: "Perfekt mit haben oder sein",
    ref: "Durrell 6.6–6.7, 7.3 · Swick Kap. 14–15",
    explain: "In speech and e-mails we tell past events in the Perfekt: <b>haben/sein + Partizip II</b> at the end. Verbs of movement or change of state (fahren, ankommen, einsteigen, bleiben, passieren) take <b>sein</b>. Written reports and stories prefer the Präteritum (fuhr, kam, hielt).",
    items: [
      { q: "Der Zug ___ in Hannover stehen geblieben.", a: ["ist"], hint: "bleiben" },
      { q: "Ich ___ meinen Anschlusszug verpasst.", a: ["habe"], hint: "verpassen" },
      { q: "Wir ___ erst um Mitternacht angekommen.", a: ["sind"], hint: "ankommen" },
      { q: "Der Zugbegleiter ___ Wasser verteilt.", a: ["hat"], hint: "verteilen" },
      { q: "Was ___ denn passiert?", a: ["ist"], hint: "passieren" }
    ]
  },
  reading: {
    kind: "article",
    from: "Reiseblog „Unterwegs“",
    subject: "Meine Odyssee mit der Bahn",
    text: "Eigentlich wollte ich am Freitag nur schnell von Hamburg nach Nürnberg fahren, um meine Schwester zu besuchen. Der ICE sollte um 14:46 Uhr abfahren. Schon am Bahnsteig kam die erste Durchsage: „Der Zug hat heute circa 20 Minuten Verspätung.“ Na gut, dachte ich, und kaufte mir einen Kaffee.\n\nIn Hannover hielt der Zug dann plötzlich an. Nach einer halben Stunde erfuhren wir, dass es eine [[Störung|fault]] an einem [[Stellwerk|signal box]] gab. Der Zugbegleiter war sehr freundlich und verteilte Wasser, aber niemand wusste, wie lange es dauern würde.\n\nAm Ende bin ich mit fast drei Stunden Verspätung in Nürnberg angekommen. Meinen [[Anschlusszug|connecting train]] nach Erlangen habe ich natürlich verpasst, also hat mich meine Schwester mit dem Auto abgeholt.\n\nDas Gute: Ab 60 Minuten Verspätung bekommt man 25 Prozent des Fahrpreises zurück, ab 120 Minuten sogar 50 Prozent. Den Antrag auf [[Entschädigung|compensation]] habe ich am nächsten Tag online gestellt, und das Geld war nach zehn Tagen auf meinem Konto. Trotzdem fahre ich nächstes Mal vielleicht lieber mit dem Fernbus.",
    questions: [
      { type: "mc", q: "Warum wollte die Person nach Nürnberg fahren?", options: ["Sie hatte dort einen Termin.", "Sie wollte ihre Schwester besuchen.", "Sie zog dorthin um."], a: 1 },
      { type: "rf", q: "Der Zug hatte schon in Hamburg Verspätung.", a: true },
      { type: "mc", q: "Warum stand der Zug in Hannover?", options: ["Ein Fahrgast war krank.", "Es gab eine Störung an einem Stellwerk.", "Es lag zu viel Schnee."], a: 1 },
      { type: "rf", q: "Die Person hat 25 Prozent des Fahrpreises zurückbekommen.", a: false },
      { type: "rf", q: "Die Entschädigung war nach zehn Tagen auf dem Konto.", a: true }
    ]
  },
  listening: {
    intro: "Eine Durchsage am Bahnhof, danach fragt Herr Schmid im Reisezentrum nach.",
    lines: [
      ["f", "Durchsage", "Information zu ICE 785 nach München, planmäßige Abfahrt 9 Uhr 12. Dieser Zug fällt heute leider aus. Reisende nach München nutzen bitte den ICE 587 um 9 Uhr 38 von Gleis 7. Wir bitten um Entschuldigung."],
      ["m", "Herr Schmid", "Entschuldigung, ich habe die Durchsage nicht ganz verstanden. Ist mein Zug nach München ausgefallen?"],
      ["f", "Mitarbeiterin", "Ja, leider. Sie können den nächsten ICE um 9 Uhr 38 nehmen, von Gleis 7."],
      ["m", "Herr Schmid", "Und meine Sitzplatzreservierung? Die habe ich extra gebucht."],
      ["f", "Mitarbeiterin", "Die gilt nicht für den anderen Zug. Aber Sie bekommen das Geld dafür zurück, wenn Sie das Formular ausfüllen."],
      ["m", "Herr Schmid", "Ich muss um 14 Uhr in München sein. Schaffe ich das noch?"],
      ["f", "Mitarbeiterin", "Der Zug um 9 Uhr 38 kommt um 13 Uhr 25 an, wenn alles pünktlich ist."],
      ["m", "Herr Schmid", "Hoffentlich! Wo bekomme ich das Formular?"],
      ["f", "Mitarbeiterin", "Online oder hier am Schalter. Ich gebe Ihnen eins mit."]
    ],
    questions: [
      { type: "mc", q: "Von welchem Gleis fährt der Ersatzzug?", options: ["Gleis 5", "Gleis 7", "Gleis 9"], a: 1 },
      { type: "mc", q: "Um wie viel Uhr fährt der Ersatzzug ab?", options: ["9:12 Uhr", "9:38 Uhr", "13:25 Uhr"], a: 1 },
      { type: "rf", q: "Die Sitzplatzreservierung gilt auch im anderen Zug.", a: false },
      { type: "rf", q: "Herr Schmid muss um 14 Uhr in München sein.", a: true }
    ]
  },
  writing: {
    task: "Sie wollten zur Geburtstagsparty Ihrer Freundin Anna, aber Ihre Zugfahrt war chaotisch. Schreiben Sie Anna eine E-Mail (circa 80 Wörter).",
    format: "informal",
    minWords: 70,
    points: [
      { t: "Erzählen Sie, was auf der Reise passiert ist.", re: "verspätung|ausgefallen|verpasst|gewartet|passiert|angekommen|stehen geblieben" },
      { t: "Sagen Sie, wie Sie sich gefühlt haben.", re: "ärger|genervt|müde|wütend|gestresst|traurig|enttäuscht|gefühlt" },
      { t: "Entschuldigen Sie sich, dass Sie zu spät gekommen sind.", re: "tut mir (so |wirklich |sehr )?leid|entschuldig|sorry|schade" },
      { t: "Schlagen Sie ein neues Treffen vor.", re: "nächste|wochenende|treffen|einladen|lade|zeit\\?" }
    ],
    model: "Liebe Anna,\n\nes tut mir so leid, dass ich am Samstag nicht pünktlich zu deiner Party gekommen bin! Mein Zug ist in Hamburg mit 40 Minuten Verspätung abgefahren, und dann ist er in Hannover über eine Stunde stehen geblieben. Deshalb habe ich meinen Anschlusszug verpasst und bin erst um Mitternacht angekommen. Ich war total genervt und müde.\n\nIch hoffe, ihr habt trotzdem schön gefeiert! Darf ich das wiedergutmachen? Ich lade dich nächstes Wochenende zum Essen ein. Hast du am Samstag Zeit?\n\nLiebe Grüße\n[Ihr Name]"
  },
  speaking: {
    intro: "Sie kaufen im Reisezentrum eine Fahrkarte.",
    partner: "Bahnmitarbeiter",
    voice: "m",
    turns: [
      { say: "Guten Tag, wohin möchten Sie fahren?", goal: "Sagen Sie, wohin und wann Sie fahren möchten.", keys: [["nach"], ["morgen", "heute", "uhr", "freitag", "samstag", "früh", "abend", "nachmittag", "vormittag"]], model: "Ich möchte morgen früh nach Dresden fahren, am liebsten vor 9 Uhr." },
      { say: "Einfach oder hin und zurück?", goal: "Antworten Sie: hin und zurück, Rückfahrt am Sonntag.", keys: [["zurück", "rückfahrt"]], model: "Hin und zurück, bitte. Zurück möchte ich am Sonntagabend fahren." },
      { say: "Haben Sie eine BahnCard?", goal: "Sagen Sie, dass Sie keine haben, und fragen Sie, ob sich eine lohnt.", keys: [["kein", "nein"], ["lohnt", "sinnvoll", "günstiger", "spare", "kostet"]], model: "Nein, ich habe keine. Lohnt sich eine BahnCard für mich?" },
      { say: "Wenn Sie öfter fahren, ja. Möchten Sie einen Sitzplatz reservieren?", goal: "Reservieren Sie einen Platz am Fenster.", keys: [["ja", "gern", "bitte"], ["fenster"]], model: "Ja, gern einen Fensterplatz, wenn möglich im Ruhebereich." },
      { say: "Das macht dann 79 Euro 80. Wie möchten Sie bezahlen?", goal: "Sagen Sie, wie Sie zahlen, und fragen Sie nach dem Gleis.", keys: [["karte", "bar", "handy", "kredit"], ["gleis"]], model: "Mit Karte, bitte. Und von welchem Gleis fährt der Zug morgen?" }
    ],
    shadow: [
      "Mein Zug hatte über eine Stunde Verspätung.",
      "Ich habe meinen Anschlusszug verpasst.",
      "Wo kann ich eine Entschädigung beantragen?"
    ]
  }
}
);
