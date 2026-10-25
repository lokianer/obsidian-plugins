// German texts of the SRD spells of the 6th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_6: Readonly<Record<string, DeText>> = {
  'blade-barrier': {
    text: `Du erschaffst eine senkrechte Wand aus wirbelnden, messerscharfen Klingen aus magischer Energie. Die Wand erscheint in Reichweite und bleibt für die Wirkungsdauer bestehen. Du kannst eine gerade Wand von bis zu 30 m Länge, 6 m Höhe und 1,5 m Dicke erschaffen oder eine Ringwand mit bis zu 18 m Durchmesser, 6 m Höhe und 1,5 m Dicke. Die Wand gewährt Kreaturen dahinter Dreivierteldeckung, und ihr Bereich ist schwieriges Gelände.

Betritt eine Kreatur den Bereich der Wand in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, muss sie einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 6W10 Hiebschaden, bei einem erfolgreichen die Hälfte.`,
  },
  'chain-lightning': {
    text: `Du erschaffst einen Blitz, der sich in einem Bogen auf ein Ziel deiner Wahl zubewegt, das du in Reichweite sehen kannst. Von diesem Ziel springen dann drei Blitze auf bis zu drei andere Ziele über, die jeweils höchstens 9 m vom ersten Ziel entfernt sein müssen. Ein Ziel kann eine Kreatur oder ein Gegenstand sein und nur von einem der Blitze getroffen werden.

Ein Ziel muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet das Ziel 10W8 Blitzschaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, springt für jeden Grad über dem 6. ein zusätzlicher Blitz vom ersten Ziel auf ein weiteres Ziel über.`,
    material:
      'Ein Stück Fell; ein Stück Bernstein, Glas oder ein Kristallstab; und drei silberne Nadeln.',
  },
  'circle-of-death': {
    text: `Eine Kugel negativer Energie breitet sich von einem Punkt in Reichweite in einer Kugel mit 18 m Radius aus. Jede Kreatur in diesem Bereich muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet ein Ziel 8W6 nekrotischen Schaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 6. um 2W6.`,
    material: 'Das Pulver einer zerstoßenen schwarzen Perle im Wert von mindestens 500 GM.',
  },
  'conjure-fey': {
    text: `Du beschwörst ein Feenwesen mit Herausforderungsgrad 6 oder niedriger oder einen Feengeist, der die Gestalt eines Tiers mit Herausforderungsgrad 6 oder niedriger annimmt. Es erscheint in einem freien Bereich, den du in Reichweite sehen kannst. Das Feenwesen verschwindet, wenn es auf 0 Trefferpunkte fällt oder der Zauber endet.

Das Feenwesen ist dir und deinen Gefährten für die Wirkungsdauer freundlich gesinnt. Würfle die Initiative der Kreatur aus, die eigene Züge hat. Sie gehorcht allen mündlichen Befehlen, die du ihr gibst (dafür brauchst du keine Aktion), solange sie nicht ihrer Gesinnung widersprechen. Gibst du dem Feenwesen keine Befehle, verteidigt es sich gegen feindselige Kreaturen, führt ansonsten aber keine Aktionen aus.

Wird deine Konzentration unterbrochen, verschwindet das Feenwesen nicht. Stattdessen verlierst du die Kontrolle über es; es wird dir und deinen Gefährten feindselig gesinnt und greift vielleicht an. Ein unkontrolliertes Feenwesen kannst du nicht entlassen; es verschwindet 1 Stunde, nachdem du es beschworen hast.

Der SL hat die Spielwerte des Feenwesens.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt der Herausforderungsgrad für jeden Grad über dem 6. um 1.`,
  },
  contingency: {
    text: `Wähle einen Zauber des 5. Grades oder niedriger, den du wirken kannst, der eine Zauberzeit von 1 Aktion hat und dich zum Ziel haben kann. Du wirkst diesen Zauber – den bedingten Zauber genannt – als Teil von *Eventualität* und verbrauchst Zauberplätze für beide, doch der bedingte Zauber wirkt nicht sofort. Stattdessen wirkt er, wenn ein bestimmter Umstand eintritt. Diesen Umstand beschreibst du, wenn du die beiden Zauber wirkst. Eine mit *Wasser atmen* gewirkte *Eventualität* könnte zum Beispiel festlegen, dass *Wasser atmen* wirkt, sobald du von Wasser oder einer ähnlichen Flüssigkeit umhüllt bist.

Der bedingte Zauber wirkt sofort, nachdem der Umstand zum ersten Mal eintritt, ob du es willst oder nicht, und dann endet *Eventualität*.

Der bedingte Zauber wirkt nur auf dich, auch wenn er normalerweise andere zum Ziel haben kann. Du kannst nur einen *Eventualität*-Zauber gleichzeitig nutzen. Wirkst du diesen Zauber erneut, endet die Wirkung eines anderen *Eventualität*-Zaubers auf dir. Außerdem endet *Eventualität* für dich, sobald sich seine Materialkomponente nicht mehr an deinem Körper befindet.`,
    material:
      'Eine aus Elfenbein geschnitzte Statuette von dir, mit Edelsteinen im Wert von mindestens 1.500 GM verziert.',
  },
  'create-undead': {
    text: `Du kannst diesen Zauber nur nachts wirken. Wähle in Reichweite bis zu drei Leichen mittelgroßer oder kleiner Humanoider. Jede Leiche wird zu einem Ghul unter deiner Kontrolle. (Der SL hat die Spielwerte dieser Kreaturen.)

Als Bonusaktion in jedem deiner Züge kannst du jeder Kreatur, die du mit diesem Zauber belebt hast, geistig einen Befehl geben, sofern sie höchstens 36 m von dir entfernt ist (kontrollierst du mehrere Kreaturen, kannst du einer, mehreren oder allen gleichzeitig denselben Befehl geben). Du bestimmst, welche Aktion die Kreatur in ihrem nächsten Zug ausführt und wohin sie sich bewegt, oder du gibst einen allgemeinen Befehl, etwa eine bestimmte Kammer oder einen Gang zu bewachen. Gibst du keine Befehle, verteidigt sich die Kreatur nur gegen feindselige Kreaturen. Hat die Kreatur einen Befehl erhalten, befolgt sie ihn, bis ihre Aufgabe erledigt ist.

Die Kreatur steht 24 Stunden lang unter deiner Kontrolle, danach gehorcht sie keinem deiner Befehle mehr. Um die Kontrolle über die Kreatur für weitere 24 Stunden zu behalten, musst du diesen Zauber auf die Kreatur wirken, bevor die aktuellen 24 Stunden enden. Auf diese Weise erneuerst du deine Kontrolle über bis zu drei Kreaturen, die du mit diesem Zauber belebt hast, statt neue zu beleben.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades wirkst, kannst du vier Ghule beleben oder die Kontrolle über sie erneuern. Mit einem Zauberplatz des 8. Grades kannst du fünf Ghule oder zwei Ghasts oder Grabunholde beleben oder die Kontrolle über sie erneuern. Mit einem Zauberplatz des 9. Grades kannst du sechs Ghule, drei Ghasts oder Grabunholde oder zwei Mumien beleben oder die Kontrolle über sie erneuern.`,
    material:
      'Ein Tontopf mit Graberde, ein Tontopf mit Brackwasser und ein schwarzer Onyx im Wert von 150 GM für jede Leiche.',
  },
  disintegrate: {
    text: `Ein dünner grüner Strahl schießt aus deinem ausgestreckten Finger auf ein Ziel, das du in Reichweite sehen kannst. Das Ziel kann eine Kreatur, ein Gegenstand oder eine Schöpfung aus magischer Energie sein, etwa die Wand, die *Energiewand* erschafft.

Eine Kreatur, die das Ziel dieses Zaubers ist, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 + 40 Energieschaden. Sinkt das Ziel durch diesen Schaden auf 0 Trefferpunkte, löst es sich auf.

Eine aufgelöste Kreatur und alles, was sie trägt und hält, außer magischen Gegenständen, wird zu einem Haufen feinen grauen Staubs. Die Kreatur kann nur durch die Zauber *Wahre Auferstehung* oder *Wunsch* ins Leben zurückgeholt werden.

Dieser Zauber löst einen großen oder kleineren nichtmagischen Gegenstand oder eine Schöpfung aus magischer Energie automatisch auf. Ist das Ziel ein riesiger oder größerer Gegenstand oder eine solche Schöpfung aus Energie, löst dieser Zauber einen Teil davon in der Größe eines Würfels mit 3 m Kantenlänge auf. Ein magischer Gegenstand ist von diesem Zauber nicht betroffen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 6. um 3W6.`,
    material: 'Ein Magneteisenstein und eine Prise Staub.',
  },
  eyebite: {
    text: `Für die Wirkungsdauer werden deine Augen zu einer tintenschwarzen Leere voll schrecklicher Macht. Eine Kreatur deiner Wahl im Umkreis von 18 m, die du sehen kannst, muss einen Weisheitsrettungswurf bestehen, sonst ist sie für die Wirkungsdauer von einer der folgenden Wirkungen deiner Wahl betroffen. In jedem deiner Züge bis zum Ende des Zaubers kannst du deine Aktion nutzen, um eine andere Kreatur zum Ziel zu nehmen, doch keine Kreatur erneut, die einen Rettungswurf gegen dieses Wirken von *Böser Blick* bestanden hat.

***Schlafend.*** Das Ziel wird bewusstlos. Es erwacht, wenn es Schaden erleidet oder eine andere Kreatur ihre Aktion nutzt, um den Schlafenden wachzurütteln.

***Panisch.*** Das Ziel ist vor dir verängstigt. In jedem seiner Züge muss die verängstigte Kreatur die Spurt-Aktion ausführen und sich auf dem sichersten und kürzesten verfügbaren Weg von dir entfernen, es sei denn, sie kann nirgendwohin. Bewegt sich das Ziel an einen mindestens 18 m entfernten Ort, an dem es dich nicht mehr sehen kann, endet diese Wirkung.

***Krank.*** Das Ziel ist bei Angriffswürfen und Attributswürfen im Nachteil. Am Ende jedes seiner Züge kann es einen weiteren Weisheitsrettungswurf ablegen. Gelingt er, endet die Wirkung.`,
  },
  'find-the-path': {
    text: `Mit diesem Zauber findest du den kürzesten, direktesten Weg zu einem bestimmten festen Ort auf derselben Existenzebene, der dir vertraut ist. Nennst du ein Ziel auf einer anderen Existenzebene, ein Ziel, das sich bewegt (etwa eine bewegliche Festung), oder ein Ziel, das nicht bestimmt ist (etwa „der Hort eines grünen Drachen“), misslingt der Zauber.

Für die Wirkungsdauer weißt du, solange du dich auf derselben Existenzebene wie das Ziel befindest, wie weit es entfernt ist und in welcher Richtung es liegt. Während du dorthin reist, bestimmst du jedes Mal, wenn du unterwegs zwischen Wegen wählen musst, automatisch, welcher Weg der kürzeste und direkteste (aber nicht unbedingt der sicherste) zum Ziel ist.`,
    material:
      'Ein Satz Weissagungswerkzeuge – etwa Knochen, Elfenbeinstäbchen, Karten, Zähne oder geschnitzte Runen – im Wert von 100 GM und ein Gegenstand von dem Ort, den du finden willst.',
  },
  'flesh-to-stone': {
    text: `Du versuchst, eine Kreatur, die du in Reichweite sehen kannst, in Stein zu verwandeln. Besteht der Körper des Ziels aus Fleisch, muss die Kreatur einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist sie festgesetzt, während ihr Fleisch zu verhärten beginnt. Bei einem erfolgreichen Rettungswurf ist die Kreatur nicht betroffen.

Eine durch diesen Zauber festgesetzte Kreatur muss am Ende jedes ihrer Züge einen weiteren Konstitutionsrettungswurf ablegen. Besteht sie dreimal einen Rettungswurf gegen diesen Zauber, endet der Zauber. Misslingen ihr dreimal die Rettungswürfe, wird sie zu Stein und ist für die Wirkungsdauer versteinert. Die Erfolge und Fehlschläge müssen nicht aufeinanderfolgen; zähle beide mit, bis das Ziel drei gleiche gesammelt hat.

Wird die Kreatur körperlich zerbrochen, während sie versteinert ist, leidet sie an ähnlichen Missbildungen, wenn sie in ihren ursprünglichen Zustand zurückkehrt.

Hältst du die Konzentration auf diesen Zauber während der gesamten möglichen Wirkungsdauer aufrecht, bleibt die Kreatur versteinert, bis die Wirkung aufgehoben wird.`,
    material: 'Eine Prise Kalk, Wasser und Erde.',
  },
  forbiddance: {
    text: `Du erschaffst einen Schutz gegen magisches Reisen, der bis zu 3.700 m² Bodenfläche bis zu einer Höhe von 9 m über dem Boden schützt. Für die Wirkungsdauer können sich Kreaturen nicht in den Bereich teleportieren oder Portale nutzen, etwa die des Zaubers *Portal*, um ihn zu betreten. Der Zauber schützt den Bereich vor Reisen zwischen den Ebenen und hindert Kreaturen daher daran, über die Astralebene, die Ätherebene, die Feenwildnis, das Schattenfell oder den Zauber *Ebenenwechsel* in den Bereich zu gelangen.

Außerdem verletzt der Zauber Arten von Kreaturen, die du beim Wirken wählst. Wähle eine oder mehrere der folgenden: Himmlische, Elementare, Feenwesen, Unholde und Untote. Betritt eine gewählte Kreatur den Bereich des Zaubers in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, erleidet sie 5W10 gleißenden oder nekrotischen Schaden (deine Wahl beim Wirken).

Wenn du diesen Zauber wirkst, kannst du ein Losungswort festlegen. Eine Kreatur, die das Losungswort spricht, während sie den Bereich betritt, erleidet keinen Schaden durch den Zauber.

Der Bereich des Zaubers darf sich nicht mit dem eines anderen *Verbot*-Zaubers überschneiden. Wirkst du *Verbot* 30 Tage lang jeden Tag am selben Ort, hält der Zauber an, bis er gebannt wird, und die Materialkomponenten werden beim letzten Wirken verbraucht.`,
    material:
      'Ein paar Spritzer Weihwasser, seltener Weihrauch und Rubinpulver im Wert von mindestens 1.000 GM.',
  },
  'freezing-sphere': {
    text: `Eine eisige Kugel kalter Energie schießt aus deinen Fingerspitzen zu einem Punkt deiner Wahl in Reichweite, wo sie in einer Kugel mit 18 m Radius explodiert. Jede Kreatur im Bereich muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 10W6 Kälteschaden, bei einem erfolgreichen die Hälfte.

Trifft die Kugel ein Gewässer oder eine Flüssigkeit, die hauptsächlich aus Wasser besteht (nicht jedoch Kreaturen aus Wasser), friert sie die Flüssigkeit in einem Bereich von 9 m mal 9 m bis zu einer Tiefe von 15 cm ein. Dieses Eis hält 1 Minute. Kreaturen, die an der Oberfläche des gefrorenen Wassers geschwommen sind, sind im Eis gefangen. Eine gefangene Kreatur kann eine Aktion nutzen, um einen Stärkewurf gegen deinen Zauberrettungswurf-SG abzulegen und sich zu befreien.

Du kannst darauf verzichten, die Kugel nach dem Wirken abzufeuern, wenn du willst. Eine kleine Kugel von etwa der Größe eines Schleudersteins, kühl bei Berührung, erscheint in deiner Hand. Du oder eine Kreatur, der du die Kugel gibst, kann sie jederzeit werfen (bis zu 12 m weit) oder mit einer Schleuder schleudern (auf die normale Reichweite der Schleuder). Beim Aufprall zerspringt sie mit derselben Wirkung wie beim normalen Wirken des Zaubers. Du kannst die Kugel auch ablegen, ohne dass sie zerspringt. Ist die Kugel nach 1 Minute noch nicht zersprungen, explodiert sie.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 6. um 1W6.`,
    material: 'Eine kleine Kristallkugel.',
  },
  'globe-of-invulnerability': {
    text: `Eine unbewegliche, schwach schimmernde Barriere entsteht in einem Radius von 3 m um dich und bleibt für die Wirkungsdauer bestehen.

Ein Zauber des 5. Grades oder niedriger, der von außerhalb der Barriere gewirkt wird, kann Kreaturen oder Gegenstände darin nicht beeinflussen, selbst wenn er mit einem höhergradigen Zauberplatz gewirkt wird. Ein solcher Zauber kann Kreaturen und Gegenstände innerhalb der Barriere zum Ziel haben, wirkt aber nicht auf sie. Ebenso ist der Bereich innerhalb der Barriere von den Bereichen ausgenommen, die solche Zauber betreffen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, blockiert die Barriere für jeden Grad über dem 6. Zauber eines um eins höheren Grades.`,
    material: 'Eine Glas- oder Kristallperle, die zerspringt, wenn der Zauber endet.',
  },
  'guards-and-wards': {
    text: `Du erschaffst einen Schutz, der bis zu 225 m² Bodenfläche schützt (einen Bereich von 15 m mal 15 m, hundert Felder von 1,5 m oder fünfundzwanzig Felder von 3 m). Der geschützte Bereich kann bis zu 6 m hoch sein und eine Form deiner Wahl haben. Du kannst mehrere Stockwerke einer Festung schützen, indem du die Fläche auf sie verteilst, solange du während des Wirkens in jeden zusammenhängenden Bereich gehen kannst.

Wenn du diesen Zauber wirkst, kannst du Personen bestimmen, die von einer, mehreren oder allen gewählten Wirkungen nicht betroffen sind. Du kannst auch ein Losungswort festlegen, das den Sprecher gegen diese Wirkungen immun macht, wenn er es laut ausspricht.

*Hüten und Wehren* erzeugt im geschützten Bereich die folgenden Wirkungen.

***Gänge.*** Nebel füllt alle geschützten Gänge und verschleiert sie komplett. Außerdem glaubt eine andere Kreatur als du an jeder Kreuzung oder Abzweigung, die eine Wahl der Richtung bietet, mit einer Wahrscheinlichkeit von 50 Prozent, sie gehe in die entgegengesetzte Richtung der gewählten.

***Türen.*** Alle Türen im geschützten Bereich sind magisch verschlossen, als wären sie durch den Zauber *Arkanes Schloss* versiegelt. Außerdem kannst du bis zu zehn Türen mit einer Illusion bedecken (entsprechend der Funktion für Gegenstände des Zaubers *Kleine Illusion*), damit sie wie gewöhnliche Wandabschnitte aussehen.

***Treppen.*** Netze füllen alle Treppen im geschützten Bereich von oben bis unten wie beim Zauber *Netz*. Werden diese Fäden verbrannt oder zerrissen, solange *Hüten und Wehren* anhält, wachsen sie in 10 Minuten nach.

***Weitere Zauberwirkung.*** Du kannst eine der folgenden magischen Wirkungen deiner Wahl im geschützten Bereich der Festung platzieren.

- Platziere *Tanzende Lichter* in vier Gängen. Du kannst ein einfaches Programm festlegen, das die Lichter wiederholen, solange *Hüten und Wehren* anhält.

- Platziere *Magischer Mund* an zwei Orten.

- Platziere *Stinkende Wolke* an zwei Orten. Die Dämpfe erscheinen an den bestimmten Stellen; werden sie vom Wind zerstreut, kehren sie innerhalb von 10 Minuten zurück, solange *Hüten und Wehren* anhält.

- Platziere einen ständigen *Windstoß* in einem Gang oder Raum.

- Platziere eine *Suggestion* an einem Ort. Du wählst einen Bereich von bis zu 1,5 m mal 1,5 m, und jede Kreatur, die den Bereich betritt oder durchquert, empfängt die Suggestion geistig.

Der gesamte geschützte Bereich strahlt Magie aus. Ein auf eine bestimmte Wirkung gewirktes *Magie bannen* entfernt bei Erfolg nur diese Wirkung.

Du kannst ein dauerhaft behütetes und geschütztes Bauwerk erschaffen, indem du diesen Zauber dort ein Jahr lang jeden Tag wirkst.`,
    material:
      'Brennender Weihrauch, eine kleine Menge Schwefel und Öl, eine geknotete Schnur, eine kleine Menge Blut eines Umberkolosses und ein kleiner Silberstab im Wert von mindestens 10 GM.',
  },
  harm: {
    text: `Du entfesselst eine bösartige Krankheit gegen eine Kreatur, die du in Reichweite sehen kannst. Das Ziel muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet es 14W6 nekrotischen Schaden, bei einem erfolgreichen die Hälfte. Der Schaden kann die Trefferpunkte des Ziels nicht unter 1 senken. Misslingt dem Ziel der Rettungswurf, sinkt sein Trefferpunktemaximum für 1 Stunde um den erlittenen nekrotischen Schaden. Jede Wirkung, die eine Krankheit heilt, lässt das Trefferpunktemaximum einer Kreatur vor Ablauf dieser Zeit wieder auf den normalen Wert zurückkehren.`,
  },
  heal: {
    text: `Wähle eine Kreatur, die du in Reichweite sehen kannst. Eine Woge positiver Energie durchströmt die Kreatur, und sie erhält 70 Trefferpunkte zurück. Dieser Zauber beendet außerdem Blindheit, Taubheit und alle Krankheiten, die das Ziel plagen. Dieser Zauber wirkt nicht auf Konstrukte oder Untote.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 6. um 10.`,
  },
  'heroes-feast': {
    text: `Du lässt ein großes Festmahl mit prächtigen Speisen und Getränken erscheinen. Das Festmahl zu verzehren, dauert 1 Stunde; am Ende dieser Zeit verschwindet es, und die vorteilhaften Wirkungen setzen erst ein, wenn diese Stunde vorüber ist. Bis zu zwölf andere Kreaturen können am Festmahl teilnehmen.

Eine Kreatur, die am Festmahl teilnimmt, erhält mehrere Vorteile. Die Kreatur wird von allen Krankheiten und Giften geheilt, wird immun gegen Gift und dagegen, verängstigt zu werden, und legt alle Weisheitsrettungswürfe mit Vorteil ab. Außerdem steigt ihr Trefferpunktemaximum um 2W10, und sie erhält ebenso viele Trefferpunkte. Diese Vorteile halten 24 Stunden an.`,
    material:
      'Eine mit Edelsteinen besetzte Schale im Wert von mindestens 1.000 GM, die der Zauber verbraucht.',
  },
  'instant-summons': {
    text: `Du berührst einen Gegenstand, der höchstens 5 kg wiegt und dessen längste Seite höchstens 1,8 m misst. Der Zauber hinterlässt ein unsichtbares Zeichen auf seiner Oberfläche und schreibt den Namen des Gegenstands unsichtbar auf den Saphir, den du als Materialkomponente verwendest. Bei jedem Wirken dieses Zaubers musst du einen anderen Saphir verwenden.

Zu jedem späteren Zeitpunkt kannst du deine Aktion nutzen, um den Namen des Gegenstands auszusprechen und den Saphir zu zerdrücken. Der Gegenstand erscheint augenblicklich in deiner Hand, unabhängig von körperlichen oder planaren Entfernungen, und der Zauber endet.

Hält oder trägt eine andere Kreatur den Gegenstand, holt ihn das Zerdrücken des Saphirs nicht zu dir; stattdessen erfährst du, wer die Kreatur ist, die den Gegenstand besitzt, und ungefähr, wo sie sich in diesem Moment befindet.

*Magie bannen* oder eine ähnliche Wirkung, die erfolgreich auf den Saphir angewendet wird, beendet die Wirkung dieses Zaubers.`,
    material: 'Ein Saphir im Wert von 1.000 GM.',
  },
  'irresistible-dance': {
    text: `Wähle eine Kreatur, die du in Reichweite sehen kannst. Das Ziel beginnt auf der Stelle einen komischen Tanz: Es schlurft, stampft mit den Füßen und hüpft für die Wirkungsdauer herum. Kreaturen, die nicht bezaubert werden können, sind gegen diesen Zauber immun.

Eine tanzende Kreatur muss ihre gesamte Bewegung zum Tanzen nutzen, ohne ihren Bereich zu verlassen, und ist bei Geschicklichkeitsrettungswürfen und Angriffswürfen im Nachteil. Solange das Ziel von diesem Zauber betroffen ist, sind andere Kreaturen bei Angriffswürfen gegen es im Vorteil. Als Aktion legt eine tanzende Kreatur einen Weisheitsrettungswurf ab, um die Kontrolle über sich zurückzugewinnen. Bei einem erfolgreichen Rettungswurf endet der Zauber.`,
  },
  'magic-jar': {
    text: `Dein Körper fällt in einen starren Zustand, während deine Seele ihn verlässt und in den Behälter fährt, den du als Materialkomponente des Zaubers verwendet hast. Solange deine Seele den Behälter bewohnt, nimmst du deine Umgebung wahr, als wärst du im Bereich des Behälters. Du kannst dich nicht bewegen und keine Reaktionen ausführen. Die einzige Aktion, die du ausführen kannst, ist, deine Seele bis zu 30 m weit aus dem Behälter zu projizieren, um entweder in deinen lebenden Körper zurückzukehren (was den Zauber beendet) oder zu versuchen, den Körper eines Humanoiden zu besetzen.

Du kannst versuchen, jeden Humanoiden im Umkreis von 30 m zu besetzen, den du sehen kannst (Kreaturen, die durch die Zauber *Schutz vor Gut und Böse* oder *Magischer Kreis* geschützt sind, können nicht besessen werden). Das Ziel muss einen Charismarettungswurf ablegen. Bei einem Fehlschlag fährt deine Seele in den Körper des Ziels, und die Seele des Ziels ist im Behälter gefangen. Bei einem Erfolg widersteht das Ziel deinen Versuchen, es zu besetzen, und du kannst es 24 Stunden lang nicht erneut versuchen.

Sobald du den Körper einer Kreatur besetzt hast, kontrollierst du ihn. Deine Spielwerte werden durch die der Kreatur ersetzt, doch du behältst deine Gesinnung und deine Intelligenz-, Weisheits- und Charismawerte. Du behältst den Nutzen deiner eigenen Klassenmerkmale. Hat das Ziel Klassenstufen, kannst du keines seiner Klassenmerkmale nutzen.

Unterdessen kann die Seele der besessenen Kreatur aus dem Behälter mit ihren eigenen Sinnen wahrnehmen, sich aber weder bewegen noch irgendwelche Aktionen ausführen.

Während du einen Körper besetzt, kannst du deine Aktion nutzen, um aus dem Wirtskörper in den Behälter zurückzukehren, sofern er höchstens 30 m von dir entfernt ist; die Seele der Wirtskreatur kehrt dann in ihren Körper zurück. Stirbt der Wirtskörper, während du in ihm bist, stirbt die Kreatur, und du musst einen Charismarettungswurf gegen deinen eigenen Zauber-SG ablegen. Bei einem Erfolg kehrst du in den Behälter zurück, sofern er höchstens 30 m von dir entfernt ist. Andernfalls stirbst du.

Wird der Behälter zerstört oder endet der Zauber, kehrt deine Seele sofort in deinen Körper zurück. Ist dein Körper mehr als 30 m von dir entfernt oder tot, wenn du versuchst, in ihn zurückzukehren, stirbst du. Befindet sich die Seele einer anderen Kreatur im Behälter, wenn er zerstört wird, kehrt ihre Seele in ihren Körper zurück, sofern der Körper lebt und höchstens 30 m entfernt ist. Andernfalls stirbt diese Kreatur.

Wenn der Zauber endet, wird der Behälter zerstört.`,
    material:
      'Ein Edelstein, Kristall, Reliquiar oder anderer Zierbehälter im Wert von mindestens 500 GM.',
  },
  'mass-suggestion': {
    text: `Du schlägst eine Handlung vor (beschränkt auf ein oder zwei Sätze) und beeinflusst auf magische Weise bis zu zwölf Kreaturen deiner Wahl, die du in Reichweite sehen kannst und die dich hören und verstehen können. Kreaturen, die nicht bezaubert werden können, sind gegen diese Wirkung immun. Der Vorschlag muss so formuliert sein, dass die Handlung vernünftig klingt. Die Kreatur aufzufordern, sich selbst zu erstechen, sich in einen Speer zu stürzen, sich anzuzünden oder eine andere offensichtlich schädliche Tat zu begehen, hebt die Wirkung des Zaubers automatisch auf.

Jedes Ziel muss einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf verfolgt es die beschriebene Handlung nach besten Kräften. Die vorgeschlagene Handlung kann die gesamte Wirkungsdauer andauern. Kann die vorgeschlagene Tätigkeit in kürzerer Zeit erledigt werden, endet der Zauber, sobald das Ziel getan hat, worum es gebeten wurde.

Du kannst auch Bedingungen festlegen, die während der Wirkungsdauer eine besondere Tätigkeit auslösen. Du könntest zum Beispiel vorschlagen, dass eine Gruppe Soldaten ihr ganzes Geld dem ersten Bettler gibt, dem sie begegnen. Tritt die Bedingung nicht ein, bevor der Zauber endet, wird die Tätigkeit nicht ausgeführt.

Fügst du oder einer deiner Gefährten einer von diesem Zauber betroffenen Kreatur Schaden zu, endet der Zauber für diese Kreatur.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades wirkst, beträgt die Wirkungsdauer 10 Tage. Mit einem Zauberplatz des 8. Grades beträgt sie 30 Tage, mit einem Zauberplatz des 9. Grades ein Jahr und einen Tag.`,
    material: 'Eine Schlangenzunge und entweder ein Stück Honigwabe oder ein Tropfen süßes Öl.',
  },
  'move-earth': {
    text: `Wähle in Reichweite ein Geländestück, dessen Seiten höchstens 12 m lang sind. Du kannst Erde, Sand oder Ton in dem Bereich für die Wirkungsdauer auf jede Weise umformen, die du wählst. Du kannst den Bereich anheben oder absenken, einen Graben ausheben oder zuschütten, einen Wall errichten oder einebnen oder eine Säule formen. Das Ausmaß solcher Veränderungen darf die Hälfte der größten Ausdehnung des Bereichs nicht überschreiten. Beeinflusst du also ein Quadrat mit 12 m Seitenlänge, kannst du eine Säule von bis zu 6 m Höhe erschaffen, das Quadrat um bis zu 6 m anheben oder absenken, einen bis zu 6 m tiefen Graben ausheben und so weiter. Diese Veränderungen brauchen 10 Minuten, bis sie abgeschlossen sind.

Am Ende jeder 10 Minuten, die du dich auf den Zauber konzentrierst, kannst du ein neues Geländestück zum Beeinflussen wählen.

Da die Umformung des Geländes langsam geschieht, können Kreaturen im Bereich gewöhnlich nicht durch die Bewegung des Bodens gefangen oder verletzt werden.

Dieser Zauber kann weder natürlichen Stein noch Steinbauten beeinflussen. Felsen und Bauwerke verschieben sich, um sich dem neuen Gelände anzupassen. Würde die Art, wie du das Gelände formst, ein Bauwerk instabil machen, stürzt es vielleicht ein.

Ebenso beeinflusst dieser Zauber den Pflanzenwuchs nicht direkt. Die bewegte Erde trägt alle Pflanzen mit sich.`,
    material:
      'Eine Eisenklinge und ein kleiner Beutel mit einer Mischung aus Böden – Ton, Lehm und Sand.',
  },
  'planar-ally': {
    text: `Du flehst ein jenseitiges Wesen um Hilfe an. Das Wesen muss dir bekannt sein: ein Gott, ein Urwesen, ein Dämonenfürst oder ein anderes Wesen kosmischer Macht. Dieses Wesen schickt einen ihm treuen Himmlischen, Elementar oder Unhold, um dir zu helfen, und lässt die Kreatur in einem freien Bereich in Reichweite erscheinen. Kennst du den Namen einer bestimmten Kreatur, kannst du diesen Namen beim Wirken aussprechen, um diese Kreatur zu erbitten, doch du erhältst vielleicht trotzdem eine andere (nach Wahl des SL).

Wenn die Kreatur erscheint, ist sie nicht gezwungen, sich auf eine bestimmte Weise zu verhalten. Du kannst die Kreatur bitten, gegen Bezahlung einen Dienst zu leisten, doch sie ist dazu nicht verpflichtet. Die erbetene Aufgabe kann von einfach (flieg uns über die Schlucht oder hilf uns in einer Schlacht) bis komplex reichen (spioniere unsere Feinde aus oder beschütze uns bei unserem Vorstoß ins Verlies). Du musst mit der Kreatur kommunizieren können, um über ihre Dienste zu verhandeln.

Die Bezahlung kann viele Formen annehmen. Ein Himmlischer verlangt vielleicht eine ansehnliche Spende an Gold oder magischen Gegenständen für einen verbündeten Tempel, während ein Unhold vielleicht ein lebendes Opfer oder ein Schatzgeschenk fordert. Manche Kreaturen tauschen ihren Dienst gegen eine Aufgabe, die du für sie erledigst.

Als Faustregel gilt: Eine Aufgabe, die in Minuten gemessen wird, erfordert eine Bezahlung im Wert von 100 GM pro Minute. Eine in Stunden gemessene Aufgabe erfordert 1.000 GM pro Stunde. Und eine in Tagen gemessene Aufgabe (bis zu 10 Tage) erfordert 10.000 GM pro Tag. Der SL kann diese Bezahlungen je nach den Umständen, unter denen du den Zauber wirkst, anpassen. Passt die Aufgabe zu den Werten der Kreatur, wird die Bezahlung vielleicht halbiert oder ganz erlassen. Ungefährliche Aufgaben erfordern meist nur die Hälfte der vorgeschlagenen Bezahlung, während besonders gefährliche Aufgaben ein größeres Geschenk erfordern können. Kreaturen nehmen selten Aufgaben an, die selbstmörderisch erscheinen.

Nachdem die Kreatur die Aufgabe erledigt hat oder wenn die vereinbarte Dauer des Dienstes abläuft, kehrt sie auf ihre Heimatebene zurück, nachdem sie dir Bericht erstattet hat, sofern das zur Aufgabe passt und möglich ist. Könnt ihr euch nicht auf einen Preis für den Dienst der Kreatur einigen, kehrt sie sofort auf ihre Heimatebene zurück.

Eine Kreatur, die deiner Gruppe beitritt, zählt als ihr Mitglied und erhält einen vollen Anteil der vergebenen Erfahrungspunkte.`,
  },
  'programmed-illusion': {
    text: `Du erschaffst in Reichweite die Illusion eines Gegenstands, einer Kreatur oder einer anderen sichtbaren Erscheinung, die aktiviert wird, wenn eine bestimmte Bedingung eintritt. Bis dahin ist die Illusion nicht wahrnehmbar. Sie darf nicht größer als ein Würfel mit 9 m Kantenlänge sein, und du bestimmst beim Wirken, wie sich die Illusion verhält und welche Geräusche sie macht. Diese vorgegebene Vorstellung kann bis zu 5 Minuten dauern.

Tritt die festgelegte Bedingung ein, entsteht die Illusion und führt ihre Vorstellung wie beschrieben auf. Ist die Vorstellung beendet, verschwindet die Illusion und ruht 10 Minuten lang. Danach kann die Illusion erneut aktiviert werden.

Die auslösende Bedingung kann so allgemein oder so genau sein, wie du willst, muss aber auf sichtbaren oder hörbaren Bedingungen beruhen, die im Umkreis von 9 m um den Bereich eintreten. Du könntest zum Beispiel eine Illusion von dir selbst erscheinen lassen, die andere warnt, die eine mit einer Falle gesicherte Tür öffnen wollen, oder die Illusion nur dann auslösen lassen, wenn eine Kreatur das richtige Wort oder den richtigen Satz sagt.

Körperlicher Kontakt mit dem Bild entlarvt es als Illusion, denn Dinge können hindurchgehen. Eine Kreatur, die ihre Aktion nutzt, um das Bild zu untersuchen, kann mit einem erfolgreichen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG feststellen, dass es eine Illusion ist. Durchschaut eine Kreatur die Illusion, kann sie durch das Bild hindurchsehen, und jedes Geräusch, das es macht, klingt für sie hohl.`,
    material: 'Ein Stück Schafwolle und Jadestaub im Wert von mindestens 25 GM.',
  },
  sunbeam: {
    text: `Ein Strahl strahlenden Lichts fährt in einer Linie von 1,5 m Breite und 18 m Länge aus deiner Hand. Jede Kreatur in der Linie muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 6W8 gleißenden Schaden und ist bis zu deinem nächsten Zug blind. Bei einem erfolgreichen Rettungswurf erleidet sie die Hälfte des Schadens und wird von diesem Zauber nicht geblendet. Untote und Schlicke sind bei diesem Rettungswurf im Nachteil.

Bis der Zauber endet, kannst du in jedem Zug als deine Aktion eine neue Linie aus Licht erschaffen.

Für die Wirkungsdauer leuchtet ein Funke strahlenden Glanzes in deiner Hand. Er spendet in einem Radius von 9 m helles Licht und weitere 9 m dämmriges Licht. Dieses Licht ist Sonnenlicht.`,
    material: 'Ein Vergrößerungsglas.',
  },
  'transport-via-plants': {
    text: `Dieser Zauber erschafft eine magische Verbindung zwischen einer großen oder größeren, unbelebten Pflanze in Reichweite und einer anderen Pflanze in beliebiger Entfernung auf derselben Existenzebene. Du musst die Zielpflanze mindestens einmal gesehen oder berührt haben. Für die Wirkungsdauer kann jede Kreatur in die Zielpflanze treten und aus der anderen Pflanze heraustreten, indem sie 1,5 m Bewegung aufwendet.`,
  },
  'true-seeing': {
    text: `Dieser Zauber verleiht der bereitwilligen Kreatur, die du berührst, die Fähigkeit, die Dinge so zu sehen, wie sie wirklich sind. Für die Wirkungsdauer hat die Kreatur Wahrsicht, bemerkt durch Magie verborgene Geheimtüren und kann in die Ätherebene sehen, alles bis zu einer Reichweite von 36 m.`,
    material:
      'Eine Augensalbe im Wert von 25 GM aus Pilzpulver, Safran und Fett, die der Zauber verbraucht.',
  },
  'wall-of-ice': {
    text: `Du erschaffst auf einer festen Oberfläche in Reichweite eine Wand aus Eis. Du kannst sie zu einer halbkugelförmigen Kuppel oder einer Kugel mit bis zu 3 m Radius formen oder eine ebene Fläche aus zehn Feldern von 3 m mal 3 m bilden. Jedes Feld muss an ein anderes angrenzen. In jeder Form ist die Wand 30 cm dick und bleibt für die Wirkungsdauer bestehen.

Schneidet die Wand beim Erscheinen durch den Bereich einer Kreatur, wird die Kreatur in ihrem Bereich auf eine Seite der Wand geschoben und muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Kälteschaden, bei einem erfolgreichen die Hälfte.

Die Wand ist ein Gegenstand, der beschädigt und so durchbrochen werden kann. Sie hat RK 12 und 30 Trefferpunkte pro 3-m-Abschnitt und ist anfällig gegen Feuerschaden. Sinkt ein 3-m-Abschnitt der Wand auf 0 Trefferpunkte, wird er zerstört und hinterlässt in dem Bereich, den die Wand einnahm, einen Schleier eisiger Luft. Eine Kreatur, die sich in einem Zug zum ersten Mal durch den Schleier eisiger Luft bewegt, muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet diese Kreatur 5W6 Kälteschaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigt für jeden Grad über dem 6. der Schaden, den die Wand beim Erscheinen verursacht, um 2W6 und der Schaden beim Durchqueren des Schleiers eisiger Luft um 1W6.`,
    material: 'Ein kleines Stück Quarz.',
  },
  'wall-of-thorns': {
    text: `Du erschaffst eine Wand aus zähem, biegsamem, verschlungenem Gestrüpp, das vor nadelspitzen Dornen starrt. Die Wand erscheint in Reichweite auf einer festen Oberfläche und bleibt für die Wirkungsdauer bestehen. Du kannst die Wand bis zu 18 m lang, 3 m hoch und 1,5 m dick machen oder als Kreis mit 6 m Durchmesser und bis zu 6 m Höhe und 1,5 m Dicke. Die Wand blockiert die Sichtlinie.

Wenn die Wand erscheint, muss jede Kreatur in ihrem Bereich einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 7W8 Stichschaden, bei einem erfolgreichen die Hälfte.

Eine Kreatur kann sich durch die Wand bewegen, wenn auch langsam und schmerzhaft. Für jeden Meter, den sich eine Kreatur durch die Wand bewegt, muss sie 4 m Bewegung aufwenden. Außerdem muss eine Kreatur, wenn sie die Wand in einem Zug zum ersten Mal betritt oder ihren Zug dort beendet, einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 7W8 Hiebschaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 7. Grades oder höher wirkst, steigen beide Schadensarten für jeden Grad über dem 6. um 1W8.`,
    material: 'Eine Handvoll Dornen.',
  },
  'wind-walk': {
    text: `Du und bis zu zehn bereitwillige Kreaturen, die du in Reichweite sehen kannst, nehmt für die Wirkungsdauer eine gasförmige Gestalt an und erscheint als Wolkenfetzen. In dieser Wolkengestalt hat eine Kreatur eine Flugbewegungsrate von 90 m und Resistenz gegen Schaden durch nichtmagische Waffen. Die einzigen Aktionen, die eine Kreatur in dieser Gestalt ausführen kann, sind die Spurt-Aktion oder die Rückkehr in ihre normale Gestalt. Die Rückverwandlung dauert 1 Minute, in der eine Kreatur kampfunfähig ist und sich nicht bewegen kann. Bis der Zauber endet, kann eine Kreatur wieder die Wolkengestalt annehmen, was ebenfalls die einminütige Verwandlung erfordert.

Ist eine Kreatur in Wolkengestalt und fliegt, wenn die Wirkung endet, sinkt sie 1 Minute lang mit 18 m pro Runde, bis sie sicher landet. Kann sie nach 1 Minute nicht landen, fällt die Kreatur die restliche Strecke.`,
    material: 'Feuer und Weihwasser.',
  },
  'word-of-recall': {
    text: `Du und bis zu fünf bereitwillige Kreaturen im Umkreis von 1,5 m um dich teleportiert euch augenblicklich zu einem zuvor bestimmten Zufluchtsort. Du und alle Kreaturen, die sich mit dir teleportieren, erscheint im nächstgelegenen freien Bereich zu der Stelle, die du beim Vorbereiten deines Zufluchtsorts bestimmt hast (siehe unten). Wirkst du diesen Zauber, ohne zuvor einen Zufluchtsort vorbereitet zu haben, wirkt er nicht.

Du bestimmst einen Zufluchtsort, indem du diesen Zauber an einem Ort wirkst, der deiner Gottheit geweiht oder eng mit ihr verbunden ist, etwa einem Tempel. Versuchst du, den Zauber auf diese Weise in einem Bereich zu wirken, der nicht deiner Gottheit geweiht ist, wirkt er nicht.`,
  },
};
