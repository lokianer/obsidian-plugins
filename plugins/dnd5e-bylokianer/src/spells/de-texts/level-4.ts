// German texts of the SRD spells of the 4th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

const SUMMONED = `Die beschworenen Kreaturen sind dir und deinen Gefährten freundlich gesinnt. Würfle die Initiative der beschworenen Kreaturen als Gruppe aus, die eigene Züge hat. Sie gehorchen allen mündlichen Befehlen, die du ihnen gibst (dafür brauchst du keine Aktion). Gibst du ihnen keine Befehle, verteidigen sie sich gegen feindselige Kreaturen, führen ansonsten aber keine Aktionen aus.

Der SL hat die Spielwerte der Kreaturen.`;

const MORE_SUMMONED = `Wenn du diesen Zauber mit bestimmten höhergradigen Zauberplätzen wirkst, wählst du eine der obigen Beschwörungsmöglichkeiten, und es erscheinen mehr Kreaturen: doppelt so viele mit einem Platz des 6. Grades und dreimal so viele mit einem Platz des 8. Grades.`;

export const DE_TEXTS_4: Readonly<Record<string, DeText>> = {
  'arcane-eye': {
    text: `Du erschaffst in Reichweite ein unsichtbares, magisches Auge, das für die Wirkungsdauer in der Luft schwebt.

Du empfängst geistig Seheindrücke vom Auge, das normale Sicht und Dunkelsicht bis 9 m hat. Das Auge kann in jede Richtung blicken.

Als Aktion kannst du das Auge bis zu 9 m weit in eine beliebige Richtung bewegen. Es gibt keine Grenze dafür, wie weit sich das Auge von dir entfernen kann, aber es kann keine andere Existenzebene betreten. Eine feste Barriere hält das Auge auf, doch es kann sich durch eine Öffnung mit nur 2,5 cm Durchmesser bewegen.`,
    material: 'Ein Büschel Fledermausfell.',
  },
  banishment: {
    text: `Du versuchst, eine Kreatur, die du in Reichweite sehen kannst, auf eine andere Existenzebene zu schicken. Das Ziel muss einen Charismarettungswurf bestehen, sonst wird es verbannt.

Stammt das Ziel von der Existenzebene, auf der du dich befindest, verbannst du es auf eine harmlose Halbebene. Dort ist das Ziel kampfunfähig. Es bleibt dort, bis der Zauber endet; dann erscheint es wieder in dem Bereich, den es verlassen hat, oder im nächstgelegenen freien Bereich, falls dieser besetzt ist.

Stammt das Ziel von einer anderen Existenzebene als der, auf der du dich befindest, wird es mit einem leisen Knall verbannt und kehrt auf seine Heimatebene zurück. Endet der Zauber, bevor 1 Minute vergangen ist, erscheint das Ziel wieder in dem Bereich, den es verlassen hat, oder im nächstgelegenen freien Bereich, falls dieser besetzt ist. Andernfalls kehrt das Ziel nicht zurück.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, kannst du für jeden Grad über dem 4. eine zusätzliche Kreatur als Ziel wählen.`,
    material: 'Ein Gegenstand, den das Ziel verabscheut.',
  },
  'black-tentacles': {
    text: `Sich windende, ebenholzschwarze Tentakel füllen ein Quadrat mit 6 m Seitenlänge auf dem Boden, das du in Reichweite sehen kannst. Für die Wirkungsdauer machen diese Tentakel den Boden im Bereich zu schwierigem Gelände.

Betritt eine Kreatur den betroffenen Bereich in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Geschicklichkeitsrettungswurf bestehen, sonst erleidet sie 3W6 Wuchtschaden und ist von den Tentakeln festgesetzt, bis der Zauber endet. Eine Kreatur, die ihren Zug im Bereich beginnt und bereits von den Tentakeln festgesetzt ist, erleidet 3W6 Wuchtschaden.

Eine von den Tentakeln festgesetzte Kreatur kann ihre Aktion nutzen, um einen Stärke- oder Geschicklichkeitswurf (ihre Wahl) gegen deinen Zauberrettungswurf-SG abzulegen. Bei einem Erfolg befreit sie sich.`,
    material: 'Ein Stück Tentakel eines Riesenkraken oder Riesenkalmars.',
  },
  blight: {
    text: `Nekromantische Energie überflutet eine Kreatur deiner Wahl, die du in Reichweite sehen kannst, und entzieht ihr Feuchtigkeit und Lebenskraft. Das Ziel muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet es 8W8 nekrotischen Schaden, bei einem erfolgreichen die Hälfte. Der Zauber wirkt nicht auf Untote oder Konstrukte.

Wählst du eine Pflanzenkreatur oder eine magische Pflanze als Ziel, legt sie den Rettungswurf mit Nachteil ab, und der Zauber verursacht bei ihr den höchstmöglichen Schaden.

Wählst du eine nichtmagische Pflanze, die keine Kreatur ist, etwa einen Baum oder Strauch, legt sie keinen Rettungswurf ab; sie welkt einfach und stirbt.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 4. um 1W8.`,
  },
  compulsion: {
    text: `Kreaturen deiner Wahl, die du in Reichweite sehen kannst und die dich hören können, müssen einen Weisheitsrettungswurf ablegen. Ein Ziel besteht diesen Rettungswurf automatisch, wenn es nicht bezaubert werden kann. Bei einem misslungenen Rettungswurf ist ein Ziel von diesem Zauber betroffen. Bis der Zauber endet, kannst du in jedem deiner Züge eine Bonusaktion nutzen, um eine waagerechte Richtung von dir aus zu bestimmen. Jedes betroffene Ziel muss in seinem nächsten Zug so viel seiner Bewegung wie möglich nutzen, um sich in diese Richtung zu bewegen. Vor der Bewegung kann es jede beliebige Aktion ausführen. Nach einer solchen Bewegung kann es einen weiteren Weisheitsrettungswurf ablegen, um die Wirkung zu beenden.

Ein Ziel wird nicht gezwungen, sich in eine offensichtlich tödliche Gefahr wie ein Feuer oder eine Grube zu bewegen, nimmt aber Gelegenheitsangriffe in Kauf, um sich in die bestimmte Richtung zu bewegen.`,
  },
  confusion: {
    text: `Dieser Zauber bedrängt und verdreht den Geist von Kreaturen, erzeugt Wahnvorstellungen und provoziert unkontrollierte Handlungen. Jede Kreatur in einer Kugel mit 3 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist, muss beim Wirken dieses Zaubers einen Weisheitsrettungswurf bestehen, sonst ist sie betroffen.

Ein betroffenes Ziel kann keine Reaktionen ausführen und muss zu Beginn jedes seiner Züge einen W10 werfen, um sein Verhalten in diesem Zug zu bestimmen.

| W10 | Verhalten |
|---|---|
| 1 | Die Kreatur nutzt ihre ganze Bewegung, um sich in eine zufällige Richtung zu bewegen. Um die Richtung zu bestimmen, wirf einen W8 und weise jeder Würfelseite eine Richtung zu. Die Kreatur führt in diesem Zug keine Aktion aus. |
| 2–6 | Die Kreatur bewegt sich in diesem Zug nicht und führt keine Aktionen aus. |
| 7–8 | Die Kreatur nutzt ihre Aktion für einen Nahkampfangriff gegen eine zufällig bestimmte Kreatur in ihrer Reichweite. Ist keine Kreatur in ihrer Reichweite, tut die Kreatur in diesem Zug nichts. |
| 9–10 | Die Kreatur kann normal handeln und sich bewegen. |

Am Ende jedes seiner Züge kann ein betroffenes Ziel einen Weisheitsrettungswurf ablegen. Gelingt er, endet diese Wirkung für das Ziel.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, steigt der Radius der Kugel für jeden Grad über dem 4. um 1,5 m.`,
    material: 'Drei Walnussschalen.',
  },
  'conjure-minor-elementals': {
    text: `Du beschwörst Elementare, die in freien Bereichen erscheinen, die du in Reichweite sehen kannst. Wähle eine der folgenden Möglichkeiten für das, was erscheint:

- Ein Elementar mit Herausforderungsgrad 2 oder niedriger

- Zwei Elementare mit Herausforderungsgrad 1 oder niedriger

- Vier Elementare mit Herausforderungsgrad 1/2 oder niedriger

- Acht Elementare mit Herausforderungsgrad 1/4 oder niedriger

Ein durch diesen Zauber beschworener Elementar verschwindet, wenn er auf 0 Trefferpunkte fällt oder der Zauber endet.

${SUMMONED}`,
    higher: MORE_SUMMONED,
  },
  'conjure-woodland-beings': {
    text: `Du beschwörst Feenwesen, die in freien Bereichen erscheinen, die du in Reichweite sehen kannst. Wähle eine der folgenden Möglichkeiten für das, was erscheint:

- Ein Feenwesen mit Herausforderungsgrad 2 oder niedriger

- Zwei Feenwesen mit Herausforderungsgrad 1 oder niedriger

- Vier Feenwesen mit Herausforderungsgrad 1/2 oder niedriger

- Acht Feenwesen mit Herausforderungsgrad 1/4 oder niedriger

Eine beschworene Kreatur verschwindet, wenn sie auf 0 Trefferpunkte fällt oder der Zauber endet.

${SUMMONED}`,
    higher: MORE_SUMMONED,
    material: 'Eine Stechpalmenbeere pro beschworener Kreatur.',
  },
  'control-water': {
    text: `Bis der Zauber endet, kontrollierst du alles frei stehende Wasser in einem Bereich deiner Wahl, der ein Würfel mit bis zu 30 m Kantenlänge ist. Beim Wirken dieses Zaubers kannst du eine der folgenden Wirkungen wählen. Als Aktion in deinem Zug kannst du dieselbe Wirkung wiederholen oder eine andere wählen.

***Flut.*** Du lässt den Wasserspiegel allen stehenden Wassers im Bereich um bis zu 6 m steigen. Gehört ein Ufer zum Bereich, schwappt das Flutwasser auf das trockene Land.

Wählst du einen Bereich in einem großen Gewässer, erschaffst du stattdessen eine 6 m hohe Welle, die von einer Seite des Bereichs zur anderen rollt und dann niederkracht. Alle riesigen oder kleineren Fahrzeuge auf dem Weg der Welle werden mit ihr zur anderen Seite getragen. Alle riesigen oder kleineren Fahrzeuge, die von der Welle getroffen werden, kentern mit einer Wahrscheinlichkeit von 25 Prozent.

Der Wasserspiegel bleibt erhöht, bis der Zauber endet oder du eine andere Wirkung wählst. Hat diese Wirkung eine Welle erzeugt, wiederholt sich die Welle zu Beginn deines nächsten Zuges, solange die Flutwirkung anhält.

***Wasser teilen.*** Du lässt das Wasser im Bereich auseinanderweichen und einen Graben bilden. Der Graben erstreckt sich über den Bereich des Zaubers, und das geteilte Wasser bildet zu beiden Seiten eine Wand. Der Graben bleibt, bis der Zauber endet oder du eine andere Wirkung wählst. Danach füllt das Wasser den Graben im Laufe der nächsten Runde langsam auf, bis der normale Wasserspiegel wiederhergestellt ist.

***Strömung umlenken.*** Du lässt fließendes Wasser im Bereich in eine Richtung deiner Wahl strömen, auch wenn es dafür über Hindernisse, Wände hinauf oder in andere unwahrscheinliche Richtungen fließen muss. Das Wasser im Bereich bewegt sich, wie du es lenkst, doch sobald es den Bereich des Zaubers verlässt, fließt es wieder dem Gelände entsprechend. Das Wasser bewegt sich weiter in die gewählte Richtung, bis der Zauber endet oder du eine andere Wirkung wählst.

***Strudel.*** Diese Wirkung erfordert ein Gewässer von mindestens 15 m Seitenlänge und 7,5 m Tiefe. Du lässt in der Mitte des Bereichs einen Strudel entstehen. Der Strudel bildet einen Wirbel, der am Grund 1,5 m breit, oben bis zu 15 m breit und 7,5 m hoch ist. Jede Kreatur und jeder Gegenstand im Wasser im Umkreis von 7,5 m um den Wirbel wird 3 m auf ihn zu gezogen. Eine Kreatur kann vom Wirbel wegschwimmen, indem sie einen Stärkewurf (Athletik) gegen deinen Zauberrettungswurf-SG ablegt.

Betritt eine Kreatur den Wirbel in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Stärkerettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 2W8 Wuchtschaden und ist im Wirbel gefangen, bis der Zauber endet. Bei einem erfolgreichen Rettungswurf erleidet sie den halben Schaden und ist nicht im Wirbel gefangen. Eine im Wirbel gefangene Kreatur kann ihre Aktion nutzen, um wie oben beschrieben vom Wirbel wegzuschwimmen, ist dabei aber beim Stärkewurf (Athletik) im Nachteil.

Wenn ein Gegenstand in einem Zug zum ersten Mal in den Wirbel gerät, erleidet er 2W8 Wuchtschaden; dieser Schaden tritt in jeder Runde ein, die er im Wirbel bleibt.`,
    material: 'Ein Tropfen Wasser und eine Prise Staub.',
  },
  'death-ward': {
    text: `Du berührst eine Kreatur und gewährst ihr ein gewisses Maß an Schutz vor dem Tod.

Wenn das Ziel zum ersten Mal infolge von Schaden auf 0 Trefferpunkte fallen würde, fällt es stattdessen auf 1 Trefferpunkt, und der Zauber endet.

Wirkt der Zauber noch, wenn das Ziel einer Wirkung ausgesetzt wird, die es augenblicklich töten würde, ohne Schaden zu verursachen, wird diese Wirkung gegen das Ziel stattdessen aufgehoben, und der Zauber endet.`,
  },
  'dimension-door': {
    text: `Du teleportierst dich von deinem aktuellen Ort an eine beliebige andere Stelle in Reichweite. Du kommst genau an der gewünschten Stelle an. Das kann ein Ort sein, den du sehen kannst, einer, den du dir vorstellen kannst, oder einer, den du durch Angabe von Entfernung und Richtung beschreiben kannst, etwa „60 m senkrecht nach unten“ oder „nach oben in nordwestlicher Richtung, im 45-Grad-Winkel, 90 m“.

Du kannst Gegenstände mitnehmen, solange ihr Gewicht nicht mehr beträgt, als du tragen kannst. Du kannst auch eine bereitwillige Kreatur deiner Größe oder kleiner mitnehmen, die Ausrüstung bis zu ihrer Tragkraft trägt. Die Kreatur muss sich beim Wirken dieses Zaubers höchstens 1,5 m von dir entfernt befinden.

Würdest du an einem Ort ankommen, der bereits von einem Gegenstand oder einer Kreatur besetzt ist, erleiden du und jede Kreatur, die mit dir reist, jeweils 4W6 Energieschaden, und der Zauber teleportiert dich nicht.`,
  },
  divination: {
    text: `Deine Magie und ein Opfer bringen dich in Kontakt mit einem Gott oder seinen Dienern. Du stellst eine einzige Frage zu einem bestimmten Ziel, Ereignis oder Vorhaben, das innerhalb von 7 Tagen eintreten soll. Der SL gibt eine wahrheitsgemäße Antwort. Die Antwort kann ein kurzer Satz, ein rätselhafter Reim oder ein Omen sein.

Der Zauber berücksichtigt keine möglichen Umstände, die den Ausgang ändern könnten, etwa das Wirken weiterer Zauber oder den Verlust oder Gewinn eines Gefährten.

Wirkst du den Zauber zweimal oder öfter, bevor du deine nächste lange Rast beendest, besteht für jedes Wirken nach dem ersten eine sich aufaddierende Wahrscheinlichkeit von 25 Prozent, dass du eine zufällige Deutung erhältst. Der SL würfelt dies verdeckt aus.`,
    material:
      'Weihrauch und eine zu deiner Religion passende Opfergabe im Gesamtwert von mindestens 25 GM, die der Zauber verbraucht.',
  },
  'dominate-beast': {
    text: `Du versuchst, eine Kreatur zu betören, die du in Reichweite sehen kannst. Sie muss einen Weisheitsrettungswurf bestehen, sonst ist sie für die Wirkungsdauer von dir bezaubert. Kämpfst du oder kämpfen dir freundlich gesinnte Kreaturen gegen sie, ist sie beim Rettungswurf im Vorteil.

Solange die Kreatur bezaubert ist, hast du eine telepathische Verbindung zu ihr, sofern ihr euch auf derselben Existenzebene befindet. Über diese telepathische Verbindung kannst du der Kreatur Befehle geben, solange du bei Bewusstsein bist (dafür brauchst du keine Aktion), und sie tut ihr Bestes, um zu gehorchen. Du kannst eine einfache und allgemeine Handlung vorgeben, etwa „Greif diese Kreatur an“, „Lauf dorthin“ oder „Hol diesen Gegenstand“. Erfüllt die Kreatur den Befehl und erhält sie keine weitere Anweisung von dir, verteidigt und schützt sie sich nach besten Kräften.

Du kannst deine Aktion nutzen, um die vollständige und genaue Kontrolle über das Ziel zu übernehmen. Bis zum Ende deines nächsten Zuges führt die Kreatur nur die Aktionen aus, die du wählst, und tut nichts, was du ihr nicht erlaubst. Während dieser Zeit kannst du die Kreatur auch eine Reaktion ausführen lassen, musst dafür aber auch deine eigene Reaktion nutzen. Jedes Mal, wenn das Ziel Schaden erleidet, legt es einen neuen Weisheitsrettungswurf gegen den Zauber ab. Gelingt der Rettungswurf, endet der Zauber.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 9. Grades wirkst, beträgt die Wirkungsdauer Konzentration, bis zu 8 Stunden.`,
  },
  fabricate: {
    text: `Du verwandelst Rohstoffe in Erzeugnisse aus demselben Material. Du kannst zum Beispiel aus einer Gruppe Bäume eine Holzbrücke fertigen, aus einem Hanffeld ein Seil und aus Flachs oder Wolle Kleidung.

Wähle Rohstoffe, die du in Reichweite sehen kannst. Du kannst einen großen oder kleineren Gegenstand fertigen (der in einen Würfel mit 3 m Kantenlänge oder in acht verbundene Würfel mit 1,5 m Kantenlänge passt), sofern genug Rohstoff vorhanden ist. Arbeitest du jedoch mit Metall, Stein oder einem anderen mineralischen Stoff, darf der gefertigte Gegenstand höchstens mittelgroß sein (in einen einzelnen Würfel mit 1,5 m Kantenlänge passen). Die Qualität der vom Zauber gefertigten Gegenstände entspricht der Qualität der Rohstoffe.

Kreaturen oder magische Gegenstände können mit diesem Zauber weder erschaffen noch verwandelt werden. Du kannst ihn auch nicht nutzen, um Gegenstände herzustellen, die gewöhnlich hohe Handwerkskunst erfordern, etwa Schmuck, Waffen, Glas oder Rüstungen, es sei denn, du bist im Umgang mit den Handwerkerwerkzeugen geübt, mit denen solche Gegenstände hergestellt werden.`,
  },
  'faithful-hound': {
    text: `Du beschwörst einen geisterhaften Wachhund in einem freien Bereich, den du in Reichweite sehen kannst. Dort bleibt er für die Wirkungsdauer, bis du ihn als Aktion entlässt oder bis du dich mehr als 30 m von ihm entfernst.

Der Hund ist für alle Kreaturen außer dir unsichtbar und kann nicht verletzt werden. Nähert sich ihm eine kleine oder größere Kreatur auf 9 m, ohne zuvor das Losungswort zu sprechen, das du beim Wirken festlegst, beginnt der Hund laut zu bellen. Der Hund sieht unsichtbare Kreaturen und kann in die Ätherebene sehen. Er ignoriert Illusionen.

Zu Beginn jedes deiner Züge versucht der Hund, eine dir feindselig gesinnte Kreatur im Umkreis von 1,5 m zu beißen. Der Angriffsbonus des Hundes entspricht deinem Zauberattributsmodifikator + deinem Übungsbonus. Bei einem Treffer verursacht er 4W8 Stichschaden.`,
    material: 'Eine winzige Silberpfeife, ein Stück Knochen und ein Faden.',
  },
  'fire-shield': {
    text: `Dünne, rauchige Flammen umhüllen deinen Körper für die Wirkungsdauer und spenden in einem Radius von 3 m helles Licht und weitere 3 m dämmriges Licht. Du kannst den Zauber vorzeitig beenden, indem du ihn als Aktion verschwinden lässt.

Die Flammen bilden um dich einen warmen oder einen kalten Schild, deine Wahl. Der warme Schild gewährt dir Resistenz gegen Kälteschaden, der kalte Schild Resistenz gegen Feuerschaden.

Außerdem schießen jedes Mal, wenn eine Kreatur im Umkreis von 1,5 m dich mit einem Nahkampfangriff trifft, Flammen aus dem Schild. Der Angreifer erleidet dann 2W8 Feuerschaden beim warmen Schild oder Kälteschaden beim kalten Schild.`,
    material: 'Ein wenig Phosphor oder ein Glühwürmchen.',
  },
  'freedom-of-movement': {
    text: `Du berührst eine bereitwillige Kreatur. Für die Wirkungsdauer wird die Bewegung des Ziels nicht durch schwieriges Gelände beeinträchtigt, und Zauber und andere magische Wirkungen können weder seine Bewegungsrate verringern noch es lähmen oder festsetzen.

Das Ziel kann außerdem 1,5 m Bewegung aufwenden, um sich automatisch aus nichtmagischen Fesseln zu befreien, etwa aus Handschellen oder dem Griff einer Kreatur, die es gepackt hält. Schließlich bringt es dem Ziel keine Nachteile für Bewegung oder Angriffe, unter Wasser zu sein.`,
    material: 'Ein Lederriemen, um einen Arm oder ein ähnliches Körperglied gebunden.',
  },
  'giant-insect': {
    text: `Du verwandelst in Reichweite bis zu zehn Hundertfüßer, drei Spinnen, fünf Wespen oder einen Skorpion für die Wirkungsdauer in riesige Versionen ihrer natürlichen Gestalt. Ein Hundertfüßer wird zu einem Riesenhundertfüßer, eine Spinne zu einer Riesenspinne, eine Wespe zu einer Riesenwespe und ein Skorpion zu einem Riesenskorpion.

Jede Kreatur gehorcht deinen mündlichen Befehlen, und im Kampf handeln sie in jeder Runde in deinem Zug. Der SL hat die Spielwerte dieser Kreaturen und handhabt ihre Aktionen und Bewegungen.

Eine Kreatur behält ihre riesige Größe für die Wirkungsdauer, bis sie auf 0 Trefferpunkte fällt oder bis du eine Aktion nutzt, um die Wirkung auf sie zu beenden.

Der SL erlaubt dir vielleicht, andere Ziele zu wählen. Verwandelst du zum Beispiel eine Biene, könnte ihre riesige Version die Spielwerte einer Riesenwespe haben.`,
  },
  'greater-invisibility': {
    text: `Du oder eine Kreatur, die du berührst, wird unsichtbar, bis der Zauber endet. Alles, was das Ziel trägt oder hält, ist unsichtbar, solange es sich am Körper des Ziels befindet.`,
  },
  'guardian-of-faith': {
    text: `Ein großer, geisterhafter Wächter erscheint und schwebt für die Wirkungsdauer in einem freien Bereich deiner Wahl, den du in Reichweite sehen kannst. Der Wächter besetzt diesen Bereich und ist bis auf ein glänzendes Schwert und einen Schild mit dem Symbol deiner Gottheit undeutlich.

Jede dir feindselig gesinnte Kreatur, die sich in einem Zug zum ersten Mal in einen Bereich im Umkreis von 3 m um den Wächter bewegt, muss einen Geschicklichkeitsrettungswurf bestehen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 20 gleißenden Schaden, bei einem erfolgreichen die Hälfte. Der Wächter verschwindet, sobald er insgesamt 60 Schaden verursacht hat.`,
  },
  'hallucinatory-terrain': {
    text: `Du lässt natürliches Gelände in einem Würfel mit 45 m Kantenlänge in Reichweite aussehen, klingen und riechen wie eine andere Art natürlichen Geländes. So können offene Felder oder eine Straße wie ein Sumpf, ein Hügel, eine Gletscherspalte oder ein anderes schwieriges oder unpassierbares Gelände erscheinen. Ein Teich kann wie eine grasige Wiese wirken, ein Abgrund wie ein sanfter Hang oder eine felsübersäte Rinne wie eine breite, glatte Straße. Bauwerke, Ausrüstung und Kreaturen im Bereich verändern ihr Aussehen nicht.

Die Beschaffenheit des Geländes beim Ertasten bleibt unverändert, daher durchschauen Kreaturen, die den Bereich betreten, die Illusion wahrscheinlich. Ist der Unterschied nicht durch Berührung offensichtlich, kann eine Kreatur, die die Illusion sorgfältig untersucht, einen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG ablegen, um sie zu durchschauen. Eine Kreatur, die die Illusion durchschaut, sieht sie als verschwommenes Bild, das über dem Gelände liegt.`,
    material: 'Ein Stein, ein Zweig und ein Stück grüner Pflanze.',
  },
  'ice-storm': {
    text: `Ein Hagel aus steinhartem Eis prasselt in einem Zylinder mit 6 m Radius und 12 m Höhe, dessen Mittelpunkt ein Punkt in Reichweite ist, zu Boden. Jede Kreatur im Zylinder muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 2W8 Wuchtschaden und 4W6 Kälteschaden, bei einem erfolgreichen die Hälfte.

Hagelkörner machen den Wirkungsbereich des Sturms bis zum Ende deines nächsten Zuges zu schwierigem Gelände.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, steigt der Wuchtschaden für jeden Grad über dem 4. um 1W8.`,
    material: 'Eine Prise Staub und ein paar Tropfen Wasser.',
  },
  'locate-creature': {
    text: `Beschreibe oder benenne eine Kreatur, die dir vertraut ist. Du spürst die Richtung zum Ort der Kreatur, solange sie höchstens 300 m von dir entfernt ist. Bewegt sich die Kreatur, kennst du die Richtung ihrer Bewegung.

Der Zauber kann eine bestimmte, dir bekannte Kreatur aufspüren oder die nächste Kreatur einer bestimmten Art (etwa einen Menschen oder ein Einhorn), sofern du eine solche Kreatur mindestens einmal aus der Nähe – höchstens 9 m – gesehen hast. Befindet sich die beschriebene oder benannte Kreatur in einer anderen Gestalt, etwa unter der Wirkung des Zaubers *Verwandlung*, spürt dieser Zauber sie nicht auf.

Dieser Zauber kann eine Kreatur nicht aufspüren, wenn fließendes Wasser von mindestens 3 m Breite den direkten Weg zwischen dir und der Kreatur versperrt.`,
    material: 'Ein Büschel Fell eines Bluthunds.',
  },
  'phantasmal-killer': {
    text: `Du greifst auf die Albträume einer Kreatur zu, die du in Reichweite sehen kannst, und erschaffst eine illusionäre Verkörperung ihrer tiefsten Ängste, die nur diese Kreatur sehen kann. Das Ziel muss einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist das Ziel für die Wirkungsdauer verängstigt. Zu Beginn jedes seiner Züge vor dem Ende des Zaubers muss das Ziel einen Weisheitsrettungswurf bestehen, sonst erleidet es 4W10 psychischen Schaden. Bei einem erfolgreichen Rettungswurf endet der Zauber.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 4. um 1W10.`,
  },
  polymorph: {
    text: `Dieser Zauber verwandelt eine Kreatur, die du in Reichweite sehen kannst, in eine neue Gestalt. Eine nicht bereitwillige Kreatur muss einen Weisheitsrettungswurf ablegen, um der Wirkung zu entgehen. Ein Gestaltwandler besteht diesen Rettungswurf automatisch.

Die Verwandlung hält für die Wirkungsdauer an oder bis das Ziel auf 0 Trefferpunkte fällt oder stirbt. Die neue Gestalt kann jedes Tier sein, dessen Herausforderungsgrad kleiner oder gleich dem des Ziels ist (oder seiner Stufe, wenn es keinen Herausforderungsgrad hat). Die Spielwerte des Ziels, einschließlich seiner geistigen Attributswerte, werden durch die Spielwerte des gewählten Tiers ersetzt. Es behält seine Gesinnung und Persönlichkeit.

Das Ziel übernimmt die Trefferpunkte seiner neuen Gestalt. Nimmt es wieder seine normale Gestalt an, kehrt die Kreatur zu der Zahl an Trefferpunkten zurück, die sie vor der Verwandlung hatte. Verwandelt sie sich zurück, weil sie auf 0 Trefferpunkte gefallen ist, wird überschüssiger Schaden auf ihre normale Gestalt übertragen. Solange der überschüssige Schaden die normale Gestalt der Kreatur nicht auf 0 Trefferpunkte bringt, wird sie nicht bewusstlos.

Die Kreatur ist in den Aktionen, die sie ausführen kann, durch die Natur ihrer neuen Gestalt eingeschränkt, und sie kann weder sprechen noch Zauber wirken noch eine andere Aktion ausführen, die Hände oder Sprache erfordert.

Die Ausrüstung des Ziels verschmilzt mit der neuen Gestalt. Die Kreatur kann ihre Ausrüstung weder aktivieren noch benutzen, führen oder anderweitig von ihr profitieren.`,
    material: 'Ein Raupenkokon.',
  },
  'private-sanctum': {
    text: `Du sicherst einen Bereich in Reichweite magisch ab. Der Bereich ist ein Würfel mit einer Kantenlänge von mindestens 1,5 m und höchstens 30 m. Der Zauber hält für die Wirkungsdauer an oder bis du ihn mit einer Aktion beendest.

Wenn du den Zauber wirkst, bestimmst du, welchen Schutz er bietet, und wählst eine, mehrere oder alle der folgenden Eigenschaften:

- Geräusche können die Barriere am Rand des geschützten Bereichs nicht durchdringen.

- Die Barriere des geschützten Bereichs erscheint dunkel und neblig und verhindert die Sicht (auch Dunkelsicht) hindurch.

- Sensoren, die durch Erkenntniszauber erschaffen werden, können nicht im geschützten Bereich erscheinen oder die Barriere an seinem Rand durchqueren.

- Kreaturen im Bereich können nicht zum Ziel von Erkenntniszaubern werden.

- Nichts kann sich in den geschützten Bereich hinein oder aus ihm heraus teleportieren.

- Reisen zwischen den Ebenen ist im geschützten Bereich blockiert.

Wirkst du diesen Zauber ein Jahr lang jeden Tag an derselben Stelle, wird die Wirkung dauerhaft.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, kannst du die Kantenlänge des Würfels für jeden Grad über dem 4. um 30 m vergrößern. Mit einem Zauberplatz des 5. Grades könntest du also einen Würfel mit bis zu 60 m Kantenlänge schützen.`,
    material:
      'Eine dünne Bleiplatte, ein Stück undurchsichtiges Glas, ein Bausch Baumwolle oder Stoff und Chrysolithpulver.',
  },
  'resilient-sphere': {
    text: `Eine Kugel aus schimmernder Energie umschließt eine große oder kleinere Kreatur oder einen solchen Gegenstand in Reichweite. Eine nicht bereitwillige Kreatur muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist die Kreatur für die Wirkungsdauer eingeschlossen.

Nichts – weder Gegenstände noch Energie noch andere Zauberwirkungen – kann die Barriere durchqueren, weder hinein noch hinaus, doch eine Kreatur in der Kugel kann darin atmen. Die Kugel ist immun gegen jeglichen Schaden, und eine Kreatur oder ein Gegenstand darin kann nicht durch Angriffe oder Wirkungen von außen verletzt werden; ebenso kann eine Kreatur in der Kugel nichts außerhalb verletzen.

Die Kugel ist gewichtslos und gerade groß genug, um die Kreatur oder den Gegenstand darin aufzunehmen. Eine eingeschlossene Kreatur kann ihre Aktion nutzen, um gegen die Wände der Kugel zu drücken und sie so mit bis zur Hälfte ihrer Bewegungsrate zu rollen. Ebenso kann die Kugel von anderen Kreaturen aufgehoben und bewegt werden.

Der Zauber *Auflösung*, auf die Kugel gewirkt, zerstört sie, ohne etwas darin zu verletzen.`,
    material:
      'Ein halbkugelförmiges Stück klaren Kristalls und ein passendes halbkugelförmiges Stück Gummiarabikum.',
  },
  'secret-chest': {
    text: `Du versteckst eine Truhe samt ihrem gesamten Inhalt auf der Ätherebene. Du musst die Truhe und die Miniaturnachbildung berühren, die als Materialkomponente des Zaubers dient. Die Truhe kann bis zu 0,35 Kubikmeter nicht lebendes Material aufnehmen (90 cm mal 60 cm mal 60 cm).

Solange die Truhe auf der Ätherebene bleibt, kannst du eine Aktion nutzen und die Nachbildung berühren, um die Truhe zurückzurufen. Sie erscheint in einem freien Bereich auf dem Boden im Umkreis von 1,5 m um dich. Du kannst die Truhe auf die Ätherebene zurückschicken, indem du eine Aktion nutzt und sowohl die Truhe als auch die Nachbildung berührst.

Nach 60 Tagen besteht eine sich aufaddierende Wahrscheinlichkeit von 5 Prozent pro Tag, dass die Wirkung des Zaubers endet. Die Wirkung endet, wenn du diesen Zauber erneut wirkst, wenn die kleine Nachbildung zerstört wird oder wenn du den Zauber als Aktion beendest. Endet der Zauber, während sich die große Truhe auf der Ätherebene befindet, ist sie unwiederbringlich verloren.`,
    material:
      'Eine erlesene Truhe von 90 cm mal 60 cm mal 60 cm aus seltenen Materialien im Wert von mindestens 5.000 GM und eine winzige Nachbildung aus denselben Materialien im Wert von mindestens 50 GM.',
  },
  'stone-shape': {
    text: `Du berührst einen steinernen Gegenstand mittlerer Größe oder kleiner oder einen Abschnitt aus Stein, der in keiner Richtung größer als 1,5 m ist, und formst ihn in jede Gestalt, die deinem Zweck dient. So könntest du zum Beispiel einen großen Felsen zu einer Waffe, einem Götzenbild oder einer Schatulle formen oder einen kleinen Durchgang durch eine Wand schaffen, sofern die Wand weniger als 1,5 m dick ist. Du könntest auch eine Steintür oder ihren Rahmen so formen, dass die Tür versiegelt ist. Der geschaffene Gegenstand kann bis zu zwei Scharniere und einen Riegel haben, feinere mechanische Einzelheiten sind aber nicht möglich.`,
    material: 'Weicher Ton, grob in die gewünschte Form des steinernen Gegenstands geknetet.',
  },
  stoneskin: {
    text: `Dieser Zauber macht das Fleisch einer bereitwilligen Kreatur, die du berührst, hart wie Stein. Bis der Zauber endet, hat das Ziel Resistenz gegen nichtmagischen Wucht-, Stich- und Hiebschaden.`,
    material: 'Diamantstaub im Wert von 100 GM, den der Zauber verbraucht.',
  },
  'wall-of-fire': {
    text: `Du erschaffst auf einer festen Oberfläche in Reichweite eine Feuerwand. Du kannst die Wand bis zu 18 m lang, 6 m hoch und 30 cm dick machen oder als Ringwand mit bis zu 6 m Durchmesser, 6 m Höhe und 30 cm Dicke. Die Wand ist undurchsichtig und bleibt für die Wirkungsdauer bestehen.

Wenn die Wand erscheint, muss jede Kreatur in ihrem Bereich einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 5W8 Feuerschaden, bei einem erfolgreichen die Hälfte.

Eine Seite der Wand, die du beim Wirken bestimmst, verursacht bei jeder Kreatur, die ihren Zug im Umkreis von 3 m um diese Seite oder in der Wand beendet, 5W8 Feuerschaden. Eine Kreatur erleidet denselben Schaden, wenn sie die Wand in einem Zug zum ersten Mal betritt oder ihren Zug dort beendet. Die andere Seite der Wand verursacht keinen Schaden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 5. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 4. um 1W8.`,
    material: 'Ein kleines Stück Phosphor.',
  },
};
