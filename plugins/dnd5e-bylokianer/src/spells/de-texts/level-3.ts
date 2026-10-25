// German texts of the SRD spells of the 3rd level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_3: Readonly<Record<string, DeText>> = {
  'animate-dead': {
    text: `Dieser Zauber erschafft einen untoten Diener. Wähle in Reichweite einen Knochenhaufen oder die Leiche eines mittelgroßen oder kleinen Humanoiden. Dein Zauber durchdringt das Ziel mit einem widerwärtigen Abbild des Lebens und erhebt es als untote Kreatur. Das Ziel wird zu einem Skelett, wenn du Knochen gewählt hast, oder zu einem Zombie, wenn du eine Leiche gewählt hast (der SL hat die Spielwerte der Kreatur).

In jedem deiner Züge kannst du eine Bonusaktion nutzen, um jeder Kreatur, die du mit diesem Zauber erschaffen hast, geistig einen Befehl zu geben, sofern sie höchstens 18 m von dir entfernt ist (kontrollierst du mehrere Kreaturen, kannst du einer, mehreren oder allen gleichzeitig denselben Befehl geben). Du bestimmst, welche Aktion die Kreatur in ihrem nächsten Zug ausführt und wohin sie sich bewegt, oder du gibst einen allgemeinen Befehl, etwa eine bestimmte Kammer oder einen Gang zu bewachen. Gibst du keine Befehle, verteidigt sich die Kreatur nur gegen feindselige Kreaturen. Hat die Kreatur einen Befehl erhalten, befolgt sie ihn, bis ihre Aufgabe erledigt ist.

Die Kreatur steht 24 Stunden lang unter deiner Kontrolle, danach gehorcht sie keinem deiner Befehle mehr. Um die Kontrolle über die Kreatur für weitere 24 Stunden zu behalten, musst du diesen Zauber erneut auf die Kreatur wirken, bevor die aktuellen 24 Stunden enden. Auf diese Weise erneuerst du deine Kontrolle über bis zu vier Kreaturen, die du mit diesem Zauber belebt hast, statt eine neue zu beleben.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, belebst du für jeden Grad über dem 3. zwei zusätzliche untote Kreaturen oder erneuerst die Kontrolle über sie. Jede der Kreaturen muss aus einer anderen Leiche oder einem anderen Knochenhaufen stammen.`,
    material: 'Ein Tropfen Blut, ein Stück Fleisch und eine Prise Knochenstaub.',
  },
  'beacon-of-hope': {
    text: `Dieser Zauber schenkt Hoffnung und Lebenskraft. Wähle eine beliebige Anzahl von Kreaturen in Reichweite. Für die Wirkungsdauer ist jedes Ziel bei Weisheitsrettungswürfen und Todesrettungswürfen im Vorteil und erhält durch jede Heilung die höchstmögliche Zahl an Trefferpunkten zurück.`,
  },
  'bestow-curse': {
    text: `Du berührst eine Kreatur, und diese muss einen Weisheitsrettungswurf bestehen, sonst ist sie für die Wirkungsdauer verflucht. Wenn du diesen Zauber wirkst, wähle die Art des Fluchs aus den folgenden Möglichkeiten:

- Wähle einen Attributswert. Solange das Ziel verflucht ist, ist es bei Attributswürfen und Rettungswürfen mit diesem Attribut im Nachteil.

- Solange das Ziel verflucht ist, ist es bei Angriffswürfen gegen dich im Nachteil.

- Solange das Ziel verflucht ist, muss es zu Beginn jedes seiner Züge einen Weisheitsrettungswurf ablegen. Misslingt er, verschwendet es seine Aktion in diesem Zug, indem es nichts tut.

- Solange das Ziel verflucht ist, verursachen deine Angriffe und Zauber bei ihm zusätzlich 1W8 nekrotischen Schaden.

Der Zauber *Fluch brechen* beendet diese Wirkung. Mit Erlaubnis des SL kannst du eine andere Fluchwirkung wählen, die aber nicht mächtiger sein sollte als die oben beschriebenen. Der SL hat das letzte Wort über die Wirkung eines solchen Fluchs.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, beträgt die Wirkungsdauer Konzentration, bis zu 10 Minuten. Mit einem Zauberplatz des 5. Grades oder höher beträgt die Wirkungsdauer 8 Stunden, mit einem Zauberplatz des 7. Grades oder höher 24 Stunden. Mit einem Zauberplatz des 9. Grades hält der Zauber an, bis er gebannt wird. Ab einem Zauberplatz des 5. Grades erfordert die Wirkungsdauer keine Konzentration.`,
  },
  blink: {
    text: `Wirf für die Wirkungsdauer am Ende jedes deiner Züge einen W20. Bei einem Ergebnis von 11 oder mehr verschwindest du von deiner aktuellen Existenzebene und erscheinst auf der Ätherebene (befindest du dich bereits dort, misslingt der Zauber, und das Wirken ist verschwendet). Zu Beginn deines nächsten Zuges und wenn der Zauber endet, während du auf der Ätherebene bist, kehrst du in einen freien Bereich deiner Wahl zurück, den du im Umkreis von 3 m um den Bereich sehen kannst, aus dem du verschwunden bist. Ist in diesem Umkreis kein freier Bereich verfügbar, erscheinst du im nächstgelegenen freien Bereich (zufällig gewählt, wenn mehrere gleich nah sind). Du kannst diesen Zauber als Aktion beenden.

Auf der Ätherebene kannst du die Ebene sehen und hören, von der du gekommen bist; sie erscheint in Grautönen, und du kannst dort nichts sehen, das mehr als 18 m entfernt ist. Du kannst nur andere Kreaturen auf der Ätherebene beeinflussen und nur von ihnen beeinflusst werden. Kreaturen, die nicht dort sind, können dich weder wahrnehmen noch mit dir interagieren, es sei denn, sie haben die Fähigkeit dazu.`,
  },
  'call-lightning': {
    text: `Eine Gewitterwolke in Form eines Zylinders mit 3 m Höhe und 18 m Radius erscheint; ihr Mittelpunkt ist ein Punkt, den du 30 m direkt über dir sehen kannst. Der Zauber misslingt, wenn du keinen Punkt in der Luft sehen kannst, an dem die Gewitterwolke erscheinen könnte (zum Beispiel in einem Raum, der die Wolke nicht fassen kann).

Wenn du den Zauber wirkst, wähle einen Punkt, den du in Reichweite sehen kannst. Ein Blitz zuckt aus der Wolke auf diesen Punkt herab. Jede Kreatur im Umkreis von 1,5 m um diesen Punkt muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 3W10 Blitzschaden, bei einem erfolgreichen die Hälfte. In jedem deiner Züge bis zum Ende des Zaubers kannst du deine Aktion nutzen, um auf diese Weise erneut einen Blitz herabzurufen, auf denselben oder einen anderen Punkt.

Bist du beim Wirken dieses Zaubers bei stürmischem Wetter im Freien, gibt dir der Zauber die Kontrolle über den vorhandenen Sturm, statt einen neuen zu erschaffen. Unter solchen Bedingungen steigt der Schaden des Zaubers um 1W10.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 3. um 1W10.`,
  },
  clairvoyance: {
    text: `Du erschaffst in Reichweite einen unsichtbaren Sensor an einem dir vertrauten Ort (einem Ort, den du besucht oder gesehen hast) oder an einem offensichtlichen Ort, den du nicht kennst (etwa hinter einer Tür, um eine Ecke oder in einem Hain). Der Sensor bleibt für die Wirkungsdauer an Ort und Stelle und kann weder angegriffen noch auf andere Weise beeinflusst werden.

Wenn du den Zauber wirkst, wählst du Sehen oder Hören. Du kannst den gewählten Sinn durch den Sensor nutzen, als wärst du in seinem Bereich. Als deine Aktion kannst du zwischen Sehen und Hören wechseln.

Eine Kreatur, die den Sensor sehen kann (etwa eine Kreatur, die von *Unsichtbares sehen* oder Wahrsicht profitiert), sieht eine leuchtende, nicht greifbare Kugel von etwa der Größe deiner Faust.`,
    material:
      'Ein Fokus im Wert von mindestens 100 GM, entweder ein juwelenbesetztes Horn zum Hören oder ein Glasauge zum Sehen.',
  },
  'conjure-animals': {
    text: `Du beschwörst Feengeister, die die Gestalt von Tieren annehmen und in freien Bereichen erscheinen, die du in Reichweite sehen kannst. Wähle eine der folgenden Möglichkeiten für das, was erscheint:

- Ein Tier mit Herausforderungsgrad 2 oder niedriger

- Zwei Tiere mit Herausforderungsgrad 1 oder niedriger

- Vier Tiere mit Herausforderungsgrad 1/2 oder niedriger

- Acht Tiere mit Herausforderungsgrad 1/4 oder niedriger

- Jedes Tier gilt außerdem als Feenwesen und verschwindet, wenn es auf 0 Trefferpunkte fällt oder der Zauber endet.

Die beschworenen Kreaturen sind dir und deinen Gefährten freundlich gesinnt. Würfle die Initiative der beschworenen Kreaturen als Gruppe aus, die eigene Züge hat. Sie gehorchen allen mündlichen Befehlen, die du ihnen gibst (dafür brauchst du keine Aktion). Gibst du ihnen keine Befehle, verteidigen sie sich gegen feindselige Kreaturen, führen ansonsten aber keine Aktionen aus.

Der SL hat die Spielwerte der Kreaturen.`,
    higher: `Wenn du diesen Zauber mit bestimmten höhergradigen Zauberplätzen wirkst, wählst du eine der obigen Beschwörungsmöglichkeiten, und es erscheinen mehr Kreaturen: doppelt so viele mit einem Platz des 5. Grades, dreimal so viele mit einem Platz des 7. Grades.`,
  },
  counterspell: {
    text: `Du versuchst, eine Kreatur zu unterbrechen, während sie einen Zauber wirkt. Wirkt die Kreatur einen Zauber des 3. Grades oder niedriger, misslingt ihr Zauber und wirkt nicht. Wirkt sie einen Zauber des 4. Grades oder höher, lege einen Attributswurf mit deinem Zauberattribut ab. Der SG beträgt 10 + den Grad des Zaubers. Bei einem Erfolg misslingt der Zauber der Kreatur und wirkt nicht.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, wirkt der unterbrochene Zauber nicht, wenn sein Grad kleiner oder gleich dem Grad des verwendeten Zauberplatzes ist.`,
  },
  'create-food-and-water': {
    text: `Du erschaffst in Reichweite 22,5 kg Nahrung und 120 Liter Wasser auf dem Boden oder in Behältern, genug, um bis zu fünfzehn Humanoide oder fünf Reittiere 24 Stunden lang zu versorgen. Die Nahrung ist fade, aber nahrhaft, und verdirbt, wenn sie nach 24 Stunden nicht gegessen wurde. Das Wasser ist sauber und wird nicht schlecht.`,
  },
  daylight: {
    text: `Eine Lichtkugel mit 18 m Radius breitet sich von einem Punkt deiner Wahl in Reichweite aus. Die Kugel ist helles Licht und spendet weitere 18 m dämmriges Licht.

Liegt der gewählte Punkt auf einem Gegenstand, den du hältst, oder einem, den niemand trägt oder hält, scheint das Licht von dem Gegenstand aus und bewegt sich mit ihm. Wird der betroffene Gegenstand vollständig mit einem undurchsichtigen Gegenstand wie einer Schüssel oder einem Helm bedeckt, wird das Licht blockiert.

Überschneidet sich ein Teil des Bereichs dieses Zaubers mit einem Bereich der Dunkelheit, der durch einen Zauber des 3. Grades oder niedriger erschaffen wurde, wird der Zauber, der die Dunkelheit erschaffen hat, gebannt.`,
  },
  'dispel-magic': {
    text: `Wähle eine Kreatur, einen Gegenstand oder eine magische Wirkung in Reichweite. Jeder Zauber des 3. Grades oder niedriger auf dem Ziel endet. Lege für jeden Zauber des 4. Grades oder höher auf dem Ziel einen Attributswurf mit deinem Zauberattribut ab. Der SG beträgt 10 + den Grad des Zaubers. Bei einem erfolgreichen Wurf endet der Zauber.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, beendest du die Wirkungen eines Zaubers auf dem Ziel automatisch, wenn sein Grad kleiner oder gleich dem Grad des verwendeten Zauberplatzes ist.`,
  },
  fear: {
    text: `Du projizierst ein Trugbild der schlimmsten Ängste einer Kreatur. Jede Kreatur in einem Kegel von 9 m muss einen Weisheitsrettungswurf bestehen, sonst lässt sie fallen, was sie hält, und ist für die Wirkungsdauer verängstigt.

Solange eine Kreatur durch diesen Zauber verängstigt ist, muss sie in jedem ihrer Züge die Spurt-Aktion ausführen und sich auf dem sichersten verfügbaren Weg von dir entfernen, es sei denn, sie kann nirgendwohin. Beendet die Kreatur ihren Zug an einem Ort, von dem aus sie keine Sichtlinie zu dir hat, kann sie einen Weisheitsrettungswurf ablegen. Bei einem erfolgreichen Rettungswurf endet der Zauber für diese Kreatur.`,
    material: 'Eine weiße Feder oder das Herz einer Henne.',
  },
  fireball: {
    text: `Ein heller Streifen zuckt von deinem ausgestreckten Finger zu einem Punkt deiner Wahl in Reichweite und erblüht dann mit einem dumpfen Grollen zu einer Flammenexplosion. Jede Kreatur in einer Kugel mit 6 m Radius, deren Mittelpunkt dieser Punkt ist, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet ein Ziel 8W6 Feuerschaden, bei einem erfolgreichen die Hälfte.

Das Feuer breitet sich um Ecken aus. Es entzündet brennbare Gegenstände im Bereich, die nicht getragen oder gehalten werden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 3. um 1W6.`,
    material: 'Ein winziges Kügelchen aus Fledermauskot und Schwefel.',
  },
  fly: {
    text: `Du berührst eine bereitwillige Kreatur. Das Ziel erhält für die Wirkungsdauer eine Flugbewegungsrate von 18 m. Wenn der Zauber endet, stürzt das Ziel ab, falls es sich noch in der Luft befindet, es sei denn, es kann den Sturz aufhalten.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, kannst du für jeden Grad über dem 3. eine zusätzliche Kreatur als Ziel wählen.`,
    material: 'Eine Schwungfeder eines beliebigen Vogels.',
  },
  'gaseous-form': {
    text: `Du verwandelst eine bereitwillige Kreatur, die du berührst, samt allem, was sie trägt und hält, für die Wirkungsdauer in eine Nebelwolke. Der Zauber endet, wenn die Kreatur auf 0 Trefferpunkte fällt. Eine körperlose Kreatur ist nicht betroffen.

In dieser Gestalt kann sich das Ziel nur mit einer Flugbewegungsrate von 3 m fortbewegen. Das Ziel kann den Bereich einer anderen Kreatur betreten und dort verweilen. Es hat Resistenz gegen nichtmagischen Schaden und ist bei Stärke-, Geschicklichkeits- und Konstitutionsrettungswürfen im Vorteil. Das Ziel kann sich durch kleine Löcher, schmale Öffnungen und sogar bloße Ritzen bewegen, behandelt Flüssigkeiten aber wie feste Oberflächen. Das Ziel kann nicht fallen und bleibt auch in der Luft schweben, wenn es betäubt oder auf andere Weise kampfunfähig ist.

Als Nebelwolke kann das Ziel weder sprechen noch Gegenstände handhaben, und Gegenstände, die es getragen oder gehalten hat, können nicht fallen gelassen, benutzt oder anderweitig verwendet werden. Das Ziel kann weder angreifen noch Zauber wirken.`,
    material: 'Ein Stück Gaze und ein Rauchfaden.',
  },
  'glyph-of-warding': {
    text: `Wenn du diesen Zauber wirkst, schreibst du eine Glyphe, die anderen Kreaturen schadet, entweder auf eine Oberfläche (etwa einen Tisch oder einen Abschnitt eines Bodens oder einer Wand) oder in einen Gegenstand, der geschlossen werden kann (etwa ein Buch, eine Schriftrolle oder eine Schatztruhe), um die Glyphe zu verbergen. Wählst du eine Oberfläche, kann die Glyphe einen Bereich mit höchstens 3 m Durchmesser bedecken. Wählst du einen Gegenstand, muss er an seinem Platz bleiben; wird er mehr als 3 m von der Stelle bewegt, an der du den Zauber gewirkt hast, wird die Glyphe zerstört, und der Zauber endet, ohne ausgelöst zu werden.

Die Glyphe ist fast unsichtbar; um sie zu finden, ist ein erfolgreicher Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG nötig.

Beim Wirken des Zaubers bestimmst du, was die Glyphe auslöst. Bei Glyphen auf einer Oberfläche gehören zu den üblichsten Auslösern, die Glyphe zu berühren oder darauf zu stehen, einen anderen Gegenstand zu entfernen, der die Glyphe bedeckt, sich der Glyphe auf eine bestimmte Entfernung zu nähern oder den Gegenstand zu handhaben, auf dem die Glyphe steht. Bei Glyphen in einem Gegenstand gehören zu den üblichsten Auslösern, den Gegenstand zu öffnen, sich ihm auf eine bestimmte Entfernung zu nähern oder die Glyphe zu sehen oder zu lesen. Sobald eine Glyphe ausgelöst wird, endet dieser Zauber.

Du kannst den Auslöser weiter verfeinern, sodass der Zauber nur unter bestimmten Umständen oder abhängig von körperlichen Merkmalen (etwa Größe oder Gewicht), der Art der Kreatur (der Schutz könnte zum Beispiel auf Aberrationen oder Drow wirken) oder der Gesinnung ausgelöst wird. Du kannst auch Bedingungen für Kreaturen festlegen, die die Glyphe nicht auslösen, etwa jene, die ein bestimmtes Losungswort sagen.

Wenn du die Glyphe schreibst, wähle *Explosive Runen* oder eine *Zauberglyphe*.

***Explosive Runen.*** Wird die Glyphe ausgelöst, bricht in einer Kugel mit 6 m Radius, deren Mittelpunkt die Glyphe ist, magische Energie hervor. Die Kugel breitet sich um Ecken aus. Jede Kreatur im Bereich muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 5W8 Säure-, Kälte-, Feuer-, Blitz- oder Schallschaden (deine Wahl beim Erschaffen der Glyphe), bei einem erfolgreichen die Hälfte.

***Zauberglyphe.*** Du kannst einen vorbereiteten Zauber des 3. Grades oder niedriger in der Glyphe speichern, indem du ihn als Teil des Erschaffens der Glyphe wirkst. Der Zauber muss eine einzelne Kreatur oder einen Bereich zum Ziel haben. Der gespeicherte Zauber hat beim Wirken auf diese Weise keine unmittelbare Wirkung. Wird die Glyphe ausgelöst, wird der gespeicherte Zauber gewirkt. Hat der Zauber ein Ziel, ist es die Kreatur, die die Glyphe ausgelöst hat. Betrifft der Zauber einen Bereich, ist diese Kreatur sein Mittelpunkt. Beschwört der Zauber feindselige Kreaturen oder erschafft er schädliche Gegenstände oder Fallen, erscheinen sie so nah wie möglich am Eindringling und greifen ihn an. Erfordert der Zauber Konzentration, hält er bis zum Ende seiner vollen Wirkungsdauer an.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden einer Glyphe mit *Explosiven Runen* für jeden Grad über dem 3. um 1W8. Erschaffst du eine Zauberglyphe, kannst du jeden Zauber bis zum Grad des Zauberplatzes speichern, den du für die *Schutzglyphe* verwendest.`,
    material:
      'Weihrauch und Diamantstaub im Wert von mindestens 200 GM, die der Zauber verbraucht.',
  },
  haste: {
    text: `Wähle eine bereitwillige Kreatur, die du in Reichweite sehen kannst. Bis der Zauber endet, verdoppelt sich die Bewegungsrate des Ziels, es erhält einen Bonus von +2 auf die RK, ist bei Geschicklichkeitsrettungswürfen im Vorteil und erhält in jedem seiner Züge eine zusätzliche Aktion. Diese Aktion kann nur für die Aktionen Angreifen (nur ein Waffenangriff), Spurt, Rückzug, Verstecken oder Gegenstand benutzen genutzt werden.

Wenn der Zauber endet, kann sich das Ziel bis nach seinem nächsten Zug weder bewegen noch Aktionen ausführen, da eine Welle der Lethargie über es hinwegrollt.`,
    material: 'Ein Span Süßholzwurzel.',
  },
  'hypnotic-pattern': {
    text: `Du erschaffst ein sich windendes Farbmuster, das sich in einem Würfel mit 9 m Kantenlänge in Reichweite durch die Luft schlängelt. Das Muster erscheint für einen Moment und verschwindet. Jede Kreatur im Bereich, die das Muster sieht, muss einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist die Kreatur für die Wirkungsdauer bezaubert. Solange sie durch diesen Zauber bezaubert ist, ist die Kreatur kampfunfähig und hat eine Bewegungsrate von 0.

Der Zauber endet für eine betroffene Kreatur, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie aus ihrer Erstarrung zu rütteln.`,
    material:
      'Ein glühendes Räucherstäbchen oder eine Kristallphiole mit phosphoreszierendem Material.',
  },
  'lightning-bolt': {
    text: `Ein Blitz, der eine Linie von 30 m Länge und 1,5 m Breite bildet, fährt in eine Richtung deiner Wahl von dir aus. Jede Kreatur in der Linie muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 8W6 Blitzschaden, bei einem erfolgreichen die Hälfte.

Der Blitz entzündet brennbare Gegenstände im Bereich, die nicht getragen oder gehalten werden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 3. um 1W6.`,
    material: 'Ein Stück Fell und ein Stab aus Bernstein, Kristall oder Glas.',
  },
  'magic-circle': {
    text: `Du erschaffst einen Zylinder magischer Energie mit 3 m Radius und 6 m Höhe, dessen Mittelpunkt ein Punkt auf dem Boden ist, den du in Reichweite sehen kannst. Wo der Zylinder den Boden oder eine andere Oberfläche schneidet, erscheinen leuchtende Runen.

Wähle eine oder mehrere der folgenden Arten von Kreaturen: Himmlische, Elementare, Feenwesen, Unholde oder Untote. Der Kreis wirkt auf eine Kreatur der gewählten Art folgendermaßen:

- Die Kreatur kann den Zylinder nicht freiwillig mit nichtmagischen Mitteln betreten. Versucht die Kreatur, dafür Teleportation oder Reisen zwischen den Ebenen zu nutzen, muss sie zuerst einen Charismarettungswurf bestehen.

- Die Kreatur ist bei Angriffswürfen gegen Ziele im Zylinder im Nachteil.

- Ziele im Zylinder können von der Kreatur weder bezaubert noch verängstigt noch besessen werden.

Wenn du diesen Zauber wirkst, kannst du seine Magie umkehren, sodass eine Kreatur der gewählten Art den Zylinder nicht verlassen kann und Ziele außerhalb geschützt sind.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt die Wirkungsdauer für jeden Grad über dem 3. um 1 Stunde.`,
    material:
      'Weihwasser oder Silber- und Eisenpulver im Wert von mindestens 100 GM, die der Zauber verbraucht.',
  },
  'major-image': {
    text: `Du erschaffst das Bild eines Gegenstands, einer Kreatur oder einer anderen sichtbaren Erscheinung, die nicht größer als ein Würfel mit 6 m Kantenlänge ist. Das Bild erscheint an einer Stelle, die du in Reichweite sehen kannst, und bleibt für die Wirkungsdauer bestehen. Es wirkt völlig echt, mit Geräuschen, Gerüchen und Temperatur, die zum Dargestellten passen. Du kannst weder genug Hitze oder Kälte erzeugen, um Schaden zu verursachen, noch ein Geräusch, das laut genug ist, um Schallschaden zu verursachen oder eine Kreatur taub zu machen, noch einen Geruch, der einer Kreatur übel werden lässt (wie der Gestank eines Troglodyten).

Solange du dich in Reichweite der Illusion befindest, kannst du deine Aktion nutzen, um das Bild an eine beliebige andere Stelle in Reichweite zu bewegen. Während das Bild den Ort wechselt, kannst du sein Aussehen so verändern, dass seine Bewegungen natürlich wirken. Erschaffst du zum Beispiel das Bild einer Kreatur und bewegst es, kannst du es so verändern, dass es zu gehen scheint. Ebenso kannst du die Illusion zu verschiedenen Zeiten verschiedene Geräusche machen und sie zum Beispiel sogar ein Gespräch führen lassen.

Körperlicher Kontakt mit dem Bild entlarvt es als Illusion, denn Dinge können hindurchgehen. Eine Kreatur, die ihre Aktion nutzt, um das Bild zu untersuchen, kann mit einem erfolgreichen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG feststellen, dass es eine Illusion ist. Durchschaut eine Kreatur die Illusion, kann sie durch das Bild hindurchsehen, und seine anderen Sinneseindrücke werden für sie blass.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 6. Grades oder höher wirkst, hält er an, bis er gebannt wird, ohne dass du dich konzentrieren musst.`,
    material: 'Ein Stück Schafwolle.',
  },
  'mass-healing-word': {
    text: `Während du Worte der Genesung ausrufst, erhalten bis zu sechs Kreaturen deiner Wahl, die du in Reichweite sehen kannst, Trefferpunkte in Höhe von 1W4 + deinem Zauberattributsmodifikator zurück. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 3. um 1W4.`,
  },
  'meld-into-stone': {
    text: `Du trittst in einen steinernen Gegenstand oder eine Steinfläche, die groß genug ist, um deinen ganzen Körper aufzunehmen, und verschmilzt für die Wirkungsdauer mit dir und deiner gesamten Ausrüstung mit dem Stein. Mit deiner Bewegung trittst du an einem Punkt, den du berühren kannst, in den Stein. Nichts von deiner Anwesenheit bleibt sichtbar oder mit nichtmagischen Sinnen wahrnehmbar.

Solange du mit dem Stein verschmolzen bist, kannst du nicht sehen, was außerhalb geschieht, und Weisheitswürfe (Wahrnehmung), um Geräusche von außen zu hören, legst du mit Nachteil ab. Du nimmst den Lauf der Zeit weiterhin wahr und kannst Zauber auf dich selbst wirken, während du im Stein bist. Du kannst deine Bewegung nutzen, um den Stein dort zu verlassen, wo du ihn betreten hast, was den Zauber beendet. Ansonsten kannst du dich nicht bewegen.

Kleinerer körperlicher Schaden am Stein verletzt dich nicht, doch seine teilweise Zerstörung oder eine Veränderung seiner Form (sodass du nicht mehr hineinpasst) stößt dich hinaus und fügt dir 6W6 Wuchtschaden zu. Die vollständige Zerstörung des Steins (oder seine Verwandlung in einen anderen Stoff) stößt dich hinaus und fügt dir 50 Wuchtschaden zu. Wirst du hinausgestoßen, fällst du in dem freien Bereich hin, der der Stelle am nächsten liegt, an der du den Stein betreten hast.`,
  },
  nondetection: {
    text: `Für die Wirkungsdauer verbirgst du ein Ziel, das du berührst, vor Erkenntnismagie. Das Ziel kann eine bereitwillige Kreatur oder ein Ort oder Gegenstand sein, der in keiner Richtung größer als 3 m ist. Das Ziel kann von keiner Erkenntnismagie zum Ziel genommen und nicht durch magische Ausspähsensoren wahrgenommen werden.`,
    material:
      'Eine Prise Diamantstaub im Wert von 25 GM, über das Ziel gestreut, die der Zauber verbraucht.',
  },
  'phantom-steed': {
    text: `Eine große, halb wirkliche, pferdeähnliche Kreatur erscheint in einem freien Bereich deiner Wahl in Reichweite auf dem Boden. Du bestimmst das Aussehen der Kreatur, doch sie ist mit Sattel, Gebiss und Zaumzeug ausgestattet. Jedes Ausrüstungsteil, das der Zauber erschafft, verschwindet in einer Rauchwolke, wenn es mehr als 3 m vom Reittier fortgetragen wird.

Für die Wirkungsdauer kannst du oder eine Kreatur deiner Wahl das Reittier reiten. Die Kreatur hat die Spielwerte eines Reitpferds, aber eine Bewegungsrate von 30 m und kann in einer Stunde 15 km zurücklegen, bei schnellem Tempo 20 km. Wenn der Zauber endet, verblasst das Reittier allmählich und gibt dem Reiter 1 Minute Zeit zum Absteigen. Der Zauber endet, wenn du ihn mit einer Aktion beendest oder das Reittier Schaden erleidet.`,
  },
  'plant-growth': {
    text: `Dieser Zauber leitet Lebenskraft in Pflanzen in einem bestimmten Bereich. Es gibt zwei mögliche Anwendungen, die entweder sofortige oder langfristige Vorteile bringen.

Wirkst du diesen Zauber mit 1 Aktion, wähle einen Punkt in Reichweite. Alle gewöhnlichen Pflanzen in einem Radius von 30 m um diesen Punkt werden dicht und überwuchert. Eine Kreatur, die sich durch den Bereich bewegt, muss für jeden Meter, den sie zurücklegt, 4 m Bewegung aufwenden.

Du kannst einen oder mehrere Teilbereiche beliebiger Größe innerhalb des Wirkungsbereichs von der Wirkung ausnehmen.

Wirkst du diesen Zauber über 8 Stunden, bereicherst du das Land. Alle Pflanzen in einem Radius von 750 m um einen Punkt in Reichweite werden für 1 Jahr bereichert. Die Pflanzen bringen bei der Ernte doppelt so viel Nahrung wie gewöhnlich.`,
  },
  'protection-from-energy': {
    text: `Für die Wirkungsdauer hat die bereitwillige Kreatur, die du berührst, Resistenz gegen eine Schadensart deiner Wahl: Säure, Kälte, Feuer, Blitz oder Schall.`,
  },
  'remove-curse': {
    text: `Bei deiner Berührung enden alle Flüche, die auf eine Kreatur oder einen Gegenstand wirken. Ist der Gegenstand ein verfluchter magischer Gegenstand, bleibt sein Fluch bestehen, doch der Zauber löst die Einstimmung seines Besitzers auf den Gegenstand, sodass er abgelegt oder weggeworfen werden kann.`,
  },
  revivify: {
    text: `Du berührst eine Kreatur, die innerhalb der letzten Minute gestorben ist. Diese Kreatur kehrt mit 1 Trefferpunkt ins Leben zurück. Dieser Zauber kann keine Kreatur ins Leben zurückholen, die an Altersschwäche gestorben ist, und keine fehlenden Körperteile wiederherstellen.`,
    material: 'Diamanten im Wert von 300 GM, die der Zauber verbraucht.',
  },
  sending: {
    text: `Du sendest eine kurze Nachricht von höchstens fünfundzwanzig Wörtern an eine Kreatur, die dir vertraut ist. Die Kreatur hört die Nachricht in ihrem Geist, erkennt dich als Absender, wenn sie dich kennt, und kann sofort auf dieselbe Weise antworten. Der Zauber ermöglicht es Kreaturen mit einem Intelligenzwert von mindestens 1, die Bedeutung deiner Nachricht zu verstehen.

Du kannst die Nachricht über jede Entfernung und sogar auf andere Existenzebenen senden, doch befindet sich das Ziel auf einer anderen Ebene als du, kommt die Nachricht mit einer Wahrscheinlichkeit von 5 Prozent nicht an.`,
    material: 'Ein kurzes Stück feiner Kupferdraht.',
  },
  'sleet-storm': {
    text: `Bis der Zauber endet, fallen Eisregen und Graupel in einem Zylinder mit 6 m Höhe und 12 m Radius, dessen Mittelpunkt ein Punkt deiner Wahl in Reichweite ist. Der Bereich ist komplett verschleiert, und offene Flammen im Bereich erlöschen.

Der Boden im Bereich ist mit glattem Eis bedeckt und wird so zu schwierigem Gelände. Betritt eine Kreatur den Bereich des Zaubers in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf fällt sie hin.

Konzentriert sich eine Kreatur im Bereich des Zaubers, muss sie einen Konstitutionsrettungswurf gegen deinen Zauberrettungswurf-SG bestehen, sonst verliert sie die Konzentration.`,
    material: 'Eine Prise Staub und ein paar Tropfen Wasser.',
  },
  slow: {
    text: `Du veränderst die Zeit um bis zu sechs Kreaturen deiner Wahl in einem Würfel mit 12 m Kantenlänge in Reichweite. Jedes Ziel muss einen Weisheitsrettungswurf bestehen, sonst ist es für die Wirkungsdauer von diesem Zauber betroffen.

Die Bewegungsrate eines betroffenen Ziels halbiert sich, es erhält einen Malus von -2 auf die RK und auf Geschicklichkeitsrettungswürfe und kann keine Reaktionen ausführen. In seinem Zug kann es entweder eine Aktion oder eine Bonusaktion ausführen, nicht beides. Unabhängig von den Fähigkeiten oder magischen Gegenständen der Kreatur kann sie in ihrem Zug nicht mehr als einen Nah- oder Fernkampfangriff ausführen.

Versucht die Kreatur, einen Zauber mit einer Zauberzeit von 1 Aktion zu wirken, wirf einen W20. Bei 11 oder mehr wirkt der Zauber erst im nächsten Zug der Kreatur, und sie muss in diesem Zug ihre Aktion nutzen, um den Zauber zu vollenden. Kann sie das nicht, ist der Zauber verschwendet.

Eine von diesem Zauber betroffene Kreatur legt am Ende ihres Zuges einen weiteren Weisheitsrettungswurf ab. Bei einem erfolgreichen Rettungswurf endet die Wirkung für sie.`,
    material: 'Ein Tropfen Melasse.',
  },
  'speak-with-dead': {
    text: `Du verleihst einer Leiche deiner Wahl in Reichweite einen Anschein von Leben und Verstand, sodass sie die Fragen beantworten kann, die du stellst. Die Leiche muss noch einen Mund haben und darf nicht untot sein. Der Zauber misslingt, wenn die Leiche innerhalb der letzten 10 Tage Ziel dieses Zaubers war.

Bis der Zauber endet, kannst du der Leiche bis zu fünf Fragen stellen. Die Leiche weiß nur, was sie im Leben wusste, einschließlich der Sprachen, die sie kannte. Die Antworten sind meist kurz, rätselhaft oder wiederholen sich, und die Leiche ist nicht gezwungen, wahrheitsgemäß zu antworten, wenn du ihr feindselig gesinnt bist oder sie dich als Feind erkennt. Dieser Zauber bringt die Seele der Kreatur nicht in ihren Körper zurück, nur ihren belebenden Geist. Daher kann die Leiche keine neuen Informationen erfahren, versteht nichts, was seit ihrem Tod geschehen ist, und kann nicht über künftige Ereignisse spekulieren.`,
    material: 'Brennender Weihrauch.',
  },
  'speak-with-plants': {
    text: `Du verleihst Pflanzen im Umkreis von 9 m um dich begrenztes Bewusstsein und Beweglichkeit, sodass sie mit dir kommunizieren und deine einfachen Befehle befolgen können. Du kannst Pflanzen über Ereignisse im Bereich des Zaubers während des vergangenen Tages befragen und erhältst Auskunft über Kreaturen, die vorbeigekommen sind, das Wetter und andere Umstände.

Du kannst auch schwieriges Gelände, das durch Pflanzenwuchs entsteht (etwa Dickicht und Unterholz), für die Wirkungsdauer in gewöhnliches Gelände verwandeln. Oder du verwandelst gewöhnliches Gelände, in dem Pflanzen wachsen, für die Wirkungsdauer in schwieriges Gelände, sodass zum Beispiel Ranken und Äste Verfolger behindern.

Nach Ermessen des SL können Pflanzen auch andere Aufgaben für dich erledigen. Der Zauber erlaubt es Pflanzen nicht, sich zu entwurzeln und umherzuwandern, doch sie können Äste, Ranken und Stängel frei bewegen.

Befindet sich eine Pflanzenkreatur im Bereich, kannst du mit ihr kommunizieren, als hättet ihr eine gemeinsame Sprache, erhältst aber keine magische Fähigkeit, sie zu beeinflussen.

Dieser Zauber kann die durch den Zauber *Verstricken* erschaffenen Pflanzen dazu bringen, eine festgesetzte Kreatur freizugeben.`,
  },
  'spirit-guardians': {
    text: `Du rufst Geister herbei, die dich beschützen. Sie schwirren für die Wirkungsdauer in einem Abstand von bis zu 4,5 m um dich herum. Bist du gut oder neutral, erscheint ihre geisterhafte Gestalt engelhaft oder feenhaft (deine Wahl). Bist du böse, erscheinen sie unholdisch.

Wenn du diesen Zauber wirkst, kannst du beliebig viele Kreaturen, die du sehen kannst, bestimmen, die nicht betroffen sind. Die Bewegungsrate einer betroffenen Kreatur halbiert sich im Bereich, und betritt die Kreatur den Bereich in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 3W8 gleißenden Schaden (wenn du gut oder neutral bist) oder 3W8 nekrotischen Schaden (wenn du böse bist). Bei einem erfolgreichen Rettungswurf erleidet sie die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 3. um 1W8.`,
    material: 'Ein heiliges Symbol.',
  },
  'stinking-cloud': {
    text: `Du erschaffst eine Kugel aus gelbem, übelkeiterregendem Gas mit 6 m Radius, deren Mittelpunkt ein Punkt in Reichweite ist. Die Wolke breitet sich um Ecken aus, und ihr Bereich ist komplett verschleiert. Die Wolke bleibt für die Wirkungsdauer in der Luft hängen.

Jede Kreatur, die sich zu Beginn ihres Zuges vollständig in der Wolke befindet, muss einen Konstitutionsrettungswurf gegen Gift ablegen. Bei einem misslungenen Rettungswurf verbringt die Kreatur ihre Aktion in diesem Zug würgend und taumelnd. Kreaturen, die nicht atmen müssen oder gegen Gift immun sind, bestehen diesen Rettungswurf automatisch.

Ein mäßiger Wind (mindestens 15 km/h) zerstreut die Wolke nach 4 Runden. Ein starker Wind (mindestens 30 km/h) zerstreut sie nach 1 Runde.`,
    material: 'Ein faules Ei oder einige Blätter des Stinkkohls.',
  },
  'tiny-hut': {
    text: `Eine unbewegliche Kuppel aus Energie mit 3 m Radius entsteht um dich und über dir und bleibt für die Wirkungsdauer an Ort und Stelle. Der Zauber endet, wenn du ihren Bereich verlässt.

Neun Kreaturen mittlerer Größe oder kleiner passen mit dir in die Kuppel. Der Zauber misslingt, wenn sein Bereich eine größere Kreatur oder mehr als neun Kreaturen umfasst. Kreaturen und Gegenstände, die sich beim Wirken in der Kuppel befinden, können sich frei durch sie hindurchbewegen. Alle anderen Kreaturen und Gegenstände können sie nicht durchqueren. Zauber und andere magische Wirkungen können sich nicht durch die Kuppel ausdehnen oder durch sie hindurch gewirkt werden. Die Luft im Inneren ist angenehm und trocken, unabhängig vom Wetter draußen.

Bis der Zauber endet, kannst du das Innere dämmrig erhellt oder dunkel werden lassen. Die Kuppel ist von außen undurchsichtig und hat eine Farbe deiner Wahl, ist von innen aber durchsichtig.`,
    material: 'Eine kleine Kristallperle.',
  },
  tongues: {
    text: `Dieser Zauber verleiht der Kreatur, die du berührst, die Fähigkeit, jede gesprochene Sprache zu verstehen, die sie hört. Außerdem versteht jede Kreatur, die mindestens eine Sprache beherrscht und das Ziel hören kann, was es sagt, wenn es spricht.`,
    material: 'Ein kleines Tonmodell einer Zikkurat.',
  },
  'vampiric-touch': {
    text: `Die Berührung deiner von Schatten umhüllten Hand kann anderen Lebenskraft entziehen, um deine Wunden zu heilen. Führe einen Nahkampf-Zauberangriff gegen eine Kreatur in deiner Reichweite aus. Bei einem Treffer erleidet das Ziel 3W6 nekrotischen Schaden, und du erhältst Trefferpunkte in Höhe der Hälfte des verursachten nekrotischen Schadens zurück. Bis der Zauber endet, kannst du den Angriff in jedem deiner Züge als Aktion wiederholen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 3. um 1W6.`,
  },
  'water-breathing': {
    text: `Dieser Zauber verleiht bis zu zehn bereitwilligen Kreaturen, die du in Reichweite sehen kannst, bis zum Ende des Zaubers die Fähigkeit, unter Wasser zu atmen. Die betroffenen Kreaturen behalten außerdem ihre gewöhnliche Atmung.`,
    material: 'Ein kurzes Stück Schilfrohr oder Stroh.',
  },
  'water-walk': {
    text: `Dieser Zauber verleiht die Fähigkeit, sich über jede flüssige Oberfläche – etwa Wasser, Säure, Schlamm, Schnee, Treibsand oder Lava – zu bewegen, als wäre sie harmloser fester Boden (Kreaturen, die geschmolzene Lava überqueren, können dennoch Schaden durch die Hitze erleiden). Bis zu zehn bereitwillige Kreaturen, die du in Reichweite sehen kannst, erhalten diese Fähigkeit für die Wirkungsdauer.

Wählst du eine Kreatur als Ziel, die in eine Flüssigkeit getaucht ist, trägt der Zauber das Ziel mit 18 m pro Runde an die Oberfläche der Flüssigkeit.`,
    material: 'Ein Stück Kork.',
  },
  'wind-wall': {
    text: `Eine Wand aus starkem Wind erhebt sich an einem Punkt deiner Wahl in Reichweite aus dem Boden. Du kannst die Wand bis zu 15 m lang, 4,5 m hoch und 30 cm dick machen. Du kannst der Wand jede beliebige Form geben, solange sie einen durchgehenden Pfad entlang des Bodens bildet. Die Wand bleibt für die Wirkungsdauer bestehen.

Wenn die Wand erscheint, muss jede Kreatur in ihrem Bereich einen Stärkerettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 3W8 Wuchtschaden, bei einem erfolgreichen die Hälfte.

Der starke Wind hält Nebel, Rauch und andere Gase fern. Kleine oder kleinere fliegende Kreaturen oder Gegenstände können die Wand nicht durchqueren. Lose, leichte Materialien, die in die Wand gelangen, fliegen nach oben. Pfeile, Bolzen und andere gewöhnliche Geschosse, die auf Ziele hinter der Wand abgefeuert werden, werden nach oben abgelenkt und verfehlen automatisch. (Von Riesen oder Belagerungsgeräten geschleuderte Felsbrocken und ähnliche Geschosse sind nicht betroffen.) Kreaturen in gasförmiger Gestalt können die Wand nicht durchqueren.`,
    material: 'Ein winziger Fächer und eine Feder exotischer Herkunft.',
  },
};
