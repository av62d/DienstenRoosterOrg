# Functie-inventaris Apps Script

Bron: actuele code in `\\wsl.localhost\Ubuntu\home\avliet\projects\dienstenrooster-origineel`.

- Scriptbestanden: 11
- Functiedeclaraties: 194
- Functies op bestandsniveau: 181
- Lokale hulpfuncties: 13

De regelnummers horen bij de geïnventariseerde versie. Een standaardwaarde staat achter het betreffende argument. Functies zonder argumenten zijn aangeduid met **geen**.

## BH_Beheer.js

Aantal: 19

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `bhControleerProjectConfiguratie` | Bestandsniveau | geen | Controleert project configuratie. | 11 |
| `bhSpreadsheetSpecificatie` | Bestandsniveau | geen | Retourneert de verwachte werkbladen en benoemde bereiken. | 45 |
| `bhVoorpaginaKolomspecificatie` | Bestandsniveau | geen | Retourneert de definitieve namen, volgorde, aliassen en validatietypen van Voorpagina. | 130 |
| `bhMaakVoorpaginaKolomindex` | Bestandsniveau | `sheet` – Spreadsheet-werkbladobject | Maakt voorpagina kolomindex. | 267 |
| `bhZoekVoorpaginaKolom` | Bestandsniveau | `cols` – kolom of kolomindex<br>`name` – invoerwaarde | Zoekt voorpagina kolom. | 285 |
| `bhMaakDienstVanRij` | Bestandsniveau | `row` – rij of rijgegevens<br>`cols` – kolom of kolomindex | Maakt dienst van rij. | 292 |
| `bhMigreerVoorpagina` | Bestandsniveau | geen | Maakt een backup en zet Voorpagina om naar de afgesproken kolommen en volgorde. | 304 |
| `bhHerstelDraaitabelbronnen` | Bestandsniveau | `showMessage` – invoerwaarde | Verwerkt herstel draaitabelbronnen. | 384 |
| `bhLeesGroep` | Lokale helper | `group` – invoerwaarde | Leest groep binnen de bovenliggende functie. | 389 |
| `bhVoegGroepToe` | Lokale helper | `pivot` – invoerwaarde<br>`group` – invoerwaarde<br>`isRowGroup` – rij of rijgegevens | Voegt groep toe binnen de bovenliggende functie. | 398 |
| `bhStelVoorpaginaValidatiesIn` | Bestandsniveau | `showMessage` – invoerwaarde | Stelt het HA-selectievakje en de ja/nee-keuzes voor de dienstkolommen in. | 490 |
| `bhHerberekenVoorpagina` | Bestandsniveau | `showMessage` – invoerwaarde<br>`firstRow` – tekst of waarde<br>`rowCount` – aantal<br>`calcDate` – datum of begindatum<br>`calcCollection` – kolom of kolomindex | Berekent Maand en Kwartaal uit Datum en CollecteCategorie uit Lijst Collectes. | 534 |
| `bhBijWijzigingVoorpagina` | Bestandsniveau | `e` – Apps Script-gebeurtenisobject | Herberekent afgeleide Voorpagina-kolommen na wijziging van Datum of Collecte. | 603 |
| `bhConfiguratieSpecificatie` | Bestandsniveau | geen | Retourneert de toegestane configuratiesleutels, aliassen, categorieën en toelichtingen. | 623 |
| `bhSchoonConfiguratieOp` | Bestandsniveau | geen | Verwijdert ongebruikte instellingen en bouwt Configuratie opnieuw logisch op. | 743 |
| `bhMigreerConfiguratie` | Bestandsniveau | `showMessage` – invoerwaarde | Migreert configuratie. | 833 |
| `bhBepaalDocumentId` | Bestandsniveau | `value` – tekst of waarde | Bepaalt document id. | 901 |
| `bhControleerSpreadsheet` | Bestandsniveau | geen | Controleert spreadsheet. | 924 |
| `bhInitialiseerSpreadsheet` | Bestandsniveau | geen | Initialiseert spreadsheet. | 1011 |

## CM_Communicatie.js

Aantal: 55

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `cmVerzendRooster` | Bestandsniveau | geen | Verzendt rooster. | 8 |
| `cmVerzendRoosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject<br>`reportWeeks` – week of aantal weken; standaard: `6`<br>`reportMonths` – maand of aantal maanden; standaard: `6`<br>`confirmAddress` – invoerwaarde | Verzendt rooster naar lijst. | 11 |
| `cmVerzendEmail` | Bestandsniveau | `source` – invoerwaarde<br>`subject` – invoerwaarde<br>`options` – invoerwaarde | Verzendt HTML-mail naar een lijst, afzonderlijk of als BCC, met optionele bevestiging. | 52 |
| `cmLeesEmailadressen` | Bestandsniveau | `source` – invoerwaarde | Leest emailadressen. | 96 |
| `cmMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element. | 107 |
| `cmVoegLijstItemToe` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe. | 110 |
| `cmEscapeHtml` | Bestandsniveau | `value` – tekst of waarde | Verwerkt escape html. | 115 |
| `cmIsJaWaarde` | Bestandsniveau | `value` – tekst of waarde | Verwerkt is ja waarde. | 118 |
| `cmIsNeeWaarde` | Bestandsniveau | `value` – tekst of waarde | Verwerkt is nee waarde. | 121 |
| `cmMaakDienstvelden` | Bestandsniveau | `selection` – invoerwaarde<br>`index` – invoerwaarde | Maakt dienstvelden. | 126 |
| `cmMaakHtmlDienstenrapport` | Bestandsniveau | `selection` – invoerwaarde<br>`count` – aantal | Maakt html dienstenrapport. | 145 |
| `cmMaakTekstDienstenrapport` | Bestandsniveau | `selection` – invoerwaarde<br>`count` – aantal | Maakt tekst dienstenrapport. | 167 |
| `cmMaakHtmlWeekrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Bouwt een HTML-weekrapport voor de opgegeven periode. | 187 |
| `cmNormaliseerPlaceholder` | Bestandsniveau | `name` – invoerwaarde | Normaliseert placeholder. | 193 |
| `cmMaakTemplateWaarde` | Bestandsniveau | `text` – tekst of waarde<br>`html` – invoerwaarde | Maakt template waarde. | 198 |
| `cmMaakTemplateVariabelen` | Bestandsniveau | `selection` – invoerwaarde<br>`index` – invoerwaarde<br>`extras` – invoerwaarde | Maakt template variabelen. | 207 |
| `cmBepaalAantalDienstenUitTemplate` | Bestandsniveau | `text` – tekst of waarde | Bepaalt aantal diensten uit template. | 246 |
| `cmSelecteerKomendeDiensten` | Bestandsniveau | `count` – aantal<br>`startDate` – datum of begindatum | Selecteert komende diensten. | 257 |
| `cmMaakTesttemplateVariabelen` | Bestandsniveau | `selection` – invoerwaarde | Maakt testtemplate variabelen. | 269 |
| `cmVerzendTesttemplate` | Bestandsniveau | geen | Verzendt testtemplate. | 295 |
| `cmVervangHtmlTemplate` | Bestandsniveau | `html` – invoerwaarde<br>`vars` – invoerwaarde<br>`selection` – invoerwaarde | Verwerkt vervang html template. | 315 |
| `cmVervangDocumentTemplate` | Bestandsniveau | `document` – invoerwaarde<br>`vars` – invoerwaarde<br>`selection` – invoerwaarde | Verwerkt vervang document template. | 333 |
| `cmExporteerDocumentNaarHtml` | Bestandsniveau | `documentId` – Google Document-ID | Exporteert document naar html. | 363 |
| `cmVerzendTemplate` | Bestandsniveau | geen | Verzendt template. | 373 |
| `cmVerzendTemplateNaarLijst` | Bestandsniveau | `emailListSheetName` – naam van het werkblad<br>`confirmAddress` – invoerwaarde | Verzendt template naar lijst. | 376 |
| `cmVerzendMededelingen` | Bestandsniveau | geen | Verzendt mededelingen. | 426 |
| `cmVerzendMededelingenVolgendeWeek` | Bestandsniveau | geen | Verzendt mededelingen volgende week. | 429 |
| `cmLeesDocumenttekst` | Bestandsniveau | `document` – invoerwaarde | Leest documenttekst. | 434 |
| `cmMaakMededelingenMetadata` | Bestandsniveau | `selection` – invoerwaarde | Maakt mededelingen metadata. | 443 |
| `cmBereidMededelingenVoor` | Bestandsniveau | `nextWeek` – week of aantal weken | Verwerkt bereid mededelingen voor. | 458 |
| `cmMaakMededelingenVariabelen` | Bestandsniveau | `selection` – invoerwaarde<br>`subject` – invoerwaarde<br>`liturgy` – invoerwaarde<br>`editUrl` – URL of link | Maakt mededelingen variabelen. | 480 |
| `cmMaakMededelingenBijlage` | Bestandsniveau | `prepared` – invoerwaarde | Maakt mededelingen bijlage. | 494 |
| `cmVerzendMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s)<br>`nextWeek` – week of aantal weken | Maakt mededelingen vanuit template en agenda en verzendt het resultaat naar een adres. | 517 |
| `cmZoekEersteDienstIndex` | Bestandsniveau | `selection` – invoerwaarde | Zoekt eerste dienst index. | 528 |
| `cmMaakDocumentkopie` | Bestandsniveau | `templateId` – Google Document-ID<br>`documentName` – invoerwaarde | Maakt documentkopie. | 531 |
| `cmLeesLiturgieUitAgenda` | Bestandsniveau | `calendarName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Leest liturgie uit agenda. | 535 |
| `cmExporteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID<br>`fileName` – invoerwaarde | Exporteert document naar docx. | 542 |
| `cmVerzendMjMededelingen` | Bestandsniveau | geen | Verzendt mj mededelingen. | 557 |
| `cmMaakMjHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt mj html element. | 560 |
| `cmHaalGebeurtenissenUitAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Haalt gebeurtenissen uit agenda. | 563 |
| `cmFormatteerGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert gebeurtenissen. | 569 |
| `cmFormatteerEersteGebeurtenisVolledig` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert eerste gebeurtenis volledig. | 580 |
| `cmVerzendMjMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt mj mededelingen naar adres. | 585 |
| `cmVerzendLiemersActiviteiten` | Bestandsniveau | geen | Verzendt liemers activiteiten. | 630 |
| `cmMaakLiemersHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt liemers html element. | 633 |
| `cmLeesAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Leest agenda. | 636 |
| `cmFormatteerLiemersGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert liemers gebeurtenissen. | 642 |
| `cmVerzendLiemersActiviteitenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt liemers activiteiten naar adres. | 658 |
| `cmVerzendLijstKerkdiensten` | Bestandsniveau | `emailTo` – ontvanger(s); standaard: `crLeesConfiguratie("Mailinglijst - Kerkdiensten")` | Verzendt lijst kerkdiensten. | 699 |
| `cmMaakHtmlLijstrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Maakt html lijstrapport. | 724 |
| `cmMaakHtmlElement` | Lokale helper | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 746 |
| `cmVoegLijstItemToe` | Lokale helper | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe binnen de bovenliggende functie. | 749 |
| `cmVerzendLectorrooster` | Bestandsniveau | geen | Verzendt lectorrooster. | 826 |
| `cmVerzendLectorroosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject<br>`confirmAddress` – invoerwaarde | Verzendt lectorrooster naar lijst. | 829 |
| `cmGenereerLectorroosterLijst` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Genereert lectorrooster lijst. | 864 |

## CR_Core.js

Aantal: 31

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `crMaakOfLeegWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad | Maakt of leeg werkblad. | 11 |
| `crNormaliseerKolomnaam` | Bestandsniveau | `name` – invoerwaarde | Normaliseert kolomnaam. | 27 |
| `crMaakKolomindex` | Bestandsniveau | `sheet` – Spreadsheet-werkbladobject<br>`headerRow` – rij of rijgegevens | Leest een kopregel en maakt een naam-naar-kolomindexobject. | 32 |
| `crZoekKolom` | Bestandsniveau | `cols` – kolom of kolomindex<br>`name` – invoerwaarde<br>`required` – invoerwaarde | Zoekt een nulgebaseerde kolomindex op genormaliseerde kopnaam. | 51 |
| `crLeesAlleConfiguratie` | Bestandsniveau | geen | Leest alle configuratie. | 61 |
| `crWisConfiguratieCache` | Bestandsniveau | geen | Verwerkt wis configuratie cache. | 81 |
| `crLeesConfiguratie` | Bestandsniveau | `key` – invoerwaarde<br>`defaultValue` – tekst of waarde | Leest configuratie. | 84 |
| `crStartMeting` | Bestandsniveau | geen | Verwerkt start meting. | 94 |
| `crEindMeting` | Bestandsniveau | `name` – invoerwaarde<br>`startTime` – tijd<br>`details` – invoerwaarde | Verwerkt eind meting. | 99 |
| `crLeesWerkbladInhoud` | Bestandsniveau | `argSheetName` – naam van het werkblad<br>`argA1Position` – invoerwaarde | Leest werkblad inhoud. | 108 |
| `crFormatteerDatum` | Bestandsniveau | `date` – datum of begindatum<br>`formaat` – uitvoerformaat | Formatteert een datum centraal volgens een alias of expliciet patroon. | 158 |
| `crVoegTekstToeIndienGevuld` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt tekst toe indien gevuld. | 215 |
| `crVoegTekstToe` | Bestandsniveau | `data` – invoerwaarde<br>`start` – invoerwaarde<br>`count` – aantal | Voegt tekst toe. | 218 |
| `crBepaalDatumVanWeeknummer` | Bestandsniveau | `wantWeekDay` – week of aantal weken<br>`wantWeekNumber` – week of aantal weken | Bepaalt datum van weeknummer. | 234 |
| `crLogFoutopsporing` | Bestandsniveau | `arg` – invoerwaarde | Logt foutopsporing. | 245 |
| `crBepaalBeginVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van maand. | 249 |
| `crZetOpBeginVanDag` | Bestandsniveau | `argDate` – datum of begindatum | Zet op begin van dag. | 259 |
| `crMaakBegindatumVanMaand` | Bestandsniveau | `month` – maand of aantal maanden<br>`curYear` – jaar; standaard: `2026` | Maakt begindatum van maand. | 267 |
| `crBepaalEindeVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van maand. | 278 |
| `crBepaalBeginVanJaar` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Bepaalt begin van jaar. | 289 |
| `crBepaalEindeVanJaar` | Bestandsniveau | geen | Bepaalt einde van jaar. | 300 |
| `crBepaalWeeknummer` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt weeknummer. | 310 |
| `crBepaalBegindatumVanWeeknummer` | Bestandsniveau | `argWeekNum` – week of aantal weken | Bepaalt begindatum van weeknummer. | 314 |
| `crBepaalBeginVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van week. | 319 |
| `crBepaalEindeVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van week. | 329 |
| `crTelDagenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`daysOffset` – dag of aantal dagen | Telt dagen bij datum op. | 339 |
| `crTelWekenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`weeksOffset` – week of aantal weken | Telt weken bij datum op. | 346 |
| `crTelMaandenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`monthsOffset` – maand of aantal maanden<br>`maxMonth` – maand of aantal maanden; standaard: `12` | Telt maanden bij datum op. | 353 |
| `crBepaalVolgendeZondag` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt volgende zondag. | 368 |
| `crZetTijdOpBeginVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op begin van dag. | 378 |
| `crZetTijdOpEindeVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op einde van dag. | 387 |

## EX_Export.js

Aantal: 6

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `exConverteerWerkbladNaarXlsx` | Bestandsniveau | `sheetName` – naam van het werkblad | Converteert werkblad naar xlsx. | 6 |
| `exConverteerWerkbladNaarPdf` | Bestandsniveau | `sheetName` – naam van het werkblad | Converteert werkblad naar pdf. | 9 |
| `exExporteerWerkblad` | Bestandsniveau | `sheetName` – naam van het werkblad<br>`formaat` – uitvoerformaat | Exporteert één werkblad naar het gekozen bestandsformaat. | 14 |
| `exMaakJaarroosterXlsx` | Bestandsniveau | `curYear` – jaar; standaard: `new Date().getFullYear()` | Maakt jaarrooster xlsx. | 53 |
| `exMaakRoosterXlsx` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster xlsx. | 59 |
| `exVerzendJaarroosterXlsx` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster xlsx. | 138 |

## KA_Kalender.js

Aantal: 2

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `kaZetGebeurtenissenInAgenda` | Bestandsniveau | geen | Zet gebeurtenissen in agenda. | 6 |
| `kaLeesAgenda` | Bestandsniveau | `reportSheet` – Spreadsheet-werkbladobject | Leest agenda. | 60 |

## MN_Menu.js

Aantal: 3

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `onOpen` | Apps Script-entrypoint | `e` – Apps Script-gebeurtenisobject | Apps Script-entrypoint; bouwt het menu wanneer de spreadsheet wordt geopend. | 7 |
| `onEdit` | Apps Script-entrypoint | `e` – Apps Script-gebeurtenisobject | Apps Script-entrypoint; verwerkt wijzigingen op Voorpagina. | 12 |
| `mnBijOpenen` | Bestandsniveau | geen | Bouwt het volledige menu Dienstenrooster met alle submenu’s en opdrachten. | 15 |

## OP_Opmaak.js

Aantal: 6

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `opPasKleurenToeOpWaarde` | Bestandsniveau | `sourceSheet` – Spreadsheet-werkbladobject<br>`destinationSheet` – Spreadsheet-werkbladobject<br>`startCol` – kolom of kolomindex; standaard: `0`<br>`endCol` – kolom of kolomindex; standaard: `0` | Kopieert kleuren op basis van overeenkomende waarden tussen twee werkbladen. | 23 |
| `opGenereerOnderscheidendeKleurenVerticaal` | Bestandsniveau | `count` – aantal<br>`sheetName` – naam van het werkblad | Genereert onderscheidende kleuren verticaal. | 86 |
| `opConverteerHslNaarHex` | Bestandsniveau | `hue` – kleurwaarde of kleurcomponent<br>`s` – kleurwaarde of kleurcomponent<br>`l` – kleurwaarde of kleurcomponent | Converteert hsl naar hex. | 137 |
| `opConverteerRgbNaarHex` | Bestandsniveau | `r` – kleurwaarde of kleurcomponent<br>`g` – kleurwaarde of kleurcomponent<br>`b` – kleurwaarde of kleurcomponent | Converteert rgb naar hex. | 176 |
| `opBepaalContrasterendeTekstkleur` | Bestandsniveau | `hexColor` – kleurwaarde of kleurcomponent<br>`hue` – kleurwaarde of kleurcomponent | Bepaalt contrasterende tekstkleur. | 187 |
| `opStelAchtergrondkleurenIn` | Bestandsniveau | geen | Stelt achtergrondkleuren in. | 208 |

## Obsolete.js

Aantal: 23

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `cmVerzendRoosterbericht` | Bestandsniveau | geen | Verzendt roosterbericht. | 10 |
| `cmMaakUrlLink` | Bestandsniveau | `url` – URL of link<br>`text` – tekst of waarde | Maakt url link. | 26 |
| `cmVerzendDienstenlijst` | Bestandsniveau | geen | Verzendt dienstenlijst. | 29 |
| `cmMaakRoosterbericht` | Bestandsniveau | geen | Maakt roosterbericht. | 37 |
| `cmVerzendLectorBericht` | Bestandsniveau | geen | Verzendt lector bericht. | 46 |
| `cmMaakLectorrooster` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum<br>`rptSheetName` – naam van het werkblad; standaard: `"Lectorrooster"`<br>`rptTitle` – titel; standaard: `"Lectorrooster"` | Bouwt en formatteert het werkblad met het lectorrooster. | 62 |
| `cmBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 72 |
| `cmMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 77 |
| `crHaalWerkbladOp` | Bestandsniveau | `argSheetName` – naam van het werkblad | Haalt werkblad op. | 223 |
| `exConverteerDocumentNaarPdf` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar pdf. | 229 |
| `exConverteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar docx. | 240 |
| `exConverteerDocumentNaarXlsx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar xlsx. | 251 |
| `exMaakHalfjaarroosterXlsx` | Bestandsniveau | geen | Maakt halfjaarrooster xlsx. | 262 |
| `opBepaalKleurtype` | Bestandsniveau | `type` – invoerwaarde<br>`color` – kleurwaarde of kleurcomponent | Bepaalt kleurtype. | 269 |
| `rsSelecteerCriteria` | Bestandsniveau | geen | Selecteert criteria. | 290 |
| `rsMaakMaandRooster` | Bestandsniveau | `argDate` – datum of begindatum; standaard: `new Date()`<br>`argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""` | Maakt maand rooster. | 299 |
| `rsBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 319 |
| `rsBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 324 |
| `rsMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde<br>`fontWeight` – invoerwaarde; standaard: `"bold"`<br>`horizontalAlignment` – invoerwaarde; standaard: `"center"`<br>`verticalAlignment` – invoerwaarde; standaard: `"middle"` | Maakt laatste rij op binnen de bovenliggende functie. | 329 |
| `rsVoegTabelrijMetEenKolomToe` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Voegt tabelrij met een kolom toe. | 499 |
| `ytVerzendLaatsteVideos` | Bestandsniveau | geen | Verzendt laatste videos. | 505 |
| `ytMaakUploadWerkblad` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Maakt upload werkblad. | 514 |
| `ytWerkVideoBij` | Bestandsniveau | geen | Werkt video bij. | 532 |

## RS_Rooster.js

Aantal: 20

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `rsSelecteerGegevens` | Bestandsniveau | `argStartDate` – datum of begindatum; standaard: `new Date()`<br>`argEndDate` – einddatum; standaard: `new Date()` | Leest Voorpagina op kolomnaam en retourneert roostergegevens binnen een datumperiode. | 11 |
| `rsMaakRoosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladnaam. | 128 |
| `rsMaakRoosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladtitel. | 143 |
| `rsMaakRoosterWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkblad. | 161 |
| `rsVoegRapportRijToe` | Lokale helper | `values` – tekst of waarde<br>`type` – invoerwaarde<br>`background` – invoerwaarde<br>`liturgicalColor` – kleurwaarde of kleurcomponent | Voegt rapport rij toe binnen de bovenliggende functie. | 178 |
| `rsMaakMaandroosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladnaam. | 262 |
| `rsMaakMaandroosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladtitel. | 266 |
| `rsVerwijderAlleRoosters` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verwijdert alle roosters. | 273 |
| `rsVerwijderWerkbladenMetVoorvoegsel` | Bestandsniveau | `prefix` – voorvoegsel | Verwijdert werkbladen met voorvoegsel. | 284 |
| `rsMaakJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster. | 300 |
| `rsMaakHalfjaarrooster1` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster1. | 303 |
| `rsMaakHalfjaarrooster2` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster2. | 323 |
| `rsMaakJaarroosterNaam` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster naam. | 343 |
| `rsVerzendJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster. | 346 |
| `rsStelTabelkolommenIn` | Bestandsniveau | `tableRow` – rij of rijgegevens | Stelt tabelkolommen in. | 377 |
| `rsMaakHtmlElementen` | Bestandsniveau | `tag` – HTML-tag<br>`tableRow` – rij of rijgegevens | Maakt html elementen. | 380 |
| `rsMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Maakt html element. | 387 |
| `rsMaakHtmlElementMetOptie` | Bestandsniveau | `tag` – HTML-tag<br>`opt` – invoerwaarde<br>`val` – tekst of waarde | Maakt html element met optie. | 390 |
| `rsVoegTabelrijToe` | Bestandsniveau | `tag` – HTML-tag<br>`hdrRow` – rij of rijgegevens | Voegt tabelrij toe. | 393 |
| `rsMaakHtmlRooster` | Bestandsniveau | `rptStartDate` – datum of begindatum; standaard: `crZetOpBeginVanDag()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt html rooster. | 399 |

## TS_Test.js

Aantal: 21

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `tsTestVertaalDatum` | Bestandsniveau | geen | Test vertaal datum. | 6 |
| `tsTestOpmaak` | Bestandsniveau | geen | Test opmaak. | 12 |
| `tsTestMaakRooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Test maak rooster. | 29 |
| `tsTestHtmlRooster` | Bestandsniveau | geen | Test html rooster. | 37 |
| `tsTestVerzendRooster` | Bestandsniveau | geen | Test verzend rooster. | 51 |
| `tsTestMaakHtmlWeekrapport` | Bestandsniveau | geen | Test maak html weekrapport. | 62 |
| `tsTestVerzendTemplate` | Bestandsniveau | geen | Test verzend template. | 70 |
| `tsVerzendTesttemplate` | Bestandsniveau | geen | Verzendt testtemplate. | 75 |
| `tsTestVerzendMededelingen` | Bestandsniveau | geen | Test verzend mededelingen. | 78 |
| `tsTestVerzendMjMededelingen` | Bestandsniveau | geen | Test verzend mj mededelingen. | 81 |
| `tsTestVerzendLiemersActiviteiten` | Bestandsniveau | geen | Test verzend liemers activiteiten. | 84 |
| `tsTestConversie` | Bestandsniveau | geen | Test conversie. | 87 |
| `tsTestVerzendLectorrooster` | Bestandsniveau | geen | Test verzend lectorrooster. | 96 |
| `tsLeesTestmailadressen` | Bestandsniveau | geen | Leest testmailadressen. | 101 |
| `tsEersteTestmailadres` | Bestandsniveau | geen | Verwerkt eerste testmailadres. | 108 |
| `tsTestAgenda` | Bestandsniveau | geen | Test agenda. | 111 |
| `tsTestMaakUitzending` | Bestandsniveau | geen | Test maak uitzending. | 115 |
| `tsTestBereikbaarheid` | Bestandsniveau | geen | Test bereikbaarheid. | 122 |
| `tsTestOphalen` | Bestandsniveau | geen | Test ophalen. | 127 |
| `tsTestKleurwerkblad` | Bestandsniveau | geen | Test kleurwerkblad. | 159 |
| `tsTestGenereerKleuren` | Bestandsniveau | geen | Test genereer kleuren. | 164 |

## YT_YouTube.js

Aantal: 8

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `ytMaakUploadLijst` | Bestandsniveau | `n` – aantal; standaard: `4` | Maakt upload lijst. | 6 |
| `ytMaakHtmlElement` | Lokale helper | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 8 |
| `ytMaakHtmlLink` | Lokale helper | `link` – URL of link<br>`text` – tekst of waarde | Maakt html link binnen de bovenliggende functie. | 11 |
| `ytHaalMijnUploadsOp` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Haalt mijn uploads op. | 27 |
| `ytLaad` | Lokale helper | `rptSheet` – Spreadsheet-werkbladobject<br>`details` – invoerwaarde<br>`results` – invoerwaarde | Lokale helper voor laad. | 36 |
| `ytMaakYouTubeUitzending` | Bestandsniveau | `title` – titel<br>`date` – datum of begindatum<br>`time` – tijd | Maakt een geplande YouTube-live-uitzending. | 77 |
| `ytMaakLivestream` | Bestandsniveau | `title` – titel | Maakt livestream. | 112 |
| `ytKoppelUitzending` | Bestandsniveau | `broadcastId` – YouTube-broadcast-ID<br>`streamId` – YouTube-stream-ID | Koppelt een YouTube-uitzending aan een livestream. | 134 |
