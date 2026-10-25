// German texts of the SRD spells of the 5th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

const DOMINATE = `Solange das Ziel bezaubert ist, hast du eine telepathische Verbindung zu ihm, sofern ihr euch auf derselben Existenzebene befindet. Über diese telepathische Verbindung kannst du der Kreatur Befehle geben, solange du bei Bewusstsein bist (dafür brauchst du keine Aktion), und sie tut ihr Bestes, um zu gehorchen. Du kannst eine einfache und allgemeine Handlung vorgeben, etwa „Greif diese Kreatur an“, „Lauf dorthin“ oder „Hol diesen Gegenstand“. Erfüllt die Kreatur den Befehl und erhält sie keine weitere Anweisung von dir, verteidigt und schützt sie sich nach besten Kräften.

Du kannst deine Aktion nutzen, um die vollständige und genaue Kontrolle über das Ziel zu übernehmen. Bis zum Ende deines nächsten Zuges führt die Kreatur nur die Aktionen aus, die du wählst, und tut nichts, was du ihr nicht erlaubst. Während dieser Zeit kannst du die Kreatur auch eine Reaktion ausführen lassen, musst dafür aber auch deine eigene Reaktion nutzen.

Jedes Mal, wenn das Ziel Schaden erleidet, legt es einen neuen Weisheitsrettungswurf gegen den Zauber ab. Gelingt der Rettungswurf, endet der Zauber.`;

export const DE_TEXTS_5: Readonly<Record<string, DeText>> = {
  'animate-objects': {
    text: `Gegenstände erwachen auf deinen Befehl zum Leben. Wähle bis zu zehn nichtmagische Gegenstände in Reichweite, die niemand trägt oder hält. Mittelgroße Ziele zählen als zwei Gegenstände, große als vier, riesige als acht. Du kannst keinen Gegenstand beleben, der größer als riesig ist. Jedes Ziel erwacht zum Leben und wird zu einer Kreatur unter deiner Kontrolle, bis der Zauber endet oder es auf 0 Trefferpunkte fällt.

Als Bonusaktion kannst du jeder Kreatur, die du mit diesem Zauber erschaffen hast, geistig einen Befehl geben, sofern sie höchstens 150 m von dir entfernt ist (kontrollierst du mehrere Kreaturen, kannst du einer, mehreren oder allen gleichzeitig denselben Befehl geben). Du bestimmst, welche Aktion die Kreatur in ihrem nächsten Zug ausführt und wohin sie sich bewegt, oder du gibst einen allgemeinen Befehl, etwa eine bestimmte Kammer oder einen Gang zu bewachen. Gibst du keine Befehle, verteidigt sich die Kreatur nur gegen feindselige Kreaturen. Hat die Kreatur einen Befehl erhalten, befolgt sie ihn, bis ihre Aufgabe erledigt ist.

##### Spielwerte belebter Gegenstände

| Größe | TP | RK | Angriff | ST | GE |
|---|---|---|---|---|---|
| Winzig | 20 | 18 | +8 auf Treffer, 1W4 + 4 Schaden | 4 | 18 |
| Klein | 25 | 16 | +6 auf Treffer, 1W8 + 2 Schaden | 6 | 14 |
| Mittelgroß | 40 | 13 | +5 auf Treffer, 2W6 + 1 Schaden | 10 | 12 |
| Groß | 50 | 10 | +6 auf Treffer, 2W10 + 2 Schaden | 14 | 10 |
| Riesig | 80 | 10 | +8 auf Treffer, 2W12 + 4 Schaden | 18 | 6 |

Ein belebter Gegenstand ist ein Konstrukt, dessen RK, Trefferpunkte, Angriffe, Stärke und Geschicklichkeit von seiner Größe abhängen. Seine Konstitution beträgt 10, seine Intelligenz und Weisheit 3 und sein Charisma 1. Seine Bewegungsrate beträgt 9 m; hat der Gegenstand keine Beine oder anderen Gliedmaßen, mit denen er sich fortbewegen kann, hat er stattdessen eine Flugbewegungsrate von 9 m und kann schweben. Ist der Gegenstand fest an einer Oberfläche oder einem größeren Gegenstand befestigt, etwa eine an eine Wand geschraubte Kette, beträgt seine Bewegungsrate 0. Er hat Blindsicht mit einem Radius von 9 m und ist darüber hinaus blind. Fällt der belebte Gegenstand auf 0 Trefferpunkte, nimmt er wieder seine ursprüngliche Gegenstandsform an, und verbleibender Schaden wird auf diese übertragen.

Befiehlst du einem Gegenstand anzugreifen, kann er einen einzelnen Nahkampfangriff gegen eine Kreatur im Umkreis von 1,5 m ausführen. Er führt einen Hiebangriff mit einem Angriffsbonus und Wuchtschaden aus, die von seiner Größe abhängen. Der SL kann entscheiden, dass ein bestimmter Gegenstand aufgrund seiner Form Hieb- oder Stichschaden verursacht.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, kannst du für jeden Grad über dem 5. zwei zusätzliche Gegenstände beleben.`,
  },
  'antilife-shell': {
    text: `Eine schimmernde Barriere breitet sich in einem Radius von 3 m von dir aus und bewegt sich mit dir, wobei du stets ihr Mittelpunkt bleibst. Sie hält alle Kreaturen außer Untoten und Konstrukten fern. Die Barriere bleibt für die Wirkungsdauer bestehen.

Die Barriere hindert eine betroffene Kreatur daran, hindurchzugehen oder hindurchzugreifen. Eine betroffene Kreatur kann durch die Barriere Zauber wirken oder Angriffe mit Fernkampf- oder Langwaffen ausführen.

Bewegst du dich so, dass eine betroffene Kreatur gezwungen wäre, die Barriere zu durchqueren, endet der Zauber.`,
  },
  'arcane-hand': {
    text: `Du erschaffst eine große Hand aus schimmernder, durchscheinender Energie in einem freien Bereich, den du in Reichweite sehen kannst. Die Hand bleibt für die Wirkungsdauer bestehen und bewegt sich auf deinen Befehl, wobei sie die Bewegungen deiner eigenen Hand nachahmt.

Die Hand ist ein Gegenstand mit RK 20 und Trefferpunkten in Höhe deines Trefferpunktemaximums. Fällt sie auf 0 Trefferpunkte, endet der Zauber. Sie hat eine Stärke von 26 (+8) und eine Geschicklichkeit von 10 (+0). Die Hand füllt ihren Bereich nicht aus.

Wenn du den Zauber wirkst und als Bonusaktion in deinen folgenden Zügen, kannst du die Hand bis zu 18 m weit bewegen und dann eine der folgenden Wirkungen mit ihr hervorrufen.

***Geballte Faust.*** Die Hand schlägt eine Kreatur oder einen Gegenstand im Umkreis von 1,5 m. Führe für die Hand mit deinen Spielwerten einen Nahkampf-Zauberangriff aus. Bei einem Treffer erleidet das Ziel 4W8 Energieschaden.

***Kraftvolle Hand.*** Die Hand versucht, eine Kreatur im Umkreis von 1,5 m in eine Richtung deiner Wahl zu stoßen. Lege einen Wurf mit der Stärke der Hand ab, gegen den das Ziel einen vergleichenden Stärkewurf (Athletik) ablegt. Ist das Ziel mittelgroß oder kleiner, bist du beim Wurf im Vorteil. Gelingt er dir, stößt die Hand das Ziel bis zu 1,5 m weit plus eine Anzahl Meter in Höhe des 1,5-Fachen deines Zauberattributsmodifikators. Die Hand bewegt sich mit dem Ziel, um höchstens 1,5 m von ihm entfernt zu bleiben.

***Greifende Hand.*** Die Hand versucht, eine riesige oder kleinere Kreatur im Umkreis von 1,5 m zu packen. Für den Versuch nutzt du den Stärkewert der Hand. Ist das Ziel mittelgroß oder kleiner, bist du beim Wurf im Vorteil. Solange die Hand das Ziel gepackt hält, kannst du eine Bonusaktion nutzen, damit die Hand es zerquetscht. Tust du das, erleidet das Ziel Wuchtschaden in Höhe von 2W6 + deinem Zauberattributsmodifikator.

***Schützende Hand.*** Die Hand schiebt sich zwischen dich und eine Kreatur deiner Wahl, bis du ihr einen anderen Befehl gibst. Die Hand bewegt sich so, dass sie zwischen dir und dem Ziel bleibt, und gewährt dir halbe Deckung gegen das Ziel. Das Ziel kann den Bereich der Hand nicht durchqueren, wenn sein Stärkewert kleiner oder gleich dem der Hand ist. Ist sein Stärkewert höher als der der Hand, kann sich das Ziel durch den Bereich der Hand auf dich zubewegen, doch dieser Bereich ist für es schwieriges Gelände.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt für jeden Grad über dem 5. der Schaden der geballten Faust um 2W8 und der Schaden der greifenden Hand um 2W6.`,
    material: 'Eine Eierschale und ein Handschuh aus Schlangenhaut.',
  },
  awaken: {
    text: `Nachdem du während der Zauberzeit magische Pfade in einem kostbaren Edelstein nachgezeichnet hast, berührst du ein riesiges oder kleineres Tier oder eine solche Pflanze. Das Ziel darf entweder keinen Intelligenzwert oder eine Intelligenz von 3 oder weniger haben. Das Ziel erhält eine Intelligenz von 10. Außerdem erhält es die Fähigkeit, eine Sprache zu sprechen, die du beherrschst. Ist das Ziel eine Pflanze, erhält es die Fähigkeit, seine Äste, Wurzeln, Ranken, Schlingen und dergleichen zu bewegen, und es erhält ähnliche Sinne wie ein Mensch. Dein SL wählt passende Spielwerte für die erweckte Pflanze, etwa die des erweckten Strauchs oder des erweckten Baums.

Das erweckte Tier oder die erweckte Pflanze ist 30 Tage lang von dir bezaubert oder bis du oder deine Gefährten ihm etwas Schädliches antun. Endet der Zustand bezaubert, entscheidet die erweckte Kreatur, ob sie dir freundlich gesinnt bleibt, je nachdem, wie du sie behandelt hast, während sie bezaubert war.`,
    material: 'Ein Achat im Wert von mindestens 1.000 GM, den der Zauber verbraucht.',
  },
  cloudkill: {
    text: `Du erschaffst eine Kugel aus giftigem, gelbgrünem Nebel mit 6 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist. Der Nebel breitet sich um Ecken aus. Er bleibt für die Wirkungsdauer bestehen oder bis starker Wind ihn zerstreut, was den Zauber beendet. Sein Bereich ist komplett verschleiert.

Betritt eine Kreatur den Bereich des Zaubers in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 5W8 Giftschaden, bei einem erfolgreichen die Hälfte. Kreaturen sind auch betroffen, wenn sie den Atem anhalten oder nicht atmen müssen.

Der Nebel bewegt sich zu Beginn jedes deiner Züge 3 m von dir weg und rollt dabei über den Boden. Die Dämpfe sind schwerer als Luft, sinken zur tiefsten Stelle des Geländes und strömen sogar durch Öffnungen hinab.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 5. um 1W8.`,
  },
  commune: {
    text: `Du nimmst Kontakt zu deiner Gottheit oder einem göttlichen Stellvertreter auf und stellst bis zu drei Fragen, die mit Ja oder Nein beantwortet werden können. Du musst deine Fragen stellen, bevor der Zauber endet. Auf jede Frage erhältst du eine korrekte Antwort.

Göttliche Wesen sind nicht unbedingt allwissend, daher erhältst du vielleicht „unklar“ als Antwort, wenn eine Frage Wissen betrifft, das jenseits der Kenntnis der Gottheit liegt. Könnte eine Antwort aus einem Wort irreführend sein oder den Interessen der Gottheit zuwiderlaufen, gibt der SL stattdessen vielleicht einen kurzen Satz als Antwort.

Wirkst du den Zauber zweimal oder öfter, bevor du deine nächste lange Rast beendest, besteht für jedes Wirken nach dem ersten eine sich aufaddierende Wahrscheinlichkeit von 25 Prozent, dass du keine Antwort erhältst. Der SL würfelt dies verdeckt aus.`,
    material: 'Weihrauch und eine Phiole mit geweihtem oder entweihtem Wasser.',
  },
  'commune-with-nature': {
    text: `Du wirst kurz eins mit der Natur und erhältst Wissen über das umliegende Gebiet. Im Freien gibt dir der Zauber Wissen über das Land im Umkreis von 4,5 km um dich. In Höhlen und anderen natürlichen unterirdischen Umgebungen ist der Radius auf 90 m begrenzt. Der Zauber wirkt nicht dort, wo die Natur durch Bauwerke ersetzt wurde, etwa in Verliesen und Städten.

Du erhältst sofort Kenntnis von bis zu drei Tatsachen deiner Wahl zu den folgenden Themen, soweit sie das Gebiet betreffen:

- Gelände und Gewässer

- vorherrschende Pflanzen, Mineralien, Tiere oder Völker

- mächtige Himmlische, Feenwesen, Unholde, Elementare oder Untote

- Einflüsse anderer Existenzebenen

- Gebäude

Du könntest zum Beispiel feststellen, wo sich mächtige Untote im Gebiet befinden, wo die wichtigsten Quellen sicheren Trinkwassers liegen und wo nahe Städte sind.`,
  },
  'cone-of-cold': {
    text: `Ein Stoß kalter Luft bricht aus deinen Händen hervor. Jede Kreatur in einem Kegel von 18 m muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 8W8 Kälteschaden, bei einem erfolgreichen die Hälfte.

Eine Kreatur, die durch diesen Zauber getötet wird, wird zu einer gefrorenen Statue, bis sie auftaut.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 5. um 1W8.`,
    material: 'Ein kleiner Kegel aus Kristall oder Glas.',
  },
  'conjure-elemental': {
    text: `Du rufst einen elementaren Diener herbei. Wähle einen Bereich aus Luft, Erde, Feuer oder Wasser, der einen Würfel mit 3 m Kantenlänge in Reichweite füllt. Ein zum gewählten Bereich passender Elementar mit Herausforderungsgrad 5 oder niedriger erscheint in einem freien Bereich im Umkreis von 3 m darum. Ein Feuerelementar entsteigt zum Beispiel einem Freudenfeuer, und ein Erdelementar erhebt sich aus dem Boden. Der Elementar verschwindet, wenn er auf 0 Trefferpunkte fällt oder der Zauber endet.

Der Elementar ist dir und deinen Gefährten für die Wirkungsdauer freundlich gesinnt. Würfle die Initiative des Elementars aus, der eigene Züge hat. Er gehorcht allen mündlichen Befehlen, die du ihm gibst (dafür brauchst du keine Aktion). Gibst du ihm keine Befehle, verteidigt er sich gegen feindselige Kreaturen, führt ansonsten aber keine Aktionen aus.

Wird deine Konzentration unterbrochen, verschwindet der Elementar nicht. Stattdessen verlierst du die Kontrolle über ihn; er wird dir und deinen Gefährten feindselig gesinnt und greift vielleicht an. Einen unkontrollierten Elementar kannst du nicht entlassen; er verschwindet 1 Stunde, nachdem du ihn beschworen hast.

Der SL hat die Spielwerte des Elementars.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt der Herausforderungsgrad für jeden Grad über dem 5. um 1.`,
    material:
      'Brennender Weihrauch für Luft, weicher Ton für Erde, Schwefel und Phosphor für Feuer oder Wasser und Sand für Wasser.',
  },
  'contact-other-plane': {
    text: `Du nimmst geistig Kontakt zu einem Halbgott, dem Geist eines lange toten Weisen oder einem anderen geheimnisvollen Wesen einer anderen Ebene auf. Der Kontakt mit diesem außerplanaren Verstand kann deinen Geist belasten oder sogar brechen. Wenn du diesen Zauber wirkst, lege einen Intelligenzrettungswurf gegen SG 15 ab. Bei einem Fehlschlag erleidest du 6W6 psychischen Schaden und bist wahnsinnig, bis du eine lange Rast beendest. Solange du wahnsinnig bist, kannst du keine Aktionen ausführen, nicht verstehen, was andere Kreaturen sagen, nicht lesen und nur unverständliches Zeug reden. Der Zauber *Vollständige Genesung*, auf dich gewirkt, beendet diese Wirkung.

Bei einem erfolgreichen Rettungswurf kannst du dem Wesen bis zu fünf Fragen stellen. Du musst deine Fragen stellen, bevor der Zauber endet. Der SL beantwortet jede Frage mit einem Wort, etwa „Ja“, „Nein“, „Vielleicht“, „Niemals“, „Unwichtig“ oder „Unklar“ (wenn das Wesen die Antwort nicht kennt). Wäre eine Antwort aus einem Wort irreführend, gibt der SL stattdessen vielleicht einen kurzen Satz als Antwort.`,
  },
  contagion: {
    text: `Deine Berührung überträgt eine Krankheit. Führe einen Nahkampf-Zauberangriff gegen eine Kreatur in deiner Reichweite aus. Bei einem Treffer befällst du die Kreatur mit einer Krankheit deiner Wahl aus den unten beschriebenen.

Am Ende jedes seiner Züge muss das Ziel einen Konstitutionsrettungswurf ablegen. Nach drei misslungenen Rettungswürfen halten die Wirkungen der Krankheit für die Wirkungsdauer an, und die Kreatur legt keine weiteren dieser Rettungswürfe ab. Nach drei erfolgreichen Rettungswürfen erholt sich die Kreatur von der Krankheit, und der Zauber endet.

Da dieser Zauber eine natürliche Krankheit im Ziel hervorruft, wirkt jede Wirkung, die eine Krankheit heilt oder ihre Wirkungen anderweitig lindert, auch auf sie.

***Blendende Krankheit.*** Schmerz ergreift den Geist der Kreatur, und ihre Augen werden milchig weiß. Die Kreatur ist bei Weisheitswürfen und Weisheitsrettungswürfen im Nachteil und ist blind.

***Schmutzfieber.*** Rasendes Fieber durchfährt den Körper der Kreatur. Die Kreatur ist bei Stärkewürfen, Stärkerettungswürfen und Angriffswürfen, die Stärke nutzen, im Nachteil.

***Fleischfäule.*** Das Fleisch der Kreatur verwest. Die Kreatur ist bei Charismawürfen im Nachteil und hat Anfälligkeit gegen jeglichen Schaden.

***Geistesfeuer.*** Der Geist der Kreatur wird fiebrig. Die Kreatur ist bei Intelligenzwürfen und Intelligenzrettungswürfen im Nachteil und verhält sich im Kampf, als stünde sie unter der Wirkung des Zaubers *Verwirrung*.

***Krampfanfall.*** Die Kreatur wird von Zittern überwältigt. Sie ist bei Geschicklichkeitswürfen, Geschicklichkeitsrettungswürfen und Angriffswürfen, die Geschicklichkeit nutzen, im Nachteil.

***Schleimiges Verderben.*** Die Kreatur beginnt unkontrolliert zu bluten. Sie ist bei Konstitutionswürfen und Konstitutionsrettungswürfen im Nachteil. Außerdem ist sie jedes Mal, wenn sie Schaden erleidet, bis zum Ende ihres nächsten Zuges betäubt.`,
  },
  creation: {
    text: `Du ziehst Fäden von Schattenmaterie aus dem Schattenfell, um in Reichweite einen nicht lebenden Gegenstand aus pflanzlichem Material zu erschaffen: Stoffe, Seil, Holz oder etwas Ähnliches. Du kannst mit diesem Zauber auch mineralische Gegenstände wie Stein, Kristall oder Metall erschaffen. Der erschaffene Gegenstand darf nicht größer als ein Würfel mit 1,5 m Kantenlänge sein und muss eine Form und ein Material haben, die du schon einmal gesehen hast.

Die Wirkungsdauer hängt vom Material des Gegenstands ab. Besteht der Gegenstand aus mehreren Materialien, gilt die kürzeste Wirkungsdauer.

| Material | Wirkungsdauer |
|---|---|
| Pflanzliches Material | 1 Tag |
| Stein oder Kristall | 12 Stunden |
| Edelmetalle | 1 Stunde |
| Edelsteine | 10 Minuten |
| Adamant oder Mithral | 1 Minute |

Wird ein von diesem Zauber erschaffenes Material als Materialkomponente eines anderen Zaubers verwendet, misslingt dieser Zauber.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt die Kantenlänge des Würfels für jeden Grad über dem 5. um 1,5 m.`,
    material:
      'Ein winziges Stück Materie derselben Art wie der Gegenstand, den du erschaffen willst.',
  },
  'dispel-evil-and-good': {
    text: `Schimmernde Energie umgibt dich und schützt dich vor Feenwesen, Untoten und Kreaturen, die von jenseits der Materiellen Ebene stammen. Für die Wirkungsdauer sind Himmlische, Elementare, Feenwesen, Unholde und Untote bei Angriffswürfen gegen dich im Nachteil.

Du kannst den Zauber vorzeitig beenden, indem du eine der folgenden besonderen Funktionen nutzt.

***Verzauberung brechen.*** Als deine Aktion berührst du eine Kreatur in deiner Reichweite, die von einem Himmlischen, einem Elementar, einem Feenwesen, einem Unhold oder einem Untoten bezaubert, verängstigt oder besessen ist. Die berührte Kreatur ist von solchen Kreaturen nicht mehr bezaubert, verängstigt oder besessen.

***Verbannen.*** Als deine Aktion führst du einen Nahkampf-Zauberangriff gegen einen Himmlischen, einen Elementar, ein Feenwesen, einen Unhold oder einen Untoten in deiner Reichweite aus. Bei einem Treffer versuchst du, die Kreatur auf ihre Heimatebene zurückzutreiben. Die Kreatur muss einen Charismarettungswurf bestehen, sonst wird sie auf ihre Heimatebene zurückgeschickt (falls sie nicht schon dort ist). Sind sie nicht auf ihrer Heimatebene, werden Untote ins Schattenfell und Feenwesen in die Feenwildnis geschickt.`,
    material: 'Weihwasser oder Silber- und Eisenpulver.',
  },
  'dominate-person': {
    text: `Du versuchst, einen Humanoiden zu betören, den du in Reichweite sehen kannst. Er muss einen Weisheitsrettungswurf bestehen, sonst ist er für die Wirkungsdauer von dir bezaubert. Kämpfst du oder kämpfen dir freundlich gesinnte Kreaturen gegen ihn, ist er beim Rettungswurf im Vorteil.

${DOMINATE}`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades wirkst, beträgt die Wirkungsdauer Konzentration, bis zu 10 Minuten. Mit einem Zauberplatz des 7. Grades beträgt sie Konzentration, bis zu 1 Stunde, mit einem Zauberplatz des 8. Grades oder höher Konzentration, bis zu 8 Stunden.`,
  },
  dream: {
    text: `Dieser Zauber formt die Träume einer Kreatur. Wähle eine dir bekannte Kreatur als Ziel dieses Zaubers. Das Ziel muss sich auf derselben Existenzebene befinden wie du. Kreaturen, die nicht schlafen, etwa Elfen, können mit diesem Zauber nicht erreicht werden. Du oder eine bereitwillige Kreatur, die du berührst, fallt in einen Trancezustand und dient als Bote.

Während der Trance nimmt der Bote seine Umgebung wahr, kann aber weder Aktionen ausführen noch sich bewegen.

Schläft das Ziel, erscheint der Bote in seinen Träumen und kann sich mit ihm unterhalten, solange es während der Wirkungsdauer schläft. Der Bote kann auch die Umgebung des Traums formen und Landschaften, Gegenstände und andere Bilder erschaffen. Der Bote kann jederzeit aus der Trance erwachen und die Wirkung des Zaubers vorzeitig beenden. Das Ziel erinnert sich beim Erwachen genau an den Traum. Ist das Ziel wach, wenn du den Zauber wirkst, weiß der Bote das und kann entweder die Trance (und den Zauber) beenden oder warten, bis das Ziel einschläft; dann erscheint der Bote in den Träumen des Ziels.

Du kannst den Boten für das Ziel monströs und furchterregend erscheinen lassen. Tust du das, kann der Bote eine Nachricht von höchstens zehn Wörtern überbringen, und das Ziel muss dann einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erzeugen Nachklänge der trügerischen Monstrosität einen Albtraum, der den ganzen Schlaf des Ziels anhält und verhindert, dass es aus dieser Rast einen Nutzen zieht. Außerdem erleidet das Ziel beim Erwachen 3W6 psychischen Schaden.

Besitzt du ein Körperteil, eine Haarlocke, einen abgeschnittenen Nagel oder einen ähnlichen Teil vom Körper des Ziels, legt es seinen Rettungswurf mit Nachteil ab.`,
    material:
      'Eine Handvoll Sand, ein Tupfer Tinte und eine Schreibfeder, die einem schlafenden Vogel ausgerupft wurde.',
  },
  'flame-strike': {
    text: `Eine senkrechte Säule göttlichen Feuers donnert an einem Ort deiner Wahl vom Himmel herab. Jede Kreatur in einem Zylinder mit 3 m Radius und 12 m Höhe, dessen Mittelpunkt ein Punkt in Reichweite ist, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 4W6 Feuerschaden und 4W6 gleißenden Schaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt der Feuerschaden oder der gleißende Schaden (deine Wahl) für jeden Grad über dem 5. um 1W6.`,
    material: 'Eine Prise Schwefel.',
  },
  geas: {
    text: `Du belegst eine Kreatur, die du in Reichweite sehen kannst, mit einem magischen Befehl, der sie zwingt, nach deinem Willen einen Dienst zu leisten oder eine Handlung oder ein Vorhaben zu unterlassen. Kann die Kreatur dich verstehen, muss sie einen Weisheitsrettungswurf bestehen, sonst ist sie für die Wirkungsdauer von dir bezaubert. Solange die Kreatur von dir bezaubert ist, erleidet sie jedes Mal 5W10 psychischen Schaden, wenn sie deinen Anweisungen direkt zuwiderhandelt, jedoch höchstens einmal pro Tag. Eine Kreatur, die dich nicht verstehen kann, ist von dem Zauber nicht betroffen.

Du kannst jeden beliebigen Befehl geben, außer einer Tätigkeit, die den sicheren Tod zur Folge hätte. Gibst du einen selbstmörderischen Befehl, endet der Zauber.

Du kannst den Zauber vorzeitig beenden, indem du ihn mit einer Aktion aufhebst. Auch die Zauber *Fluch brechen*, *Vollständige Genesung* oder *Wunsch* beenden ihn.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. oder 8. Grades wirkst, beträgt die Wirkungsdauer 1 Jahr. Mit einem Zauberplatz des 9. Grades hält der Zauber an, bis er durch einen der oben genannten Zauber beendet wird.`,
  },
  'greater-restoration': {
    text: `Du durchdringst eine Kreatur, die du berührst, mit positiver Energie, um eine schwächende Wirkung aufzuheben. Du kannst die Erschöpfungsstufe des Ziels um eins senken oder eine der folgenden Wirkungen auf dem Ziel beenden:

- Eine Wirkung, die das Ziel bezaubert oder versteinert hat

- Einen Fluch, einschließlich der Einstimmung des Ziels auf einen verfluchten magischen Gegenstand

- Jede Verringerung eines Attributswerts des Ziels

- Eine Wirkung, die das Trefferpunktemaximum des Ziels verringert`,
    material: 'Diamantstaub im Wert von mindestens 100 GM, den der Zauber verbraucht.',
  },
  hallow: {
    text: `Du berührst einen Punkt und erfüllst einen Bereich darum mit heiliger (oder unheiliger) Macht. Der Bereich kann einen Radius von bis zu 18 m haben, und der Zauber misslingt, wenn der Radius einen Bereich einschließt, der bereits unter der Wirkung eines *Weihen*-Zaubers steht. Der betroffene Bereich unterliegt den folgenden Wirkungen.

Erstens können Himmlische, Elementare, Feenwesen, Unholde und Untote den Bereich nicht betreten, und solche Kreaturen können Kreaturen darin weder bezaubern noch verängstigen noch besetzen. Jede Kreatur, die von einer solchen Kreatur bezaubert, verängstigt oder besessen ist, ist es nicht mehr, sobald sie den Bereich betritt. Du kannst eine oder mehrere dieser Kreaturenarten von dieser Wirkung ausnehmen.

Zweitens kannst du eine zusätzliche Wirkung an den Bereich binden. Wähle die Wirkung aus der folgenden Liste oder eine Wirkung, die der SL anbietet. Einige dieser Wirkungen gelten für Kreaturen im Bereich; du kannst bestimmen, ob die Wirkung für alle Kreaturen gilt, für Kreaturen, die einer bestimmten Gottheit oder einem bestimmten Anführer folgen, oder für Kreaturen einer bestimmten Art, etwa Orks oder Trolle. Betritt eine Kreatur, die betroffen wäre, den Bereich des Zaubers in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, kann sie einen Charismarettungswurf ablegen. Bei einem Erfolg ignoriert die Kreatur die zusätzliche Wirkung, bis sie den Bereich verlässt.

***Mut.*** Betroffene Kreaturen können im Bereich nicht verängstigt werden.

***Dunkelheit.*** Dunkelheit füllt den Bereich. Normales Licht sowie magisches Licht von Zaubern eines niedrigeren Grades als des Zauberplatzes, mit dem du diesen Zauber gewirkt hast, können den Bereich nicht erhellen.

***Tageslicht.*** Helles Licht füllt den Bereich. Magische Dunkelheit von Zaubern eines niedrigeren Grades als des Zauberplatzes, mit dem du diesen Zauber gewirkt hast, kann das Licht nicht löschen.

***Energieschutz.*** Betroffene Kreaturen im Bereich haben Resistenz gegen eine Schadensart deiner Wahl außer Wucht-, Stich- oder Hiebschaden.

***Energieanfälligkeit.*** Betroffene Kreaturen im Bereich haben Anfälligkeit gegen eine Schadensart deiner Wahl außer Wucht-, Stich- oder Hiebschaden.

***Ewige Ruhe.*** Im Bereich bestattete Leichen können nicht in Untote verwandelt werden.

***Extradimensionale Störung.*** Betroffene Kreaturen können sich weder durch Teleportation noch auf extradimensionalen oder planaren Wegen bewegen oder reisen.

***Furcht.*** Betroffene Kreaturen sind im Bereich verängstigt.

***Stille.*** Kein Geräusch kann aus dem Bereich dringen, und kein Geräusch kann in ihn hineingelangen.

***Zungen.*** Betroffene Kreaturen können mit jeder anderen Kreatur im Bereich kommunizieren, auch wenn sie keine gemeinsame Sprache haben.`,
    material:
      'Kräuter, Öle und Weihrauch im Wert von mindestens 1.000 GM, die der Zauber verbraucht.',
  },
  'hold-monster': {
    text: `Wähle eine Kreatur, die du in Reichweite sehen kannst. Das Ziel muss einen Weisheitsrettungswurf bestehen, sonst ist es für die Wirkungsdauer gelähmt. Dieser Zauber wirkt nicht auf Untote. Am Ende jedes seiner Züge kann das Ziel einen weiteren Weisheitsrettungswurf ablegen. Bei einem Erfolg endet der Zauber für die Kreatur.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, kannst du für jeden Grad über dem 5. eine zusätzliche Kreatur als Ziel wählen. Die Kreaturen dürfen höchstens 9 m voneinander entfernt sein, wenn du sie als Ziel wählst.`,
    material: 'Ein kleines Stück Eisen.',
  },
  'insect-plague': {
    text: `Schwärmende, beißende Heuschrecken füllen eine Kugel mit 6 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist. Die Kugel breitet sich um Ecken aus. Sie bleibt für die Wirkungsdauer bestehen, und ihr Bereich ist leicht verschleiert. Der Bereich der Kugel ist schwieriges Gelände.

Wenn der Bereich erscheint, muss jede Kreatur darin einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 4W10 Stichschaden, bei einem erfolgreichen die Hälfte. Eine Kreatur muss diesen Rettungswurf auch ablegen, wenn sie den Bereich des Zaubers in einem Zug zum ersten Mal betritt oder ihren Zug dort beendet.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 5. um 1W10.`,
    material: 'Ein paar Zuckerkörner, einige Getreidekörner und ein Klecks Fett.',
  },
  'legend-lore': {
    text: `Nenne oder beschreibe eine Person, einen Ort oder einen Gegenstand. Der Zauber bringt dir eine kurze Zusammenfassung des bedeutsamen Wissens über das Genannte in den Sinn. Das Wissen kann aus aktuellen Erzählungen, vergessenen Geschichten oder sogar geheimem Wissen bestehen, das nie weithin bekannt war. Ist das Genannte nicht von legendärer Bedeutung, erhältst du keine Auskunft. Je mehr du bereits darüber weißt, desto genauer und ausführlicher sind die Auskünfte, die du erhältst.

Was du erfährst, ist zutreffend, kann aber in bildhafte Sprache gekleidet sein. Hast du zum Beispiel eine geheimnisvolle magische Axt zur Hand, könnte der Zauber diese Auskunft geben: „Wehe dem Übeltäter, dessen Hand die Axt berührt, denn selbst der Schaft schneidet die Hand der Bösen. Nur ein wahres Kind des Steins, Liebender und Geliebter Moradins, vermag die wahren Kräfte der Axt zu erwecken, und nur mit dem heiligen Wort *Rudnogg* auf den Lippen.“`,
    material:
      'Weihrauch im Wert von mindestens 250 GM, den der Zauber verbraucht, und vier Elfenbeinstreifen im Wert von je mindestens 50 GM.',
  },
  'mass-cure-wounds': {
    text: `Eine Welle heilender Energie geht von einem Punkt deiner Wahl in Reichweite aus. Wähle bis zu sechs Kreaturen in einer Kugel mit 9 m Radius, deren Mittelpunkt dieser Punkt ist. Jedes Ziel erhält Trefferpunkte in Höhe von 3W8 + deinem Zauberattributsmodifikator zurück. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 5. um 1W8.`,
  },
  mislead: {
    text: `Du wirst unsichtbar, während zugleich ein illusionärer Doppelgänger von dir dort erscheint, wo du stehst. Der Doppelgänger bleibt für die Wirkungsdauer bestehen, doch die Unsichtbarkeit endet, wenn du angreifst oder einen Zauber wirkst.

Du kannst deine Aktion nutzen, um deinen Doppelgänger bis zum Doppelten deiner Bewegungsrate weit zu bewegen und ihn gestikulieren, sprechen und sich auf jede Weise verhalten zu lassen, die du wählst.

Du kannst durch seine Augen sehen und durch seine Ohren hören, als wärst du an seinem Ort. In jedem deiner Züge kannst du als Bonusaktion von seinen Sinnen zu deinen eigenen wechseln oder zurück. Solange du seine Sinne nutzt, bist du in Bezug auf deine eigene Umgebung blind und taub.`,
  },
  'modify-memory': {
    text: `Du versuchst, die Erinnerungen einer anderen Kreatur umzuformen. Eine Kreatur, die du sehen kannst, muss einen Weisheitsrettungswurf ablegen. Kämpfst du gegen die Kreatur, ist sie beim Rettungswurf im Vorteil. Bei einem misslungenen Rettungswurf ist das Ziel für die Wirkungsdauer von dir bezaubert. Das bezauberte Ziel ist kampfunfähig und nimmt seine Umgebung nicht wahr, kann dich aber weiterhin hören. Erleidet es Schaden oder wird es zum Ziel eines anderen Zaubers, endet dieser Zauber, und keine Erinnerung des Ziels wird verändert.

Solange diese Bezauberung anhält, kannst du die Erinnerung des Ziels an ein Ereignis beeinflussen, das es in den letzten 24 Stunden erlebt hat und das nicht länger als 10 Minuten dauerte. Du kannst jede Erinnerung an das Ereignis dauerhaft löschen, das Ziel sich mit vollkommener Klarheit und in allen Einzelheiten an das Ereignis erinnern lassen, seine Erinnerung an die Einzelheiten des Ereignisses verändern oder eine Erinnerung an ein anderes Ereignis erschaffen.

Du musst zum Ziel sprechen, um zu beschreiben, wie seine Erinnerungen verändert werden, und es muss deine Sprache verstehen können, damit die veränderten Erinnerungen Wurzeln schlagen. Sein Geist füllt alle Lücken in den Einzelheiten deiner Beschreibung. Endet der Zauber, bevor du die veränderten Erinnerungen fertig beschrieben hast, wird das Gedächtnis der Kreatur nicht verändert. Andernfalls setzen sich die veränderten Erinnerungen fest, wenn der Zauber endet.

Eine veränderte Erinnerung beeinflusst nicht unbedingt, wie sich eine Kreatur verhält, besonders wenn die Erinnerung ihren natürlichen Neigungen, ihrer Gesinnung oder ihren Überzeugungen widerspricht. Eine unlogische veränderte Erinnerung, etwa die eingepflanzte Erinnerung, wie sehr die Kreatur es genossen hat, sich mit Säure zu übergießen, wird verworfen, vielleicht als schlechter Traum. Der SL kann eine veränderte Erinnerung als zu unsinnig ansehen, um eine Kreatur nennenswert zu beeinflussen.

Die Zauber *Fluch brechen* oder *Vollständige Genesung*, auf das Ziel gewirkt, stellen die wahre Erinnerung der Kreatur wieder her.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, kannst du die Erinnerungen des Ziels an ein Ereignis verändern, das bis zu 7 Tage (6. Grad), 30 Tage (7. Grad) oder 1 Jahr (8. Grad) zurückliegt oder zu einem beliebigen Zeitpunkt in der Vergangenheit der Kreatur stattfand (9. Grad).`,
  },
  passwall: {
    text: `Ein Durchgang erscheint an einem Punkt deiner Wahl, den du in Reichweite auf einer Oberfläche aus Holz, Putz oder Stein (etwa einer Wand, einer Decke oder einem Boden) sehen kannst, und bleibt für die Wirkungsdauer bestehen. Du bestimmst die Maße der Öffnung: bis zu 1,5 m breit, 2,4 m hoch und 6 m tief. Der Durchgang beeinträchtigt die Stabilität des umgebenden Bauwerks nicht.

Verschwindet die Öffnung, werden alle Kreaturen und Gegenstände, die sich noch im vom Zauber geschaffenen Durchgang befinden, unversehrt in den freien Bereich befördert, der der Oberfläche, auf die du den Zauber gewirkt hast, am nächsten liegt.`,
    material: 'Eine Prise Sesamsamen.',
  },
  'planar-binding': {
    text: `Mit diesem Zauber versuchst du, einen Himmlischen, einen Elementar, ein Feenwesen oder einen Unhold an deinen Dienst zu binden. Die Kreatur muss sich während des gesamten Wirkens in Reichweite befinden. (Meist wird die Kreatur zuerst in die Mitte eines umgekehrten *Magischen Kreises* beschworen, um sie gefangen zu halten, während dieser Zauber gewirkt wird.) Am Ende des Wirkens muss das Ziel einen Charismarettungswurf ablegen. Bei einem misslungenen Rettungswurf ist es für die Wirkungsdauer verpflichtet, dir zu dienen. Wurde die Kreatur durch einen anderen Zauber beschworen oder erschaffen, verlängert sich dessen Wirkungsdauer auf die dieses Zaubers.

Eine gebundene Kreatur muss deinen Anweisungen nach besten Kräften folgen. Du könntest der Kreatur befehlen, dich auf ein Abenteuer zu begleiten, einen Ort zu bewachen oder eine Nachricht zu überbringen. Die Kreatur gehorcht dem Wortlaut deiner Anweisungen, doch ist sie dir feindselig gesinnt, versucht sie, deine Worte zu verdrehen, um ihre eigenen Ziele zu erreichen. Führt die Kreatur deine Anweisungen vollständig aus, bevor der Zauber endet, reist sie zu dir, um dies zu melden, sofern ihr euch auf derselben Existenzebene befindet. Bist du auf einer anderen Existenzebene, kehrt sie an den Ort zurück, an dem du sie gebunden hast, und bleibt dort, bis der Zauber endet.`,
    higher: `Wenn du diesen Zauber mit einem höhergradigen Zauberplatz wirkst, steigt die Wirkungsdauer auf 10 Tage mit einem Platz des 6. Grades, auf 30 Tage mit einem Platz des 7. Grades, auf 180 Tage mit einem Platz des 8. Grades und auf ein Jahr und einen Tag mit einem Zauberplatz des 9. Grades.`,
    material: 'Ein Juwel im Wert von mindestens 1.000 GM, das der Zauber verbraucht.',
  },
  'raise-dead': {
    text: `Du bringst eine tote Kreatur, die du berührst, ins Leben zurück, sofern sie nicht länger als 10 Tage tot ist. Ist die Seele der Kreatur bereit und frei, in den Körper zurückzukehren, kehrt die Kreatur mit 1 Trefferpunkt ins Leben zurück.

Dieser Zauber neutralisiert außerdem alle Gifte und heilt nichtmagische Krankheiten, die die Kreatur zum Zeitpunkt ihres Todes plagten. Magische Krankheiten, Flüche oder ähnliche Wirkungen entfernt er jedoch nicht; werden sie nicht vor dem Wirken des Zaubers entfernt, wirken sie, sobald die Kreatur ins Leben zurückkehrt. Der Zauber kann keine untote Kreatur ins Leben zurückholen.

Dieser Zauber schließt alle tödlichen Wunden, stellt aber keine fehlenden Körperteile wieder her. Fehlen der Kreatur Körperteile oder Organe, die für ihr Überleben unerlässlich sind – etwa ihr Kopf –, misslingt der Zauber automatisch.

Von den Toten zurückzukehren, ist eine Tortur. Das Ziel erhält einen Malus von -4 auf alle Angriffswürfe, Rettungswürfe und Attributswürfe. Jedes Mal, wenn das Ziel eine lange Rast beendet, sinkt der Malus um 1, bis er verschwindet.`,
    material: 'Ein Diamant im Wert von mindestens 500 GM, den der Zauber verbraucht.',
  },
  reincarnate: {
    text: `Du berührst einen toten Humanoiden oder einen Teil eines toten Humanoiden. Sofern die Kreatur nicht länger als 10 Tage tot ist, formt der Zauber einen neuen, erwachsenen Körper für sie und ruft dann die Seele in diesen Körper. Ist die Seele des Ziels nicht frei oder nicht bereit dazu, misslingt der Zauber.

Die Magie formt einen neuen Körper, den die Kreatur bewohnt, wodurch sich wahrscheinlich ihr Volk ändert. Der SL wirft einen W100 und bestimmt anhand der folgenden Tabelle, welche Gestalt die Kreatur bei ihrer Rückkehr ins Leben annimmt, oder er wählt eine Gestalt.

| W100 | Volk |
|---|---|
| 01–04 | Drachenblütiger |
| 05–13 | Zwerg, Hügel |
| 14–21 | Zwerg, Gebirge |
| 22–25 | Elf, Dunkel |
| 26–34 | Elf, Hoch |
| 35–42 | Elf, Wald |
| 43–46 | Gnom, Wald |
| 47–52 | Gnom, Fels |
| 53–56 | Halbelf |
| 57–60 | Halbork |
| 61–68 | Halbling, Leichtfuß |
| 69–76 | Halbling, Stämmig |
| 77–96 | Mensch |
| 97–00 | Tiefling |

Die wiedergeborene Kreatur erinnert sich an ihr früheres Leben und ihre Erfahrungen. Sie behält die Fähigkeiten ihrer ursprünglichen Gestalt, tauscht aber ihr ursprüngliches Volk gegen das neue und ändert ihre Volksmerkmale entsprechend.`,
    material: 'Seltene Öle und Salben im Wert von mindestens 1.000 GM, die der Zauber verbraucht.',
  },
  scrying: {
    text: `Du kannst eine bestimmte Kreatur deiner Wahl sehen und hören, die sich auf derselben Existenzebene befindet wie du. Das Ziel muss einen Weisheitsrettungswurf ablegen, der davon abhängt, wie gut du das Ziel kennst und welche Art körperlicher Verbindung du zu ihm hast. Weiß ein Ziel, dass du diesen Zauber wirkst, kann es den Rettungswurf freiwillig nicht bestehen, wenn es beobachtet werden will.

| Kenntnis | Rettungswurfmodifikator |
|---|---|
| Aus zweiter Hand (du hast vom Ziel gehört) | +5 |
| Aus erster Hand (du bist dem Ziel begegnet) | +0 |
| Vertraut (du kennst das Ziel gut) | -5 |

| Verbindung | Rettungswurfmodifikator |
|---|---|
| Abbild oder Bild | -2 |
| Besitz oder Kleidungsstück | -4 |
| Körperteil, Haarlocke, Stück Nagel oder Ähnliches | -10 |

Bei einem erfolgreichen Rettungswurf ist das Ziel nicht betroffen, und du kannst diesen Zauber 24 Stunden lang nicht erneut gegen es einsetzen.

Bei einem misslungenen Rettungswurf erschafft der Zauber im Umkreis von 3 m um das Ziel einen unsichtbaren Sensor. Du kannst durch den Sensor sehen und hören, als wärst du dort. Der Sensor bewegt sich mit dem Ziel und bleibt für die Wirkungsdauer höchstens 3 m von ihm entfernt. Eine Kreatur, die unsichtbare Gegenstände sehen kann, sieht den Sensor als leuchtende Kugel von etwa der Größe deiner Faust.

Statt eine Kreatur zum Ziel zu nehmen, kannst du einen Ort, den du schon einmal gesehen hast, als Ziel dieses Zaubers wählen. Tust du das, erscheint der Sensor an diesem Ort und bewegt sich nicht.`,
    material:
      'Ein Fokus im Wert von mindestens 1.000 GM, etwa eine Kristallkugel, ein Silberspiegel oder ein mit Weihwasser gefülltes Becken.',
  },
  seeming: {
    text: `Mit diesem Zauber kannst du das Aussehen beliebig vieler Kreaturen ändern, die du in Reichweite sehen kannst. Du gibst jedem gewählten Ziel ein neues, illusionäres Aussehen. Ein nicht bereitwilliges Ziel kann einen Charismarettungswurf ablegen und ist bei einem Erfolg von diesem Zauber nicht betroffen.

Der Zauber verkleidet das körperliche Aussehen sowie Kleidung, Rüstung, Waffen und Ausrüstung. Du kannst jede Kreatur 30 cm kleiner oder größer wirken und dünn, dick oder etwas dazwischen erscheinen lassen. Den Körperbau eines Ziels kannst du nicht ändern; du musst also eine Gestalt mit derselben grundlegenden Anordnung der Gliedmaßen wählen. Ansonsten bestimmst du den Umfang der Illusion. Der Zauber hält für die Wirkungsdauer an, sofern du ihn nicht vorher mit deiner Aktion beendest.

Die Veränderungen dieses Zaubers halten einer körperlichen Untersuchung nicht stand. Fügst du der Kleidung einer Kreatur mit diesem Zauber zum Beispiel einen Hut hinzu, gehen Gegenstände durch den Hut hindurch, und wer ihn berührt, spürt nichts oder fühlt Kopf und Haar der Kreatur. Lässt du mit diesem Zauber jemanden dünner erscheinen, als er ist, stößt die Hand von jemandem, der ihn berühren will, gegen ihn, während sie scheinbar noch in der Luft ist.

Eine Kreatur kann ihre Aktion nutzen, um ein Ziel zu untersuchen, und einen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG ablegen. Gelingt er, bemerkt sie, dass das Ziel verkleidet ist.`,
  },
  telekinesis: {
    text: `Du erhältst die Fähigkeit, Kreaturen oder Gegenstände mit Gedankenkraft zu bewegen oder zu handhaben. Wenn du den Zauber wirkst und als deine Aktion in jeder Runde der Wirkungsdauer, kannst du deinen Willen auf eine Kreatur oder einen Gegenstand richten, den du in Reichweite sehen kannst, und die entsprechende Wirkung unten hervorrufen. Du kannst Runde für Runde dasselbe Ziel beeinflussen oder jederzeit ein neues wählen. Wechselst du das Ziel, ist das vorherige nicht mehr vom Zauber betroffen.

***Kreatur.*** Du kannst versuchen, eine riesige oder kleinere Kreatur zu bewegen. Lege einen Attributswurf mit deinem Zauberattribut ab, gegen den die Kreatur einen vergleichenden Stärkewurf ablegt. Gewinnst du, bewegst du die Kreatur bis zu 9 m weit in eine beliebige Richtung, auch nach oben, aber nicht über die Reichweite dieses Zaubers hinaus. Bis zum Ende deines nächsten Zuges ist die Kreatur in deinem telekinetischen Griff festgesetzt. Eine nach oben gehobene Kreatur schwebt in der Luft.

In folgenden Runden kannst du deine Aktion nutzen, um zu versuchen, deinen telekinetischen Griff um die Kreatur aufrechtzuerhalten, indem du den vergleichenden Wurf wiederholst.

***Gegenstand.*** Du kannst versuchen, einen Gegenstand mit einem Gewicht von bis zu 500 kg zu bewegen. Trägt oder hält niemand den Gegenstand, bewegst du ihn automatisch bis zu 9 m weit in eine beliebige Richtung, aber nicht über die Reichweite dieses Zaubers hinaus.

Trägt oder hält eine Kreatur den Gegenstand, musst du einen Attributswurf mit deinem Zauberattribut ablegen, gegen den diese Kreatur einen vergleichenden Stärkewurf ablegt. Gelingt er dir, entreißt du ihr den Gegenstand und kannst ihn bis zu 9 m weit in eine beliebige Richtung bewegen, aber nicht über die Reichweite dieses Zaubers hinaus.

Mit deinem telekinetischen Griff kannst du Gegenstände fein steuern, etwa ein einfaches Werkzeug handhaben, eine Tür oder einen Behälter öffnen, einen Gegenstand in einem offenen Behälter verstauen oder daraus hervorholen oder den Inhalt einer Phiole ausgießen.`,
  },
  'telepathic-bond': {
    text: `Du schmiedest eine telepathische Verbindung zwischen bis zu acht bereitwilligen Kreaturen deiner Wahl in Reichweite und verbindest jede Kreatur für die Wirkungsdauer geistig mit allen anderen. Kreaturen mit einem Intelligenzwert von 2 oder weniger sind von diesem Zauber nicht betroffen.

Bis der Zauber endet, können die Ziele über das Band telepathisch kommunizieren, ob sie eine gemeinsame Sprache haben oder nicht. Die Kommunikation ist über jede Entfernung möglich, reicht aber nicht auf andere Existenzebenen.`,
    material: 'Eierschalenstücke von zwei verschiedenen Arten von Kreaturen.',
  },
  'teleportation-circle': {
    text: `Während du den Zauber wirkst, zeichnest du einen Kreis mit 3 m Durchmesser auf den Boden, versehen mit Siegeln, die deinen Ort mit einem dauerhaften Teleportationskreis deiner Wahl verbinden, dessen Siegelfolge du kennst und der sich auf derselben Existenzebene befindet wie du. In dem gezeichneten Kreis öffnet sich ein schimmerndes Portal, das bis zum Ende deines nächsten Zuges offen bleibt. Jede Kreatur, die das Portal betritt, erscheint augenblicklich im Umkreis von 1,5 m um den Zielkreis oder im nächstgelegenen freien Bereich, falls dieser Bereich besetzt ist.

Viele bedeutende Tempel, Gilden und andere wichtige Orte haben irgendwo in ihren Mauern dauerhafte Teleportationskreise. Jeder solche Kreis hat eine einzigartige Siegelfolge – eine Reihe magischer Runen in einem bestimmten Muster. Wenn du die Fähigkeit erhältst, diesen Zauber zu wirken, erfährst du die Siegelfolgen für zwei Ziele auf der Materiellen Ebene, die der SL bestimmt. Auf deinen Abenteuern kannst du weitere Siegelfolgen erlernen. Eine neue Siegelfolge kannst du dir einprägen, nachdem du sie 1 Minute lang studiert hast.

Du kannst einen dauerhaften Teleportationskreis erschaffen, indem du diesen Zauber ein Jahr lang jeden Tag am selben Ort wirkst. Wirkst du den Zauber auf diese Weise, musst du den Kreis nicht zum Teleportieren nutzen.`,
    material:
      'Seltene Kreiden und Tinten, mit kostbaren Edelsteinen im Wert von 50 GM versetzt, die der Zauber verbraucht.',
  },
  'tree-stride': {
    text: `Du erhältst die Fähigkeit, einen Baum zu betreten und dich aus seinem Inneren in das Innere eines anderen Baums derselben Art im Umkreis von 150 m zu bewegen. Beide Bäume müssen lebendig und mindestens so groß sein wie du. Du musst 1,5 m Bewegung aufwenden, um einen Baum zu betreten. Du kennst sofort den Ort aller anderen Bäume derselben Art im Umkreis von 150 m und kannst als Teil der Bewegung, mit der du den Baum betrittst, entweder in einen dieser Bäume übergehen oder aus dem Baum heraustreten, in dem du bist. Du erscheinst an einer Stelle deiner Wahl im Umkreis von 1,5 m um den Zielbaum und wendest dafür weitere 1,5 m Bewegung auf. Hast du keine Bewegung mehr übrig, erscheinst du im Umkreis von 1,5 m um den Baum, den du betreten hast.

Du kannst diese Fortbewegung für die Wirkungsdauer einmal pro Runde nutzen. Du musst jeden Zug außerhalb eines Baums beenden.`,
  },
  'wall-of-force': {
    text: `Eine unsichtbare Wand aus Energie entsteht an einem Punkt deiner Wahl in Reichweite. Die Wand erscheint in jeder Ausrichtung, die du wählst, als waagerechte oder senkrechte Barriere oder schräg. Sie kann frei schweben oder auf einer festen Oberfläche ruhen. Du kannst sie zu einer halbkugelförmigen Kuppel oder einer Kugel mit bis zu 3 m Radius formen oder eine ebene Fläche aus zehn Feldern von 3 m mal 3 m bilden. Jedes Feld muss an ein anderes angrenzen. In jeder Form ist die Wand 6 mm dick. Sie bleibt für die Wirkungsdauer bestehen. Schneidet die Wand beim Erscheinen durch den Bereich einer Kreatur, wird die Kreatur auf eine Seite der Wand geschoben (du wählst, auf welche).

Nichts kann die Wand körperlich durchqueren. Sie ist immun gegen jeglichen Schaden und kann nicht durch *Magie bannen* gebannt werden. Der Zauber *Auflösung* zerstört die Wand jedoch augenblicklich. Die Wand reicht außerdem in die Ätherebene und blockiert ätherische Reisen durch die Wand.`,
    material: 'Eine Prise Pulver aus einem zerstoßenen klaren Edelstein.',
  },
  'wall-of-stone': {
    text: `Eine nichtmagische Wand aus massivem Stein entsteht an einem Punkt deiner Wahl in Reichweite. Die Wand ist 15 cm dick und besteht aus zehn Feldern von 3 m mal 3 m. Jedes Feld muss an mindestens ein anderes angrenzen. Alternativ kannst du Felder von 3 m mal 6 m erschaffen, die nur 7,5 cm dick sind.

Schneidet die Wand beim Erscheinen durch den Bereich einer Kreatur, wird die Kreatur auf eine Seite der Wand geschoben (deine Wahl). Würde eine Kreatur auf allen Seiten von der Wand (oder der Wand und einer anderen festen Oberfläche) umschlossen, kann sie einen Geschicklichkeitsrettungswurf ablegen. Bei einem Erfolg kann sie ihre Reaktion nutzen, um sich bis zu ihrer Bewegungsrate weit zu bewegen, sodass sie nicht mehr von der Wand eingeschlossen ist.

Die Wand kann jede gewünschte Form haben, darf aber nicht denselben Bereich einnehmen wie eine Kreatur oder ein Gegenstand. Sie muss weder senkrecht stehen noch auf einem festen Fundament ruhen. Sie muss jedoch mit vorhandenem Stein verschmelzen und fest von ihm gestützt werden. So kannst du mit diesem Zauber eine Schlucht überbrücken oder eine Rampe erschaffen.

Erschaffst du eine Spannweite von mehr als 6 m Länge, musst du die Größe jedes Felds halbieren, um Stützen zu schaffen. Du kannst die Wand grob formen, um Zinnen, Brustwehren und Ähnliches zu schaffen.

Die Wand ist ein steinerner Gegenstand, der beschädigt und so durchbrochen werden kann. Jedes Feld hat RK 15 und 30 Trefferpunkte pro 2,5 cm Dicke. Sinkt ein Feld auf 0 Trefferpunkte, wird es zerstört, und nach Ermessen des SL stürzen vielleicht verbundene Felder ein.

Hältst du die Konzentration auf diesen Zauber während der gesamten Wirkungsdauer aufrecht, wird die Wand dauerhaft und kann nicht gebannt werden. Andernfalls verschwindet die Wand, wenn der Zauber endet.`,
    material: 'Ein kleiner Granitblock.',
  },
};
