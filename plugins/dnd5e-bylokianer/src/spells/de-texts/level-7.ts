// German texts of the SRD spells of the 7th level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_7: Readonly<Record<string, DeText>> = {
  'arcane-sword': {
    text: `Du erschaffst eine schwertförmige Fläche aus Energie, die in Reichweite schwebt. Sie bleibt für die Wirkungsdauer bestehen.

Wenn das Schwert erscheint, führst du einen Nahkampf-Zauberangriff gegen ein Ziel deiner Wahl im Umkreis von 1,5 m um das Schwert aus. Bei einem Treffer erleidet das Ziel 3W10 Energieschaden. Bis der Zauber endet, kannst du in jedem deiner Züge eine Bonusaktion nutzen, um das Schwert bis zu 6 m weit an eine Stelle zu bewegen, die du sehen kannst, und diesen Angriff gegen dasselbe oder ein anderes Ziel zu wiederholen.`,
    material:
      'Ein Miniaturschwert aus Platin mit Griff und Knauf aus Kupfer und Zink im Wert von 250 GM.',
  },
  'conjure-celestial': {
    text: `Du beschwörst einen Himmlischen mit Herausforderungsgrad 4 oder niedriger, der in einem freien Bereich erscheint, den du in Reichweite sehen kannst. Der Himmlische verschwindet, wenn er auf 0 Trefferpunkte fällt oder der Zauber endet.

Der Himmlische ist dir und deinen Gefährten für die Wirkungsdauer freundlich gesinnt. Würfle die Initiative des Himmlischen aus, der eigene Züge hat. Er gehorcht allen mündlichen Befehlen, die du ihm gibst (dafür brauchst du keine Aktion), solange sie nicht seiner Gesinnung widersprechen. Gibst du dem Himmlischen keine Befehle, verteidigt er sich gegen feindselige Kreaturen, führt ansonsten aber keine Aktionen aus.

Der SL hat die Spielwerte des Himmlischen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 9. Grades wirkst, beschwörst du einen Himmlischen mit Herausforderungsgrad 5 oder niedriger.`,
  },
  'delayed-blast-fireball': {
    text: `Ein Strahl gelben Lichts zuckt aus deinem ausgestreckten Finger und verdichtet sich dann zu einer leuchtenden Perle, die für die Wirkungsdauer an einem gewählten Punkt in Reichweite verharrt. Wenn der Zauber endet, weil deine Konzentration unterbrochen wird oder du beschließt, ihn zu beenden, erblüht die Perle mit einem dumpfen Grollen zu einer Flammenexplosion, die sich um Ecken ausbreitet. Jede Kreatur in einer Kugel mit 6 m Radius, deren Mittelpunkt dieser Punkt ist, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur Feuerschaden in Höhe des insgesamt angesammelten Schadens, bei einem erfolgreichen die Hälfte.

Der Grundschaden des Zaubers beträgt 12W6. Ist die Perle am Ende deines Zuges noch nicht explodiert, steigt der Schaden um 1W6.

Wird die leuchtende Perle berührt, bevor die Zeit abgelaufen ist, muss die Kreatur, die sie berührt, einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf endet der Zauber sofort, und die Perle bricht in Flammen aus. Bei einem erfolgreichen Rettungswurf kann die Kreatur die Perle bis zu 12 m weit werfen. Trifft sie eine Kreatur oder einen festen Gegenstand, endet der Zauber, und die Perle explodiert.

Das Feuer beschädigt Gegenstände im Bereich und entzündet brennbare Gegenstände, die nicht getragen oder gehalten werden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 8. Grades oder höher wirkst, steigt der Grundschaden für jeden Grad über dem 7. um 1W6.`,
    material: 'Ein winziges Kügelchen aus Fledermauskot und Schwefel.',
  },
  'divine-word': {
    text: `Du sprichst ein göttliches Wort, erfüllt von der Macht, die die Welt am Anbeginn der Schöpfung formte. Wähle beliebig viele Kreaturen, die du in Reichweite sehen kannst. Jede Kreatur, die dich hören kann, muss einen Charismarettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur eine Wirkung, die von ihren aktuellen Trefferpunkten abhängt:

- 50 Trefferpunkte oder weniger: 1 Minute lang taub

- 40 Trefferpunkte oder weniger: 10 Minuten lang taub und blind

- 30 Trefferpunkte oder weniger: 1 Stunde lang blind, taub und betäubt

- 20 Trefferpunkte oder weniger: augenblicklich getötet

Unabhängig von seinen aktuellen Trefferpunkten wird ein Himmlischer, ein Elementar, ein Feenwesen oder ein Unhold, dem der Rettungswurf misslingt, auf seine Ursprungsebene zurückgezwungen (falls er nicht schon dort ist) und kann 24 Stunden lang mit keinem Mittel außer dem Zauber *Wunsch* auf deine aktuelle Ebene zurückkehren.`,
  },
  etherealness: {
    text: `Du trittst in die Grenzbereiche der Ätherebene, dort, wo sie sich mit deiner aktuellen Ebene überschneidet. Du bleibst für die Wirkungsdauer im Grenzäther oder bis du den Zauber mit deiner Aktion beendest. Während dieser Zeit kannst du dich in jede Richtung bewegen. Bewegst du dich nach oben oder unten, kostet jeder Meter Bewegung einen zusätzlichen Meter. Du kannst die Ebene sehen und hören, von der du gekommen bist, doch alles dort sieht grau aus, und du kannst nichts sehen, das mehr als 18 m entfernt ist.

Auf der Ätherebene kannst du nur andere Kreaturen auf dieser Ebene beeinflussen und nur von ihnen beeinflusst werden. Kreaturen, die nicht auf der Ätherebene sind, können dich weder wahrnehmen noch mit dir interagieren, es sei denn, eine besondere Fähigkeit oder Magie verleiht ihnen die Fähigkeit dazu.

Du ignorierst alle Gegenstände und Wirkungen, die nicht auf der Ätherebene sind, und kannst dich so durch Gegenstände bewegen, die du auf der Ebene wahrnimmst, von der du gekommen bist.

Wenn der Zauber endet, kehrst du sofort an der Stelle, an der du dich gerade befindest, auf die Ebene zurück, von der du gekommen bist. Befindest du dich dabei an derselben Stelle wie ein fester Gegenstand oder eine Kreatur, wirst du sofort in den nächstgelegenen freien Bereich verschoben, den du einnehmen kannst, und erleidest Energieschaden in Höhe von 3 je Meter, den du verschoben wirst.

Dieser Zauber wirkt nicht, wenn du ihn auf der Ätherebene wirkst oder auf einer Ebene, die nicht an sie grenzt, etwa einer der Äußeren Ebenen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 8. Grades oder höher wirkst, kannst du für jeden Grad über dem 7. bis zu drei bereitwillige Kreaturen (einschließlich dir) als Ziel wählen. Die Kreaturen müssen sich beim Wirken höchstens 3 m von dir entfernt befinden.`,
  },
  'finger-of-death': {
    text: `Du lässt negative Energie durch eine Kreatur strömen, die du in Reichweite sehen kannst, und verursachst ihr sengenden Schmerz. Das Ziel muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet es 7W8 + 30 nekrotischen Schaden, bei einem erfolgreichen die Hälfte.

Ein Humanoide, der durch diesen Zauber getötet wird, erhebt sich zu Beginn deines nächsten Zuges als Zombie, der dauerhaft unter deinem Befehl steht und deinen mündlichen Anweisungen nach besten Kräften folgt.`,
  },
  'fire-storm': {
    text: `Ein Sturm aus brüllenden Flammenwänden erscheint an einem Ort deiner Wahl in Reichweite. Der Bereich des Sturms besteht aus bis zu zehn Würfeln mit 3 m Kantenlänge, die du beliebig anordnen kannst. Jeder Würfel muss mit mindestens einer Seite an die Seite eines anderen Würfels grenzen. Jede Kreatur im Bereich muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 7W10 Feuerschaden, bei einem erfolgreichen die Hälfte.

Das Feuer beschädigt Gegenstände im Bereich und entzündet brennbare Gegenstände, die nicht getragen oder gehalten werden. Wenn du willst, sind Pflanzen im Bereich von diesem Zauber nicht betroffen.`,
  },
  forcecage: {
    text: `Ein unbewegliches, unsichtbares, würfelförmiges Gefängnis aus magischer Energie entsteht um einen Bereich deiner Wahl in Reichweite. Das Gefängnis kann ein Käfig oder ein massiver Kasten sein, ganz wie du willst.

Ein Gefängnis in Form eines Käfigs kann eine Kantenlänge von bis zu 6 m haben und besteht aus Stäben mit 1,25 cm Durchmesser, die 1,25 cm voneinander entfernt sind.

Ein Gefängnis in Form eines Kastens kann eine Kantenlänge von bis zu 3 m haben und bildet eine massive Barriere, die keine Materie durchlässt und alle Zauber blockiert, die in den Bereich hinein oder aus ihm heraus gewirkt werden.

Wenn du den Zauber wirkst, ist jede Kreatur, die sich vollständig im Bereich des Käfigs befindet, gefangen. Kreaturen, die nur teilweise im Bereich sind oder zu groß sind, um hineinzupassen, werden vom Mittelpunkt des Bereichs weggestoßen, bis sie sich vollständig außerhalb befinden.

Eine Kreatur im Käfig kann ihn nicht mit nichtmagischen Mitteln verlassen. Versucht die Kreatur, den Käfig mit Teleportation oder Reisen zwischen den Ebenen zu verlassen, muss sie zuerst einen Charismarettungswurf ablegen. Bei einem Erfolg kann die Kreatur diese Magie nutzen, um den Käfig zu verlassen. Bei einem Fehlschlag kann sie den Käfig nicht verlassen und verschwendet den Einsatz des Zaubers oder der Wirkung. Der Käfig reicht außerdem in die Ätherebene und blockiert ätherische Reisen.

Dieser Zauber kann nicht durch *Magie bannen* gebannt werden.`,
    material: 'Rubinstaub im Wert von 1.500 GM.',
  },
  'magnificent-mansion': {
    text: `Du beschwörst in Reichweite eine extradimensionale Behausung, die für die Wirkungsdauer bestehen bleibt. Du bestimmst, wo sich ihr einziger Eingang befindet. Der Eingang schimmert schwach und ist 1,5 m breit und 3 m hoch. Du und jede Kreatur, die du beim Wirken bestimmst, könnt die extradimensionale Behausung betreten, solange das Portal offen bleibt. Du kannst das Portal öffnen oder schließen, wenn du höchstens 9 m davon entfernt bist. Geschlossen ist das Portal unsichtbar.

Hinter dem Portal liegt eine prächtige Eingangshalle mit zahlreichen Gemächern dahinter. Die Luft ist sauber, frisch und warm.

Du kannst jeden beliebigen Grundriss erschaffen, doch der Raum darf 50 Würfel mit je 3 m Kantenlänge nicht übersteigen. Der Ort ist nach deinen Wünschen eingerichtet und geschmückt. Er enthält genug Speisen für ein Bankett mit neun Gängen für bis zu 100 Personen. Ein Stab von 100 fast durchsichtigen Dienern bedient alle, die eintreten. Du bestimmst das Aussehen dieser Diener und ihre Kleidung. Sie gehorchen deinen Befehlen vollkommen. Jeder Diener kann jede Aufgabe erledigen, die ein gewöhnlicher menschlicher Diener erledigen könnte, aber sie können nicht angreifen und keine Aktion ausführen, die einer anderen Kreatur direkt schaden würde. So können die Diener Dinge holen, putzen, flicken, Kleidung falten, Feuer entzünden, Essen servieren, Wein einschenken und so weiter. Die Diener können überall in die Villa gehen, sie aber nicht verlassen. Einrichtungsgegenstände und andere Gegenstände, die dieser Zauber erschafft, lösen sich in Rauch auf, wenn sie aus der Villa entfernt werden. Wenn der Zauber endet, werden alle Kreaturen im extradimensionalen Raum in die freien Bereiche befördert, die dem Eingang am nächsten liegen.`,
    material:
      'Ein aus Elfenbein geschnitztes Miniaturportal, ein kleines Stück polierter Marmor und ein winziger Silberlöffel, jeder Gegenstand im Wert von mindestens 5 GM.',
  },
  'mirage-arcane': {
    text: `Du lässt das Gelände in einem Bereich von bis zu 1,5 km mal 1,5 km aussehen, klingen, riechen und sich sogar anfühlen wie eine andere Art von Gelände. Die allgemeine Form des Geländes bleibt jedoch gleich. Offene Felder oder eine Straße könnten wie ein Sumpf, ein Hügel, eine Gletscherspalte oder ein anderes schwieriges oder unpassierbares Gelände erscheinen. Ein Teich kann wie eine grasige Wiese wirken, ein Abgrund wie ein sanfter Hang oder eine felsübersäte Rinne wie eine breite, glatte Straße.

Ebenso kannst du das Aussehen von Bauwerken verändern oder welche hinzufügen, wo keine sind. Der Zauber verkleidet, verbirgt oder ergänzt keine Kreaturen.

Die Illusion umfasst hörbare, sichtbare, fühlbare und riechbare Elemente, sodass sie freies Gelände in schwieriges Gelände verwandeln kann (oder umgekehrt) oder die Bewegung durch den Bereich auf andere Weise behindert. Jedes Stück des illusionären Geländes (etwa ein Stein oder ein Stock), das aus dem Bereich des Zaubers entfernt wird, verschwindet sofort.

Kreaturen mit Wahrsicht können durch die Illusion die wahre Gestalt des Geländes erkennen; alle anderen Elemente der Illusion bleiben jedoch bestehen, sodass die Kreatur zwar von der Illusion weiß, aber dennoch körperlich mit ihr interagieren kann.`,
  },
  'plane-shift': {
    text: `Du und bis zu acht bereitwillige Kreaturen, die sich im Kreis an den Händen halten, werdet auf eine andere Existenzebene versetzt. Du kannst ein Ziel allgemein angeben, etwa die Stadt aus Messing auf der Elementarebene des Feuers oder den Palast des Dispater auf der zweiten Ebene der Neun Höllen, und du erscheinst an diesem Ziel oder in seiner Nähe. Willst du zum Beispiel die Stadt aus Messing erreichen, kommst du nach Ermessen des SL vielleicht in ihrer Straße des Stahls an, vor ihrem Aschentor oder mit Blick auf die Stadt von jenseits des Feuermeers.

Alternativ kann dich dieser Zauber, wenn du die Siegelfolge eines Teleportationskreises auf einer anderen Existenzebene kennst, zu diesem Kreis bringen. Ist der Teleportationskreis zu klein, um alle versetzten Kreaturen aufzunehmen, erscheinen sie in den nächstgelegenen freien Bereichen neben dem Kreis.

Du kannst diesen Zauber nutzen, um eine nicht bereitwillige Kreatur auf eine andere Ebene zu verbannen. Wähle eine Kreatur in deiner Reichweite und führe einen Nahkampf-Zauberangriff gegen sie aus. Bei einem Treffer muss die Kreatur einen Charismarettungswurf ablegen. Misslingt er, wird sie an einen zufälligen Ort auf der von dir genannten Existenzebene versetzt. Eine so versetzte Kreatur muss ihren eigenen Weg zurück auf deine aktuelle Existenzebene finden.`,
    material:
      'Ein gegabelter Metallstab im Wert von mindestens 250 GM, auf eine bestimmte Existenzebene eingestimmt.',
  },
  'prismatic-spray': {
    text: `Acht vielfarbige Lichtstrahlen zucken aus deiner Hand. Jeder Strahl hat eine andere Farbe und eine andere Kraft und Bestimmung. Jede Kreatur in einem Kegel von 18 m muss einen Geschicklichkeitsrettungswurf ablegen. Wirf für jedes Ziel einen W8, um zu bestimmen, welcher Farbstrahl es trifft.

***1. Rot.*** Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 Feuerschaden, bei einem erfolgreichen die Hälfte.

***2. Orange.*** Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 Säureschaden, bei einem erfolgreichen die Hälfte.

***3. Gelb.*** Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 Blitzschaden, bei einem erfolgreichen die Hälfte.

***4. Grün.*** Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 Giftschaden, bei einem erfolgreichen die Hälfte.

***5. Blau.*** Bei einem misslungenen Rettungswurf erleidet das Ziel 10W6 Kälteschaden, bei einem erfolgreichen die Hälfte.

***6. Indigo.*** Bei einem misslungenen Rettungswurf ist das Ziel festgesetzt. Es muss dann am Ende jedes seiner Züge einen Konstitutionsrettungswurf ablegen. Besteht es dreimal, endet der Zauber. Misslingt ihm der Rettungswurf dreimal, wird es dauerhaft zu Stein und ist versteinert. Die Erfolge und Fehlschläge müssen nicht aufeinanderfolgen; zähle beide mit, bis das Ziel drei gleiche gesammelt hat.

***7. Violett.*** Bei einem misslungenen Rettungswurf ist das Ziel blind. Es muss dann zu Beginn deines nächsten Zuges einen Weisheitsrettungswurf ablegen. Ein erfolgreicher Rettungswurf beendet die Blindheit. Misslingt er, wird die Kreatur auf eine Existenzebene nach Wahl des SL versetzt und ist nicht mehr blind. (Meist wird eine Kreatur, die sich nicht auf ihrer Heimatebene befindet, nach Hause verbannt, während andere Kreaturen meist auf die Astral- oder Ätherebene geschleudert werden.)

***8. Besonders.*** Das Ziel wird von zwei Strahlen getroffen. Wirf noch zweimal und wiederhole jede 8.`,
  },
  'project-image': {
    text: `Du erschaffst eine illusionäre Kopie von dir, die für die Wirkungsdauer bestehen bleibt. Die Kopie kann an jedem Ort in Reichweite erscheinen, den du schon einmal gesehen hast, unabhängig von dazwischenliegenden Hindernissen. Die Illusion sieht aus und klingt wie du, ist aber nicht greifbar. Erleidet die Illusion Schaden, verschwindet sie, und der Zauber endet.

Du kannst deine Aktion nutzen, um diese Illusion bis zum Doppelten deiner Bewegungsrate weit zu bewegen und sie gestikulieren, sprechen und sich auf jede Weise verhalten zu lassen, die du wählst. Sie ahmt deine Eigenheiten vollkommen nach.

Du kannst durch ihre Augen sehen und durch ihre Ohren hören, als wärst du in ihrem Bereich. In deinem Zug kannst du als Bonusaktion von ihren Sinnen zu deinen eigenen wechseln oder zurück. Solange du ihre Sinne nutzt, bist du in Bezug auf deine eigene Umgebung blind und taub.

Körperlicher Kontakt mit dem Bild entlarvt es als Illusion, denn Dinge können hindurchgehen. Eine Kreatur, die ihre Aktion nutzt, um das Bild zu untersuchen, kann mit einem erfolgreichen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG feststellen, dass es eine Illusion ist. Durchschaut eine Kreatur die Illusion, kann sie durch das Bild hindurchsehen, und jedes Geräusch, das es macht, klingt für sie hohl.`,
    material: 'Eine kleine Nachbildung von dir aus Materialien im Wert von mindestens 5 GM.',
  },
  regenerate: {
    text: `Du berührst eine Kreatur und regst ihre natürliche Heilkraft an. Das Ziel erhält 4W8 + 15 Trefferpunkte zurück. Für die Wirkungsdauer erhält das Ziel zu Beginn jedes seiner Züge 1 Trefferpunkt zurück (10 Trefferpunkte pro Minute).

Abgetrennte Körperteile des Ziels (Finger, Beine, Schwänze und so weiter), falls vorhanden, wachsen nach 2 Minuten nach. Hast du das abgetrennte Teil und hältst es an den Stumpf, lässt der Zauber das Glied augenblicklich mit dem Stumpf verwachsen.`,
    material: 'Eine Gebetsmühle und Weihwasser.',
  },
  resurrection: {
    text: `Du berührst eine tote Kreatur, die nicht länger als ein Jahrhundert tot ist, nicht an Altersschwäche gestorben ist und nicht untot ist. Ist ihre Seele frei und bereit, kehrt das Ziel mit all seinen Trefferpunkten ins Leben zurück.

Dieser Zauber neutralisiert alle Gifte und heilt gewöhnliche Krankheiten, die die Kreatur bei ihrem Tod plagten. Magische Krankheiten, Flüche und dergleichen entfernt er jedoch nicht; werden solche Wirkungen nicht vor dem Wirken des Zaubers entfernt, plagen sie das Ziel bei seiner Rückkehr ins Leben.

Dieser Zauber schließt alle tödlichen Wunden und stellt alle fehlenden Körperteile wieder her.

Von den Toten zurückzukehren, ist eine Tortur. Das Ziel erhält einen Malus von -4 auf alle Angriffswürfe, Rettungswürfe und Attributswürfe. Jedes Mal, wenn das Ziel eine lange Rast beendet, sinkt der Malus um 1, bis er verschwindet.

Eine Kreatur ins Leben zurückzuholen, die seit einem Jahr oder länger tot ist, zehrt sehr an dir. Bis du eine lange Rast beendest, kannst du keine Zauber mehr wirken und bist bei allen Angriffswürfen, Attributswürfen und Rettungswürfen im Nachteil.`,
    material: 'Ein Diamant im Wert von mindestens 1.000 GM, den der Zauber verbraucht.',
  },
  'reverse-gravity': {
    text: `Dieser Zauber kehrt die Schwerkraft in einem Zylinder mit 15 m Radius und 30 m Höhe um, dessen Mittelpunkt ein Punkt in Reichweite ist. Alle Kreaturen und Gegenstände im Bereich, die nicht irgendwie am Boden verankert sind, fallen nach oben und erreichen beim Wirken des Zaubers die Oberseite des Bereichs. Eine Kreatur kann einen Geschicklichkeitsrettungswurf ablegen, um sich an einem festen Gegenstand in ihrer Reichweite festzuhalten und so den Sturz zu vermeiden.

Trifft dieser Sturz auf einen festen Gegenstand (etwa eine Decke), schlagen fallende Gegenstände und Kreaturen genauso darauf auf wie bei einem gewöhnlichen Sturz nach unten. Erreicht ein Gegenstand oder eine Kreatur die Oberseite des Bereichs, ohne etwas zu treffen, bleibt er für die Wirkungsdauer dort und pendelt leicht.

Am Ende der Wirkungsdauer fallen betroffene Gegenstände und Kreaturen wieder nach unten.`,
    material: 'Ein Magneteisenstein und Eisenspäne.',
  },
  sequester: {
    text: `Mit diesem Zauber kann eine bereitwillige Kreatur oder ein Gegenstand für die Wirkungsdauer versteckt und vor Entdeckung sicher sein. Wenn du den Zauber wirkst und das Ziel berührst, wird es unsichtbar und kann weder zum Ziel von Erkenntniszaubern werden noch durch Ausspähsensoren wahrgenommen werden, die Erkenntniszauber erschaffen.

Ist das Ziel eine Kreatur, fällt sie in einen Zustand der Starre. Die Zeit hört für sie auf zu fließen, und sie altert nicht.

Du kannst eine Bedingung festlegen, unter der der Zauber vorzeitig endet. Die Bedingung kann alles sein, was du willst, muss aber im Umkreis von 1,5 km um das Ziel eintreten oder sichtbar sein. Beispiele sind „nach 1.000 Jahren“ oder „wenn die Tarraske erwacht“. Dieser Zauber endet auch, wenn das Ziel Schaden erleidet.`,
    material:
      'Ein Pulver aus Diamant-, Smaragd-, Rubin- und Saphirstaub im Wert von mindestens 5.000 GM, das der Zauber verbraucht.',
  },
  simulacrum: {
    text: `Du formst einen illusionären Doppelgänger eines Tiers oder Humanoiden, das sich während der gesamten Zauberzeit in Reichweite befindet. Der Doppelgänger ist eine Kreatur, teilweise wirklich und aus Eis oder Schnee geformt, und er kann Aktionen ausführen und auch sonst wie eine normale Kreatur beeinflusst werden. Er sieht aus wie das Original, hat aber nur die Hälfte von dessen Trefferpunktemaximum und wird ohne Ausrüstung geformt. Ansonsten nutzt die Illusion alle Spielwerte der Kreatur, die sie nachbildet.

Das Simulakrum ist dir und den Kreaturen, die du bestimmst, freundlich gesinnt. Es gehorcht deinen gesprochenen Befehlen, bewegt sich und handelt nach deinen Wünschen und handelt im Kampf in deinem Zug. Dem Simulakrum fehlt die Fähigkeit, zu lernen oder mächtiger zu werden, daher steigt es nie in seiner Stufe oder anderen Fähigkeiten auf, und es kann keine verbrauchten Zauberplätze zurückerhalten.

Wird das Simulakrum beschädigt, kannst du es in einem alchemistischen Labor mit seltenen Kräutern und Mineralien im Wert von 100 GM pro zurückerhaltenem Trefferpunkt reparieren. Das Simulakrum besteht, bis es auf 0 Trefferpunkte fällt; dann wird es wieder zu Schnee und schmilzt augenblicklich.

Wirkst du diesen Zauber erneut, werden alle gerade aktiven Doppelgänger, die du mit diesem Zauber erschaffen hast, augenblicklich zerstört.`,
    material:
      'Schnee oder Eis in ausreichender Menge für eine lebensgroße Kopie der nachgebildeten Kreatur; etwas Haar, Fingernagelschnipsel oder ein anderes Stück vom Körper dieser Kreatur, in den Schnee oder das Eis gelegt; und Rubinpulver im Wert von 1.500 GM, über den Doppelgänger gestreut und vom Zauber verbraucht.',
  },
  symbol: {
    text: `Wenn du diesen Zauber wirkst, schreibst du eine schädliche Glyphe entweder auf eine Oberfläche (etwa einen Abschnitt eines Bodens, eine Wand oder einen Tisch) oder in einen Gegenstand, der geschlossen werden kann, um die Glyphe zu verbergen (etwa ein Buch, eine Schriftrolle oder eine Schatztruhe). Wählst du eine Oberfläche, kann die Glyphe einen Bereich mit höchstens 3 m Durchmesser bedecken. Wählst du einen Gegenstand, muss er an seinem Platz bleiben; wird er mehr als 3 m von der Stelle bewegt, an der du den Zauber gewirkt hast, wird die Glyphe zerstört, und der Zauber endet, ohne ausgelöst zu werden.

Die Glyphe ist fast unsichtbar; um sie zu finden, ist ein Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG nötig.

Beim Wirken des Zaubers bestimmst du, was die Glyphe auslöst. Bei Glyphen auf einer Oberfläche gehören zu den üblichsten Auslösern, die Glyphe zu berühren oder darauf zu treten, einen anderen Gegenstand zu entfernen, der sie bedeckt, sich ihr auf eine bestimmte Entfernung zu nähern oder den Gegenstand zu handhaben, der sie trägt. Bei Glyphen in einem Gegenstand sind die üblichsten Auslöser, den Gegenstand zu öffnen, sich ihm auf eine bestimmte Entfernung zu nähern oder die Glyphe zu sehen oder zu lesen.

Du kannst den Auslöser weiter verfeinern, sodass der Zauber nur unter bestimmten Umständen oder abhängig von den körperlichen Merkmalen einer Kreatur (etwa Größe oder Gewicht) oder ihrer Art (der Schutz könnte zum Beispiel auf Vetteln oder Gestaltwandler wirken) ausgelöst wird. Du kannst auch Kreaturen bestimmen, die die Glyphe nicht auslösen, etwa jene, die ein bestimmtes Losungswort sagen.

Wenn du die Glyphe schreibst, wähle eine der folgenden Möglichkeiten für ihre Wirkung. Sobald sie ausgelöst ist, leuchtet die Glyphe auf und füllt 10 Minuten lang eine Kugel mit 18 m Radius mit dämmrigem Licht; danach endet der Zauber. Jede Kreatur, die sich beim Aktivieren der Glyphe in der Kugel befindet, ist das Ziel ihrer Wirkung, ebenso eine Kreatur, die die Kugel in einem Zug zum ersten Mal betritt oder ihren Zug dort beendet.

***Tod.*** Jedes Ziel muss einen Konstitutionsrettungswurf ablegen und erleidet bei einem misslungenen Rettungswurf 10W10 nekrotischen Schaden, bei einem erfolgreichen die Hälfte.

***Zwietracht.*** Jedes Ziel muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf zankt und streitet ein Ziel 1 Minute lang mit anderen Kreaturen. Während dieser Zeit ist es zu sinnvoller Verständigung unfähig und bei Angriffswürfen und Attributswürfen im Nachteil.

***Furcht.*** Jedes Ziel muss einen Weisheitsrettungswurf ablegen und ist bei einem misslungenen Rettungswurf 1 Minute lang verängstigt. Solange es verängstigt ist, lässt das Ziel fallen, was es hält, und muss sich in jedem seiner Züge mindestens 9 m von der Glyphe entfernen, wenn es kann.

***Hoffnungslosigkeit.*** Jedes Ziel muss einen Charismarettungswurf ablegen. Bei einem misslungenen Rettungswurf wird das Ziel 1 Minute lang von Verzweiflung überwältigt. Während dieser Zeit kann es keine Kreatur angreifen oder mit schädlichen Fähigkeiten, Zaubern oder anderen magischen Wirkungen zum Ziel nehmen.

***Wahnsinn.*** Jedes Ziel muss einen Intelligenzrettungswurf ablegen. Bei einem misslungenen Rettungswurf wird das Ziel 1 Minute lang in den Wahnsinn getrieben. Eine wahnsinnige Kreatur kann keine Aktionen ausführen, nicht verstehen, was andere Kreaturen sagen, nicht lesen und nur unverständliches Zeug reden. Der SL steuert ihre Bewegung, die sprunghaft ist.

***Schmerz.*** Jedes Ziel muss einen Konstitutionsrettungswurf ablegen und ist bei einem misslungenen Rettungswurf 1 Minute lang vor quälenden Schmerzen kampfunfähig.

***Schlaf.*** Jedes Ziel muss einen Weisheitsrettungswurf ablegen und wird bei einem misslungenen Rettungswurf für 10 Minuten bewusstlos. Eine Kreatur erwacht, wenn sie Schaden erleidet oder jemand eine Aktion nutzt, um sie wachzurütteln oder wachzuohrfeigen.

***Betäubung.*** Jedes Ziel muss einen Weisheitsrettungswurf ablegen und ist bei einem misslungenen Rettungswurf 1 Minute lang betäubt.`,
    material:
      'Quecksilber, Phosphor sowie Diamant- und Opalpulver im Gesamtwert von mindestens 1.000 GM, die der Zauber verbraucht.',
  },
  teleport: {
    text: `Dieser Zauber versetzt dich und bis zu acht bereitwillige Kreaturen deiner Wahl, die du in Reichweite sehen kannst, oder einen einzelnen Gegenstand, den du in Reichweite sehen kannst, augenblicklich an ein Ziel deiner Wahl. Wählst du einen Gegenstand, muss er vollständig in einen Würfel mit 3 m Kantenlänge passen und darf nicht von einer nicht bereitwilligen Kreatur gehalten oder getragen werden.

Das gewählte Ziel muss dir bekannt sein und sich auf derselben Existenzebene befinden wie du. Wie vertraut dir das Ziel ist, bestimmt, ob du erfolgreich dort ankommst. Der SL wirft einen W100 und schlägt in der Tabelle nach.

| Vertrautheit | Missgeschick | Ähnlicher Bereich | Daneben | Am Ziel |
|---|---|---|---|---|
| Dauerhafter Kreis | – | – | – | 01–100 |
| Verbundener Gegenstand | – | – | – | 01–100 |
| Sehr vertraut | 01–05 | 06–13 | 14–24 | 25–100 |
| Flüchtig gesehen | 01–33 | 34–43 | 44–53 | 54–100 |
| Einmal gesehen | 01–43 | 44–53 | 54–73 | 74–100 |
| Beschreibung | 01–43 | 44–53 | 54–73 | 74–100 |
| Falsches Ziel | 01–50 | 51–100 | – | – |

***Vertrautheit.*** „Dauerhafter Kreis“ ist ein dauerhafter Teleportationskreis, dessen Siegelfolge du kennst.

„Verbundener Gegenstand“ bedeutet, dass du einen Gegenstand besitzt, der in den letzten sechs Monaten vom gewünschten Ziel mitgenommen wurde, etwa ein Buch aus der Bibliothek eines Magiers, Bettwäsche aus einem königlichen Gemach oder ein Marmorbrocken aus dem geheimen Grab eines Lichs.

„Sehr vertraut“ ist ein Ort, an dem du sehr oft warst, den du sorgfältig studiert hast oder den du beim Wirken des Zaubers sehen kannst.

„Flüchtig gesehen“ ist ein Ort, den du mehr als einmal gesehen hast, mit dem du aber nicht sehr vertraut bist.

„Einmal gesehen“ ist ein Ort, den du einmal gesehen hast, vielleicht mithilfe von Magie.

„Beschreibung“ ist ein Ort, dessen Lage und Aussehen du aus der Beschreibung eines anderen kennst, vielleicht von einer Karte.

„Falsches Ziel“ ist ein Ort, den es nicht gibt. Vielleicht wolltest du das Heiligtum eines Feindes ausspähen und hast stattdessen eine Illusion gesehen, oder du versuchst, dich an einen vertrauten Ort zu teleportieren, der nicht mehr existiert.

***Am Ziel.*** Du und deine Gruppe (oder der Zielgegenstand) erscheint dort, wo du willst.

***Daneben.*** Du und deine Gruppe (oder der Zielgegenstand) erscheint in zufälliger Entfernung vom Ziel in zufälliger Richtung. Die Abweichung beträgt 1W10 × 1W10 Prozent der zurückzulegenden Strecke. Wolltest du zum Beispiel 180 km weit reisen, bist danebengelandet und hast mit den beiden W10 eine 5 und eine 3 geworfen, liegst du 15 Prozent, also 27 km, daneben. Der SL bestimmt die Richtung der Abweichung zufällig mit einem W8, wobei 1 Norden bedeutet, 2 Nordosten, 3 Osten und so weiter rund um die Windrose. Wolltest du dich in eine Küstenstadt teleportieren und landest 27 km weit draußen auf dem Meer, könntest du in Schwierigkeiten stecken.

***Ähnlicher Bereich.*** Du und deine Gruppe (oder der Zielgegenstand) landet in einem anderen Bereich, der dem Zielbereich optisch oder thematisch ähnelt. Bist du zum Beispiel auf dem Weg in dein heimisches Labor, landest du vielleicht im Labor eines anderen Magiers oder in einem Laden für alchemistischen Bedarf, der viele der Werkzeuge und Geräte deines Labors führt. Meist erscheinst du am nächstgelegenen ähnlichen Ort, doch da der Zauber keine Reichweitengrenze hat, könntest du theoretisch überall auf der Ebene landen.

***Missgeschick.*** Die unberechenbare Magie des Zaubers führt zu einer schwierigen Reise. Jede teleportierende Kreatur (oder der Zielgegenstand) erleidet 3W10 Energieschaden, und der SL würfelt erneut auf der Tabelle, um zu sehen, wo du landest (es können mehrere Missgeschicke geschehen, die jedes Mal Schaden verursachen).`,
  },
};
