# Apps Script-architectuur

Het project bestaat uit tien actieve scriptmodules en één archiefmodule. Iedere functie begint met de
tweeletterprefix van de module waarin zij staat.

| Bestand | Prefix | Verantwoordelijkheid |
|---|---|---|
| `MN_Menu.js` | `mn` | Menu-opbouw en publieke menu-entrypoints |
| `CR_Core.js` | `cr` | Algemene helpers, instellingen en datumbewerkingen |
| `RS_Rooster.js` | `rs` | Selectie, HTML-roosters en roosteropbouw |
| `CM_Communicatie.js` | `cm` | E-mail, mededelingen en lectorcommunicatie |
| `EX_Export.js` | `ex` | XLSX-, PDF- en documentexport |
| `KA_Kalender.js` | `ka` | Google Agenda en agendasamenvattingen |
| `YT_YouTube.js` | `yt` | YouTube-integratie |
| `OP_Opmaak.js` | `op` | Kleuren en spreadsheetopmaak |
| `BH_Beheer.js` | `bh` | Controle en niet-destructieve initialisatie |
| `TS_Test.js` | `ts` | Handmatig uitvoerbare testfuncties |
| `Obsolete.js` | divers | Tijdelijk archief van niet actief aangeroepen functies; oorspronkelijke prefixes blijven behouden |

## Configuratie

Alle instelbare waarden staan in het werkblad `Configuratie`, geordend als
`Categorie`, `Instelling`, `Waarde` en `Toelichting`. Productiecode leest deze
waarden uitsluitend via `crLeesConfiguratie`.

Mailtemplates worden opgeslagen als Google Document-ID, niet als bestandsnaam.
Daardoor is de koppeling niet afhankelijk van unieke of onveranderde namen in
Google Drive.

## Uitzondering

`onOpen` heeft bewust geen prefix. Google Apps Script herkent een eenvoudige
open-trigger uitsluitend onder deze exacte naam. De functie bevat alleen een
doorschakeling naar `mnBijOpenen`.

## Menu

`mnBijOpenen` bouwt één hoofdmenu `Dienstenrooster` met de onderdelen
`Roosters`, `Verzenden`, `Agenda en opmaak`, `Beheer` en `Testen`.

## Mailtemplates

Alle templategestuurde mails gebruiken de centrale functies
`cmMaakTemplateVariabelen`, `cmVervangHtmlTemplate` en
`cmVervangDocumentTemplate`. De volledige template blijft de basis van de
uitvoer; placeholders zijn hoofdletterongevoelig en worden overal vervangen.
`@gegevens <n>@` voegt een verticaal overzicht van de eerstvolgende `n`
diensten toe. Onbekende placeholders blokkeren verzending. De beschikbare
variabelen en template-afspraken staan in `MAILTEMPLATES.md`.

Dynamische HTML-fragmenten worden uitsluitend opgebouwd met de centrale
`cmMaakHtml...`-functies in `CM_Communicatie.js`. Gewone tekst loopt daarbij via
`cmEscapeHtml` of `cmMaakHtmlTekstelement`; samengestelde, reeds veilige
fragmenten worden met `cmMaakHtmlElement`, `cmMaakHtmlLijst` en
`cmMaakHtmlLink` gecombineerd. Hierdoor gebruiken communicatie, roosters en
YouTube-lijsten dezelfde escaping, attribuutverwerking en tagopbouw.

## Datumformattering

Alle zichtbare datumuitvoer loopt via `crFormatteerDatum` en een benoemde waarde
uit `crDatumFormaat`, bijvoorbeeld `DATUM_LANG`, `DATUM_KORT`, `MAAND_JAAR` of
`SORTEERDATUM`. Vrije patronen en cryptische aliassen zijn niet toegestaan in
aanroepende code. De onderliggende patronen staan uitsluitend in
`crDatumPatronen`; maand- en weekdagformatters worden voor `nl-NL` en de
scripttijdzone hergebruikt.

Technische protocollen blijven afzonderlijk herkenbaar. Zo gebruikt de
YouTube-integratie rechtstreeks RFC3339 en gebruikt de weeknummerberekening een
technische kalendernotatie; dit zijn geen zichtbare rapportformaten.

## Prestatie-afspraken

- `crLeesAlleConfiguratie` leest Configuratie maximaal eenmaal per uitvoering;
  `crLeesConfiguratie` gebruikt daarna de in-memory cache.
- `bhBijWijzigingVoorpagina` verwerkt alleen de gewijzigde rijen en alleen de
  afleidingen van Datum, Collecte of Heilig Avondmaal die geraakt zijn.
- `opStelAchtergrondkleurenIn` leest en schrijft alle achtergrondkleuren in
  één batch.
- `rsSelecteerGegevens` retourneert een object met benoemde gegevensvelden;
  afnemers zijn daardoor niet afhankelijk van arrayposities.
- `rsMaakRoosterWerkblad` en `exMaakRoosterXlsx` bouwen hun uitvoer eerst in
  geheugen op en schrijven waarden en kleuren vervolgens batchgewijs.
- De centrale helpers `crStartMeting` en `crEindMeting` loggen uitvoeringstijd
  en omvang voor vergelijking in het Apps Script-uitvoeringslogboek.

## Kolommen op Voorpagina

`bhVoorpaginaKolomspecificatie` is de enige bron voor de 25 Voorpagina-kolommen.
Iedere kolom heeft daarin een vaste technische `naam`, een leesbare `titel`, een
`type`, eventuele oude `aliases` en, voor afgeleide kolommen, een `bron`.

Productiecode gebruikt uitsluitend de vaste namen uit `bhFrontCol`.
`bhMaakVoorpaginaKolomindex` koppelt de zichtbare titels en eventuele oude
kopteksten aan deze namen. `bhMaakDienstVanRij` zet vervolgens een fysieke rij
om in een dienstobject met benoemde velden, bijvoorbeeld `dienst.Datum`,
`dienst.NaamZondag` en `dienst.HeiligAvondmaal`. De zichtbare titel of fysieke
volgorde is daardoor niet meer bepalend voor het uitlezen van roostergegevens.

`bhMigreerVoorpagina` is een tijdelijke, eenmalige beheerfunctie. Zij maakt
eerst een backupwerkblad, zet de 25 behouden kolommen in de afgesproken
volgorde, vervangt oude koppen door de leesbare titels, maakt `Heilig Avondmaal`
als selectievakje en `Koffiedienst`/`Dienst in Didam` als ja/nee-keuzelijsten en bouwt
de berekende kolommen `Kwartaal`, `Maand` en `CollecteCategorie` opnieuw op.

## Centrale adressentabel

`bhAdressenKolomspecificatie` bepaalt de vaste volgorde van `Naam`,
`Sorteernaam`, `Email`, `Telefoon` en alle groeps- en taakkolommen. Alle
groeps- en taakkolommen zijn selectievakjes. `bhWerkAdressenBij` maakt eerst een
backup, voegt dubbele personen samen, combineert de oude velden `Ouderling` en
`Diaken` tot `Ambtsdrager`, hernoemt `Koffiezetter` naar `Koffie` en importeert
de bestaande benoemde taaklijsten. De voorgangerslijst wordt niet geïmporteerd.

`Sorteernaam` wordt met `bhMaakSorteernaam` uit `Naam` berekend. De eenvoudige
`onEdit`-trigger werkt deze waarde ook bij wanneer een naam later wordt gewijzigd.

## Beheerfuncties

- `bhControleerSpreadsheet`: controleert de vaste werkbladen, benoemde bereiken
  en tijdzones zonder wijzigingen aan te brengen.
- `bhInitialiseerSpreadsheet`: maakt uitsluitend ontbrekende werkbladen en
  benoemde bereiken. Bestaande inhoud en opmaak blijven intact.
- `bhControleerProjectConfiguratie`: rapporteert geïnstalleerde triggers en
  online projectconfiguratie.
- `bhMigreerConfiguratie`: hernoemt `Instellingen` naar `Configuratie` en zet
  bestaande templatebestandsnamen om naar document-ID's.
- `bhSchoonConfiguratieOp`: behoudt alleen werkelijk gebruikte instellingen,
  migreert oude sleutelnamen en bouwt de vaste, logisch gegroepeerde tabel op.
- `bhWerkAdressenBij`: maakt een backup en migreert Adressen naar het vaste
  centrale personen- en takenschema.
- `bhMigreerVoorpagina`: maakt een backup en migreert Voorpagina eenmalig naar
  de nieuwe, naamgestuurde kolomstructuur.
- `bhControleerEnHerberekenVoorpagina`: herstelt de keuzevalidaties, berekent
  Maand, Kwartaal en CollecteCategorie opnieuw en synchroniseert de tekst
  `Heilig Avondmaal` in Bijzonderheden met het bijbehorende selectievakje.
- `bhHerstelDraaitabelbronnen`: bouwt draaitabellen met een verkeerde of
  onleesbare bron opnieuw op dezelfde ankercel op, met behoud van uitleesbare
  groepen, waarden, filters en weergave-instellingen en met `Voorpagina` als
  bron. Bij berekende draaitabelwaarden stopt de functie vóór wijziging.

## Naamgeving en commentaar

- Functienamen zijn Nederlands en beginnen, behalve verplichte Apps
  Script-entrypoints, met de tweeletterige moduleprefix.
- Namen van argumenten, lokale variabelen en modulevariabelen zijn kort,
  betekenisvol, Engels en geschreven in `camelCase`.
- Werkbladnamen, kolomtitels, configuratiesleutels en templateplaceholders zijn
  domeingegevens en worden daarom niet als variabelenaam vertaald.
- Uitgeschakelde code blijft niet als commentaar staan; versiegeschiedenis hoort
  in Git. Commentaar beschrijft bedoeling, randvoorwaarden en niet-obvious
  stappen, vooral bij migraties en functies met meerdere gegevensbronnen.

## Centrale e-mailverzending

Alle actieve e-mailfuncties roepen `cmVerzendEmail` aan; alleen deze functie
gebruikt rechtstreeks `MailApp.sendEmail`. De opties ondersteunen:

- `individual`: één afzonderlijke mail per ontvanger;
- `together`: één mail met alle ontvangers in `To`;
- `bcc`: één mail met de ontvangers in BCC en een verplicht zichtbaar adres;
- optionele HTML, platte tekst, afzendernaam, bijlagen en verzendbevestiging.

Ontvangers mogen als werkbladnaam, kommagescheiden tekst of bestaande lijst
worden aangeleverd. De centrale functie normaliseert en valideert ze vóórdat de
eerste mail wordt verzonden.
