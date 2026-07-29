# Apps Script-architectuur

Het project bestaat uit tien scriptmodules. Iedere functie begint met de
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

## Configuratie

Alle instelbare waarden staan in het werkblad `Configuratie`, met de sleutel in
kolom A en de waarde in kolom B. Productiecode leest deze waarden uitsluitend via
`crLeesConfiguratie`.

Mailtemplates worden opgeslagen als Google Document-ID, niet als bestandsnaam.
Daardoor is de koppeling niet afhankelijk van unieke of onveranderde namen in
Google Drive.

## Uitzondering

`onOpen` heeft bewust geen prefix. Google Apps Script herkent een eenvoudige
open-trigger uitsluitend onder deze exacte naam. De functie bevat alleen een
doorschakeling naar `mnOnOpen`.

## Beheerfuncties

- `bhControleerSpreadsheet`: controleert de vaste werkbladen, benoemde bereiken
  en tijdzones zonder wijzigingen aan te brengen.
- `bhInitialiseerSpreadsheet`: maakt uitsluitend ontbrekende werkbladen en
  benoemde bereiken. Bestaande inhoud en opmaak blijven intact.
- `bhControleerProjectConfiguratie`: rapporteert geïnstalleerde triggers en
  online projectconfiguratie.
- `bhMigreerConfiguratie`: hernoemt `Instellingen` naar `Configuratie` en zet
  bestaande templatebestandsnamen om naar document-ID's.
