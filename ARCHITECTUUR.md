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
- `bhBijWijzigingVoorpagina` herberekent alleen de gewijzigde rijen en alleen
  de afgeleide kolommen waarvan de bron is gewijzigd.
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

Productiecode gebruikt uitsluitend de vaste namen uit `bhVoorpaginaKolom`.
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
- `bhMigreerVoorpagina`: maakt een backup en migreert Voorpagina eenmalig naar
  de nieuwe, naamgestuurde kolomstructuur.
- `bhHerstelDraaitabelbronnen`: bouwt draaitabellen met een verkeerde of
  onleesbare bron opnieuw op dezelfde ankercel op, met behoud van uitleesbare
  groepen, waarden, filters en weergave-instellingen en met `Voorpagina` als
  bron. Bij berekende draaitabelwaarden stopt de functie vóór wijziging.
