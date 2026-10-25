// German texts of the SRD cantrips. Our own translation of the SRD 5.1, CC-BY-4.0 (see NOTICE.md).

import type { DeText } from '../model';

export const DE_TEXTS_0: Readonly<Record<string, DeText>> = {
  'acid-splash': {
    text: `Du schleuderst eine Blase aus Säure. Wähle eine Kreatur in Reichweite oder zwei Kreaturen in Reichweite, die höchstens 1,5 m voneinander entfernt sind. Ein Ziel muss einen Geschicklichkeitsrettungswurf bestehen, sonst erleidet es 1W6 Säureschaden.

Der Schaden dieses Zaubers steigt um 1W6, wenn du die 5. Stufe (2W6), die 11. Stufe (3W6) und die 17. Stufe (4W6) erreichst.`,
  },
  'chill-touch': {
    text: `Du erschaffst eine geisterhafte Skeletthand im Bereich einer Kreatur in Reichweite. Führe einen Fernkampf-Zauberangriff gegen die Kreatur aus, um sie mit der Kälte des Grabes zu treffen. Bei einem Treffer erleidet das Ziel 1W8 nekrotischen Schaden und kann bis zum Beginn deines nächsten Zuges keine Trefferpunkte zurückerhalten. Bis dahin klammert sich die Hand an das Ziel.

Triffst du ein untotes Ziel, ist es außerdem bis zum Ende deines nächsten Zuges bei Angriffswürfen gegen dich im Nachteil.

Der Schaden dieses Zaubers steigt um 1W8, wenn du die 5. Stufe (2W8), die 11. Stufe (3W8) und die 17. Stufe (4W8) erreichst.`,
  },
  'dancing-lights': {
    text: `Du erschaffst bis zu vier fackelgroße Lichter in Reichweite, die wie Fackeln, Laternen oder leuchtende Kugeln aussehen und für die Wirkungsdauer in der Luft schweben. Du kannst die vier Lichter auch zu einer leuchtenden, entfernt humanoiden Gestalt mittlerer Größe vereinen. Welche Form du auch wählst, jedes Licht spendet in einem Radius von 3 m dämmriges Licht.

Als Bonusaktion in deinem Zug kannst du die Lichter bis zu 18 m weit an eine neue Stelle in Reichweite bewegen. Ein Licht muss sich höchstens 6 m von einem anderen Licht dieses Zaubers entfernt befinden, und ein Licht erlischt, wenn es die Reichweite des Zaubers verlässt.`,
    material: 'Ein Stück Phosphor oder Hexenholz oder ein Glühwürmchen.',
  },
  druidcraft: {
    text: `Du flüsterst den Geistern der Natur zu und erzeugst eine der folgenden Wirkungen in Reichweite:

- Du erzeugst eine winzige, harmlose Sinneswirkung, die vorhersagt, wie das Wetter an deinem Ort in den nächsten 24 Stunden sein wird. Die Wirkung kann sich als goldene Kugel für klaren Himmel, als Wolke für Regen, als fallende Schneeflocken für Schnee und so weiter zeigen. Diese Wirkung hält 1 Runde an.

- Du bringst augenblicklich eine Blume zum Blühen, eine Samenkapsel zum Aufspringen oder eine Blattknospe zum Austreiben.

- Du erzeugst eine augenblickliche, harmlose Sinneswirkung, etwa fallende Blätter, einen Windhauch, das Geräusch eines kleinen Tieres oder den schwachen Geruch eines Stinktiers. Die Wirkung muss in einen Würfel mit 1,5 m Kantenlänge passen.

- Du entzündest oder löschst augenblicklich eine Kerze, eine Fackel oder ein kleines Lagerfeuer.`,
  },
  'eldritch-blast': {
    text: `Ein Strahl knisternder Energie schießt auf eine Kreatur in Reichweite zu. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer erleidet das Ziel 1W10 Energieschaden. Auf höheren Stufen erzeugt der Zauber mehr als einen Strahl: zwei Strahlen auf der 5. Stufe, drei Strahlen auf der 11. Stufe und vier Strahlen auf der 17. Stufe. Du kannst die Strahlen auf dasselbe Ziel oder auf verschiedene Ziele richten. Führe für jeden Strahl einen eigenen Angriffswurf aus.`,
  },
  'fire-bolt': {
    text: `Du schleuderst einen Feuerfunken auf eine Kreatur oder einen Gegenstand in Reichweite. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer erleidet das Ziel 1W10 Feuerschaden. Ein entzündlicher Gegenstand, der von diesem Zauber getroffen wird, fängt Feuer, wenn er nicht getragen oder gehalten wird.

Der Schaden dieses Zaubers steigt um 1W10, wenn du die 5. Stufe (2W10), die 11. Stufe (3W10) und die 17. Stufe (4W10) erreichst.`,
  },
  guidance: {
    text: `Du berührst eine bereitwillige Kreatur. Einmal, bevor der Zauber endet, kann das Ziel einen W4 werfen und das Ergebnis zu einem Attributswurf seiner Wahl addieren. Es kann den Würfel vor oder nach dem Attributswurf werfen. Danach endet der Zauber.`,
  },
  light: {
    text: `Du berührst einen Gegenstand, der in keiner Richtung größer als 3 m ist. Bis der Zauber endet, spendet der Gegenstand in einem Radius von 6 m helles Licht und weitere 6 m dämmriges Licht. Das Licht kann eine Farbe deiner Wahl haben. Wird der Gegenstand vollständig mit etwas Undurchsichtigem bedeckt, wird das Licht blockiert. Der Zauber endet, wenn du ihn erneut wirkst oder ihn als Aktion beendest.

Zielst du auf einen Gegenstand, den eine feindselige Kreatur hält oder trägt, muss diese Kreatur einen Geschicklichkeitsrettungswurf bestehen, um dem Zauber zu entgehen.`,
    material: 'Ein Glühwürmchen oder phosphoreszierendes Moos.',
  },
  'mage-hand': {
    text: `Eine geisterhafte, schwebende Hand erscheint an einem Punkt deiner Wahl in Reichweite. Die Hand bleibt für die Wirkungsdauer bestehen oder bis du sie als Aktion entlässt. Die Hand verschwindet, wenn sie sich je mehr als 9 m von dir entfernt oder wenn du diesen Zauber erneut wirkst.

Du kannst deine Aktion nutzen, um die Hand zu steuern. Mit der Hand kannst du einen Gegenstand handhaben, eine unverschlossene Tür oder einen unverschlossenen Behälter öffnen, einen Gegenstand in einem offenen Behälter verstauen oder daraus hervorholen oder den Inhalt einer Phiole ausgießen. Jedes Mal, wenn du die Hand benutzt, kannst du sie bis zu 9 m weit bewegen.

Die Hand kann nicht angreifen, keine magischen Gegenstände aktivieren und nicht mehr als 5 kg tragen.`,
  },
  mending: {
    text: `Dieser Zauber repariert einen einzelnen Bruch oder Riss in einem Gegenstand, den du berührst, etwa einen zerbrochenen Schlüssel, einen zerrissenen Umhang oder einen undichten Weinschlauch. Solange der Bruch oder Riss in keiner Richtung länger als 30 cm ist, flickst du ihn, ohne eine Spur des früheren Schadens zu hinterlassen.

Dieser Zauber kann einen magischen Gegenstand oder ein Konstrukt körperlich reparieren, aber er kann einem solchen Gegenstand keine Magie zurückgeben.`,
    material: 'Zwei Magneteisensteine.',
  },
  message: {
    text: `Du zeigst mit dem Finger auf eine Kreatur in Reichweite und flüsterst eine Nachricht. Das Ziel (und nur das Ziel) hört die Nachricht und kann flüsternd antworten, was nur du hören kannst.

Du kannst diesen Zauber durch feste Gegenstände hindurch wirken, wenn du das Ziel kennst und weißt, dass es sich hinter der Barriere befindet. Magische Stille, 30 cm Stein, 2,5 cm gewöhnliches Metall, eine dünne Bleiplatte oder 90 cm Holz blockieren den Zauber. Der Zauber muss keiner geraden Linie folgen und kann sich frei um Ecken und durch Öffnungen bewegen.`,
    material: 'Ein kurzes Stück Kupferdraht.',
  },
  'minor-illusion': {
    text: `Du erschaffst in Reichweite ein Geräusch oder das Bild eines Gegenstands, das für die Wirkungsdauer bestehen bleibt. Die Illusion endet auch, wenn du sie als Aktion entlässt oder diesen Zauber erneut wirkst.

Erschaffst du ein Geräusch, kann seine Lautstärke von einem Flüstern bis zu einem Schrei reichen. Es kann deine Stimme sein, die Stimme eines anderen, das Brüllen eines Löwen, Trommelschläge oder ein beliebiges anderes Geräusch deiner Wahl. Das Geräusch hält während der gesamten Wirkungsdauer unvermindert an, oder du erzeugst zu verschiedenen Zeitpunkten einzelne Geräusche, bevor der Zauber endet.

Erschaffst du das Bild eines Gegenstands – etwa eines Stuhls, schlammiger Fußspuren oder einer kleinen Truhe –, darf es nicht größer als ein Würfel mit 1,5 m Kantenlänge sein. Das Bild kann weder Geräusche noch Licht, Geruch oder andere Sinneswirkungen erzeugen. Körperlicher Kontakt mit dem Bild entlarvt es als Illusion, denn Dinge können hindurchgehen.

Nutzt eine Kreatur ihre Aktion, um das Geräusch oder Bild zu untersuchen, kann sie mit einem erfolgreichen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG feststellen, dass es sich um eine Illusion handelt. Durchschaut eine Kreatur die Illusion, wird diese für die Kreatur blass.`,
    material: 'Ein Stück Schafwolle.',
  },
  'poison-spray': {
    text: `Du streckst die Hand nach einer Kreatur aus, die du in Reichweite sehen kannst, und stößt aus deiner Handfläche einen Hauch giftigen Gases aus. Die Kreatur muss einen Konstitutionsrettungswurf bestehen, sonst erleidet sie 1W12 Giftschaden.

Der Schaden dieses Zaubers steigt um 1W12, wenn du die 5. Stufe (2W12), die 11. Stufe (3W12) und die 17. Stufe (4W12) erreichst.`,
  },
  prestidigitation: {
    text: `Dieser Zauber ist ein kleiner magischer Trick, mit dem angehende Zauberwirker üben. Du erzeugst eine der folgenden magischen Wirkungen in Reichweite:

Du erzeugst eine augenblickliche, harmlose Sinneswirkung, etwa einen Funkenregen, einen Windhauch, leise Musiknoten oder einen seltsamen Geruch.

Du entzündest oder löschst augenblicklich eine Kerze, eine Fackel oder ein kleines Lagerfeuer.

Du säuberst oder beschmutzt augenblicklich einen Gegenstand, der nicht größer als ein Würfel mit 30 cm Kantenlänge ist.

Du kühlst, wärmst oder würzt für 1 Stunde bis zu einem Würfel mit 30 cm Kantenlänge an nicht lebendem Material.

Du lässt für 1 Stunde eine Farbe, ein kleines Zeichen oder ein Symbol auf einem Gegenstand oder einer Oberfläche erscheinen.

Du erschaffst einen nichtmagischen Tand oder ein Trugbild, das in deine Hand passt und bis zum Ende deines nächsten Zuges bestehen bleibt.

Wirkst du diesen Zauber mehrmals, können bis zu drei seiner nicht augenblicklichen Wirkungen gleichzeitig aktiv sein, und du kannst eine solche Wirkung als Aktion beenden.`,
  },
  'produce-flame': {
    text: `Eine flackernde Flamme erscheint in deiner Hand. Die Flamme bleibt für die Wirkungsdauer dort und verletzt weder dich noch deine Ausrüstung. Sie spendet in einem Radius von 3 m helles Licht und weitere 3 m dämmriges Licht. Der Zauber endet, wenn du ihn als Aktion entlässt oder erneut wirkst.

Du kannst auch mit der Flamme angreifen, doch das beendet den Zauber. Wenn du diesen Zauber wirkst oder als Aktion in einem späteren Zug, kannst du die Flamme auf eine Kreatur im Umkreis von 9 m schleudern. Führe einen Fernkampf-Zauberangriff aus. Bei einem Treffer erleidet das Ziel 1W8 Feuerschaden.

Der Schaden dieses Zaubers steigt um 1W8, wenn du die 5. Stufe (2W8), die 11. Stufe (3W8) und die 17. Stufe (4W8) erreichst.`,
  },
  'ray-of-frost': {
    text: `Ein eisiger Strahl blauweißen Lichts schießt auf eine Kreatur in Reichweite zu. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer erleidet es 1W8 Kälteschaden, und seine Bewegungsrate sinkt bis zum Beginn deines nächsten Zuges um 3 m.

Der Schaden des Zaubers steigt um 1W8, wenn du die 5. Stufe (2W8), die 11. Stufe (3W8) und die 17. Stufe (4W8) erreichst.`,
  },
  resistance: {
    text: `Du berührst eine bereitwillige Kreatur. Einmal, bevor der Zauber endet, kann das Ziel einen W4 werfen und das Ergebnis zu einem Rettungswurf seiner Wahl addieren. Es kann den Würfel vor oder nach dem Rettungswurf werfen. Danach endet der Zauber.`,
    material: 'Ein winziger Umhang.',
  },
  'sacred-flame': {
    text: `Flammengleiches Strahlen senkt sich auf eine Kreatur herab, die du in Reichweite sehen kannst. Das Ziel muss einen Geschicklichkeitsrettungswurf bestehen, sonst erleidet es 1W8 gleißenden Schaden. Für diesen Rettungswurf profitiert das Ziel nicht von Deckung.

Der Schaden des Zaubers steigt um 1W8, wenn du die 5. Stufe (2W8), die 11. Stufe (3W8) und die 17. Stufe (4W8) erreichst.`,
  },
  shillelagh: {
    text: `Das Holz einer Keule oder eines Kampfstabs, den du hältst, wird von der Kraft der Natur durchdrungen. Für die Wirkungsdauer kannst du für die Angriffs- und Schadenswürfe von Nahkampfangriffen mit dieser Waffe dein Zauberattribut statt Stärke verwenden, und der Schadenswürfel der Waffe wird zu einem W8. Die Waffe wird außerdem magisch, falls sie es noch nicht ist. Der Zauber endet, wenn du ihn erneut wirkst oder die Waffe loslässt.`,
    material: 'Mistel, ein Kleeblatt und eine Keule oder ein Kampfstab.',
  },
  'shocking-grasp': {
    text: `Ein Blitz springt aus deiner Hand und versetzt einer Kreatur, die du zu berühren versuchst, einen Schlag. Führe einen Nahkampf-Zauberangriff gegen das Ziel aus. Trägt das Ziel eine Rüstung aus Metall, bist du beim Angriffswurf im Vorteil. Bei einem Treffer erleidet das Ziel 1W8 Blitzschaden und kann bis zum Beginn seines nächsten Zuges keine Reaktionen ausführen.

Der Schaden des Zaubers steigt um 1W8, wenn du die 5. Stufe (2W8), die 11. Stufe (3W8) und die 17. Stufe (4W8) erreichst.`,
  },
  'spare-the-dying': {
    text: `Du berührst eine lebende Kreatur mit 0 Trefferpunkten. Die Kreatur wird stabilisiert. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
  },
  thaumaturgy: {
    text: `Du lässt in Reichweite ein kleines Wunder geschehen, ein Zeichen übernatürlicher Macht. Du erzeugst eine der folgenden magischen Wirkungen in Reichweite.

- Deine Stimme dröhnt für 1 Minute bis zu dreimal so laut wie gewöhnlich.

- Du lässt für 1 Minute Flammen flackern, heller oder schwächer brennen oder ihre Farbe ändern.

- Du verursachst für 1 Minute harmlose Erschütterungen im Boden.

- Du erzeugst ein augenblickliches Geräusch, das von einem Punkt deiner Wahl in Reichweite ausgeht, etwa Donnergrollen, den Schrei eines Raben oder unheilvolles Flüstern.

- Du lässt augenblicklich eine unverschlossene Tür oder ein unverschlossenes Fenster auffliegen oder zuschlagen.

- Du veränderst für 1 Minute das Aussehen deiner Augen.

Wirkst du diesen Zauber mehrmals, können bis zu drei seiner einminütigen Wirkungen gleichzeitig aktiv sein, und du kannst eine solche Wirkung als Aktion beenden.`,
  },
  'true-strike': {
    text: `Du streckst die Hand aus und zeigst mit dem Finger auf ein Ziel in Reichweite. Deine Magie gewährt dir einen kurzen Einblick in die Verteidigung des Ziels. In deinem nächsten Zug bist du bei deinem ersten Angriffswurf gegen das Ziel im Vorteil, sofern dieser Zauber nicht geendet hat.`,
  },
  'vicious-mockery': {
    text: `Du entfesselst eine Reihe von Beleidigungen, durchsetzt mit feinen Verzauberungen, gegen eine Kreatur, die du in Reichweite sehen kannst. Kann das Ziel dich hören (es muss dich nicht verstehen), muss es einen Weisheitsrettungswurf bestehen, sonst erleidet es 1W4 psychischen Schaden und ist bei seinem nächsten Angriffswurf vor dem Ende seines nächsten Zuges im Nachteil.

Der Schaden dieses Zaubers steigt um 1W4, wenn du die 5. Stufe (2W4), die 11. Stufe (3W4) und die 17. Stufe (4W4) erreichst.`,
  },
};
