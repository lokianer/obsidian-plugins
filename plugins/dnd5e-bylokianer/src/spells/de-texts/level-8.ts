// German texts of the SRD spells of the 8th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_8: Readonly<Record<string, DeText>> = {
  'animal-shapes': {
    text: `Deine Magie verwandelt andere in Tiere. Wähle beliebig viele bereitwillige Kreaturen, die du in Reichweite sehen kannst. Du verwandelst jedes Ziel in die Gestalt eines großen oder kleineren Tiers mit Herausforderungsgrad 4 oder niedriger. In späteren Zügen kannst du deine Aktion nutzen, um betroffene Kreaturen in neue Gestalten zu verwandeln.

Die Verwandlung hält für jedes Ziel für die Wirkungsdauer an oder bis das Ziel auf 0 Trefferpunkte fällt oder stirbt. Du kannst für jedes Ziel eine andere Gestalt wählen. Die Spielwerte eines Ziels werden durch die des gewählten Tiers ersetzt, doch das Ziel behält seine Gesinnung und seine Intelligenz-, Weisheits- und Charismawerte. Das Ziel übernimmt die Trefferpunkte seiner neuen Gestalt, und nimmt es wieder seine normale Gestalt an, kehrt es zu der Zahl an Trefferpunkten zurück, die es vor der Verwandlung hatte. Verwandelt es sich zurück, weil es auf 0 Trefferpunkte gefallen ist, wird überschüssiger Schaden auf seine normale Gestalt übertragen. Solange der überschüssige Schaden die normale Gestalt der Kreatur nicht auf 0 Trefferpunkte bringt, wird sie nicht bewusstlos. Die Kreatur ist in den Aktionen, die sie ausführen kann, durch die Natur ihrer neuen Gestalt eingeschränkt, und sie kann weder sprechen noch Zauber wirken.

Die Ausrüstung des Ziels verschmilzt mit der neuen Gestalt. Das Ziel kann seine Ausrüstung weder aktivieren noch führen oder anderweitig von ihr profitieren.`,
  },
  'antimagic-field': {
    text: `Eine unsichtbare Antimagiekugel mit 3 m Radius umgibt dich. Dieser Bereich ist von der magischen Energie abgeschnitten, die das Multiversum durchdringt. In der Kugel können keine Zauber gewirkt werden, beschworene Kreaturen verschwinden, und selbst magische Gegenstände werden gewöhnlich. Bis der Zauber endet, bewegt sich die Kugel mit dir, wobei du stets ihr Mittelpunkt bleibst.

Zauber und andere magische Wirkungen, außer denen eines Artefakts oder einer Gottheit, werden in der Kugel unterdrückt und können nicht in sie hineinreichen. Ein Zauberplatz, der zum Wirken eines unterdrückten Zaubers verbraucht wird, ist verbraucht. Solange eine Wirkung unterdrückt ist, funktioniert sie nicht, doch die Zeit, in der sie unterdrückt ist, zählt gegen ihre Wirkungsdauer.

***Gezielte Wirkungen.*** Zauber und andere magische Wirkungen wie *Magisches Geschoss* und *Person bezaubern*, die eine Kreatur oder einen Gegenstand in der Kugel zum Ziel haben, wirken nicht auf dieses Ziel.

***Magische Bereiche.*** Der Bereich eines anderen Zaubers oder einer anderen magischen Wirkung, etwa *Feuerball*, kann nicht in die Kugel hineinreichen. Überschneidet sich die Kugel mit einem magischen Bereich, wird der Teil des Bereichs, den die Kugel bedeckt, unterdrückt. Die Flammen einer *Feuerwand* werden zum Beispiel in der Kugel unterdrückt, wodurch eine Lücke in der Wand entsteht, wenn die Überschneidung groß genug ist.

***Zauber.*** Jeder aktive Zauber oder jede andere magische Wirkung auf einer Kreatur oder einem Gegenstand in der Kugel wird unterdrückt, solange sich die Kreatur oder der Gegenstand darin befindet.

***Magische Gegenstände.*** Die Eigenschaften und Kräfte magischer Gegenstände werden in der Kugel unterdrückt. Ein *Langschwert +1* in der Kugel funktioniert zum Beispiel wie ein nichtmagisches Langschwert.

Die Eigenschaften und Kräfte einer magischen Waffe werden unterdrückt, wenn sie gegen ein Ziel in der Kugel eingesetzt oder von einem Angreifer in der Kugel geführt wird. Verlässt eine magische Waffe oder ein Stück magischer Munition die Kugel vollständig (etwa wenn du einen magischen Pfeil abschießt oder einen magischen Speer auf ein Ziel außerhalb der Kugel wirfst), wird die Magie des Gegenstands nicht mehr unterdrückt, sobald er sie verlässt.

***Magisches Reisen.*** Teleportation und Reisen zwischen den Ebenen funktionieren in der Kugel nicht, egal ob die Kugel Ziel oder Ausgangspunkt einer solchen magischen Reise ist. Ein Portal zu einem anderen Ort, einer anderen Welt oder Existenzebene sowie eine Öffnung zu einem extradimensionalen Raum, etwa dem des Zaubers *Seiltrick*, schließt sich vorübergehend, solange sie sich in der Kugel befindet.

***Kreaturen und Gegenstände.*** Eine durch Magie beschworene oder erschaffene Kreatur oder ein solcher Gegenstand verschwindet in der Kugel vorübergehend aus der Existenz. Eine solche Kreatur erscheint sofort wieder, sobald der Bereich, den sie einnahm, nicht mehr in der Kugel liegt.

***Magie bannen.*** Zauber und magische Wirkungen wie *Magie bannen* wirken nicht auf die Kugel. Ebenso heben sich die Kugeln verschiedener *Antimagisches Feld*-Zauber nicht gegenseitig auf.`,
    material: 'Eine Prise Eisenpulver oder Eisenspäne.',
  },
  'antipathy-sympathy': {
    text: `Dieser Zauber zieht Kreaturen deiner Wahl an oder stößt sie ab. Du wählst ein Ziel in Reichweite, entweder einen riesigen oder kleineren Gegenstand oder eine solche Kreatur oder einen Bereich, der nicht größer als ein Würfel mit 60 m Kantenlänge ist. Dann bestimmst du eine Art intelligenter Kreaturen, etwa rote Drachen, Goblins oder Vampire. Du verleihst dem Ziel für die Wirkungsdauer eine Aura, die die bestimmten Kreaturen entweder anzieht oder abstößt. Wähle Antipathie oder Sympathie als Wirkung der Aura.

***Antipathie.*** Die Verzauberung erfüllt Kreaturen der bestimmten Art mit dem heftigen Drang, den Bereich zu verlassen und das Ziel zu meiden. Kann eine solche Kreatur das Ziel sehen oder nähert sie sich ihm auf 18 m, muss sie einen Weisheitsrettungswurf bestehen, sonst ist sie verängstigt. Die Kreatur bleibt verängstigt, solange sie das Ziel sehen kann oder höchstens 18 m von ihm entfernt ist. Solange sie vom Ziel verängstigt ist, muss die Kreatur ihre Bewegung nutzen, um sich zum nächstgelegenen sicheren Ort zu bewegen, von dem aus sie das Ziel nicht sehen kann. Entfernt sich die Kreatur mehr als 18 m vom Ziel und kann es nicht sehen, ist sie nicht mehr verängstigt, wird es aber erneut, wenn sie das Ziel wieder sieht oder sich ihm auf 18 m nähert.

***Sympathie.*** Die Verzauberung erfüllt die bestimmten Kreaturen mit dem heftigen Drang, sich dem Ziel zu nähern, solange sie höchstens 18 m von ihm entfernt sind oder es sehen können. Kann eine solche Kreatur das Ziel sehen oder nähert sie sich ihm auf 18 m, muss sie einen Weisheitsrettungswurf bestehen, sonst nutzt sie in jedem ihrer Züge ihre Bewegung, um den Bereich zu betreten oder sich in die Reichweite des Ziels zu bewegen. Hat die Kreatur das getan, kann sie sich nicht freiwillig vom Ziel entfernen.

Verletzt das Ziel eine betroffene Kreatur oder fügt ihr anderweitig Schaden zu, kann die betroffene Kreatur einen Weisheitsrettungswurf ablegen, um die Wirkung zu beenden, wie unten beschrieben.

***Ende der Wirkung.*** Beendet eine betroffene Kreatur ihren Zug, während sie nicht höchstens 18 m vom Ziel entfernt ist und es nicht sehen kann, legt sie einen Weisheitsrettungswurf ab. Bei einem erfolgreichen Rettungswurf ist die Kreatur nicht mehr vom Ziel betroffen und erkennt das Gefühl von Abscheu oder Anziehung als magisch. Außerdem darf eine vom Zauber betroffene Kreatur alle 24 Stunden, solange der Zauber anhält, einen weiteren Weisheitsrettungswurf ablegen.

Eine Kreatur, die einen Rettungswurf gegen diese Wirkung besteht, ist 1 Minute lang immun dagegen und kann danach erneut betroffen werden.`,
    material:
      'Entweder ein in Essig getränkter Klumpen Alaun für die Antipathie oder ein Tropfen Honig für die Sympathie.',
  },
  clone: {
    text: `Dieser Zauber lässt einen leblosen Doppelgänger einer lebenden Kreatur als Schutz vor dem Tod heranwachsen. Dieser Klon bildet sich in einem versiegelten Gefäß und erreicht nach 120 Tagen volle Größe und Reife; du kannst den Klon auch als jüngere Version derselben Kreatur entstehen lassen. Er bleibt leblos und hält unbegrenzt, solange sein Gefäß ungestört bleibt.

Stirbt die ursprüngliche Kreatur zu einem beliebigen Zeitpunkt, nachdem der Klon gereift ist, geht ihre Seele auf den Klon über, sofern die Seele frei und bereit ist zurückzukehren. Der Klon ist körperlich mit dem Original identisch und hat dieselbe Persönlichkeit, dieselben Erinnerungen und Fähigkeiten, aber nichts von der Ausrüstung des Originals. Die sterblichen Überreste der ursprünglichen Kreatur werden, falls noch vorhanden, leblos und können danach nicht mehr ins Leben zurückgeholt werden, da sich die Seele der Kreatur anderswo befindet.`,
    material:
      'Ein Diamant im Wert von mindestens 1.000 GM und mindestens 16 Kubikzentimeter Fleisch der zu klonenden Kreatur, die der Zauber verbraucht, sowie ein Gefäß im Wert von mindestens 2.000 GM mit verschließbarem Deckel, groß genug für eine mittelgroße Kreatur, etwa eine riesige Urne, ein Sarg, eine schlammgefüllte Höhlung im Boden oder ein mit Salzwasser gefüllter Kristallbehälter.',
  },
  'control-weather': {
    text: `Du übernimmst für die Wirkungsdauer die Kontrolle über das Wetter im Umkreis von 7,5 km um dich. Du musst im Freien sein, um diesen Zauber zu wirken. Bewegst du dich an einen Ort, von dem aus du keinen freien Blick zum Himmel hast, endet der Zauber vorzeitig.

Wenn du den Zauber wirkst, veränderst du die aktuellen Wetterbedingungen, die der SL anhand von Klima und Jahreszeit bestimmt. Du kannst Niederschlag, Temperatur und Wind verändern. Es dauert 1W4 × 10 Minuten, bis die neuen Bedingungen eintreten. Sobald das geschehen ist, kannst du die Bedingungen erneut verändern. Wenn der Zauber endet, kehrt das Wetter allmählich zum Normalzustand zurück.

Wenn du die Wetterbedingungen veränderst, suche eine aktuelle Bedingung in den folgenden Tabellen und verändere ihre Stufe um eins nach oben oder unten. Veränderst du den Wind, kannst du seine Richtung ändern.

##### Niederschlag

| Stufe | Bedingung |
|---|---|
| 1 | Klar |
| 2 | Leicht bewölkt |
| 3 | Bedeckt oder Bodennebel |
| 4 | Regen, Hagel oder Schnee |
| 5 | Wolkenbruch, Hagelschauer oder Schneesturm |

##### Temperatur

| Stufe | Bedingung |
|---|---|
| 1 | Unerträgliche Hitze |
| 2 | Heiß |
| 3 | Warm |
| 4 | Kühl |
| 5 | Kalt |
| 6 | Arktische Kälte |

##### Wind

| Stufe | Bedingung |
|---|---|
| 1 | Windstill |
| 2 | Mäßiger Wind |
| 3 | Starker Wind |
| 4 | Sturmböen |
| 5 | Orkan |`,
    material: 'Brennender Weihrauch und Stücke von Erde und Holz, in Wasser vermischt.',
  },
  demiplane: {
    text: `Du erschaffst eine schattenhafte Tür auf einer ebenen, festen Oberfläche, die du in Reichweite sehen kannst. Die Tür ist groß genug, dass mittelgroße Kreaturen ungehindert hindurchgehen können. Geöffnet führt die Tür zu einer Halbebene, die wie ein leerer Raum aus Holz oder Stein mit 9 m in jeder Richtung aussieht. Wenn der Zauber endet, verschwindet die Tür, und alle Kreaturen oder Gegenstände in der Halbebene bleiben dort gefangen, da die Tür auch auf der anderen Seite verschwindet.

Jedes Mal, wenn du diesen Zauber wirkst, kannst du eine neue Halbebene erschaffen oder die schattenhafte Tür mit einer Halbebene verbinden, die du mit einem früheren Wirken dieses Zaubers erschaffen hast. Kennst du außerdem Beschaffenheit und Inhalt einer Halbebene, die eine andere Kreatur mit diesem Zauber erschaffen hat, kannst du die schattenhafte Tür stattdessen mit ihrer Halbebene verbinden.`,
  },
  'dominate-monster': {
    text: `Du versuchst, eine Kreatur zu betören, die du in Reichweite sehen kannst. Sie muss einen Weisheitsrettungswurf bestehen, sonst ist sie für die Wirkungsdauer von dir bezaubert. Kämpfst du oder kämpfen dir freundlich gesinnte Kreaturen gegen sie, ist sie beim Rettungswurf im Vorteil.

Solange die Kreatur bezaubert ist, hast du eine telepathische Verbindung zu ihr, sofern ihr euch auf derselben Existenzebene befindet. Über diese telepathische Verbindung kannst du der Kreatur Befehle geben, solange du bei Bewusstsein bist (dafür brauchst du keine Aktion), und sie tut ihr Bestes, um zu gehorchen. Du kannst eine einfache und allgemeine Handlung vorgeben, etwa „Greif diese Kreatur an“, „Lauf dorthin“ oder „Hol diesen Gegenstand“. Erfüllt die Kreatur den Befehl und erhält sie keine weitere Anweisung von dir, verteidigt und schützt sie sich nach besten Kräften.

Du kannst deine Aktion nutzen, um die vollständige und genaue Kontrolle über das Ziel zu übernehmen. Bis zum Ende deines nächsten Zuges führt die Kreatur nur die Aktionen aus, die du wählst, und tut nichts, was du ihr nicht erlaubst. Während dieser Zeit kannst du die Kreatur auch eine Reaktion ausführen lassen, musst dafür aber auch deine eigene Reaktion nutzen.

Jedes Mal, wenn das Ziel Schaden erleidet, legt es einen neuen Weisheitsrettungswurf gegen den Zauber ab. Gelingt der Rettungswurf, endet der Zauber.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 9. Grades wirkst, beträgt die Wirkungsdauer Konzentration, bis zu 8 Stunden.`,
  },
  earthquake: {
    text: `Du erzeugst eine seismische Erschütterung an einem Punkt auf dem Boden, den du in Reichweite sehen kannst. Für die Wirkungsdauer reißt ein heftiges Beben den Boden in einem Kreis mit 30 m Radius um diesen Punkt auf und erschüttert Kreaturen und Bauwerke, die in diesem Bereich den Boden berühren.

Der Boden im Bereich wird zu schwierigem Gelände. Jede Kreatur auf dem Boden, die sich konzentriert, muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf wird die Konzentration der Kreatur unterbrochen.

Wenn du diesen Zauber wirkst und am Ende jedes Zuges, den du dich auf ihn konzentrierst, muss jede Kreatur auf dem Boden im Bereich einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf wird die Kreatur umgeworfen.

Dieser Zauber kann je nach Gelände im Bereich zusätzliche Wirkungen haben, die der SL bestimmt.

***Spalten.*** Zu Beginn deines nächsten Zuges nach dem Wirken öffnen sich überall im Bereich des Zaubers Spalten. Insgesamt öffnen sich 1W6 solcher Spalten an Orten, die der SL wählt. Jede ist 1W10 × 3 m tief und 3 m breit und erstreckt sich von einem Rand des Zauberbereichs zur gegenüberliegenden Seite. Eine Kreatur, die an einer Stelle steht, an der sich eine Spalte öffnet, muss einen Geschicklichkeitsrettungswurf bestehen, sonst fällt sie hinein. Eine Kreatur, die den Rettungswurf besteht, bewegt sich mit dem Rand der Spalte, während diese sich öffnet.

Eine Spalte, die sich unter einem Bauwerk öffnet, lässt es automatisch einstürzen (siehe unten).

***Bauwerke.*** Das Beben fügt jedem Bauwerk, das den Boden im Bereich berührt, beim Wirken des Zaubers und zu Beginn jedes deiner Züge bis zum Ende des Zaubers 50 Wuchtschaden zu. Fällt ein Bauwerk auf 0 Trefferpunkte, stürzt es ein und verletzt dabei vielleicht nahe Kreaturen. Eine Kreatur, die sich höchstens die Hälfte der Höhe eines Bauwerks von diesem entfernt befindet, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 5W6 Wuchtschaden, wird umgeworfen und unter den Trümmern begraben; um sich zu befreien, ist als Aktion ein Stärkewurf (Athletik) gegen SG 20 nötig. Der SL kann den SG je nach Art der Trümmer erhöhen oder senken. Bei einem erfolgreichen Rettungswurf erleidet die Kreatur die Hälfte des Schadens und wird weder umgeworfen noch begraben.`,
    material: 'Eine Prise Erde, ein Stück Fels und ein Klumpen Ton.',
  },
  feeblemind: {
    text: `Du greifst den Geist einer Kreatur an, die du in Reichweite sehen kannst, und versuchst, ihren Verstand und ihre Persönlichkeit zu zerschmettern. Das Ziel erleidet 4W6 psychischen Schaden und muss einen Intelligenzrettungswurf ablegen.

Bei einem misslungenen Rettungswurf sinken der Intelligenz- und der Charismawert der Kreatur auf 1. Die Kreatur kann keine Zauber wirken, keine magischen Gegenstände aktivieren, keine Sprache verstehen und sich auf keine verständliche Weise verständigen. Sie kann jedoch ihre Freunde erkennen, ihnen folgen und sie sogar beschützen.

Am Ende von jeweils 30 Tagen kann die Kreatur ihren Rettungswurf gegen diesen Zauber wiederholen. Gelingt ihr der Rettungswurf, endet der Zauber.

Der Zauber kann auch durch *Vollständige Genesung*, *Heilung* oder *Wunsch* beendet werden.`,
    material: 'Eine Handvoll Kugeln aus Ton, Kristall, Glas oder Mineral.',
  },
  glibness: {
    text: `Bis der Zauber endet, kannst du bei einem Charismawurf das gewürfelte Ergebnis durch eine 15 ersetzen. Außerdem zeigt Magie, die feststellen soll, ob du die Wahrheit sagst, unabhängig davon, was du sagst, dass du die Wahrheit sagst.`,
  },
  'holy-aura': {
    text: `Göttliches Licht strömt von dir aus und verdichtet sich in einem Radius von 9 m um dich zu einem sanften Glanz. Kreaturen deiner Wahl, die sich beim Wirken in diesem Radius befinden, spenden in einem Radius von 1,5 m dämmriges Licht und sind bei allen Rettungswürfen im Vorteil, und andere Kreaturen sind bis zum Ende des Zaubers bei Angriffswürfen gegen sie im Nachteil. Außerdem blitzt die Aura in strahlendem Licht auf, wenn ein Unhold oder Untoter eine betroffene Kreatur mit einem Nahkampfangriff trifft. Der Angreifer muss einen Konstitutionsrettungswurf bestehen, sonst ist er bis zum Ende des Zaubers blind.`,
    material:
      'Ein winziges Reliquiar im Wert von mindestens 1.000 GM mit einer heiligen Reliquie, etwa einem Stofffetzen aus dem Gewand eines Heiligen oder einem Stück Pergament aus einer heiligen Schrift.',
  },
  'incendiary-cloud': {
    text: `Eine wirbelnde Rauchwolke, durchsetzt von weißglühender Glut, erscheint in einer Kugel mit 6 m Radius, deren Mittelpunkt ein Punkt in Reichweite ist. Die Wolke breitet sich um Ecken aus und ist komplett verschleiert. Sie bleibt für die Wirkungsdauer bestehen oder bis ein mäßiger oder stärkerer Wind (mindestens 15 km/h) sie zerstreut.

Wenn die Wolke erscheint, muss jede Kreatur darin einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 10W8 Feuerschaden, bei einem erfolgreichen die Hälfte. Eine Kreatur muss diesen Rettungswurf auch ablegen, wenn sie den Bereich des Zaubers in einem Zug zum ersten Mal betritt oder ihren Zug dort beendet.

Zu Beginn jedes deiner Züge bewegt sich die Wolke 3 m direkt von dir weg in eine Richtung deiner Wahl.`,
  },
  maze: {
    text: `Du verbannst eine Kreatur, die du in Reichweite sehen kannst, in eine labyrinthartige Halbebene. Das Ziel bleibt dort für die Wirkungsdauer oder bis es dem Labyrinth entkommt.

Das Ziel kann seine Aktion nutzen, um zu versuchen zu entkommen. Tut es das, legt es einen Intelligenzwurf gegen SG 20 ab. Gelingt er, entkommt es, und der Zauber endet (ein Minotaurus oder ein Goristro-Dämon hat automatisch Erfolg).

Wenn der Zauber endet, erscheint das Ziel wieder in dem Bereich, den es verlassen hat, oder, falls dieser besetzt ist, im nächstgelegenen freien Bereich.`,
  },
  'mind-blank': {
    text: `Bis der Zauber endet, ist eine bereitwillige Kreatur, die du berührst, immun gegen psychischen Schaden, gegen jede Wirkung, die ihre Gefühle wahrnehmen oder ihre Gedanken lesen würde, gegen Erkenntniszauber und gegen den Zustand bezaubert. Der Zauber vereitelt sogar *Wunsch*-Zauber und Zauber oder Wirkungen ähnlicher Macht, mit denen der Geist des Ziels beeinflusst oder Auskunft über das Ziel erlangt werden soll.`,
  },
  'power-word-stun': {
    text: `Du sprichst ein Machtwort, das den Geist einer Kreatur, die du in Reichweite sehen kannst, überwältigen kann und sie fassungslos zurücklässt. Hat das Ziel 150 Trefferpunkte oder weniger, ist es betäubt. Andernfalls wirkt der Zauber nicht.

Das betäubte Ziel muss am Ende jedes seiner Züge einen Konstitutionsrettungswurf ablegen. Bei einem erfolgreichen Rettungswurf endet diese Betäubung.`,
  },
  sunburst: {
    text: `Strahlendes Sonnenlicht blitzt in einem Radius von 18 m um einen Punkt deiner Wahl in Reichweite auf. Jede Kreatur in diesem Licht muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 12W6 gleißenden Schaden und ist 1 Minute lang blind. Bei einem erfolgreichen Rettungswurf erleidet sie die Hälfte des Schadens und wird von diesem Zauber nicht geblendet. Untote und Schlicke sind bei diesem Rettungswurf im Nachteil.

Eine durch diesen Zauber geblendete Kreatur legt am Ende jedes ihrer Züge einen weiteren Konstitutionsrettungswurf ab. Bei einem erfolgreichen Rettungswurf ist sie nicht mehr blind.

Dieser Zauber bannt jede Dunkelheit in seinem Bereich, die durch einen Zauber erschaffen wurde.`,
    material: 'Feuer und ein Stück Sonnenstein.',
  },
};
