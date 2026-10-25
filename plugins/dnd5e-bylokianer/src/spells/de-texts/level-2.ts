// German texts of the SRD spells of the 2nd level. Our own translation of the SRD 5.1, CC-BY-4.0.

import type { DeText } from '../model';

const HIGHER_TARGET = `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, kannst du für jeden Grad über dem 2. eine zusätzliche Kreatur als Ziel wählen.`;

export const DE_TEXTS_2: Readonly<Record<string, DeText>> = {
  'acid-arrow': {
    text: `Ein schimmernder grüner Pfeil schießt auf ein Ziel in Reichweite zu und zerplatzt in einem Säureregen. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer erleidet das Ziel sofort 4W4 Säureschaden und am Ende seines nächsten Zuges 2W4 Säureschaden. Bei einem Fehlschlag bespritzt der Pfeil das Ziel mit Säure, die die Hälfte des anfänglichen Schadens verursacht und am Ende seines nächsten Zuges keinen Schaden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden (sowohl der anfängliche als auch der spätere) für jeden Grad über dem 2. um 1W4.`,
    material: 'Pulverisiertes Rhabarberblatt und der Magen einer Natter.',
  },
  aid: {
    text: `Dein Zauber stärkt deine Verbündeten mit Zähigkeit und Entschlossenheit. Wähle bis zu drei Kreaturen in Reichweite. Das Trefferpunktemaximum und die aktuellen Trefferpunkte jedes Ziels steigen für die Wirkungsdauer um 5.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigen die Trefferpunkte eines Ziels für jeden Grad über dem 2. um weitere 5.`,
    material: 'Ein winziger Streifen weißen Stoffs.',
  },
  'alter-self': {
    text: `Du nimmst eine andere Gestalt an. Wenn du den Zauber wirkst, wähle eine der folgenden Optionen, deren Wirkungen für die Wirkungsdauer anhalten. Solange der Zauber wirkt, kannst du als Aktion eine Option beenden, um die Vorteile einer anderen zu erhalten.

***Anpassung an Wasser.*** Du passt deinen Körper an eine Umgebung unter Wasser an: Dir wachsen Kiemen und Schwimmhäute zwischen den Fingern. Du kannst unter Wasser atmen und erhältst eine Schwimmbewegungsrate in Höhe deiner Bewegungsrate zu Fuß.

***Aussehen verändern.*** Du veränderst dein Aussehen. Du bestimmst, wie du aussiehst, einschließlich Größe, Gewicht, Gesichtszügen, Klang deiner Stimme, Haarlänge, Färbung und besonderer Merkmale, falls vorhanden. Du kannst wie ein Angehöriger eines anderen Volkes aussehen, doch keiner deiner Spielwerte ändert sich. Du kannst auch nicht als Kreatur einer anderen Größenkategorie erscheinen, und deine grundlegende Gestalt bleibt gleich; bist du zweibeinig, kannst du mit diesem Zauber zum Beispiel nicht vierbeinig werden. Während der Wirkungsdauer kannst du jederzeit deine Aktion nutzen, um dein Aussehen auf diese Weise erneut zu verändern.

***Natürliche Waffen.*** Dir wachsen Klauen, Reißzähne, Stacheln, Hörner oder eine andere natürliche Waffe deiner Wahl. Deine waffenlosen Angriffe verursachen 1W6 Wucht-, Stich- oder Hiebschaden, je nachdem, welche natürliche Waffe du gewählt hast, und du bist im Umgang mit deinen waffenlosen Angriffen geübt. Schließlich ist die natürliche Waffe magisch, und du erhältst einen Bonus von +1 auf Angriffs- und Schadenswürfe mit ihr.`,
  },
  'animal-messenger': {
    text: `Mit diesem Zauber lässt du ein Tier eine Nachricht überbringen. Wähle ein winziges Tier, das du in Reichweite sehen kannst, etwa ein Eichhörnchen, einen Eichelhäher oder eine Fledermaus. Du nennst einen Ort, den du besucht haben musst, und einen Empfänger, auf den eine allgemeine Beschreibung zutrifft, etwa „ein Mann oder eine Frau in der Uniform der Stadtwache“ oder „ein rothaariger Zwerg mit spitzem Hut“. Außerdem sprichst du eine Nachricht aus bis zu fünfundzwanzig Wörtern. Das Tier reist für die Wirkungsdauer zum genannten Ort und legt dabei etwa 75 km pro 24 Stunden zurück, wenn es fliegt, andere Tiere etwa 40 km.

Wenn der Bote ankommt, überbringt er deine Nachricht der beschriebenen Kreatur und ahmt dabei den Klang deiner Stimme nach. Der Bote spricht nur zu einer Kreatur, auf die deine Beschreibung zutrifft. Erreicht der Bote sein Ziel nicht vor dem Ende des Zaubers, geht die Nachricht verloren, und das Tier kehrt dorthin zurück, wo du diesen Zauber gewirkt hast.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt die Wirkungsdauer für jeden Grad über dem 2. um 48 Stunden.`,
    material: 'Ein Happen Futter.',
  },
  'arcane-lock': {
    text: `Du berührst eine geschlossene Tür, ein Fenster, ein Tor, eine Truhe oder einen anderen Zugang, und er wird für die Wirkungsdauer verschlossen. Du und die Kreaturen, die du beim Wirken bestimmst, könnt den Gegenstand normal öffnen. Du kannst auch ein Losungswort festlegen, das den Zauber für 1 Minute unterdrückt, wenn es im Umkreis von 1,5 m um den Gegenstand gesprochen wird. Ansonsten ist er unpassierbar, bis er aufgebrochen oder der Zauber gebannt oder unterdrückt wird. *Klopfen* auf den Gegenstand gewirkt, unterdrückt *Arkanes Schloss* für 10 Minuten.

Solange der Gegenstand von diesem Zauber betroffen ist, ist er schwerer aufzubrechen oder gewaltsam zu öffnen; der SG, um ihn aufzubrechen oder seine Schlösser zu knacken, steigt um 10.`,
    material: 'Goldstaub im Wert von mindestens 25 GM, den der Zauber verbraucht.',
  },
  'arcanists-magic-aura': {
    text: `Du belegst eine Kreatur oder einen Gegenstand, den du berührst, mit einer Illusion, sodass Erkenntniszauber falsche Auskünfte darüber geben. Das Ziel kann eine bereitwillige Kreatur sein oder ein Gegenstand, den keine andere Kreatur trägt oder hält.

Wenn du den Zauber wirkst, wähle eine oder beide der folgenden Wirkungen. Die Wirkung hält für die Wirkungsdauer an. Wirkst du diesen Zauber 30 Tage lang jeden Tag auf dieselbe Kreatur oder denselben Gegenstand und legst jedes Mal dieselbe Wirkung darauf, bleibt die Illusion bestehen, bis sie gebannt wird.

***Falsche Aura.*** Du veränderst, wie das Ziel für Zauber und magische Wirkungen erscheint, die magische Auren entdecken, etwa *Magie entdecken*. Du kannst einen nichtmagischen Gegenstand magisch erscheinen lassen, einen magischen nichtmagisch oder seine magische Aura so verändern, dass sie scheinbar zu einer Schule der Magie deiner Wahl gehört. Nutzt du diese Wirkung bei einem Gegenstand, kannst du die falsche Magie für jede Kreatur erkennbar machen, die den Gegenstand in die Hand nimmt.

***Maske.*** Du veränderst, wie das Ziel für Zauber und magische Wirkungen erscheint, die Kreaturenarten entdecken, etwa das Göttliche Gespür eines Paladins oder den Auslöser eines *Symbol*-Zaubers. Du wählst eine Kreaturenart, und andere Zauber und magische Wirkungen behandeln das Ziel, als wäre es eine Kreatur dieser Art oder dieser Gesinnung.`,
    material: 'Ein kleines Quadrat aus Seide.',
  },
  augury: {
    text: `Indem du mit Edelsteinen besetzte Stäbchen wirfst, Drachenknochen rollst, verzierte Karten auslegst oder ein anderes Weissagungswerkzeug benutzt, erhältst du von einem jenseitigen Wesen ein Omen über den Ausgang einer bestimmten Handlung, die du in den nächsten 30 Minuten vorhast. Der SL wählt aus den folgenden möglichen Omen:

- Heil, für gute Folgen

- Unheil, für schlechte Folgen

- Heil und Unheil, für gute und schlechte Folgen zugleich

- Nichts, für Folgen, die weder besonders gut noch besonders schlecht sind

Der Zauber berücksichtigt keine möglichen Umstände, die den Ausgang ändern könnten, etwa das Wirken weiterer Zauber oder den Verlust oder Gewinn eines Gefährten.

Wirkst du den Zauber zweimal oder öfter, bevor du deine nächste lange Rast beendest, besteht für jedes Wirken nach dem ersten eine sich aufaddierende Wahrscheinlichkeit von 25 Prozent, dass du eine zufällige Deutung erhältst. Der SL würfelt dies verdeckt aus.`,
    material:
      'Besonders markierte Stäbchen, Knochen oder ähnliche Marken im Wert von mindestens 25 GM.',
  },
  barkskin: {
    text: `Du berührst eine bereitwillige Kreatur. Bis der Zauber endet, hat die Haut des Ziels ein raues, rindenartiges Aussehen, und die RK des Ziels kann nicht unter 16 liegen, egal welche Art von Rüstung es trägt.`,
    material: 'Eine Handvoll Eichenrinde.',
  },
  'blindness-deafness': {
    text: `Du kannst einen Feind blenden oder taub machen. Wähle eine Kreatur, die du in Reichweite sehen kannst; sie muss einen Konstitutionsrettungswurf ablegen. Misslingt er, ist das Ziel für die Wirkungsdauer entweder blind oder taub (deine Wahl). Am Ende jedes seiner Züge kann das Ziel einen Konstitutionsrettungswurf ablegen. Bei einem Erfolg endet der Zauber.`,
    higher: HIGHER_TARGET,
  },
  blur: {
    text: `Dein Körper verschwimmt und wabert für alle, die dich sehen können. Für die Wirkungsdauer ist jede Kreatur bei Angriffswürfen gegen dich im Nachteil. Ein Angreifer ist gegen diese Wirkung immun, wenn er nicht auf Sicht angewiesen ist, etwa durch Blindsicht, oder Illusionen durchschauen kann, etwa durch Wahrsicht.`,
  },
  'branding-smite': {
    text: `Wenn du vor dem Ende dieses Zaubers das nächste Mal eine Kreatur mit einem Waffenangriff triffst, erstrahlt die Waffe beim Schlag in astralem Glanz. Der Angriff verursacht beim Ziel zusätzlich 2W6 gleißenden Schaden. Ist das Ziel unsichtbar, wird es sichtbar, und bis der Zauber endet, spendet es in einem Radius von 1,5 m dämmriges Licht und kann nicht unsichtbar werden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der zusätzliche Schaden für jeden Grad über dem 2. um 1W6.`,
  },
  'calm-emotions': {
    text: `Du versuchst, starke Gefühle in einer Gruppe von Personen zu unterdrücken. Jeder Humanoide in einer Kugel mit 6 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist, muss einen Charismarettungswurf ablegen; eine Kreatur kann sich entscheiden, diesen Rettungswurf freiwillig nicht zu bestehen. Misslingt einer Kreatur der Rettungswurf, wähle eine der beiden folgenden Wirkungen. Du kannst jede Wirkung unterdrücken, durch die ein Ziel bezaubert oder verängstigt ist. Wenn dieser Zauber endet, setzt jede unterdrückte Wirkung wieder ein, sofern ihre Wirkungsdauer in der Zwischenzeit nicht abgelaufen ist.

Alternativ kannst du ein Ziel gegenüber Kreaturen deiner Wahl, denen es feindselig gesinnt ist, gleichgültig machen. Diese Gleichgültigkeit endet, wenn das Ziel angegriffen oder durch einen Zauber verletzt wird oder sieht, wie einem seiner Freunde Schaden zugefügt wird. Wenn der Zauber endet, wird die Kreatur wieder feindselig, sofern der SL nichts anderes entscheidet.`,
  },
  'continual-flame': {
    text: `Eine Flamme, so hell wie eine Fackel, entspringt einem Gegenstand, den du berührst. Die Wirkung sieht aus wie eine gewöhnliche Flamme, erzeugt aber keine Hitze und verbraucht keinen Sauerstoff. Eine immerwährende Flamme kann abgedeckt oder versteckt, aber nicht erstickt oder gelöscht werden.`,
    material: 'Rubinstaub im Wert von 50 GM, den der Zauber verbraucht.',
  },
  darkness: {
    text: `Magische Dunkelheit breitet sich von einem Punkt deiner Wahl in Reichweite aus und füllt für die Wirkungsdauer eine Kugel mit 4,5 m Radius. Die Dunkelheit breitet sich um Ecken aus. Eine Kreatur mit Dunkelsicht kann diese Dunkelheit nicht durchdringen, und nichtmagisches Licht kann sie nicht erhellen.

Liegt der gewählte Punkt auf einem Gegenstand, den du hältst, oder einem, den niemand trägt oder hält, geht die Dunkelheit von dem Gegenstand aus und bewegt sich mit ihm. Wird die Quelle der Dunkelheit vollständig mit einem undurchsichtigen Gegenstand wie einer Schüssel oder einem Helm bedeckt, wird die Dunkelheit blockiert.

Überschneidet sich ein Teil des Bereichs dieses Zaubers mit einem Lichtbereich, der durch einen Zauber des 2. Grades oder niedriger erschaffen wurde, wird der Zauber, der das Licht erschaffen hat, gebannt.`,
    material: 'Fledermausfell und ein Tropfen Pech oder ein Stück Kohle.',
  },
  darkvision: {
    text: `Du berührst eine bereitwillige Kreatur und verleihst ihr die Fähigkeit, im Dunkeln zu sehen. Für die Wirkungsdauer hat diese Kreatur Dunkelsicht mit einer Reichweite von 18 m.`,
    material: 'Entweder eine Prise getrockneter Karotte oder ein Achat.',
  },
  'detect-thoughts': {
    text: `Für die Wirkungsdauer kannst du die Gedanken bestimmter Kreaturen lesen. Wenn du den Zauber wirkst und als deine Aktion in jedem Zug bis zum Ende des Zaubers, kannst du deinen Geist auf eine Kreatur richten, die du im Umkreis von 9 m sehen kannst. Hat die gewählte Kreatur eine Intelligenz von 3 oder weniger oder spricht sie keine Sprache, ist sie nicht betroffen.

Zunächst erfährst du die oberflächlichen Gedanken der Kreatur – was sie in diesem Moment am meisten beschäftigt. Als Aktion kannst du entweder deine Aufmerksamkeit auf die Gedanken einer anderen Kreatur lenken oder versuchen, tiefer in den Geist derselben Kreatur vorzudringen. Dringst du tiefer vor, muss das Ziel einen Weisheitsrettungswurf ablegen. Misslingt er, erhältst du Einblick in seine Überlegungen (falls vorhanden), seinen Gefühlszustand und etwas, das in seinem Geist großen Raum einnimmt (etwa etwas, um das es sich sorgt, das es liebt oder hasst). Gelingt er, endet der Zauber. In jedem Fall weiß das Ziel, dass du in seinen Geist vordringst, und solange du deine Aufmerksamkeit nicht auf die Gedanken einer anderen Kreatur lenkst, kann die Kreatur in ihrem Zug ihre Aktion nutzen, um einen Intelligenzwurf abzulegen, gegen den du einen vergleichenden Intelligenzwurf ablegst; gelingt ihr der Wurf, endet der Zauber.

Fragen, die mündlich an die Zielkreatur gerichtet werden, lenken ihre Gedanken ganz natürlich, daher ist dieser Zauber bei einem Verhör besonders wirksam.

Du kannst diesen Zauber auch nutzen, um die Anwesenheit denkender Kreaturen zu entdecken, die du nicht sehen kannst. Wenn du den Zauber wirkst oder als deine Aktion während der Wirkungsdauer, kannst du im Umkreis von 9 m nach Gedanken suchen. Der Zauber durchdringt Barrieren, doch 60 cm Fels, 5 cm eines anderen Metalls als Blei oder eine dünne Bleiplatte blockieren dich. Eine Kreatur mit einer Intelligenz von 3 oder weniger oder eine, die keine Sprache spricht, kannst du nicht entdecken.

Hast du die Anwesenheit einer Kreatur auf diese Weise entdeckt, kannst du für den Rest der Wirkungsdauer wie oben beschrieben ihre Gedanken lesen, auch wenn du sie nicht sehen kannst, sie muss sich aber weiterhin in Reichweite befinden.`,
    material: 'Eine Kupfermünze.',
  },
  'enhance-ability': {
    text: `Du berührst eine Kreatur und verleihst ihr eine magische Verbesserung. Wähle eine der folgenden Wirkungen; das Ziel erhält sie, bis der Zauber endet.

***Ausdauer des Bären.*** Das Ziel ist bei Konstitutionswürfen im Vorteil. Außerdem erhält es 2W6 temporäre Trefferpunkte, die verloren gehen, wenn der Zauber endet.

***Stärke des Stiers.*** Das Ziel ist bei Stärkewürfen im Vorteil, und seine Tragkraft verdoppelt sich.

***Anmut der Katze.*** Das Ziel ist bei Geschicklichkeitswürfen im Vorteil. Außerdem erleidet es bei einem Sturz aus 6 m Höhe oder weniger keinen Schaden, sofern es nicht kampfunfähig ist.

***Glanz des Adlers.*** Das Ziel ist bei Charismawürfen im Vorteil.

***Gerissenheit des Fuchses.*** Das Ziel ist bei Intelligenzwürfen im Vorteil.

***Weisheit der Eule.*** Das Ziel ist bei Weisheitswürfen im Vorteil.`,
    higher: HIGHER_TARGET,
    material: 'Fell oder eine Feder eines Tiers.',
  },
  'enlarge-reduce': {
    text: `Du lässt eine Kreatur oder einen Gegenstand, den du in Reichweite sehen kannst, für die Wirkungsdauer größer oder kleiner werden. Wähle entweder eine Kreatur oder einen Gegenstand, den niemand trägt oder hält. Ist das Ziel nicht bereitwillig, kann es einen Konstitutionsrettungswurf ablegen. Bei einem Erfolg wirkt der Zauber nicht.

Ist das Ziel eine Kreatur, ändert sich die Größe von allem, was sie trägt und hält, mit ihr. Ein Gegenstand, den eine betroffene Kreatur fallen lässt, nimmt sofort wieder seine normale Größe an.

***Vergrößern.*** Die Größe des Ziels verdoppelt sich in allen Dimensionen, und sein Gewicht verachtfacht sich. Dieses Wachstum erhöht seine Größe um eine Kategorie – zum Beispiel von mittelgroß zu groß. Ist nicht genug Platz, damit das Ziel seine Größe verdoppeln kann, erreicht die Kreatur oder der Gegenstand die größtmögliche Größe im verfügbaren Raum. Bis der Zauber endet, ist das Ziel außerdem bei Stärkewürfen und Stärkerettungswürfen im Vorteil. Auch die Waffen des Ziels wachsen auf seine neue Größe an. Solange diese Waffen vergrößert sind, verursachen die Angriffe des Ziels mit ihnen zusätzlich 1W4 Schaden.

***Verkleinern.*** Die Größe des Ziels halbiert sich in allen Dimensionen, und sein Gewicht sinkt auf ein Achtel des normalen. Diese Verkleinerung verringert seine Größe um eine Kategorie – zum Beispiel von mittelgroß zu klein. Bis der Zauber endet, ist das Ziel außerdem bei Stärkewürfen und Stärkerettungswürfen im Nachteil. Auch die Waffen des Ziels schrumpfen auf seine neue Größe. Solange diese Waffen verkleinert sind, verursachen die Angriffe des Ziels mit ihnen 1W4 weniger Schaden (dadurch kann der Schaden nicht unter 1 sinken).`,
    material: 'Eine Prise Eisenpulver.',
  },
  enthrall: {
    text: `Du spinnst einen ablenkenden Wortschwall, woraufhin Kreaturen deiner Wahl, die du in Reichweite sehen kannst und die dich hören können, einen Weisheitsrettungswurf ablegen müssen. Jede Kreatur, die nicht bezaubert werden kann, besteht diesen Rettungswurf automatisch, und kämpfst du oder kämpfen deine Gefährten gegen eine Kreatur, ist sie beim Rettungswurf im Vorteil. Bei einem misslungenen Rettungswurf ist das Ziel bei Weisheitswürfen (Wahrnehmung), um andere Kreaturen als dich wahrzunehmen, im Nachteil, bis der Zauber endet oder das Ziel dich nicht mehr hören kann. Der Zauber endet, wenn du kampfunfähig bist oder nicht mehr sprechen kannst.`,
  },
  'find-steed': {
    text: `Du beschwörst einen Geist, der die Gestalt eines ungewöhnlich klugen, starken und treuen Reittiers annimmt, und gehst ein dauerhaftes Band mit ihm ein. Das Reittier erscheint in einem freien Bereich in Reichweite und nimmt eine Gestalt deiner Wahl an, etwa ein Schlachtross, ein Pony, ein Kamel, einen Elch oder eine Dogge. (Dein SL erlaubt vielleicht, auch andere Tiere als Reittiere zu beschwören.) Das Reittier hat die Spielwerte der gewählten Gestalt, ist aber statt seiner normalen Art ein Himmlischer, ein Feenwesen oder ein Unhold (deine Wahl). Hat dein Reittier eine Intelligenz von 5 oder weniger, steigt sie außerdem auf 6, und es erhält die Fähigkeit, eine Sprache deiner Wahl zu verstehen, die du sprichst.

Dein Reittier dient dir im Kampf und außerhalb als Reittier, und du hast ein instinktives Band mit ihm, das euch als nahtlose Einheit kämpfen lässt. Solange du auf deinem Reittier sitzt, kannst du jeden Zauber, den du wirkst und der nur dich zum Ziel hat, auch auf dein Reittier wirken lassen.

Fällt das Reittier auf 0 Trefferpunkte, verschwindet es und hinterlässt keine körperliche Gestalt. Du kannst dein Reittier auch jederzeit als Aktion entlassen, woraufhin es verschwindet. In beiden Fällen beschwört ein erneutes Wirken dieses Zaubers dasselbe Reittier, mit vollen Trefferpunkten.

Solange dein Reittier höchstens 1,5 km von dir entfernt ist, kannst du telepathisch mit ihm kommunizieren.

Du kannst nicht mehr als ein durch diesen Zauber gebundenes Reittier gleichzeitig haben. Als Aktion kannst du das Reittier jederzeit aus seinem Band entlassen, woraufhin es verschwindet.`,
  },
  'find-traps': {
    text: `Du spürst die Anwesenheit jeder Falle in Reichweite, die sich in deiner Sichtlinie befindet. Eine Falle im Sinne dieses Zaubers ist alles, was eine plötzliche oder unerwartete Wirkung hervorrufen würde, die du als schädlich oder unerwünscht ansiehst, und von seinem Erschaffer gezielt so beabsichtigt war. Der Zauber würde also einen von *Alarm* betroffenen Bereich, eine *Schutzglyphe* oder eine mechanische Fallgrube spüren, aber keine natürliche Schwachstelle im Boden, eine einsturzgefährdete Decke oder ein verborgenes Erdloch enthüllen.

Dieser Zauber enthüllt nur, dass eine Falle vorhanden ist. Du erfährst nicht, wo sich jede Falle befindet, aber du erfährst die allgemeine Art der Gefahr, die von einer gespürten Falle ausgeht.`,
  },
  'flame-blade': {
    text: `Du rufst eine feurige Klinge in deiner freien Hand hervor. Die Klinge ähnelt in Größe und Form einem Krummsäbel und bleibt für die Wirkungsdauer bestehen. Lässt du die Klinge los, verschwindet sie, doch du kannst sie als Bonusaktion erneut hervorrufen.

Du kannst deine Aktion nutzen, um mit der feurigen Klinge einen Nahkampf-Zauberangriff auszuführen. Bei einem Treffer erleidet das Ziel 3W6 Feuerschaden.

Die flammende Klinge spendet in einem Radius von 3 m helles Licht und weitere 3 m dämmriges Licht.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Schaden für je zwei Grade über dem 2. um 1W6.`,
    material: 'Ein Sumachblatt.',
  },
  'flaming-sphere': {
    text: `Eine Feuerkugel mit 1,5 m Durchmesser erscheint in einem freien Bereich deiner Wahl in Reichweite und bleibt für die Wirkungsdauer bestehen. Jede Kreatur, die ihren Zug im Umkreis von 1,5 m um die Kugel beendet, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet die Kreatur 2W6 Feuerschaden, bei einem erfolgreichen die Hälfte.

Als Bonusaktion kannst du die Kugel bis zu 9 m weit bewegen. Rammst du die Kugel in eine Kreatur, muss diese den Rettungswurf gegen den Schaden der Kugel ablegen, und die Kugel bewegt sich in diesem Zug nicht weiter.

Wenn du die Kugel bewegst, kannst du sie über Hindernisse von bis zu 1,5 m Höhe lenken und über Gruben von bis zu 3 m Breite springen lassen. Die Kugel entzündet brennbare Gegenstände, die nicht getragen oder gehalten werden, und spendet in einem Radius von 6 m helles Licht und weitere 6 m dämmriges Licht.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 2. um 1W6.`,
    material: 'Ein Stück Talg, eine Prise Schwefel und eine Spur Eisenpulver.',
  },
  'gentle-repose': {
    text: `Du berührst eine Leiche oder andere sterbliche Überreste. Für die Wirkungsdauer ist das Ziel vor Verwesung geschützt und kann nicht zum Untoten werden.

Der Zauber verlängert außerdem praktisch die Frist, in der das Ziel von den Toten erweckt werden kann, denn Tage unter dem Einfluss dieses Zaubers zählen nicht gegen die Frist von Zaubern wie *Tote erwecken*.`,
    material:
      'Eine Prise Salz und je eine Kupfermünze auf jedem Auge der Leiche, die für die Wirkungsdauer dort bleiben müssen.',
  },
  'gust-of-wind': {
    text: `Eine Linie starken Windes, 18 m lang und 3 m breit, bläst für die Wirkungsdauer in eine Richtung deiner Wahl von dir aus. Jede Kreatur, die ihren Zug in der Linie beginnt, muss einen Stärkerettungswurf bestehen, sonst wird sie entlang der Linie 4,5 m von dir weggestoßen.

Jede Kreatur in der Linie muss für jeden Meter, den sie sich auf dich zubewegt, 2 m Bewegung aufwenden.

Der Windstoß zerstreut Gas oder Dampf und löscht Kerzen, Fackeln und ähnliche ungeschützte Flammen im Bereich. Geschützte Flammen, etwa die von Laternen, flackern wild und erlöschen mit einer Wahrscheinlichkeit von 50 Prozent.

Als Bonusaktion in jedem deiner Züge vor dem Ende des Zaubers kannst du die Richtung ändern, in die die Linie von dir aus bläst.`,
    material: 'Ein Hülsenfruchtsamen.',
  },
  'heat-metal': {
    text: `Wähle einen hergestellten Gegenstand aus Metall, etwa eine Metallwaffe oder eine schwere oder mittelschwere Rüstung aus Metall, den du in Reichweite sehen kannst. Du lässt den Gegenstand rot glühen. Jede Kreatur, die den Gegenstand körperlich berührt, erleidet beim Wirken des Zaubers 2W8 Feuerschaden. Bis der Zauber endet, kannst du in jedem deiner folgenden Züge eine Bonusaktion nutzen, um diesen Schaden erneut zu verursachen.

Hält oder trägt eine Kreatur den Gegenstand und erleidet sie den Schaden durch ihn, muss sie einen Konstitutionsrettungswurf bestehen, sonst lässt sie den Gegenstand fallen, wenn sie kann. Lässt sie ihn nicht fallen, ist sie bis zum Beginn deines nächsten Zuges bei Angriffswürfen und Attributswürfen im Nachteil.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 2. um 1W8.`,
    material: 'Ein Stück Eisen und eine Flamme.',
  },
  'hold-person': {
    text: `Wähle einen Humanoiden, den du in Reichweite sehen kannst. Das Ziel muss einen Weisheitsrettungswurf bestehen, sonst ist es für die Wirkungsdauer gelähmt. Am Ende jedes seiner Züge kann das Ziel einen weiteren Weisheitsrettungswurf ablegen. Bei einem Erfolg endet der Zauber für das Ziel.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, kannst du für jeden Grad über dem 2. einen zusätzlichen Humanoiden als Ziel wählen. Die Humanoiden dürfen höchstens 9 m voneinander entfernt sein, wenn du sie als Ziel wählst.`,
    material: 'Ein kleines, gerades Stück Eisen.',
  },
  invisibility: {
    text: `Eine Kreatur, die du berührst, wird unsichtbar, bis der Zauber endet. Alles, was das Ziel trägt oder hält, ist unsichtbar, solange es sich am Körper des Ziels befindet. Der Zauber endet für ein Ziel, das angreift oder einen Zauber wirkt.`,
    higher: HIGHER_TARGET,
    material: 'Eine in Gummiarabikum eingeschlossene Wimper.',
  },
  knock: {
    text: `Wähle einen Gegenstand, den du in Reichweite sehen kannst. Der Gegenstand kann eine Tür, eine Kiste, eine Truhe, ein Satz Handschellen, ein Vorhängeschloss oder ein anderer Gegenstand sein, der eine gewöhnliche oder magische Vorrichtung enthält, die den Zugang verhindert.

Ein Ziel, das durch ein gewöhnliches Schloss verschlossen, verklemmt oder verriegelt ist, wird aufgeschlossen, gelöst oder entriegelt. Hat der Gegenstand mehrere Schlösser, wird nur eines davon geöffnet.

Wählst du ein Ziel, das durch *Arkanes Schloss* verschlossen ist, wird dieser Zauber für 10 Minuten unterdrückt; während dieser Zeit kann das Ziel normal geöffnet und geschlossen werden.

Wenn du den Zauber wirkst, geht vom Zielgegenstand ein lautes Klopfen aus, das noch in 90 m Entfernung zu hören ist.`,
  },
  'lesser-restoration': {
    text: `Du berührst eine Kreatur und kannst entweder eine Krankheit oder einen Zustand beenden, der sie plagt. Der Zustand kann blind, taub, gelähmt oder vergiftet sein.`,
  },
  levitate: {
    text: `Eine Kreatur oder ein Gegenstand deiner Wahl, den du in Reichweite sehen kannst, steigt senkrecht bis zu 6 m in die Höhe und schwebt dort für die Wirkungsdauer. Der Zauber kann ein Ziel mit einem Gewicht von bis zu 250 kg schweben lassen. Eine nicht bereitwillige Kreatur, die einen Konstitutionsrettungswurf besteht, ist nicht betroffen.

Das Ziel kann sich nur bewegen, indem es sich an einem festen Gegenstand oder einer Fläche in Reichweite (etwa einer Wand oder einer Decke) abstößt oder heranzieht, wodurch es sich bewegen kann, als würde es klettern. In deinem Zug kannst du die Höhe des Ziels um bis zu 6 m in beide Richtungen ändern. Bist du selbst das Ziel, kannst du dich als Teil deiner Bewegung auf- oder abwärts bewegen. Andernfalls kannst du deine Aktion nutzen, um das Ziel zu bewegen, das in der Reichweite des Zaubers bleiben muss.

Wenn der Zauber endet, schwebt das Ziel sanft zu Boden, falls es sich noch in der Luft befindet.`,
    material:
      'Entweder eine kleine Lederschlaufe oder ein Stück Golddraht, zu einem Becher mit langem Stiel gebogen.',
  },
  'locate-animals-or-plants': {
    text: `Beschreibe oder benenne eine bestimmte Art von Tier oder Pflanze. Indem du dich auf die Stimme der Natur in deiner Umgebung konzentrierst, erfährst du Richtung und Entfernung zur nächsten Kreatur oder Pflanze dieser Art im Umkreis von 7,5 km, falls eine vorhanden ist.`,
    material: 'Ein Büschel Fell eines Bluthunds.',
  },
  'locate-object': {
    text: `Beschreibe oder benenne einen Gegenstand, der dir vertraut ist. Du spürst die Richtung zum Ort des Gegenstands, solange er höchstens 300 m von dir entfernt ist. Bewegt sich der Gegenstand, kennst du die Richtung seiner Bewegung.

Der Zauber kann einen bestimmten, dir bekannten Gegenstand aufspüren, sofern du ihn mindestens einmal aus der Nähe – höchstens 9 m – gesehen hast. Alternativ kann der Zauber den nächstgelegenen Gegenstand einer bestimmten Art aufspüren, etwa eine bestimmte Art von Kleidung, Schmuck, Möbelstück, Werkzeug oder Waffe.

Dieser Zauber kann einen Gegenstand nicht aufspüren, wenn Blei in beliebiger Dicke, auch eine dünne Platte, den direkten Weg zwischen dir und dem Gegenstand versperrt.`,
    material: 'Ein gegabelter Zweig.',
  },
  'magic-mouth': {
    text: `Du pflanzt einem Gegenstand in Reichweite eine Botschaft ein, die ausgesprochen wird, wenn eine auslösende Bedingung eintritt. Wähle einen Gegenstand, den du sehen kannst und den keine andere Kreatur trägt oder hält. Sprich dann die Botschaft, die höchstens 25 Wörter umfassen darf, deren Vortrag aber bis zu 10 Minuten dauern kann. Lege schließlich die Umstände fest, die den Zauber auslösen, damit er deine Botschaft überbringt.

Treten diese Umstände ein, erscheint ein magischer Mund auf dem Gegenstand und spricht die Botschaft mit deiner Stimme und im selben Tonfall, in dem du sie eingepflanzt hast. Hat der gewählte Gegenstand einen Mund oder etwas, das einem Mund ähnelt, etwa den Mund einer Statue, erscheint der magische Mund dort, sodass die Worte scheinbar aus dem Mund des Gegenstands kommen.

Wenn du diesen Zauber wirkst, kannst du festlegen, dass er endet, sobald die Botschaft überbracht ist, oder dass er bestehen bleibt und seine Botschaft jedes Mal wiederholt, wenn die Umstände eintreten.

Die auslösenden Umstände können so allgemein oder so genau sein, wie du willst, müssen aber auf sichtbaren oder hörbaren Bedingungen beruhen, die im Umkreis von 9 m um den Gegenstand eintreten. Du könntest den Mund zum Beispiel anweisen zu sprechen, sobald sich eine Kreatur dem Gegenstand auf 9 m nähert oder im Umkreis von 9 m eine Silberglocke läutet.`,
    material:
      'Eine kleine Honigwabe und Jadestaub im Wert von mindestens 10 GM, die der Zauber verbraucht.',
  },
  'magic-weapon': {
    text: `Du berührst eine nichtmagische Waffe. Bis der Zauber endet, wird diese Waffe zu einer magischen Waffe mit einem Bonus von +1 auf Angriffs- und Schadenswürfe.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 4. Grades oder höher wirkst, steigt der Bonus auf +2. Nutzt du einen Zauberplatz des 6. Grades oder höher, steigt der Bonus auf +3.`,
  },
  'mirror-image': {
    text: `Drei illusionäre Doppelgänger von dir erscheinen in deinem Bereich. Bis der Zauber endet, bewegen sich die Doppelgänger mit dir und ahmen deine Handlungen nach, wobei sie ständig die Position wechseln, sodass man unmöglich verfolgen kann, welches Bild echt ist. Du kannst deine Aktion nutzen, um die Doppelgänger zu entlassen.

Jedes Mal, wenn eine Kreatur dich während der Wirkungsdauer mit einem Angriff zum Ziel nimmt, wirf einen W20, um zu bestimmen, ob der Angriff stattdessen einen deiner Doppelgänger trifft.

Hast du drei Doppelgänger, musst du eine 6 oder mehr werfen, um das Ziel des Angriffs auf einen Doppelgänger zu lenken. Mit zwei Doppelgängern brauchst du eine 8 oder mehr, mit einem eine 11 oder mehr.

Die RK eines Doppelgängers beträgt 10 + deinen Geschicklichkeitsmodifikator. Trifft ein Angriff einen Doppelgänger, wird er zerstört. Ein Doppelgänger kann nur durch einen Angriff zerstört werden, der ihn trifft. Allen anderen Schaden und alle anderen Wirkungen ignoriert er. Der Zauber endet, wenn alle drei Doppelgänger zerstört sind.

Eine Kreatur ist von diesem Zauber nicht betroffen, wenn sie nicht sehen kann, sich auf andere Sinne als die Sicht verlässt, etwa Blindsicht, oder Illusionen als falsch erkennen kann, etwa durch Wahrsicht.`,
  },
  'misty-step': {
    text: `Kurz von silbrigem Nebel umhüllt, teleportierst du dich bis zu 9 m weit in einen freien Bereich, den du sehen kannst.`,
  },
  moonbeam: {
    text: `Ein silbriger Strahl fahlen Lichts scheint in einem Zylinder mit 1,5 m Radius und 12 m Höhe herab, dessen Mittelpunkt ein Punkt in Reichweite ist. Bis der Zauber endet, füllt dämmriges Licht den Zylinder.

Betritt eine Kreatur den Bereich des Zaubers in einem Zug zum ersten Mal oder beginnt sie ihren Zug dort, wird sie von geisterhaften Flammen erfasst, die sengenden Schmerz verursachen, und muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet sie 2W10 gleißenden Schaden, bei einem erfolgreichen die Hälfte.

Ein Gestaltwandler legt seinen Rettungswurf mit Nachteil ab. Misslingt er, nimmt der Gestaltwandler außerdem sofort wieder seine ursprüngliche Gestalt an und kann keine andere Gestalt annehmen, bis er das Licht des Zaubers verlässt.

In jedem deiner Züge nach dem Wirken dieses Zaubers kannst du eine Aktion nutzen, um den Strahl 18 m weit in eine beliebige Richtung zu bewegen.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 2. um 1W10.`,
    material: 'Einige Samen einer Mondsamenpflanze und ein Stück opalisierender Feldspat.',
  },
  'pass-without-trace': {
    text: `Ein Schleier aus Schatten und Stille geht von dir aus und verbirgt dich und deine Gefährten vor Entdeckung. Für die Wirkungsdauer erhält jede Kreatur deiner Wahl im Umkreis von 9 m um dich (einschließlich dir) einen Bonus von +10 auf Geschicklichkeitswürfe (Heimlichkeit) und kann nur mit magischen Mitteln verfolgt werden. Eine Kreatur, die diesen Bonus erhält, hinterlässt keine Spuren oder anderen Hinweise auf ihren Weg.`,
    material: 'Asche eines verbrannten Mistelblatts und ein Fichtenzweig.',
  },
  'prayer-of-healing': {
    text: `Bis zu sechs Kreaturen deiner Wahl, die du in Reichweite sehen kannst, erhalten jeweils Trefferpunkte in Höhe von 2W8 + deinem Zauberattributsmodifikator zurück. Dieser Zauber wirkt nicht auf Untote oder Konstrukte.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt die Heilung für jeden Grad über dem 2. um 1W8.`,
  },
  'protection-from-poison': {
    text: `Du berührst eine Kreatur. Ist sie vergiftet, neutralisierst du das Gift. Plagt das Ziel mehr als ein Gift, neutralisierst du ein Gift, von dem du weißt, dass es vorhanden ist, oder ein zufälliges.

Für die Wirkungsdauer ist das Ziel bei Rettungswürfen gegen Vergiftung im Vorteil und hat Resistenz gegen Giftschaden.`,
  },
  'ray-of-enfeeblement': {
    text: `Ein schwarzer Strahl entkräftender Energie schießt aus deinem Finger auf eine Kreatur in Reichweite zu. Führe einen Fernkampf-Zauberangriff gegen das Ziel aus. Bei einem Treffer verursacht das Ziel mit Waffenangriffen, die Stärke nutzen, nur halben Schaden, bis der Zauber endet.

Am Ende jedes seiner Züge kann das Ziel einen Konstitutionsrettungswurf gegen den Zauber ablegen. Bei einem Erfolg endet der Zauber.`,
  },
  'rope-trick': {
    text: `Du berührst ein Seil von bis zu 18 m Länge. Ein Ende des Seils steigt in die Luft, bis das ganze Seil senkrecht zum Boden hängt. Am oberen Ende des Seils öffnet sich ein unsichtbarer Eingang zu einem extradimensionalen Raum, der bis zum Ende des Zaubers bestehen bleibt.

Den extradimensionalen Raum erreicht man, indem man das Seil hinaufklettert. Der Raum fasst bis zu acht mittelgroße oder kleinere Kreaturen. Das Seil kann in den Raum hochgezogen werden, sodass es außerhalb des Raums nicht mehr zu sehen ist.

Angriffe und Zauber können den Eingang in den extradimensionalen Raum oder aus ihm heraus nicht durchqueren, doch wer sich darin befindet, kann hinaussehen wie durch ein Fenster von 90 cm mal 1,5 m, dessen Mittelpunkt das Seil ist.

Alles, was sich im extradimensionalen Raum befindet, fällt heraus, wenn der Zauber endet.`,
    material: 'Pulverisierter Maisextrakt und eine verdrehte Pergamentschlaufe.',
  },
  'scorching-ray': {
    text: `Du erschaffst drei Feuerstrahlen und schleuderst sie auf Ziele in Reichweite. Du kannst sie auf ein Ziel oder auf mehrere schleudern.

Führe für jeden Strahl einen Fernkampf-Zauberangriff aus. Bei einem Treffer erleidet das Ziel 2W6 Feuerschaden.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, erschaffst du für jeden Grad über dem 2. einen zusätzlichen Strahl.`,
  },
  'see-invisibility': {
    text: `Für die Wirkungsdauer siehst du unsichtbare Kreaturen und Gegenstände, als wären sie sichtbar, und du kannst in die Ätherebene sehen. Ätherische Gegenstände und Kreaturen erscheinen geisterhaft durchscheinend.`,
    material: 'Eine Prise Talk und eine kleine Menge Silberpulver.',
  },
  shatter: {
    text: `Ein plötzlicher, schmerzhaft durchdringender Klang bricht von einem Punkt deiner Wahl in Reichweite hervor. Jede Kreatur in einer Kugel mit 3 m Radius, deren Mittelpunkt dieser Punkt ist, muss einen Konstitutionsrettungswurf ablegen. Bei einem misslungenen Rettungswurf erleidet eine Kreatur 3W8 Schallschaden, bei einem erfolgreichen die Hälfte. Eine Kreatur aus anorganischem Material wie Stein, Kristall oder Metall ist bei diesem Rettungswurf im Nachteil.

Ein nichtmagischer Gegenstand, den niemand trägt oder hält, erleidet ebenfalls den Schaden, wenn er sich im Bereich des Zaubers befindet.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden für jeden Grad über dem 2. um 1W8.`,
    material: 'Ein Splitter Glimmer.',
  },
  silence: {
    text: `Für die Wirkungsdauer kann in einer Kugel mit 6 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist, kein Geräusch entstehen oder sie durchdringen. Jede Kreatur und jeder Gegenstand, die sich vollständig in der Kugel befinden, sind immun gegen Schallschaden, und Kreaturen sind taub, solange sie sich vollständig darin befinden.

Einen Zauber mit verbaler Komponente zu wirken, ist dort unmöglich.`,
  },
  'spider-climb': {
    text: `Bis der Zauber endet, erhält eine bereitwillige Kreatur, die du berührst, die Fähigkeit, sich an senkrechten Flächen auf, ab und seitwärts sowie kopfüber an Decken zu bewegen, wobei ihre Hände frei bleiben. Außerdem erhält das Ziel eine Kletterbewegungsrate in Höhe seiner Bewegungsrate zu Fuß.`,
    material: 'Ein Tropfen Bitumen und eine Spinne.',
  },
  'spike-growth': {
    text: `Der Boden in einem Radius von 6 m um einen Punkt in Reichweite verdreht sich und lässt harte Stacheln und Dornen sprießen. Der Bereich wird für die Wirkungsdauer zu schwierigem Gelände. Bewegt sich eine Kreatur in den Bereich hinein oder darin, erleidet sie für je 1,5 m, die sie zurücklegt, 2W4 Stichschaden.

Die Veränderung des Bodens ist so getarnt, dass sie natürlich aussieht. Jede Kreatur, die den Bereich beim Wirken des Zaubers nicht sehen kann, kann einen Weisheitswurf (Wahrnehmung) gegen deinen Zauberrettungswurf-SG ablegen, um das Gelände vor dem Betreten als gefährlich zu erkennen.`,
    material: 'Sieben spitze Dornen oder sieben kleine, angespitzte Zweige.',
  },
  'spiritual-weapon': {
    text: `Du erschaffst in Reichweite eine schwebende, geisterhafte Waffe, die für die Wirkungsdauer bestehen bleibt oder bis du diesen Zauber erneut wirkst. Wenn du den Zauber wirkst, kannst du einen Nahkampf-Zauberangriff gegen eine Kreatur im Umkreis von 1,5 m um die Waffe ausführen. Bei einem Treffer erleidet das Ziel Energieschaden in Höhe von 1W8 + deinem Zauberattributsmodifikator.

Als Bonusaktion in deinem Zug kannst du die Waffe bis zu 6 m weit bewegen und den Angriff gegen eine Kreatur im Umkreis von 1,5 m um sie wiederholen.

Die Waffe kann jede Form annehmen, die du wählst. Kleriker von Gottheiten, die mit einer bestimmten Waffe verbunden sind (wie der heilige Cuthbert mit seinem Streitkolben oder Thor mit seinem Hammer), lassen die Wirkung dieses Zaubers dieser Waffe ähneln.`,
    higher: `Wenn du diesen Zauber mit einem Zauberplatz des 3. Grades oder höher wirkst, steigt der Schaden für je zwei Grade über dem 2. um 1W8.`,
  },
  suggestion: {
    text: `Du schlägst eine Handlung vor (beschränkt auf ein oder zwei Sätze) und beeinflusst auf magische Weise eine Kreatur, die du in Reichweite sehen kannst und die dich hören und verstehen kann. Kreaturen, die nicht bezaubert werden können, sind gegen diese Wirkung immun. Der Vorschlag muss so formuliert sein, dass die Handlung vernünftig klingt. Die Kreatur aufzufordern, sich selbst zu erstechen, sich in einen Speer zu stürzen, sich anzuzünden oder eine andere offensichtlich schädliche Tat zu begehen, beendet den Zauber.

Das Ziel muss einen Weisheitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf verfolgt es die beschriebene Handlung nach besten Kräften. Die vorgeschlagene Handlung kann die gesamte Wirkungsdauer andauern. Kann die vorgeschlagene Tätigkeit in kürzerer Zeit erledigt werden, endet der Zauber, sobald das Ziel getan hat, worum es gebeten wurde.

Du kannst auch Bedingungen festlegen, die während der Wirkungsdauer eine besondere Tätigkeit auslösen. Du könntest zum Beispiel vorschlagen, dass eine Ritterin ihr Schlachtross dem ersten Bettler schenkt, dem sie begegnet. Tritt die Bedingung nicht ein, bevor der Zauber endet, wird die Tätigkeit nicht ausgeführt.

Fügst du oder einer deiner Gefährten dem Ziel Schaden zu, endet der Zauber.`,
    material: 'Eine Schlangenzunge und entweder ein Stück Honigwabe oder ein Tropfen süßes Öl.',
  },
  'warding-bond': {
    text: `Dieser Zauber schützt eine bereitwillige Kreatur, die du berührst, und erschafft bis zum Ende des Zaubers eine mystische Verbindung zwischen dir und dem Ziel. Solange das Ziel höchstens 18 m von dir entfernt ist, erhält es einen Bonus von +1 auf die RK und auf Rettungswürfe und hat Resistenz gegen jeglichen Schaden. Außerdem erleidest du jedes Mal, wenn es Schaden erleidet, denselben Schaden.

Der Zauber endet, wenn du auf 0 Trefferpunkte fällst oder du und das Ziel mehr als 18 m voneinander getrennt werdet.

Er endet auch, wenn der Zauber erneut auf eine der verbundenen Kreaturen gewirkt wird. Du kannst den Zauber auch als Aktion beenden.`,
    material:
      'Ein Paar Platinringe im Wert von je mindestens 50 GM, die du und das Ziel für die Wirkungsdauer tragen müsst.',
  },
  web: {
    text: `Du beschwörst an einem Punkt deiner Wahl in Reichweite eine Masse dicker, klebriger Spinnweben. Die Netze füllen für die Wirkungsdauer einen Würfel mit 6 m Kantenlänge, der von diesem Punkt ausgeht. Die Netze sind schwieriges Gelände und verschleiern ihren Bereich leicht.

Sind die Netze nicht zwischen zwei festen Massen (etwa Wänden oder Bäumen) verankert oder über einen Boden, eine Wand oder eine Decke gespannt, fällt das beschworene Netz in sich zusammen, und der Zauber endet zu Beginn deines nächsten Zuges. Über eine ebene Fläche gespannte Netze sind 1,5 m dick.

Jede Kreatur, die ihren Zug in den Netzen beginnt oder sie während ihres Zuges betritt, muss einen Geschicklichkeitsrettungswurf ablegen. Bei einem misslungenen Rettungswurf ist die Kreatur festgesetzt, solange sie in den Netzen bleibt oder bis sie sich befreit.

Eine von den Netzen festgesetzte Kreatur kann ihre Aktion nutzen, um einen Stärkewurf gegen deinen Zauberrettungswurf-SG abzulegen. Gelingt er, ist sie nicht mehr festgesetzt.

Die Netze sind brennbar. Jeder Würfel mit 1,5 m Kantenlänge aus Netzen, der Feuer ausgesetzt ist, verbrennt in 1 Runde und verursacht bei jeder Kreatur, die ihren Zug im Feuer beginnt, 2W4 Feuerschaden.`,
    material: 'Ein Stück Spinnennetz.',
  },
  'zone-of-truth': {
    text: `Du erschaffst eine magische Zone, die vor Täuschung schützt, in einer Kugel mit 4,5 m Radius, deren Mittelpunkt ein Punkt deiner Wahl in Reichweite ist. Bis der Zauber endet, muss eine Kreatur, die den Bereich des Zaubers in einem Zug zum ersten Mal betritt oder ihren Zug dort beginnt, einen Charismarettungswurf ablegen. Bei einem misslungenen Rettungswurf kann eine Kreatur im Radius keine bewusste Lüge aussprechen. Du weißt, ob jede Kreatur ihren Rettungswurf besteht oder nicht.

Eine betroffene Kreatur weiß von dem Zauber und kann daher vermeiden, Fragen zu beantworten, auf die sie normalerweise mit einer Lüge antworten würde. Eine solche Kreatur kann in ihren Antworten ausweichend bleiben, solange sie innerhalb der Grenzen der Wahrheit bleibt.`,
  },
};
