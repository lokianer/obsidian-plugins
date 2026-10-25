// German texts of the SRD spells of the 9th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_9: Readonly<Record<string, DeText>> = {
  'astral-projection': {
    text: `Du und bis zu acht bereitwillige Kreaturen in Reichweite projiziert eure Astralkörper auf die Astralebene (befindest du dich bereits auf dieser Ebene, misslingt der Zauber, und das Wirken ist verschwendet). Der stoffliche Körper, den du zurücklässt, ist bewusstlos und in einem Zustand der Starre; er braucht weder Nahrung noch Luft und altert nicht.

Dein Astralkörper gleicht deiner sterblichen Gestalt in fast jeder Hinsicht und übernimmt deine Spielwerte und deine Habe. Der wichtigste Unterschied ist eine silbrige Schnur, die zwischen deinen Schulterblättern hervortritt, hinter dir herzieht und nach 30 cm unsichtbar wird. Diese Schnur ist deine Verbindung zu deinem stofflichen Körper. Solange die Verbindung intakt bleibt, findest du den Weg nach Hause. Wird die Schnur durchtrennt – was nur geschehen kann, wenn eine Wirkung ausdrücklich besagt, dass sie es tut –, werden Seele und Körper getrennt, und du stirbst augenblicklich.

Deine Astralgestalt kann frei durch die Astralebene reisen und dort Portale durchqueren, die zu jeder anderen Ebene führen. Betrittst du eine neue Ebene oder kehrst du auf die Ebene zurück, auf der du beim Wirken warst, werden dein Körper und deine Habe entlang der Silberschnur mitgenommen, sodass du in deinen Körper zurückkehren kannst, während du die neue Ebene betrittst. Deine Astralgestalt ist eine eigene Verkörperung. Schaden oder andere Wirkungen, die sie treffen, wirken nicht auf deinen stofflichen Körper und bleiben auch nicht bestehen, wenn du in ihn zurückkehrst.

Der Zauber endet für dich und deine Gefährten, wenn du ihn mit deiner Aktion beendest. Wenn der Zauber endet, kehrt die betroffene Kreatur in ihren stofflichen Körper zurück und erwacht.

Der Zauber kann für dich oder einen deiner Gefährten auch vorzeitig enden. Ein erfolgreicher Zauber *Magie bannen* gegen einen Astral- oder stofflichen Körper beendet den Zauber für diese Kreatur. Fällt der ursprüngliche Körper einer Kreatur oder ihre Astralgestalt auf 0 Trefferpunkte, endet der Zauber für diese Kreatur. Endet der Zauber und ist die Silberschnur intakt, zieht die Schnur die Astralgestalt der Kreatur zurück in ihren Körper und beendet ihren Zustand der Starre.

Wirst du vorzeitig in deinen Körper zurückgebracht, bleiben deine Gefährten in ihren Astralgestalten und müssen ihren eigenen Weg zurück in ihre Körper finden, meist indem sie auf 0 Trefferpunkte fallen.`,
    material:
      'Für jede Kreatur, die du mit diesem Zauber betriffst, ein Hyazinth im Wert von mindestens 1.000 GM und ein kunstvoll verzierter Silberbarren im Wert von mindestens 100 GM, die der Zauber alle verbraucht.',
  },
  foresight: {
    text: `Du berührst eine bereitwillige Kreatur und verleihst ihr eine begrenzte Fähigkeit, in die unmittelbare Zukunft zu blicken. Für die Wirkungsdauer kann das Ziel nicht überrascht werden und ist bei Angriffswürfen, Attributswürfen und Rettungswürfen im Vorteil. Außerdem sind andere Kreaturen für die Wirkungsdauer bei Angriffswürfen gegen das Ziel im Nachteil.

Dieser Zauber endet sofort, wenn du ihn erneut wirkst, bevor seine Wirkungsdauer endet.`,
    material: 'Eine Kolibrifeder.',
  },
  gate: {
    text: `Du beschwörst ein Portal, das einen freien Bereich, den du in Reichweite sehen kannst, mit einem genauen Ort auf einer anderen Existenzebene verbindet. Das Portal ist eine kreisrunde Öffnung, die du mit 1,5 m bis 6 m Durchmesser erschaffen kannst. Du kannst das Portal in jede Richtung ausrichten, die du willst. Das Portal bleibt für die Wirkungsdauer bestehen.

Das Portal hat auf jeder Ebene, auf der es erscheint, eine Vorder- und eine Rückseite. Durch das Portal reisen kann man nur, indem man sich durch seine Vorderseite bewegt. Alles, was das tut, wird augenblicklich auf die andere Ebene versetzt und erscheint im freien Bereich, der dem Portal am nächsten liegt.

Gottheiten und andere Herrscher der Ebenen können verhindern, dass sich mit diesem Zauber erschaffene Portale in ihrer Gegenwart oder irgendwo in ihren Reichen öffnen.

Wenn du diesen Zauber wirkst, kannst du den Namen einer bestimmten Kreatur aussprechen (ein Deckname, Titel oder Spitzname funktioniert nicht). Befindet sich diese Kreatur auf einer anderen Ebene als du, öffnet sich das Portal in ihrer unmittelbaren Nähe und zieht die Kreatur hindurch in den nächstgelegenen freien Bereich auf deiner Seite des Portals. Du erhältst keine besondere Macht über die Kreatur, und sie kann frei handeln, wie der SL es für angemessen hält. Sie geht vielleicht, greift dich an oder hilft dir.`,
    material: 'Ein Diamant im Wert von mindestens 5.000 GM.',
  },
  imprisonment: {
    text: `Du erschaffst eine magische Fessel, um eine Kreatur festzuhalten, die du in Reichweite sehen kannst. Das Ziel muss einen Weisheitsrettungswurf bestehen, sonst wird es vom Zauber gebunden; besteht es ihn, ist es gegen diesen Zauber immun, wenn du ihn erneut wirkst. Solange die Kreatur von diesem Zauber betroffen ist, muss sie weder atmen noch essen noch trinken, und sie altert nicht. Erkenntniszauber können das Ziel weder aufspüren noch wahrnehmen.

Wenn du den Zauber wirkst, wählst du eine der folgenden Formen der Gefangenschaft.

***Begräbnis.*** Das Ziel wird tief unter der Erde in einer Kugel aus magischer Energie eingeschlossen, die gerade groß genug ist, um es aufzunehmen. Nichts kann die Kugel durchqueren, und keine Kreatur kann sich hinein oder hinaus teleportieren oder Reisen zwischen den Ebenen dafür nutzen.

Die besondere Komponente für diese Version des Zaubers ist eine kleine Mithralkugel.

***Ketten.*** Schwere Ketten, fest im Boden verankert, halten das Ziel an Ort und Stelle. Das Ziel ist festgesetzt, bis der Zauber endet, und kann sich bis dahin weder bewegen noch auf irgendeine Weise bewegt werden.

Die besondere Komponente für diese Version des Zaubers ist eine feine Kette aus Edelmetall.

***Umfriedetes Gefängnis.*** Der Zauber versetzt das Ziel auf eine winzige Halbebene, die gegen Teleportation und Reisen zwischen den Ebenen geschützt ist. Die Halbebene kann ein Labyrinth, ein Käfig, ein Turm oder ein ähnliches abgeschlossenes Bauwerk oder ein Bereich deiner Wahl sein.

Die besondere Komponente für diese Version des Zaubers ist eine Miniaturdarstellung des Gefängnisses aus Jade.

***Kleinsteinschluss.*** Das Ziel schrumpft auf eine Größe von 2,5 cm und wird in einem Edelstein oder ähnlichen Gegenstand eingeschlossen. Licht kann den Edelstein normal durchdringen (sodass das Ziel hinaus- und andere Kreaturen hineinsehen können), aber nichts anderes, auch nicht durch Teleportation oder Reisen zwischen den Ebenen. Der Edelstein kann nicht geschnitten oder zerbrochen werden, solange der Zauber wirkt.

Die besondere Komponente für diese Version des Zaubers ist ein großer, durchsichtiger Edelstein, etwa ein Korund, ein Diamant oder ein Rubin.

***Schlummer.*** Das Ziel schläft ein und kann nicht geweckt werden.

Die besondere Komponente für diese Version des Zaubers besteht aus seltenen einschläfernden Kräutern.

***Ende des Zaubers.*** Während des Wirkens kannst du bei jeder Version eine Bedingung festlegen, die den Zauber beendet und das Ziel freilässt. Die Bedingung kann so genau oder ausgefeilt sein, wie du willst, doch der SL muss zustimmen, dass sie vernünftig ist und eine Chance hat einzutreten. Die Bedingungen können auf dem Namen, der Identität oder der Gottheit einer Kreatur beruhen, müssen ansonsten aber auf beobachtbaren Handlungen oder Eigenschaften beruhen und nicht auf nicht greifbaren Dingen wie Stufe, Klasse oder Trefferpunkten.

Der Zauber *Magie bannen* kann den Zauber nur beenden, wenn er als Zauber des 9. Grades gewirkt wird und entweder das Gefängnis oder die besondere Komponente zum Ziel hat, mit der es erschaffen wurde.

Mit einer bestimmten besonderen Komponente kannst du nur ein Gefängnis gleichzeitig erschaffen. Wirkst du den Zauber erneut mit derselben Komponente, wird das Ziel des ersten Wirkens sofort aus seiner Fessel befreit.`,
    material:
      'Eine Darstellung auf Pergament oder eine geschnitzte Statuette nach dem Ebenbild des Ziels und eine besondere Komponente, die je nach gewählter Version des Zaubers variiert und mindestens 500 GM pro Trefferwürfel des Ziels wert ist.',
  },
  'mass-heal': {
    text: `Eine Flut heilender Energie strömt von dir in verletzte Kreaturen um dich. Du stellst bis zu 700 Trefferpunkte wieder her, die du nach Belieben auf beliebig viele Kreaturen verteilst, die du in Reichweite sehen kannst. Durch diesen Zauber geheilte Kreaturen werden außerdem von allen Krankheiten und jeder Wirkung geheilt, die sie blind oder taub macht. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
  },
  'meteor-swarm': {
    text: `Lodernde Feuerkugeln stürzen an vier verschiedenen Punkten, die du in Reichweite sehen kannst, zu Boden. Jede Kreatur in einer Kugel mit 12 m Radius um jeden gewählten Punkt muss einen Geschicklichkeitsrettungswurf ablegen. Die Kugel breitet sich um Ecken aus. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 20W6 Feuerschaden und 20W6 Wuchtschaden, bei einem erfolgreichen die Hälfte. Eine Kreatur im Bereich mehrerer Feuerexplosionen ist nur einmal betroffen.

Der Zauber beschädigt Gegenstände im Bereich und entzündet brennbare Gegenstände, die nicht getragen oder gehalten werden.`,
  },
  'power-word-kill': {
    text: `Du sprichst ein Machtwort, das eine Kreatur, die du in Reichweite sehen kannst, zwingen kann, augenblicklich zu sterben. Hat die gewählte Kreatur 100 Trefferpunkte oder weniger, stirbt sie. Andernfalls wirkt der Zauber nicht.`,
  },
  'prismatic-wall': {
    text: `Eine schimmernde, vielfarbige Lichtfläche bildet eine senkrechte, undurchsichtige Wand – bis zu 27 m lang, 9 m hoch und 2,5 cm dick –, deren Mittelpunkt ein Punkt ist, den du in Reichweite sehen kannst. Alternativ kannst du die Wand zu einer Kugel mit bis zu 9 m Durchmesser formen, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist. Die Wand bleibt für die Wirkungsdauer an Ort und Stelle. Platzierst du die Wand so, dass sie durch einen Bereich verläuft, den eine Kreatur einnimmt, misslingt der Zauber, und deine Aktion und der Zauberplatz sind verschwendet.

Die Wand spendet bis zu einer Reichweite von 30 m helles Licht und weitere 30 m dämmriges Licht. Du und die Kreaturen, die du beim Wirken bestimmst, könnt die Wand ohne Schaden durchqueren und euch in ihrer Nähe aufhalten. Nähert sich eine andere Kreatur, die die Wand sehen kann, ihr auf 6 m oder beginnt sie ihren Zug dort, muss sie einen Konstitutionsrettungswurf bestehen, sonst ist sie 1 Minute lang blind.

Die Wand besteht aus sieben Schichten mit je einer anderen Farbe. Versucht eine Kreatur, in die Wand hineinzugreifen oder sie zu durchqueren, tut sie das Schicht für Schicht durch alle Schichten der Wand. Während sie jede Schicht durchquert oder hineingreift, muss die Kreatur einen Geschicklichkeitsrettungswurf ablegen, sonst wird sie von den Eigenschaften dieser Schicht betroffen, wie unten beschrieben.

Die Wand kann zerstört werden, ebenfalls Schicht für Schicht, in der Reihenfolge von Rot bis Violett, mit Mitteln, die für jede Schicht eigen sind. Ist eine Schicht zerstört, bleibt sie es für die Wirkungsdauer. Ein *Stab der Aufhebung* zerstört eine *Prismatische Wand*, doch ein *Antimagisches Feld* wirkt nicht auf sie.

***1. Rot.*** Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Feuerschaden, bei einem erfolgreichen die Hälfte. Solange diese Schicht besteht, können nichtmagische Fernkampfangriffe die Wand nicht durchqueren. Die Schicht kann zerstört werden, indem man ihr mindestens 25 Kälteschaden zufügt.

***2. Orange.*** Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Säureschaden, bei einem erfolgreichen die Hälfte. Solange diese Schicht besteht, können magische Fernkampfangriffe die Wand nicht durchqueren. Die Schicht wird durch einen starken Wind zerstört.

***3. Gelb.*** Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Blitzschaden, bei einem erfolgreichen die Hälfte. Diese Schicht kann zerstört werden, indem man ihr mindestens 60 Energieschaden zufügt.

***4. Grün.*** Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Giftschaden, bei einem erfolgreichen die Hälfte. Der Zauber *Mauerdurchgang* oder ein anderer Zauber gleichen oder höheren Grades, der eine Öffnung in einer festen Oberfläche schaffen kann, zerstört diese Schicht.

***5. Blau.*** Bei einem misslungenen Rettungswurf erleidet die Kreatur 10W6 Kälteschaden, bei einem erfolgreichen die Hälfte. Diese Schicht kann zerstört werden, indem man ihr mindestens 25 Feuerschaden zufügt.

***6. Indigo.*** Bei einem misslungenen Rettungswurf ist die Kreatur festgesetzt. Sie muss dann am Ende jedes ihrer Züge einen Konstitutionsrettungswurf ablegen. Besteht sie dreimal, endet der Zauber. Misslingt ihr der Rettungswurf dreimal, wird sie dauerhaft zu Stein und ist versteinert. Die Erfolge und Fehlschläge müssen nicht aufeinanderfolgen; zähle beide mit, bis die Kreatur drei gleiche gesammelt hat.

Solange diese Schicht besteht, können keine Zauber durch die Wand gewirkt werden. Die Schicht wird durch das helle Licht des Zaubers *Tageslicht* oder eines ähnlichen Zaubers gleichen oder höheren Grades zerstört.

***7. Violett.*** Bei einem misslungenen Rettungswurf ist die Kreatur blind. Sie muss dann zu Beginn deines nächsten Zuges einen Weisheitsrettungswurf ablegen. Ein erfolgreicher Rettungswurf beendet die Blindheit. Misslingt er, wird die Kreatur auf eine andere Ebene nach Wahl des SL versetzt und ist nicht mehr blind. (Meist wird eine Kreatur, die sich nicht auf ihrer Heimatebene befindet, nach Hause verbannt, während andere Kreaturen meist auf die Astral- oder Ätherebene geschleudert werden.) Diese Schicht wird durch den Zauber *Magie bannen* oder einen ähnlichen Zauber gleichen oder höheren Grades zerstört, der Zauber und magische Wirkungen beenden kann.`,
  },
  shapechange: {
    text: `Du nimmst für die Wirkungsdauer die Gestalt einer anderen Kreatur an. Die neue Gestalt kann die jeder Kreatur mit einem Herausforderungsgrad in Höhe deiner Stufe oder niedriger sein. Die Kreatur darf kein Konstrukt und kein Untoter sein, und du musst diese Art von Kreatur mindestens einmal gesehen haben. Du verwandelst dich in ein durchschnittliches Exemplar dieser Kreatur, ohne Klassenstufen und ohne das Merkmal Zauberwirken.

Deine Spielwerte werden durch die der gewählten Kreatur ersetzt, doch du behältst deine Gesinnung und deine Intelligenz-, Weisheits- und Charismawerte. Außerdem behältst du alle deine Fertigkeits- und Rettungswurfübungen und erhältst zusätzlich die der Kreatur. Hat die Kreatur dieselbe Übung wie du und ist der in ihren Spielwerten angegebene Bonus höher als deiner, verwende statt deines Bonus den der Kreatur. Du kannst keine legendären Aktionen oder Hortaktionen der neuen Gestalt nutzen.

Du übernimmst die Trefferpunkte und Trefferwürfel der neuen Gestalt. Nimmst du wieder deine normale Gestalt an, kehrst du zu der Zahl an Trefferpunkten zurück, die du vor der Verwandlung hattest. Verwandelst du dich zurück, weil du auf 0 Trefferpunkte gefallen bist, wird überschüssiger Schaden auf deine normale Gestalt übertragen. Solange der überschüssige Schaden deine normale Gestalt nicht auf 0 Trefferpunkte bringt, wirst du nicht bewusstlos.

Du behältst den Nutzen aller Merkmale deiner Klasse, deines Volks oder anderer Quellen und kannst sie nutzen, sofern deine neue Gestalt körperlich dazu in der Lage ist. Besondere Sinne, die du hast (zum Beispiel Dunkelsicht), kannst du nur nutzen, wenn deine neue Gestalt diesen Sinn ebenfalls hat. Du kannst nur sprechen, wenn die Kreatur normalerweise sprechen kann.

Wenn du dich verwandelst, wählst du, ob deine Ausrüstung zu Boden fällt, mit der neuen Gestalt verschmilzt oder von ihr getragen wird. Getragene Ausrüstung funktioniert wie gewohnt. Der SL entscheidet anhand von Form und Größe der Kreatur, ob die neue Gestalt ein Ausrüstungsteil sinnvoll tragen kann. Deine Ausrüstung ändert weder Form noch Größe, um zur neuen Gestalt zu passen, und jede Ausrüstung, die die neue Gestalt nicht tragen kann, muss entweder zu Boden fallen oder mit deiner neuen Gestalt verschmelzen. Verschmolzene Ausrüstung wirkt in diesem Zustand nicht.

Während der Wirkungsdauer kannst du deine Aktion nutzen, um eine andere Gestalt anzunehmen, wobei dieselben Einschränkungen und Regeln gelten wie für die ursprüngliche Gestalt, mit einer Ausnahme: Hat deine neue Gestalt mehr Trefferpunkte als deine aktuelle, bleiben deine Trefferpunkte auf ihrem aktuellen Wert.`,
    material:
      'Ein Jadereif im Wert von mindestens 1.500 GM, den du dir vor dem Wirken des Zaubers auf den Kopf setzen musst.',
  },
  'storm-of-vengeance': {
    text: `Eine brodelnde Gewitterwolke bildet sich, deren Mittelpunkt ein Punkt ist, den du sehen kannst, und breitet sich auf einen Radius von 108 m aus. Im Bereich zucken Blitze, Donner grollt, und starke Winde brüllen. Jede Kreatur unter der Wolke (höchstens 1,5 km darunter) muss beim Erscheinen der Wolke einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 2W6 Schallschaden und ist 5 Minuten lang taub.

In jeder Runde, in der du die Konzentration auf diesen Zauber aufrechterhältst, erzeugt der Sturm in deinem Zug zusätzliche Wirkungen.

***Runde 2.*** Saurer Regen fällt aus der Wolke. Jede Kreatur und jeder Gegenstand unter der Wolke erleidet 1W6 Säureschaden.

***Runde 3.*** Du rufst sechs Blitze aus der Wolke herab, die sechs Kreaturen oder Gegenstände deiner Wahl unter der Wolke treffen. Eine Kreatur oder ein Gegenstand kann nicht von mehr als einem Blitz getroffen werden. Eine getroffene Kreatur muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 10W6 Blitzschaden, bei einem erfolgreichen die Hälfte.

***Runde 4.*** Hagelkörner prasseln aus der Wolke herab. Jede Kreatur unter der Wolke erleidet 2W6 Wuchtschaden.

***Runde 5–10.*** Böen und Eisregen peitschen den Bereich unter der Wolke. Der Bereich wird zu schwierigem Gelände und ist komplett verschleiert. Jede Kreatur dort erleidet 1W6 Kälteschaden. Fernkampf-Waffenangriffe sind im Bereich unmöglich. Wind und Regen gelten als heftige Ablenkung, wenn es darum geht, die Konzentration auf Zauber aufrechtzuerhalten. Schließlich zerstreuen Böen starken Windes (30 bis 75 km/h) automatisch Nebel, Dunst und ähnliche Erscheinungen im Bereich, ob gewöhnlich oder magisch.`,
  },
  'time-stop': {
    text: `Du hältst den Fluss der Zeit für alle außer dir kurz an. Für andere Kreaturen vergeht keine Zeit, während du 1W4 + 1 Züge hintereinander ausführst, in denen du wie gewohnt Aktionen nutzen und dich bewegen kannst.

Dieser Zauber endet, wenn eine der Aktionen, die du in dieser Zeit nutzt, oder eine Wirkung, die du in dieser Zeit erschaffst, eine andere Kreatur als dich oder einen Gegenstand betrifft, den jemand anderes als du trägt oder hält. Außerdem endet der Zauber, wenn du dich an einen Ort bewegst, der mehr als 300 m von dem Ort entfernt ist, an dem du ihn gewirkt hast.`,
  },
  'true-polymorph': {
    text: `Wähle eine Kreatur oder einen nichtmagischen Gegenstand, den du in Reichweite sehen kannst. Du verwandelst die Kreatur in eine andere Kreatur, die Kreatur in einen Gegenstand oder den Gegenstand in eine Kreatur (der Gegenstand darf weder von einer anderen Kreatur getragen noch gehalten werden). Die Verwandlung hält für die Wirkungsdauer an oder bis das Ziel auf 0 Trefferpunkte fällt oder stirbt. Konzentrierst du dich die volle Wirkungsdauer auf diesen Zauber, wird die Verwandlung dauerhaft.

Gestaltwandler sind von diesem Zauber nicht betroffen. Eine nicht bereitwillige Kreatur kann einen Weisheitsrettungswurf ablegen und ist bei einem Erfolg von diesem Zauber nicht betroffen.

***Kreatur in Kreatur.*** Verwandelst du eine Kreatur in eine andere Art von Kreatur, kann die neue Gestalt jede Art deiner Wahl sein, deren Herausforderungsgrad kleiner oder gleich dem des Ziels ist (oder seiner Stufe, wenn das Ziel keinen Herausforderungsgrad hat). Die Spielwerte des Ziels, einschließlich seiner geistigen Attributswerte, werden durch die der neuen Gestalt ersetzt. Es behält seine Gesinnung und Persönlichkeit.

Das Ziel übernimmt die Trefferpunkte seiner neuen Gestalt, und nimmt es wieder seine normale Gestalt an, kehrt die Kreatur zu der Zahl an Trefferpunkten zurück, die sie vor der Verwandlung hatte. Verwandelt sie sich zurück, weil sie auf 0 Trefferpunkte gefallen ist, wird überschüssiger Schaden auf ihre normale Gestalt übertragen. Solange der überschüssige Schaden die normale Gestalt der Kreatur nicht auf 0 Trefferpunkte bringt, wird sie nicht bewusstlos.

Die Kreatur ist in den Aktionen, die sie ausführen kann, durch die Natur ihrer neuen Gestalt eingeschränkt, und sie kann weder sprechen noch Zauber wirken noch eine andere Aktion ausführen, die Hände oder Sprache erfordert, es sei denn, ihre neue Gestalt ist zu solchen Aktionen fähig.

Die Ausrüstung des Ziels verschmilzt mit der neuen Gestalt. Die Kreatur kann ihre Ausrüstung weder aktivieren noch benutzen, führen oder anderweitig von ihr profitieren.

***Gegenstand in Kreatur.*** Du kannst einen Gegenstand in jede Art von Kreatur verwandeln, solange die Kreatur nicht größer ist als der Gegenstand und ihr Herausforderungsgrad 9 oder niedriger ist. Die Kreatur ist dir und deinen Gefährten freundlich gesinnt. Sie handelt in jedem deiner Züge. Du bestimmst, welche Aktion sie ausführt und wie sie sich bewegt. Der SL hat die Spielwerte der Kreatur und handhabt alle ihre Aktionen und Bewegungen.

Wird der Zauber dauerhaft, kontrollierst du die Kreatur nicht mehr. Sie bleibt dir vielleicht freundlich gesinnt, je nachdem, wie du sie behandelt hast.

***Kreatur in Gegenstand.*** Verwandelst du eine Kreatur in einen Gegenstand, verwandelt sie sich samt allem, was sie trägt und hält, in diese Form. Die Spielwerte der Kreatur werden zu denen des Gegenstands, und die Kreatur hat keine Erinnerung an die Zeit in dieser Form, nachdem der Zauber endet und sie in ihre normale Gestalt zurückkehrt.`,
    material: 'Ein Tropfen Quecksilber, ein Klecks Gummiarabikum und ein Rauchfaden.',
  },
  'true-resurrection': {
    text: `Du berührst eine Kreatur, die nicht länger als 200 Jahre tot ist und aus einem beliebigen Grund außer Altersschwäche gestorben ist. Ist die Seele der Kreatur frei und bereit, kehrt die Kreatur mit all ihren Trefferpunkten ins Leben zurück.

Dieser Zauber schließt alle Wunden, neutralisiert alle Gifte, heilt alle Krankheiten und hebt alle Flüche auf, die die Kreatur bei ihrem Tod plagten. Der Zauber ersetzt beschädigte oder fehlende Organe und Gliedmaßen.

Der Zauber kann sogar einen neuen Körper erschaffen, wenn der ursprüngliche nicht mehr existiert; in diesem Fall musst du den Namen der Kreatur aussprechen. Die Kreatur erscheint dann in einem freien Bereich deiner Wahl im Umkreis von 3 m um dich.`,
    material:
      'Ein paar Spritzer Weihwasser und Diamanten im Wert von mindestens 25.000 GM, die der Zauber verbraucht.',
  },
  weird: {
    text: `Du greifst auf die tiefsten Ängste einer Gruppe von Kreaturen zu und erschaffst in ihrem Geist illusionäre Kreaturen, die nur sie sehen können. Jede Kreatur in einer Kugel mit 9 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist, muss einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist eine Kreatur für die Wirkungsdauer verängstigt. Die Illusion beschwört die tiefsten Ängste der Kreatur und lässt ihre schlimmsten Albträume als unerbittliche Bedrohung erscheinen. Zu Beginn jedes ihrer Züge muss die verängstigte Kreatur einen Weisheitsrettungswurf bestehen, sonst erleidet sie 4W10 psychischen Schaden. Bei einem erfolgreichen Rettungswurf endet der Zauber für diese Kreatur.`,
  },
  wish: {
    text: `*Wunsch* ist der mächtigste Zauber, den eine sterbliche Kreatur wirken kann. Indem du einfach laut sprichst, kannst du die Grundfesten der Wirklichkeit nach deinen Wünschen verändern.

Die grundlegende Anwendung dieses Zaubers ist, jeden anderen Zauber des 8. Grades oder niedriger nachzubilden. Du musst keine der Voraussetzungen dieses Zaubers erfüllen, auch keine kostspieligen Komponenten. Der Zauber wirkt einfach.

Alternativ kannst du eine der folgenden Wirkungen deiner Wahl hervorrufen:

- Du erschaffst einen Gegenstand im Wert von bis zu 25.000 GM, der kein magischer Gegenstand ist. Der Gegenstand darf in keiner Richtung größer als 90 m sein und erscheint in einem freien Bereich auf dem Boden, den du sehen kannst.

- Du lässt bis zu zwanzig Kreaturen, die du sehen kannst, alle Trefferpunkte zurückerhalten und beendest alle Wirkungen auf ihnen, die im Zauber *Vollständige Genesung* beschrieben sind.

- Du gewährst bis zu zehn Kreaturen, die du sehen kannst, Resistenz gegen eine Schadensart deiner Wahl.

- Du gewährst bis zu zehn Kreaturen, die du sehen kannst, für 8 Stunden Immunität gegen einen einzelnen Zauber oder eine andere magische Wirkung. Du könntest zum Beispiel dich und alle deine Gefährten gegen den Lebensentzug eines Lichs immun machen.

- Du machst ein einzelnes jüngstes Ereignis ungeschehen, indem du jeden Wurf, der in der letzten Runde (einschließlich deines letzten Zuges) gemacht wurde, wiederholen lässt. Die Wirklichkeit formt sich so um, dass sie dem neuen Ergebnis entspricht. Ein *Wunsch* könnte zum Beispiel den erfolgreichen Rettungswurf eines Gegners, den kritischen Treffer eines Feindes oder den misslungenen Rettungswurf eines Freundes ungeschehen machen. Du kannst den wiederholten Wurf mit Vorteil oder Nachteil ablegen lassen und wählen, ob der wiederholte oder der ursprüngliche Wurf gilt.

Vielleicht kannst du auch etwas erreichen, das über die obigen Beispiele hinausgeht. Trage deinen Wunsch dem SL so genau wie möglich vor. Der SL hat großen Spielraum zu entscheiden, was in einem solchen Fall geschieht; je größer der Wunsch, desto größer die Wahrscheinlichkeit, dass etwas schiefgeht. Der Zauber misslingt vielleicht einfach, die gewünschte Wirkung wird nur teilweise erreicht, oder du erleidest durch die Formulierung deines Wunsches eine unvorhergesehene Folge. Der Wunsch, ein Schurke möge tot sein, könnte dich zum Beispiel in eine Zeit vorausschleudern, in der dieser Schurke nicht mehr lebt, wodurch du praktisch aus dem Spiel genommen wirst. Ebenso könnte dich der Wunsch nach einem legendären magischen Gegenstand oder Artefakt augenblicklich zum gegenwärtigen Besitzer des Gegenstands versetzen.

Die Belastung, diesen Zauber für eine andere Wirkung als das Nachbilden eines anderen Zaubers zu wirken, schwächt dich. Nachdem du diese Belastung erlitten hast, erleidest du jedes Mal, wenn du einen Zauber wirkst, bis du eine lange Rast beendest, 1W10 nekrotischen Schaden pro Grad dieses Zaubers. Dieser Schaden kann auf keine Weise verringert oder verhindert werden. Außerdem sinkt deine Stärke für 2W4 Tage auf 3, falls sie nicht schon 3 oder niedriger ist. Für jeden dieser Tage, den du mit Ruhe und nicht mehr als leichter Tätigkeit verbringst, verringert sich deine verbleibende Erholungszeit um 2 Tage. Schließlich besteht eine Wahrscheinlichkeit von 33 Prozent, dass du *Wunsch* nie wieder wirken kannst, wenn du diese Belastung erleidest.`,
  },
};
