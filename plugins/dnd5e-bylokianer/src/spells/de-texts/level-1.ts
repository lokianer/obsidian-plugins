// German texts of the SRD spells of the 1st level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

export const DE_TEXTS_1: Readonly<Record<string, DeText>> = {
  alarm: {
    text: `Du errichtest einen Alarm gegen unerwünschtes Eindringen. Wähle eine Tür, ein Fenster oder einen Bereich in Reichweite, der nicht größer als ein Würfel mit 6 m Kantenlänge ist. Bis der Zauber endet, warnt dich ein Alarm, sobald eine winzige oder größere Kreatur den geschützten Bereich berührt oder betritt. Wenn du den Zauber wirkst, kannst du Kreaturen bestimmen, die den Alarm nicht auslösen. Außerdem wählst du, ob der Alarm geistig oder hörbar ist.

Ein geistiger Alarm warnt dich mit einem Klingeln in deinem Kopf, wenn du dich höchstens 1,5 km vom geschützten Bereich entfernt befindest. Dieses Klingeln weckt dich, falls du schläfst.

Ein hörbarer Alarm erzeugt für 10 Sekunden im Umkreis von 18 m den Klang einer Handglocke.`,
    material: 'Ein winziges Glöckchen und ein Stück feiner Silberdraht.',
  },
  'animal-friendship': {
    text: `Mit diesem Zauber überzeugst du ein Tier davon, dass du ihm nichts Böses willst. Wähle ein Tier, das du in Reichweite sehen kannst. Es muss dich sehen und hören können. Beträgt die Intelligenz des Tiers 4 oder mehr, misslingt der Zauber. Andernfalls muss das Tier einen Weisheitsrettungswurf bestehen, sonst ist es für die Wirkungsdauer von dir bezaubert. Fügst du oder einer deiner Gefährten dem Ziel Schaden zu, endet der Zauber.`,
    material: 'Ein Happen Futter.',
  },
  bane: {
    text: `Bis zu drei Kreaturen deiner Wahl, die du in Reichweite sehen kannst, müssen Charismarettungswürfe ablegen. Jedes Mal, wenn ein Ziel, dem dieser Rettungswurf misslingt, vor dem Ende des Zaubers einen Angriffswurf oder einen Rettungswurf ausführt, muss es einen W4 werfen und das Ergebnis vom Angriffswurf oder Rettungswurf abziehen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, kannst du für jeden Grad über dem 1. eine zusätzliche Kreatur als Ziel wählen.`,
    material: 'Ein Tropfen Blut.',
  },
  bless: {
    text: `Du segnest bis zu drei Kreaturen deiner Wahl in Reichweite. Jedes Mal, wenn ein Ziel vor dem Ende des Zaubers einen Angriffswurf oder einen Rettungswurf ausführt, kann es einen W4 werfen und das Ergebnis zum Angriffswurf oder Rettungswurf addieren.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, kannst du für jeden Grad über dem 1. eine zusätzliche Kreatur als Ziel wählen.`,
    material: 'Ein paar Spritzer Weihwasser.',
  },
  'burning-hands': {
    text: `Während du die Hände mit sich berührenden Daumen und gespreizten Fingern hältst, schießt ein dünner Flammenfächer aus deinen ausgestreckten Fingerspitzen. Jede Kreatur in einem Kegel von 4,5 m muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 3W6 Feuerschaden, bei einem erfolgreichen die Hälfte.

Das Feuer entzündet alle brennbaren Gegenstände im Bereich, die nicht getragen oder gehalten werden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 1. um 1W6.`,
  },
  'charm-person': {
    text: `Du versuchst, einen Humanoiden zu bezaubern, den du in Reichweite sehen kannst. Er muss einen Weisheitsrettungswurf ablegen und ist dabei im Vorteil, wenn du oder deine Gefährten gegen ihn kämpfen. Misslingt der Rettungswurf, ist er von dir bezaubert, bis der Zauber endet oder du oder deine Gefährten ihm etwas Schädliches antun. Die bezauberte Kreatur hält dich für einen freundlichen Bekannten. Wenn der Zauber endet, weiß die Kreatur, dass sie von dir bezaubert wurde.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, kannst du für jeden Grad über dem 1. eine zusätzliche Kreatur als Ziel wählen. Die Kreaturen dürfen höchstens 9 m voneinander entfernt sein, wenn du sie als Ziel wählst.`,
  },
  'color-spray': {
    text: `Ein blendender Strom blitzender, farbiger Lichter springt aus deiner Hand. Wirf 6W10; die Summe gibt an, wie viele Trefferpunkte an Kreaturen dieser Zauber betreffen kann. Kreaturen in einem Kegel von 4,5 m, der von dir ausgeht, werden in aufsteigender Reihenfolge ihrer aktuellen Trefferpunkte betroffen (bewusstlose Kreaturen und solche, die nicht sehen können, werden übergangen).

Beginnend mit der Kreatur mit den wenigsten aktuellen Trefferpunkten ist jede von diesem Zauber betroffene Kreatur bis zum Ende des Zaubers blind. Ziehe die Trefferpunkte jeder Kreatur von der Summe ab, bevor du zur Kreatur mit den nächstniedrigeren Trefferpunkten übergehst. Die Trefferpunkte einer Kreatur müssen kleiner oder gleich der verbleibenden Summe sein, damit sie betroffen ist.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, wirf für jeden Grad über dem 1. zusätzlich 2W10.`,
    material: 'Eine Prise roten, gelben und blauen Pulvers oder Sands.',
  },
  command: {
    text: `Du sprichst einen Befehl aus einem Wort zu einer Kreatur, die du in Reichweite sehen kannst. Das Ziel muss einen Weisheitsrettungswurf bestehen, sonst befolgt es den Befehl in seinem nächsten Zug. Der Zauber wirkt nicht, wenn das Ziel untot ist, deine Sprache nicht versteht oder dein Befehl ihm direkt schaden würde.

Es folgen einige typische Befehle und ihre Wirkungen. Du kannst auch einen anderen als die hier beschriebenen Befehle geben. Tust du das, bestimmt der SL, wie sich das Ziel verhält. Kann das Ziel deinen Befehl nicht befolgen, endet der Zauber.

***Komm.*** Das Ziel bewegt sich auf dem kürzesten und direktesten Weg auf dich zu und beendet seinen Zug, sobald es sich bis auf 1,5 m genähert hat.

***Lass fallen.*** Das Ziel lässt fallen, was es hält, und beendet dann seinen Zug.

***Flieh.*** Das Ziel verbringt seinen Zug damit, sich auf dem schnellsten verfügbaren Weg von dir zu entfernen.

***Kriech.*** Das Ziel wirft sich zu Boden und beendet dann seinen Zug.

***Halt.*** Das Ziel bewegt sich nicht und führt keine Aktionen aus. Eine fliegende Kreatur bleibt in der Luft, sofern sie dazu in der Lage ist. Muss sie sich bewegen, um in der Luft zu bleiben, fliegt sie die kürzeste dafür nötige Strecke.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, kannst du für jeden Grad über dem 1. eine zusätzliche Kreatur betreffen. Die Kreaturen dürfen höchstens 9 m voneinander entfernt sein, wenn du sie als Ziel wählst.`,
  },
  'comprehend-languages': {
    text: `Für die Wirkungsdauer verstehst du die wörtliche Bedeutung jeder gesprochenen Sprache, die du hörst. Du verstehst außerdem jede geschriebene Sprache, die du siehst, musst dazu aber die Oberfläche berühren, auf der die Worte stehen. Eine Seite Text zu lesen, dauert etwa 1 Minute.

Dieser Zauber entschlüsselt weder geheime Botschaften in einem Text noch eine Glyphe wie ein arkanes Siegel, die nicht Teil einer geschriebenen Sprache ist.`,
    material: 'Eine Prise Ruß und Salz.',
  },
  'create-or-destroy-water': {
    text: `Du erschaffst oder vernichtest Wasser.

***Wasser erschaffen.*** Du erschaffst in Reichweite bis zu 40 Liter sauberes Wasser in einem offenen Behälter. Alternativ fällt das Wasser als Regen in einem Würfel mit 9 m Kantenlänge in Reichweite.

***Wasser vernichten.*** Du vernichtest bis zu 40 Liter Wasser in einem offenen Behälter in Reichweite. Alternativ vernichtest du Nebel in einem Würfel mit 9 m Kantenlänge in Reichweite.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, erschaffst oder vernichtest du für jeden Grad über dem 1. zusätzlich 40 Liter Wasser, oder die Kantenlänge des Würfels steigt um 1,5 m.`,
    material:
      'Ein Tropfen Wasser, um Wasser zu erschaffen, oder ein paar Sandkörner, um es zu vernichten.',
  },
  'cure-wounds': {
    text: `Eine Kreatur, die du berührst, erhält Trefferpunkte in Höhe von 1W8 + deinem Zauberattributsmodifikator zurück. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 1. um 1W8.`,
  },
  'detect-evil-and-good': {
    text: `Für die Wirkungsdauer weißt du, ob sich eine Aberration, ein Himmlischer, ein Elementar, ein Feenwesen, ein Unhold oder ein Untoter im Umkreis von 9 m um dich befindet und wo genau. Ebenso weißt du, ob sich im Umkreis von 9 m ein Ort oder Gegenstand befindet, der magisch geweiht oder entweiht wurde.

Der Zauber durchdringt die meisten Barrieren, wird aber von 30 cm Stein, 2,5 cm gewöhnlichem Metall, einer dünnen Bleiplatte oder 90 cm Holz oder Erde blockiert.`,
  },
  'detect-magic': {
    text: `Für die Wirkungsdauer spürst du die Anwesenheit von Magie im Umkreis von 9 m um dich. Spürst du auf diese Weise Magie, kannst du deine Aktion nutzen, um eine schwache Aura um jede sichtbare Kreatur und jeden sichtbaren Gegenstand im Bereich zu sehen, die Magie in sich tragen, und du erfährst ihre Schule der Magie, falls vorhanden.

Der Zauber durchdringt die meisten Barrieren, wird aber von 30 cm Stein, 2,5 cm gewöhnlichem Metall, einer dünnen Bleiplatte oder 90 cm Holz oder Erde blockiert.`,
  },
  'detect-poison-and-disease': {
    text: `Für die Wirkungsdauer spürst du die Anwesenheit und den Ort von Giften, giftigen Kreaturen und Krankheiten im Umkreis von 9 m um dich. Du erkennst außerdem jeweils die Art des Gifts, der giftigen Kreatur oder der Krankheit.

Der Zauber durchdringt die meisten Barrieren, wird aber von 30 cm Stein, 2,5 cm gewöhnlichem Metall, einer dünnen Bleiplatte oder 90 cm Holz oder Erde blockiert.`,
    material: 'Ein Eibenblatt.',
  },
  'disguise-self': {
    text: `Du lässt dich – samt Kleidung, Rüstung, Waffen und anderer Habe, die du am Leib trägst – anders aussehen, bis der Zauber endet oder du ihn mit deiner Aktion beendest. Du kannst 30 cm kleiner oder größer wirken und dünn, dick oder etwas dazwischen erscheinen. Deinen Körperbau kannst du nicht ändern; du musst also eine Gestalt mit derselben grundlegenden Anordnung der Gliedmaßen annehmen. Ansonsten bestimmst du den Umfang der Illusion.

Die Veränderungen dieses Zaubers halten einer körperlichen Untersuchung nicht stand. Fügst du deiner Kleidung mit diesem Zauber zum Beispiel einen Hut hinzu, gehen Gegenstände durch den Hut hindurch, und wer ihn berührt, spürt nichts oder fühlt deinen Kopf und dein Haar. Erscheinst du mit diesem Zauber dünner, als du bist, stößt die Hand von jemandem, der dich berühren will, gegen dich, während sie scheinbar noch in der Luft ist.

Um zu erkennen, dass du verkleidet bist, kann eine Kreatur ihre Aktion nutzen, um dein Aussehen zu untersuchen, und muss einen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG bestehen.`,
  },
  'divine-favor': {
    text: `Dein Gebet stärkt dich mit göttlichem Glanz. Bis der Zauber endet, verursachen deine Waffenangriffe bei einem Treffer zusätzlich 1W4 gleißenden Schaden.`,
  },
  entangle: {
    text: `Greifendes Unkraut und Ranken sprießen in einem Quadrat mit 6 m Seitenlänge aus dem Boden, ausgehend von einem Punkt in Reichweite. Für die Wirkungsdauer machen diese Pflanzen den Boden im Bereich zu schwierigem Gelände.

Eine Kreatur, die sich beim Wirken des Zaubers im Bereich befindet, muss einen Stärkerettungswurf bestehen, sonst ist sie von den umschlingenden Pflanzen festgesetzt, bis der Zauber endet. Eine von den Pflanzen festgesetzte Kreatur kann ihre Aktion nutzen, um einen Stärkewurf gegen deinen Zauberrettungswurf-SG abzulegen. Bei einem Erfolg befreit sie sich.

Wenn der Zauber endet, welken die beschworenen Pflanzen dahin.`,
  },
  'expeditious-retreat': {
    text: `Mit diesem Zauber bewegst du dich in unglaublichem Tempo. Wenn du diesen Zauber wirkst und danach als Bonusaktion in jedem deiner Züge bis zum Ende des Zaubers, kannst du die Spurt-Aktion ausführen.`,
  },
  'faerie-fire': {
    text: `Jeder Gegenstand in einem Würfel mit 6 m Kantenlänge in Reichweite wird von blauem, grünem oder violettem Licht (deine Wahl) umrissen. Jede Kreatur, die sich beim Wirken im Bereich befindet, wird ebenfalls von Licht umrissen, wenn ihr ein Geschicklichkeitsrettungswurf misslingt. Für die Wirkungsdauer spenden Gegenstände und betroffene Kreaturen in einem Radius von 3 m dämmriges Licht.

Jeder Angriffswurf gegen eine betroffene Kreatur oder einen betroffenen Gegenstand ist im Vorteil, wenn der Angreifer sie sehen kann, und die betroffene Kreatur oder der betroffene Gegenstand profitiert nicht davon, unsichtbar zu sein.`,
  },
  'false-life': {
    text: `Du stärkst dich mit einem nekromantischen Abbild des Lebens und erhältst für die Wirkungsdauer 1W4 + 4 temporäre Trefferpunkte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, erhältst du für jeden Grad über dem 1. zusätzlich 5 temporäre Trefferpunkte.`,
    material: 'Eine kleine Menge Alkohol oder gebrannter Schnaps.',
  },
  'feather-fall': {
    text: `Wähle bis zu fünf fallende Kreaturen in Reichweite. Die Fallgeschwindigkeit einer fallenden Kreatur verlangsamt sich auf 18 m pro Runde, bis der Zauber endet. Landet die Kreatur, bevor der Zauber endet, erleidet sie keinen Fallschaden und kann auf den Füßen landen, und der Zauber endet für diese Kreatur.`,
    material: 'Eine kleine Feder oder ein Stück Daune.',
  },
  'find-familiar': {
    text: `Du erhältst die Dienste eines Vertrauten, eines Geistes, der eine Tiergestalt deiner Wahl annimmt: Eule, Falke, Fisch (Quipper), Fledermaus, Frosch (Kröte), Giftschlange, Katze, Krabbe, Oktopus, Rabe, Ratte, Seepferdchen, Spinne, Wiesel oder Echse. Der Vertraute erscheint in einem freien Bereich in Reichweite und hat die Spielwerte der gewählten Gestalt, ist aber statt eines Tiers ein Himmlischer, ein Feenwesen oder ein Unhold (deine Wahl).

Dein Vertrauter handelt unabhängig von dir, gehorcht aber stets deinen Befehlen. Im Kampf würfelt er seine eigene Initiative und handelt in seinem eigenen Zug. Ein Vertrauter kann nicht angreifen, aber andere Aktionen wie gewohnt ausführen.

Fällt der Vertraute auf 0 Trefferpunkte, verschwindet er und hinterlässt keine körperliche Gestalt. Er erscheint wieder, wenn du diesen Zauber erneut wirkst.

Solange dein Vertrauter höchstens 30 m von dir entfernt ist, kannst du telepathisch mit ihm kommunizieren. Außerdem kannst du als Aktion bis zum Beginn deines nächsten Zuges durch die Augen deines Vertrauten sehen und hören, was er hört, und erhältst dabei die Vorteile aller besonderen Sinne, die er hat. Während dieser Zeit bist du in Bezug auf deine eigenen Sinne taub und blind.

Als Aktion kannst du deinen Vertrauten vorübergehend entlassen. Er verschwindet in eine Taschendimension, wo er auf deinen Ruf wartet. Alternativ kannst du ihn für immer entlassen. Als Aktion, während er vorübergehend entlassen ist, kannst du ihn in einem freien Bereich im Umkreis von 9 m um dich wieder erscheinen lassen.

Du kannst nicht mehr als einen Vertrauten gleichzeitig haben. Wirkst du diesen Zauber, während du bereits einen Vertrauten hast, lässt du ihn stattdessen eine neue Gestalt annehmen. Wähle eine der Gestalten aus der obigen Liste. Dein Vertrauter verwandelt sich in die gewählte Kreatur.

Schließlich kann dein Vertrauter, wenn du einen Zauber mit der Reichweite Berührung wirkst, den Zauber überbringen, als hätte er ihn gewirkt. Dein Vertrauter muss sich höchstens 30 m von dir entfernt befinden und seine Reaktion nutzen, um den Zauber zu überbringen, wenn du ihn wirkst. Erfordert der Zauber einen Angriffswurf, verwendest du für den Wurf deinen Angriffsmodifikator.`,
    material:
      'Holzkohle, Weihrauch und Kräuter im Wert von 10 GM, die in einer Messingschale vom Feuer verzehrt werden müssen.',
  },
  'floating-disk': {
    text: `Dieser Zauber erschafft eine kreisrunde, waagerechte Fläche aus Energie mit 90 cm Durchmesser und 2,5 cm Dicke, die in einem freien Bereich deiner Wahl, den du in Reichweite sehen kannst, 90 cm über dem Boden schwebt. Die Scheibe bleibt für die Wirkungsdauer bestehen und kann bis zu 250 kg tragen. Wird mehr Gewicht daraufgelegt, endet der Zauber, und alles auf der Scheibe fällt zu Boden.

Die Scheibe bleibt unbeweglich, solange du höchstens 6 m von ihr entfernt bist. Entfernst du dich weiter als 6 m von ihr, folgt sie dir, sodass sie höchstens 6 m von dir entfernt bleibt. Sie kann sich über unebenes Gelände, Treppen hinauf oder hinunter, Hänge und Ähnliches bewegen, aber keinen Höhenunterschied von 3 m oder mehr überwinden. Die Scheibe kann zum Beispiel keine 3 m tiefe Grube überqueren und könnte eine solche Grube auch nicht verlassen, wenn sie an deren Boden erschaffen wurde.

Entfernst du dich mehr als 30 m von der Scheibe (meist, weil sie ein Hindernis nicht umgehen kann, um dir zu folgen), endet der Zauber.`,
    material: 'Ein Tropfen Quecksilber.',
  },
  'fog-cloud': {
    text: `Du erschaffst eine Nebelkugel mit 6 m Radius, deren Mittelpunkt ein Punkt in Reichweite ist. Die Kugel breitet sich um Ecken aus, und ihr Bereich ist komplett verschleiert. Sie bleibt für die Wirkungsdauer bestehen oder bis ein mäßiger oder stärkerer Wind (mindestens 15 km/h) sie verweht.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Radius des Nebels für jeden Grad über dem 1. um 6 m.`,
  },
  goodberry: {
    text: `Bis zu zehn Beeren erscheinen in deiner Hand und sind für die Wirkungsdauer von Magie durchdrungen. Eine Kreatur kann ihre Aktion nutzen, um eine Beere zu essen. Das Essen einer Beere stellt 1 Trefferpunkt wieder her, und die Beere nährt eine Kreatur für einen Tag.

Die Beeren verlieren ihre Wirkung, wenn sie nicht innerhalb von 24 Stunden nach dem Wirken dieses Zaubers verzehrt werden.`,
    material: 'Ein Mistelzweig.',
  },
  grease: {
    text: `Glitschiges Fett bedeckt den Boden in einem Quadrat mit 3 m Seitenlänge, dessen Mittelpunkt ein Punkt in Reichweite ist, und macht ihn für die Wirkungsdauer zu schwierigem Gelände.

Wenn das Fett erscheint, muss jede Kreatur, die in seinem Bereich steht, einen Geschicklichkeitsrettungswurf bestehen, sonst fällt sie hin. Eine Kreatur, die den Bereich betritt oder ihren Zug dort beendet, muss ebenfalls einen Geschicklichkeitsrettungswurf bestehen, sonst fällt sie hin.`,
    material: 'Ein Stück Schwarte oder Butter.',
  },
  'guiding-bolt': {
    text: `Ein Lichtblitz schießt auf eine Kreatur deiner Wahl in Reichweite zu. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer erleidet das Ziel 4W6 gleißenden Schaden, und der nächste Angriffswurf gegen dieses Ziel vor dem Ende deines nächsten Zuges ist im Vorteil, dank des mystischen dämmrigen Lichts, das bis dahin auf dem Ziel funkelt.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 1. um 1W6.`,
  },
  'healing-word': {
    text: `Eine Kreatur deiner Wahl, die du in Reichweite sehen kannst, erhält Trefferpunkte in Höhe von 1W4 + deinem Zauberattributsmodifikator zurück. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 1. um 1W4.`,
  },
  'hellish-rebuke': {
    text: `Du zeigst mit dem Finger, und die Kreatur, die dir Schaden zugefügt hat, wird kurz von höllischen Flammen umhüllt. Die Kreatur muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 2W10 Feuerschaden, bei einem erfolgreichen die Hälfte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 1. um 1W10.`,
  },
  heroism: {
    text: `Eine bereitwillige Kreatur, die du berührst, wird von Tapferkeit erfüllt. Bis der Zauber endet, ist die Kreatur immun dagegen, verängstigt zu werden, und erhält zu Beginn jedes ihrer Züge temporäre Trefferpunkte in Höhe deines Zauberattributsmodifikators. Wenn der Zauber endet, verliert das Ziel alle verbleibenden temporären Trefferpunkte aus diesem Zauber.`,
  },
  'hideous-laughter': {
    text: `Eine Kreatur deiner Wahl, die du in Reichweite sehen kannst, findet alles urkomisch und bricht in Lachkrämpfe aus, wenn dieser Zauber sie betrifft. Das Ziel muss einen Weisheitsrettungswurf bestehen, sonst fällt es hin, ist kampfunfähig und kann für die Wirkungsdauer nicht aufstehen. Eine Kreatur mit einem Intelligenzwert von 4 oder weniger ist nicht betroffen.

Am Ende jedes seiner Züge und jedes Mal, wenn es Schaden erleidet, kann das Ziel einen weiteren Weisheitsrettungswurf ablegen. Wird der Rettungswurf durch Schaden ausgelöst, ist das Ziel dabei im Vorteil. Bei einem Erfolg endet der Zauber.`,
    material: 'Winzige Törtchen und eine Feder, die durch die Luft geschwenkt wird.',
  },
  'hunters-mark': {
    text: `Du wählst eine Kreatur, die du in Reichweite sehen kannst, und markierst sie auf mystische Weise als deine Beute. Bis der Zauber endet, verursachst du beim Ziel jedes Mal, wenn du es mit einem Waffenangriff triffst, zusätzlich 1W6 Schaden, und du bist bei Weisheitswürfen (Wahrnehmung) und Weisheitswürfen (Überlebenskunst), um es zu finden, im Vorteil. Fällt das Ziel vor dem Ende des Zaubers auf 0 Trefferpunkte, kannst du in einem späteren Zug eine Bonusaktion nutzen, um eine neue Kreatur zu markieren.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. oder 4. Grades wirkst, kannst du die Konzentration auf den Zauber bis zu 8 Stunden aufrechterhalten. Nutzt du einen Zauberplatz des 5. Grades oder höher, kannst du die Konzentration bis zu 24 Stunden aufrechterhalten.`,
  },
  identify: {
    text: `Du wählst einen Gegenstand, den du während des gesamten Wirkens berühren musst. Ist es ein magischer Gegenstand oder ein anderer von Magie durchdrungener Gegenstand, erfährst du seine Eigenschaften und wie man sie nutzt, ob er eine Einstimmung erfordert und wie viele Ladungen er hat, falls er welche hat. Du erfährst, ob Zauber auf den Gegenstand wirken und welche. Wurde der Gegenstand durch einen Zauber erschaffen, erfährst du, welcher Zauber es war.

Berührst du während des Wirkens stattdessen eine Kreatur, erfährst du, welche Zauber gerade auf sie wirken, falls welche.`,
    material: 'Eine Perle im Wert von mindestens 100 GM und eine Eulenfeder.',
  },
  'illusory-script': {
    text: `Du schreibst auf Pergament, Papier oder ein anderes geeignetes Schreibmaterial und durchdringst es mit einer mächtigen Illusion, die für die Wirkungsdauer bestehen bleibt.

Für dich und alle Kreaturen, die du beim Wirken bestimmst, erscheint die Schrift normal, in deiner Handschrift, und vermittelt die Bedeutung, die du beim Schreiben beabsichtigt hast. Für alle anderen sieht die Schrift aus, als wäre sie in einer unbekannten oder magischen Schrift verfasst, die unverständlich ist. Alternativ kannst du die Schrift als völlig andere Botschaft erscheinen lassen, in einer anderen Handschrift und Sprache, wobei es eine Sprache sein muss, die du beherrschst.

Wird der Zauber gebannt, verschwinden sowohl die ursprüngliche Schrift als auch die Illusion.

Eine Kreatur mit Wahrsicht kann die verborgene Botschaft lesen.`,
    material: 'Eine bleihaltige Tinte im Wert von mindestens 10 GM, die der Zauber verbraucht.',
  },
  'inflict-wounds': {
    text: `Führe einen Nahkampf-Zauberangriff gegen eine Kreatur in deiner Reichweite aus. Bei einem Treffer erleidet das Ziel 3W10 nekrotischen Schaden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 1. um 1W10.`,
  },
  jump: {
    text: `Du berührst eine Kreatur. Ihre Sprungweite verdreifacht sich, bis der Zauber endet.`,
    material: 'Das Hinterbein einer Heuschrecke.',
  },
  longstrider: {
    text: `Du berührst eine Kreatur. Die Bewegungsrate des Ziels steigt um 3 m, bis der Zauber endet.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, kannst du für jeden Grad über dem 1. eine zusätzliche Kreatur als Ziel wählen.`,
    material: 'Eine Prise Erde.',
  },
  'mage-armor': {
    text: `Du berührst eine bereitwillige Kreatur, die keine Rüstung trägt, und eine schützende magische Kraft umgibt sie, bis der Zauber endet. Die Grund-RK des Ziels beträgt 13 + seinen Geschicklichkeitsmodifikator. Der Zauber endet, wenn das Ziel eine Rüstung anlegt oder du den Zauber als Aktion beendest.`,
    material: 'Ein Stück gegerbtes Leder.',
  },
  'magic-missile': {
    text: `Du erschaffst drei leuchtende Pfeile aus magischer Energie. Jeder Pfeil trifft eine Kreatur deiner Wahl, die du in Reichweite sehen kannst. Ein Pfeil verursacht bei seinem Ziel 1W4 + 1 Energieschaden. Die Pfeile treffen alle gleichzeitig, und du kannst sie auf eine Kreatur oder auf mehrere richten.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, erschafft der Zauber für jeden Grad über dem 1. einen weiteren Pfeil.`,
  },
  'protection-from-evil-and-good': {
    text: `Bis der Zauber endet, ist eine bereitwillige Kreatur, die du berührst, gegen bestimmte Arten von Kreaturen geschützt: Aberrationen, Himmlische, Elementare, Feenwesen, Unholde und Untote.

Der Schutz gewährt mehrere Vorteile. Kreaturen dieser Arten sind bei Angriffswürfen gegen das Ziel im Nachteil. Außerdem kann das Ziel von ihnen weder bezaubert noch verängstigt noch besessen werden. Ist das Ziel bereits von einer solchen Kreatur bezaubert, verängstigt oder besessen, ist es bei jedem neuen Rettungswurf gegen die betreffende Wirkung im Vorteil.`,
    material: 'Weihwasser oder Silber- und Eisenpulver, die der Zauber verbraucht.',
  },
  'purify-food-and-drink': {
    text: `Alle nichtmagischen Speisen und Getränke in einer Kugel mit 1,5 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist, werden gereinigt und von Gift und Krankheit befreit.`,
  },
  sanctuary: {
    text: `Du schützt eine Kreatur in Reichweite vor Angriffen. Bis der Zauber endet, muss jede Kreatur, die die geschützte Kreatur mit einem Angriff oder einem schädlichen Zauber zum Ziel nimmt, zuerst einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf muss die Kreatur ein neues Ziel wählen oder verliert den Angriff oder Zauber. Dieser Zauber schützt die geschützte Kreatur nicht vor Flächenwirkungen wie der Explosion eines Feuerballs.

Führt die geschützte Kreatur einen Angriff aus oder wirkt sie einen Zauber, der eine feindliche Kreatur betrifft, endet dieser Zauber.`,
    material: 'Ein kleiner Silberspiegel.',
  },
  shield: {
    text: `Eine unsichtbare Barriere aus magischer Energie erscheint und schützt dich. Bis zum Beginn deines nächsten Zuges erhältst du einen Bonus von +5 auf deine RK, auch gegen den auslösenden Angriff, und du erleidest keinen Schaden durch *Magisches Geschoss*.`,
  },
  'shield-of-faith': {
    text: `Ein schimmerndes Feld erscheint und umgibt eine Kreatur deiner Wahl in Reichweite. Es gewährt ihr für die Wirkungsdauer einen Bonus von +2 auf die RK.`,
    material: 'Ein kleines Pergament, auf dem ein heiliger Text steht.',
  },
  'silent-image': {
    text: `Du erschaffst das Bild eines Gegenstands, einer Kreatur oder einer anderen sichtbaren Erscheinung, die nicht größer als ein Würfel mit 4,5 m Kantenlänge ist. Das Bild erscheint an einer Stelle in Reichweite und bleibt für die Wirkungsdauer bestehen. Das Bild ist rein visuell; es wird nicht von Geräuschen, Gerüchen oder anderen Sinneswirkungen begleitet.

Du kannst deine Aktion nutzen, um das Bild an eine beliebige Stelle in Reichweite zu bewegen. Während das Bild den Ort wechselt, kannst du sein Aussehen so verändern, dass seine Bewegungen natürlich wirken. Erschaffst du zum Beispiel das Bild einer Kreatur und bewegst es, kannst du das Bild so verändern, dass es zu gehen scheint.

Körperlicher Kontakt mit dem Bild entlarvt es als Illusion, denn Dinge können hindurchgehen. Eine Kreatur, die ihre Aktion nutzt, um das Bild zu untersuchen, kann mit einem erfolgreichen Intelligenzwurf (Nachforschungen) gegen deinen Zauberrettungswurf-SG feststellen, dass es eine Illusion ist. Durchschaut eine Kreatur die Illusion, kann sie durch das Bild hindurchsehen.`,
    material: 'Ein Stück Schafwolle.',
  },
  sleep: {
    text: `Dieser Zauber versetzt Kreaturen in einen magischen Schlummer. Wirf 5W8; die Summe gibt an, wie viele Trefferpunkte an Kreaturen dieser Zauber betreffen kann. Kreaturen im Umkreis von 6 m um einen Punkt deiner Wahl in Reichweite werden in aufsteigender Reihenfolge ihrer aktuellen Trefferpunkte betroffen (bewusstlose Kreaturen werden übergangen).

Beginnend mit der Kreatur mit den wenigsten aktuellen Trefferpunkten wird jede von diesem Zauber betroffene Kreatur bewusstlos, bis der Zauber endet, der Schlafende Schaden erleidet oder jemand eine Aktion nutzt, um ihn wachzurütteln oder wachzuohrfeigen. Ziehe die Trefferpunkte jeder Kreatur von der Summe ab, bevor du zur Kreatur mit den nächstniedrigeren Trefferpunkten übergehst. Die Trefferpunkte einer Kreatur müssen kleiner oder gleich der verbleibenden Summe sein, damit sie betroffen ist.

Untote und Kreaturen, die immun dagegen sind, bezaubert zu werden, sind von diesem Zauber nicht betroffen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, wirf für jeden Grad über dem 1. zusätzlich 2W8.`,
    material: 'Eine Prise feiner Sand, Rosenblätter oder eine Grille.',
  },
  'speak-with-animals': {
    text: `Für die Wirkungsdauer erhältst du die Fähigkeit, Tiere zu verstehen und dich mündlich mit ihnen zu verständigen. Wissen und Wahrnehmung vieler Tiere sind durch ihre Intelligenz begrenzt, aber zumindest können Tiere dir Auskunft über nahe Orte und Ungeheuer geben, einschließlich allem, was sie wahrnehmen können oder am vergangenen Tag wahrgenommen haben. Nach Ermessen des SL kannst du ein Tier vielleicht überreden, dir einen kleinen Gefallen zu tun.`,
  },
  thunderwave: {
    text: `Eine Welle donnernder Kraft fegt von dir aus. Jede Kreatur in einem Würfel mit 4,5 m Kantenlänge, der von dir ausgeht, muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 2W8 Schallschaden und wird 3 m von dir weggestoßen. Bei einem erfolgreichen Rettungswurf erleidet sie die Hälfte des Schadens und wird nicht weggestoßen.

Außerdem werden ungesicherte Gegenstände, die sich vollständig im Wirkungsbereich befinden, durch den Zauber automatisch 3 m von dir weggestoßen, und der Zauber erzeugt einen donnernden Knall, der noch in 90 m Entfernung zu hören ist.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 2. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 1. um 1W8.`,
  },
  'unseen-servant': {
    text: `Dieser Zauber erschafft eine unsichtbare, geistlose, gestaltlose Kraft, die auf deinen Befehl einfache Aufgaben erledigt, bis der Zauber endet. Der Diener entsteht in einem freien Bereich auf dem Boden in Reichweite. Er hat RK 10, 1 Trefferpunkt und eine Stärke von 2 und kann nicht angreifen. Fällt er auf 0 Trefferpunkte, endet der Zauber.

Einmal in jedem deiner Züge kannst du dem Diener als Bonusaktion geistig befehlen, sich bis zu 4,5 m weit zu bewegen und mit einem Gegenstand zu interagieren. Der Diener kann einfache Aufgaben erledigen, die auch ein menschlicher Diener erledigen könnte, etwa Dinge holen, putzen, flicken, Kleidung falten, Feuer entzünden, Essen servieren und Wein einschenken. Sobald du den Befehl gibst, erledigt der Diener die Aufgabe nach besten Kräften, bis er fertig ist, und wartet dann auf deinen nächsten Befehl.

Befiehlst du dem Diener eine Aufgabe, bei der er sich mehr als 18 m von dir entfernen würde, endet der Zauber.`,
    material: 'Ein Stück Schnur und ein Stück Holz.',
  },
};
