# Functie-inventaris Apps Script

Bron: actuele code in `/home/avliet/projects/dienstenrooster-origineel`.

- Scriptbestanden: 10
- Functiedeclaraties: 170
- Functies op bestandsniveau: 148
- Lokale hulpfuncties: 22

De regelnummers horen bij de geïnventariseerde versie. Een standaardwaarde staat achter het betreffende argument. Functies zonder argumenten zijn aangeduid met **geen**.

## BH_Beheer.js

Aantal: 13

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `bhControleerProjectConfiguratie` | Bestandsniveau | geen | Controleert project configuratie. | 12 |
| `bhSpreadsheetSpecificatie` | Bestandsniveau | geen | Retourneert de verwachte werkbladen en benoemde bereiken. | 75 |
| `bhVoorpaginaKolomspecificatie` | Bestandsniveau | geen | Retourneert de definitieve namen, volgorde, aliassen en validatietypen van Voorpagina. | 115 |
| `bhMigreerVoorpagina` | Bestandsniveau | geen | Maakt een backup en zet Voorpagina om naar de afgesproken kolommen en volgorde. | 149 |
| `bhStelVoorpaginaValidatiesIn` | Bestandsniveau | `toonMelding` – of na afloop een melding wordt getoond | Stelt het HA-selectievakje en de ja/nee-keuzes voor de dienstkolommen in. | 230 |
| `bhHerberekenVoorpagina` | Bestandsniveau | `toonMelding` – of na afloop een melding wordt getoond | Berekent Maand en Kwartaal uit Datum en CollecteCategorie uit Lijst Collectes. | 267 |
| `bhBijWijzigingVoorpagina` | Bestandsniveau | `e` – Apps Script-gebeurtenisobject | Herberekent afgeleide Voorpagina-kolommen na wijziging van Datum of Collecte. | 325 |
| `bhConfiguratieSpecificatie` | Bestandsniveau | geen | Retourneert de toegestane configuratiesleutels, aliassen, categorieën en toelichtingen. | 342 |
| `bhSchoonConfiguratieOp` | Bestandsniveau | geen | Verwijdert ongebruikte instellingen en bouwt Configuratie opnieuw logisch op. | 378 |
| `bhMigreerConfiguratie` | Bestandsniveau | `toonMelding` – of na afloop een melding wordt getoond | Migreert configuratie. | 475 |
| `bhBepaalDocumentId` | Bestandsniveau | `waarde` – tekst of waarde | Bepaalt document id. | 533 |
| `bhControleerSpreadsheet` | Bestandsniveau | geen | Controleert spreadsheet. | 557 |
| `bhInitialiseerSpreadsheet` | Bestandsniveau | geen | Initialiseert spreadsheet. | 611 |

## CM_Communicatie.js

Aantal: 46

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `cmVerzendRoosterbericht` | Bestandsniveau | geen | Verzendt roosterbericht. | 10 |
| `cmVerzendRooster` | Bestandsniveau | geen | Verzendt rooster. | 38 |
| `cmVerzendRoosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Test")`<br>`num_weeks_in_report` – week of aantal weken; standaard: `6`<br>`num_months_in_report` – maand of aantal maanden; standaard: `6` | Verzendt rooster naar lijst. | 43 |
| `cmVerzendEmail` | Bestandsniveau | `emailTo_list` – lijst met e-mailadressen<br>`emailSubject` – onderwerpregel<br>`emailName` – afzendernaam<br>`emailHtmlBody` – HTML-inhoud<br>`emailConfirmationTo` – instelling of tekst voor bevestiging<br>`emailConfirmationMsg` – instelling of tekst voor bevestiging<br>`emailAsBcc` – of BCC-verzending wordt gebruikt | Verzendt HTML-mail naar een lijst, afzonderlijk of als BCC, met optionele bevestiging. | 103 |
| `cmMaakUrlLink` | Bestandsniveau | `url` – URL of link<br>`tekst` – tekst of waarde | Maakt url link. | 160 |
| `cmMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element. | 165 |
| `cmVoegLijstItemToe` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe. | 170 |
| `cmMaakHtmlWeekrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Bouwt een HTML-weekrapport voor de opgegeven periode. | 178 |
| `cmVerzendDienstenlijst` | Bestandsniveau | geen | Verzendt dienstenlijst. | 247 |
| `cmVerzendTemplate` | Bestandsniveau | geen | Verzendt template. | 254 |
| `cmVerzendTemplateNaarLijst` | Bestandsniveau | `emailListSheetName` – naam van het werkblad; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Test")` | Verzendt template naar lijst. | 259 |
| `cmMaakHtmlElement` | Lokale helper | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 318 |
| `cmMaakHtmlElementIndienGevuld` | Lokale helper | `tg` – HTML-tag<br>`pfx` – voorvoegsel<br>`str` – tekst of waarde | Maakt html element indien gevuld binnen de bovenliggende functie. | 321 |
| `cmMaakHtmlLink` | Lokale helper | `link` – URL of link<br>`text` – tekst of waarde | Maakt html link binnen de bovenliggende functie. | 327 |
| `cmMaakWeblink` | Lokale helper | `text` – tekst of waarde | Maakt weblink binnen de bovenliggende functie. | 331 |
| `cmMaakMaillink` | Lokale helper | `text` – tekst of waarde | Maakt maillink binnen de bovenliggende functie. | 332 |
| `cmVerzendMededelingen` | Bestandsniveau | geen | Verzendt mededelingen. | 409 |
| `cmVerzendMededelingenVolgendeWeek` | Bestandsniveau | geen | Verzendt mededelingen volgende week. | 414 |
| `cmVerzendMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s)<br>`volgendeWeek` – week of aantal weken | Maakt mededelingen vanuit template en agenda en verzendt het resultaat naar een adres. | 419 |
| `cmZoekEersteDienstIndex` | Bestandsniveau | `types` – invoerwaarde | Zoekt eerste dienst index. | 467 |
| `cmMaakDocumentkopie` | Bestandsniveau | `templateId` – Google Document-ID<br>`documentnaam` – invoerwaarde | Maakt documentkopie. | 476 |
| `cmLeesLiturgieUitAgenda` | Bestandsniveau | `agendanaam` – agendanaam<br>`begindatum` – datum of begindatum<br>`einddatum` – einddatum | Leest liturgie uit agenda. | 482 |
| `cmExporteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID<br>`bestandsnaam` – invoerwaarde | Exporteert document naar docx. | 493 |
| `cmMaakRoosterbericht` | Bestandsniveau | geen | Maakt roosterbericht. | 501 |
| `cmVerzendMjMededelingen` | Bestandsniveau | geen | Verzendt mj mededelingen. | 522 |
| `cmMaakMjHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt mj html element. | 527 |
| `cmHaalGebeurtenissenUitAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Haalt gebeurtenissen uit agenda. | 532 |
| `cmFormatteerGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert gebeurtenissen. | 544 |
| `cmFormatteerEersteGebeurtenisVolledig` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert eerste gebeurtenis volledig. | 557 |
| `cmVerzendMjMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt mj mededelingen naar adres. | 565 |
| `cmVerzendLiemersActiviteiten` | Bestandsniveau | geen | Verzendt liemers activiteiten. | 621 |
| `cmMaakLiemersHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt liemers html element. | 626 |
| `cmLeesAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Leest agenda. | 631 |
| `cmFormatteerLiemersGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert liemers gebeurtenissen. | 641 |
| `cmVerzendLiemersActiviteitenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt liemers activiteiten naar adres. | 667 |
| `cmVerzendLijstKerkdiensten` | Bestandsniveau | `emailTo` – ontvanger(s); standaard: `crLeesConfiguratie("Mailinglijst - Kerkdiensten")` | Verzendt lijst kerkdiensten. | 731 |
| `cmMaakHtmlLijstrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Maakt html lijstrapport. | 770 |
| `cmMaakHtmlElement` | Lokale helper | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 780 |
| `cmVoegLijstItemToe` | Lokale helper | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe binnen de bovenliggende functie. | 784 |
| `cmVerzendLectorBericht` | Bestandsniveau | geen | Verzendt lector bericht. | 869 |
| `cmVerzendLectorrooster` | Bestandsniveau | geen | Verzendt lectorrooster. | 897 |
| `cmVerzendLectorroosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Lectoren test")` | Verzendt lectorrooster naar lijst. | 902 |
| `cmGenereerLectorroosterLijst` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Genereert lectorrooster lijst. | 964 |
| `cmMaakLectorrooster` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum<br>`rptSheetName` – naam van het werkblad; standaard: `"Lectorrooster"`<br>`rptTitle` – titel; standaard: `"Lectorrooster"` | Bouwt en formatteert het werkblad met het lectorrooster. | 1037 |
| `cmBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 1053 |
| `cmMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 1059 |

## CR_Core.js

Aantal: 28

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `crMaakOfLeegWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad | Maakt of leeg werkblad. | 6 |
| `crNormaliseerKolomnaam` | Bestandsniveau | `naam` – invoerwaarde | Normaliseert kolomnaam. | 22 |
| `crMaakKolomindex` | Bestandsniveau | `werkblad` – Spreadsheet-werkbladobject<br>`koprij` – rij of rijgegevens | Leest een kopregel en maakt een naam-naar-kolomindexobject. | 30 |
| `crZoekKolom` | Bestandsniveau | `kolommen` – kolom of kolomindex<br>`naam` – invoerwaarde<br>`verplicht` – of ontbreken als fout geldt | Zoekt een nulgebaseerde kolomindex op genormaliseerde kopnaam. | 50 |
| `crLeesConfiguratie` | Bestandsniveau | `sleutel` – configuratiesleutel of configuratie<br>`standaardWaarde` – tekst of waarde | Leest configuratie. | 59 |
| `crLeesWerkbladInhoud` | Bestandsniveau | `argSheetName` – naam van het werkblad<br>`argA1Position` – invoerwaarde | Leest werkblad inhoud. | 89 |
| `crHaalWerkbladOp` | Bestandsniveau | `argSheetName` – naam van het werkblad | Haalt werkblad op. | 103 |
| `crFormatteerDatum` | Bestandsniveau | `datum` – datum of begindatum<br>`patroon` – opmaakpatroon<br>`landinstelling` – landinstelling | Formatteert een datum centraal volgens een alias of expliciet patroon. | 122 |
| `crVoegTekstToeIndienGevuld` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt tekst toe indien gevuld. | 197 |
| `crVoegTekstToe` | Bestandsniveau | `data` – invoerwaarde<br>`start` – invoerwaarde<br>`count` – aantal | Voegt tekst toe. | 205 |
| `crBepaalDatumVanWeeknummer` | Bestandsniveau | `wantWeekDay` – week of aantal weken<br>`wantWeekNumber` – week of aantal weken | Bepaalt datum van weeknummer. | 228 |
| `crLogFoutopsporing` | Bestandsniveau | `arg` – invoerwaarde | Logt foutopsporing. | 244 |
| `crBepaalBeginVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van maand. | 250 |
| `crZetOpBeginVanDag` | Bestandsniveau | `argDate` – datum of begindatum | Zet op begin van dag. | 262 |
| `crMaakBegindatumVanMaand` | Bestandsniveau | `month` – maand of aantal maanden<br>`curYear` – jaar; standaard: `2026` | Maakt begindatum van maand. | 272 |
| `crBepaalEindeVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van maand. | 285 |
| `crBepaalBeginVanJaar` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Bepaalt begin van jaar. | 298 |
| `crBepaalEindeVanJaar` | Bestandsniveau | geen | Bepaalt einde van jaar. | 311 |
| `crBepaalWeeknummer` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt weeknummer. | 323 |
| `crBepaalBegindatumVanWeeknummer` | Bestandsniveau | `argWeekNum` – week of aantal weken | Bepaalt begindatum van weeknummer. | 332 |
| `crBepaalBeginVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van week. | 339 |
| `crBepaalEindeVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van week. | 351 |
| `crTelDagenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`daysOffset` – dag of aantal dagen | Telt dagen bij datum op. | 363 |
| `crTelWekenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`weeksOffset` – week of aantal weken | Telt weken bij datum op. | 372 |
| `crTelMaandenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`monthsOffset` – maand of aantal maanden<br>`maxMonth` – maand of aantal maanden; standaard: `12` | Telt maanden bij datum op. | 381 |
| `crBepaalVolgendeZondag` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt volgende zondag. | 399 |
| `crZetTijdOpBeginVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op begin van dag. | 411 |
| `crZetTijdOpEindeVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op einde van dag. | 422 |

## EX_Export.js

Aantal: 14

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `exConverteerWerkbladNaarXlsx` | Bestandsniveau | `werkbladnaam` – naam van het werkblad | Converteert werkblad naar xlsx. | 6 |
| `exConverteerWerkbladNaarPdf` | Bestandsniveau | `werkbladnaam` – naam van het werkblad | Converteert werkblad naar pdf. | 11 |
| `exExporteerWerkblad` | Bestandsniveau | `werkbladnaam` – naam van het werkblad<br>`formaat` – uitvoerformaat | Exporteert één werkblad naar het gekozen bestandsformaat. | 17 |
| `exConverteerDocumentNaarPdf` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar pdf. | 62 |
| `exConverteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar docx. | 85 |
| `exConverteerDocumentNaarXlsx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar xlsx. | 98 |
| `exMaakJaarroosterXlsx` | Bestandsniveau | geen | Maakt jaarrooster xlsx. | 111 |
| `exMaakHalfjaarroosterXlsx` | Bestandsniveau | geen | Maakt halfjaarrooster xlsx. | 117 |
| `exMaakRoosterXlsx` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster xlsx. | 126 |
| `exVoegKoprijToe` | Lokale helper | geen | Voegt koprij toe binnen de bovenliggende functie. | 132 |
| `exBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 167 |
| `exBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 173 |
| `exMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 179 |
| `exVerzendJaarroosterXlsx` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster xlsx. | 367 |

## KA_Kalender.js

Aantal: 2

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `kaZetGebeurtenissenInAgenda` | Bestandsniveau | geen | Zet gebeurtenissen in agenda. | 6 |
| `kaLeesAgenda` | Bestandsniveau | `report_sheet` – Spreadsheet-werkbladobject | Leest agenda. | 48 |

## MN_Menu.js

Aantal: 3

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `onOpen` | Apps Script-entrypoint | `e` – Apps Script-gebeurtenisobject | Apps Script-entrypoint; bouwt het menu wanneer de spreadsheet wordt geopend. | 7 |
| `onEdit` | Apps Script-entrypoint | `e` – Apps Script-gebeurtenisobject | Apps Script-entrypoint; verwerkt wijzigingen op Voorpagina. | 12 |
| `mnBijOpenen` | Bestandsniveau | geen | Bouwt het volledige menu Dienstenrooster met alle submenu’s en opdrachten. | 17 |

## OP_Opmaak.js

Aantal: 7

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `opPasKleurenToeOpWaarde` | Bestandsniveau | `sourceSheet` – Spreadsheet-werkbladobject<br>`destinationSheet` – Spreadsheet-werkbladobject<br>`start_col` – kolom of kolomindex; standaard: `0`<br>`end_col` – kolom of kolomindex; standaard: `0` | Kopieert kleuren op basis van overeenkomende waarden tussen twee werkbladen. | 24 |
| `opGenereerOnderscheidendeKleurenVerticaal` | Bestandsniveau | `count` – aantal<br>`sheetName` – naam van het werkblad | Genereert onderscheidende kleuren verticaal. | 128 |
| `opConverteerHslNaarHex` | Bestandsniveau | `hue` – kleurwaarde of kleurcomponent<br>`s` – kleurwaarde of kleurcomponent<br>`l` – kleurwaarde of kleurcomponent | Converteert hsl naar hex. | 190 |
| `opConverteerRgbNaarHex` | Bestandsniveau | `r` – kleurwaarde of kleurcomponent<br>`g` – kleurwaarde of kleurcomponent<br>`b` – kleurwaarde of kleurcomponent | Converteert rgb naar hex. | 223 |
| `opBepaalContrasterendeTekstkleur` | Bestandsniveau | `hexColor` – kleurwaarde of kleurcomponent<br>`hue` – kleurwaarde of kleurcomponent | Bepaalt contrasterende tekstkleur. | 239 |
| `opStelAchtergrondkleurenIn` | Bestandsniveau | geen | Stelt achtergrondkleuren in. | 267 |
| `opBepaalKleurtype` | Bestandsniveau | `type` – invoerwaarde<br>`color` – kleurwaarde of kleurcomponent | Bepaalt kleurtype. | 311 |

## RS_Rooster.js

Aantal: 28

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `rsSelecteerCriteria` | Bestandsniveau | geen | Selecteert criteria. | 6 |
| `rsSelecteerGegevens` | Bestandsniveau | `argStartDate` – datum of begindatum; standaard: `new Date()`<br>`argEndDate` – einddatum; standaard: `new Date()` | Leest Voorpagina op kolomnaam en retourneert roostergegevens binnen een datumperiode. | 19 |
| `rsMaakRoosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladnaam. | 168 |
| `rsMaakRoosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladtitel. | 179 |
| `rsMaakRoosterWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkblad. | 193 |
| `rsBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 226 |
| `rsBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 232 |
| `rsMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 238 |
| `rsMaakMaandroosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladnaam. | 432 |
| `rsMaakMaandroosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladtitel. | 438 |
| `rsMaakMaandRooster` | Bestandsniveau | `argDate` – datum of begindatum; standaard: `new Date()`<br>`argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""` | Maakt maand rooster. | 447 |
| `rsBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 475 |
| `rsBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 481 |
| `rsMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde<br>`fontWeight` – invoerwaarde; standaard: `"bold"`<br>`horizontalAlignment` – invoerwaarde; standaard: `"center"`<br>`verticalAlignment` – invoerwaarde; standaard: `"middle"` | Maakt laatste rij op binnen de bovenliggende functie. | 487 |
| `rsVerwijderAlleRoosters` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verwijdert alle roosters. | 677 |
| `rsVerwijderWerkbladenMetVoorvoegsel` | Bestandsniveau | `prefix` – voorvoegsel | Verwijdert werkbladen met voorvoegsel. | 690 |
| `rsMaakJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster. | 713 |
| `rsMaakHalfjaarrooster1` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster1. | 718 |
| `rsMaakHalfjaarrooster2` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster2. | 742 |
| `rsMaakJaarroosterNaam` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster naam. | 766 |
| `rsVerzendJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster. | 771 |
| `rsStelTabelkolommenIn` | Bestandsniveau | `tableRow` – rij of rijgegevens | Stelt tabelkolommen in. | 822 |
| `rsMaakHtmlElementen` | Bestandsniveau | `tag` – HTML-tag<br>`tableRow` – rij of rijgegevens | Maakt html elementen. | 827 |
| `rsMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Maakt html element. | 836 |
| `rsMaakHtmlElementMetOptie` | Bestandsniveau | `tag` – HTML-tag<br>`opt` – invoerwaarde<br>`val` – tekst of waarde | Maakt html element met optie. | 841 |
| `rsVoegTabelrijMetEenKolomToe` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Voegt tabelrij met een kolom toe. | 846 |
| `rsVoegTabelrijToe` | Bestandsniveau | `tag` – HTML-tag<br>`hdrRow` – rij of rijgegevens | Voegt tabelrij toe. | 853 |
| `rsMaakHtmlRooster` | Bestandsniveau | `rptStartDate` – datum of begindatum; standaard: `crZetOpBeginVanDag()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt html rooster. | 863 |

## TS_Test.js

Aantal: 18

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `tsTestVertaalDatum` | Bestandsniveau | geen | Test vertaal datum. | 6 |
| `tsTestOpmaak` | Bestandsniveau | geen | Test opmaak. | 19 |
| `tsTestMaakRooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Test maak rooster. | 51 |
| `tsTestHtmlRooster` | Bestandsniveau | geen | Test html rooster. | 60 |
| `tsTestVerzendRooster` | Bestandsniveau | geen | Test verzend rooster. | 88 |
| `tsTestMaakHtmlWeekrapport` | Bestandsniveau | geen | Test maak html weekrapport. | 104 |
| `tsTestVerzendTemplate` | Bestandsniveau | geen | Test verzend template. | 117 |
| `tsTestVerzendMededelingen` | Bestandsniveau | geen | Test verzend mededelingen. | 122 |
| `tsTestVerzendMjMededelingen` | Bestandsniveau | geen | Test verzend mj mededelingen. | 127 |
| `tsTestVerzendLiemersActiviteiten` | Bestandsniveau | geen | Test verzend liemers activiteiten. | 132 |
| `tsTestConversie` | Bestandsniveau | geen | Test conversie. | 137 |
| `tsTestVerzendLectorrooster` | Bestandsniveau | geen | Test verzend lectorrooster. | 148 |
| `tsTestAgenda` | Bestandsniveau | geen | Test agenda. | 153 |
| `tsTestMaakUitzending` | Bestandsniveau | geen | Test maak uitzending. | 159 |
| `tsTestBereikbaarheid` | Bestandsniveau | geen | Test bereikbaarheid. | 179 |
| `tsTestOphalen` | Bestandsniveau | geen | Test ophalen. | 186 |
| `tsTestKleurwerkblad` | Bestandsniveau | geen | Test kleurwerkblad. | 227 |
| `tsTestGenereerKleuren` | Bestandsniveau | geen | Test genereer kleuren. | 236 |

## YT_YouTube.js

Aantal: 11

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `ytVerzendLaatsteVideos` | Bestandsniveau | geen | Verzendt laatste videos. | 6 |
| `ytMaakUploadLijst` | Bestandsniveau | `n` – aantal; standaard: `4` | Maakt upload lijst. | 14 |
| `ytMaakHtmlElement` | Lokale helper | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 17 |
| `ytMaakHtmlLink` | Lokale helper | `link` – URL of link<br>`text` – tekst of waarde | Maakt html link binnen de bovenliggende functie. | 21 |
| `ytHaalMijnUploadsOp` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Haalt mijn uploads op. | 40 |
| `ytLaad` | Lokale helper | `rptSheet` – Spreadsheet-werkbladobject<br>`details` – invoerwaarde<br>`results` – invoerwaarde | Lokale helper voor laad. | 54 |
| `ytMaakUploadWerkblad` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Maakt upload werkblad. | 95 |
| `ytMaakYouTubeUitzending` | Bestandsniveau | `title` – titel<br>`date` – datum of begindatum<br>`time` – tijd | Maakt een geplande YouTube-live-uitzending. | 143 |
| `ytMaakLivestream` | Bestandsniveau | `title` – titel | Maakt livestream. | 193 |
| `ytKoppelUitzending` | Bestandsniveau | `broadcastId` – YouTube-broadcast-ID<br>`streamId` – YouTube-stream-ID | Koppelt een YouTube-uitzending aan een livestream. | 224 |
| `ytWerkVideoBij` | Bestandsniveau | geen | Werkt video bij. | 251 |
