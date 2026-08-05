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

Alle datumuitvoer loopt via `crFormatteerDatum`. De functie ondersteunt zowel
korte betekenisvolle patronen (`DMT`, `DM`, `MJ`, `sort`) als expliciete tokens
zoals `EEEE d MMMM yyyy HH:mm`. Maand- en weekdagformatters worden per
landinstelling en tijdzone hergebruikt.

## Kolommen op Voorpagina

Productiecode zoekt kolommen uitsluitend op basis van de kopnaam in rij 1 via
`crMaakKolomindex` en `crZoekKolom`. De fysieke volgorde van de kolommen is
daarom niet meer bepalend voor het uitlezen van roostergegevens.

`bhMigreerVoorpagina` is een tijdelijke, eenmalige beheerfunctie. Zij maakt
eerst een backupwerkblad, zet de 25 behouden kolommen in de afgesproken
volgorde, hernoemt oude koppen, maakt `HA` als selectievakje en
`KoffieDienst`/`DidamDienst` als ja/nee-keuzelijsten en bouwt
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
