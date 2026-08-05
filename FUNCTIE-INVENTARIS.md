# Functie-inventaris Apps Script

Bron: actuele code in `/mnt/c/Users/avand/.codex/.chatgpt-projects/g-p-6a69f38a97a08191a06a764632b66065/refactor_work`.

- Scriptbestanden: 11
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

Aantal: 38

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `cmVerzendRooster` | Bestandsniveau | geen | Verzendt rooster. | 10 |
| `cmVerzendRoosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Test")`<br>`num_weeks_in_report` – week of aantal weken; standaard: `6`<br>`num_months_in_report` – maand of aantal maanden; standaard: `6` | Verzendt rooster naar lijst. | 15 |
| `cmVerzendEmail` | Bestandsniveau | `emailTo_list` – lijst met e-mailadressen<br>`emailSubject` – onderwerpregel<br>`emailName` – afzendernaam<br>`emailHtmlBody` – HTML-inhoud<br>`emailConfirmationTo` – instelling of tekst voor bevestiging<br>`emailConfirmationMsg` – instelling of tekst voor bevestiging<br>`emailAsBcc` – of BCC-verzending wordt gebruikt | Verzendt HTML-mail naar een lijst, afzonderlijk of als BCC, met optionele bevestiging. | 75 |
| `cmMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element. | 132 |
| `cmVoegLijstItemToe` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe. | 137 |
| `cmMaakHtmlWeekrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Bouwt een HTML-weekrapport voor de opgegeven periode. | 145 |
| `cmVerzendTemplate` | Bestandsniveau | geen | Verzendt template. | 213 |
| `cmVerzendTemplateNaarLijst` | Bestandsniveau | `emailListSheetName` – naam van het werkblad; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Test")` | Verzendt template naar lijst. | 218 |
| `cmMaakHtmlElement` | Lokale helper | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 276 |
| `cmMaakHtmlElementIndienGevuld` | Lokale helper | `tg` – HTML-tag<br>`pfx` – voorvoegsel<br>`str` – tekst of waarde | Maakt html element indien gevuld binnen de bovenliggende functie. | 279 |
| `cmMaakHtmlLink` | Lokale helper | `link` – URL of link<br>`text` – tekst of waarde | Maakt html link binnen de bovenliggende functie. | 285 |
| `cmMaakWeblink` | Lokale helper | `text` – tekst of waarde | Maakt weblink binnen de bovenliggende functie. | 289 |
| `cmMaakMaillink` | Lokale helper | `text` – tekst of waarde | Maakt maillink binnen de bovenliggende functie. | 290 |
| `cmVerzendMededelingen` | Bestandsniveau | geen | Verzendt mededelingen. | 367 |
| `cmVerzendMededelingenVolgendeWeek` | Bestandsniveau | geen | Verzendt mededelingen volgende week. | 372 |
| `cmVerzendMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s)<br>`volgendeWeek` – week of aantal weken | Maakt mededelingen vanuit template en agenda en verzendt het resultaat naar een adres. | 377 |
| `cmZoekEersteDienstIndex` | Bestandsniveau | `types` – invoerwaarde | Zoekt eerste dienst index. | 425 |
| `cmMaakDocumentkopie` | Bestandsniveau | `templateId` – Google Document-ID<br>`documentnaam` – invoerwaarde | Maakt documentkopie. | 434 |
| `cmLeesLiturgieUitAgenda` | Bestandsniveau | `agendanaam` – agendanaam<br>`begindatum` – datum of begindatum<br>`einddatum` – einddatum | Leest liturgie uit agenda. | 440 |
| `cmExporteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID<br>`bestandsnaam` – invoerwaarde | Exporteert document naar docx. | 451 |
| `cmVerzendMjMededelingen` | Bestandsniveau | geen | Verzendt mj mededelingen. | 468 |
| `cmMaakMjHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt mj html element. | 473 |
| `cmHaalGebeurtenissenUitAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Haalt gebeurtenissen uit agenda. | 478 |
| `cmFormatteerGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert gebeurtenissen. | 490 |
| `cmFormatteerEersteGebeurtenisVolledig` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert eerste gebeurtenis volledig. | 503 |
| `cmVerzendMjMededelingenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt mj mededelingen naar adres. | 511 |
| `cmVerzendLiemersActiviteiten` | Bestandsniveau | geen | Verzendt liemers activiteiten. | 567 |
| `cmMaakLiemersHtmlElement` | Bestandsniveau | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt liemers html element. | 572 |
| `cmLeesAgenda` | Bestandsniveau | `calName` – agendanaam<br>`startDate` – datum of begindatum<br>`endDate` – einddatum | Leest agenda. | 577 |
| `cmFormatteerLiemersGebeurtenissen` | Bestandsniveau | `events` – agenda-afspraak of lijst met afspraken | Formatteert liemers gebeurtenissen. | 587 |
| `cmVerzendLiemersActiviteitenNaarAdres` | Bestandsniveau | `emailTo` – ontvanger(s) | Verzendt liemers activiteiten naar adres. | 613 |
| `cmVerzendLijstKerkdiensten` | Bestandsniveau | `emailTo` – ontvanger(s); standaard: `crLeesConfiguratie("Mailinglijst - Kerkdiensten")` | Verzendt lijst kerkdiensten. | 675 |
| `cmMaakHtmlLijstrapport` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Maakt html lijstrapport. | 714 |
| `cmMaakHtmlElement` | Lokale helper | `tag` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 724 |
| `cmVoegLijstItemToe` | Lokale helper | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt lijst item toe binnen de bovenliggende functie. | 728 |
| `cmVerzendLectorrooster` | Bestandsniveau | geen | Verzendt lectorrooster. | 813 |
| `cmVerzendLectorroosterNaarLijst` | Bestandsniveau | `emailListSheet` – Spreadsheet-werkbladobject; standaard: `crLeesConfiguratie("Mailinglijstwerkblad - Lectoren test")` | Verzendt lectorrooster naar lijst. | 818 |
| `cmGenereerLectorroosterLijst` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum | Genereert lectorrooster lijst. | 877 |

## CR_Core.js

Aantal: 27

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `crMaakOfLeegWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad | Maakt of leeg werkblad. | 6 |
| `crNormaliseerKolomnaam` | Bestandsniveau | `naam` – invoerwaarde | Normaliseert kolomnaam. | 22 |
| `crMaakKolomindex` | Bestandsniveau | `werkblad` – Spreadsheet-werkbladobject<br>`koprij` – rij of rijgegevens | Leest een kopregel en maakt een naam-naar-kolomindexobject. | 30 |
| `crZoekKolom` | Bestandsniveau | `kolommen` – kolom of kolomindex<br>`naam` – invoerwaarde<br>`verplicht` – of ontbreken als fout geldt | Zoekt een nulgebaseerde kolomindex op genormaliseerde kopnaam. | 50 |
| `crLeesConfiguratie` | Bestandsniveau | `sleutel` – configuratiesleutel of configuratie<br>`standaardWaarde` – tekst of waarde | Leest configuratie. | 59 |
| `crLeesWerkbladInhoud` | Bestandsniveau | `argSheetName` – naam van het werkblad<br>`argA1Position` – invoerwaarde | Leest werkblad inhoud. | 89 |
| `crFormatteerDatum` | Bestandsniveau | `datum` – datum of begindatum<br>`patroon` – opmaakpatroon<br>`landinstelling` – landinstelling | Formatteert een datum centraal volgens een alias of expliciet patroon. | 116 |
| `crVoegTekstToeIndienGevuld` | Bestandsniveau | `pfx` – voorvoegsel<br>`str` – tekst of waarde | Voegt tekst toe indien gevuld. | 191 |
| `crVoegTekstToe` | Bestandsniveau | `data` – invoerwaarde<br>`start` – invoerwaarde<br>`count` – aantal | Voegt tekst toe. | 199 |
| `crBepaalDatumVanWeeknummer` | Bestandsniveau | `wantWeekDay` – week of aantal weken<br>`wantWeekNumber` – week of aantal weken | Bepaalt datum van weeknummer. | 222 |
| `crLogFoutopsporing` | Bestandsniveau | `arg` – invoerwaarde | Logt foutopsporing. | 238 |
| `crBepaalBeginVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van maand. | 244 |
| `crZetOpBeginVanDag` | Bestandsniveau | `argDate` – datum of begindatum | Zet op begin van dag. | 256 |
| `crMaakBegindatumVanMaand` | Bestandsniveau | `month` – maand of aantal maanden<br>`curYear` – jaar; standaard: `2026` | Maakt begindatum van maand. | 266 |
| `crBepaalEindeVanMaand` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van maand. | 279 |
| `crBepaalBeginVanJaar` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Bepaalt begin van jaar. | 292 |
| `crBepaalEindeVanJaar` | Bestandsniveau | geen | Bepaalt einde van jaar. | 305 |
| `crBepaalWeeknummer` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt weeknummer. | 317 |
| `crBepaalBegindatumVanWeeknummer` | Bestandsniveau | `argWeekNum` – week of aantal weken | Bepaalt begindatum van weeknummer. | 326 |
| `crBepaalBeginVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt begin van week. | 333 |
| `crBepaalEindeVanWeek` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt einde van week. | 345 |
| `crTelDagenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`daysOffset` – dag of aantal dagen | Telt dagen bij datum op. | 357 |
| `crTelWekenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`weeksOffset` – week of aantal weken | Telt weken bij datum op. | 366 |
| `crTelMaandenBijDatumOp` | Bestandsniveau | `argDate` – datum of begindatum<br>`monthsOffset` – maand of aantal maanden<br>`maxMonth` – maand of aantal maanden; standaard: `12` | Telt maanden bij datum op. | 375 |
| `crBepaalVolgendeZondag` | Bestandsniveau | `argDate` – datum of begindatum | Bepaalt volgende zondag. | 393 |
| `crZetTijdOpBeginVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op begin van dag. | 405 |
| `crZetTijdOpEindeVanDag` | Bestandsniveau | `retDate` – datum of begindatum | Zet tijd op einde van dag. | 416 |

## EX_Export.js

Aantal: 10

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `exConverteerWerkbladNaarXlsx` | Bestandsniveau | `werkbladnaam` – naam van het werkblad | Converteert werkblad naar xlsx. | 6 |
| `exConverteerWerkbladNaarPdf` | Bestandsniveau | `werkbladnaam` – naam van het werkblad | Converteert werkblad naar pdf. | 11 |
| `exExporteerWerkblad` | Bestandsniveau | `werkbladnaam` – naam van het werkblad<br>`formaat` – uitvoerformaat | Exporteert één werkblad naar het gekozen bestandsformaat. | 17 |
| `exMaakJaarroosterXlsx` | Bestandsniveau | geen | Maakt jaarrooster xlsx. | 72 |
| `exMaakRoosterXlsx` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster xlsx. | 81 |
| `exVoegKoprijToe` | Lokale helper | geen | Voegt koprij toe binnen de bovenliggende functie. | 87 |
| `exBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 122 |
| `exBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 128 |
| `exMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 134 |
| `exVerzendJaarroosterXlsx` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster xlsx. | 320 |

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

Aantal: 6

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `opPasKleurenToeOpWaarde` | Bestandsniveau | `sourceSheet` – Spreadsheet-werkbladobject<br>`destinationSheet` – Spreadsheet-werkbladobject<br>`start_col` – kolom of kolomindex; standaard: `0`<br>`end_col` – kolom of kolomindex; standaard: `0` | Kopieert kleuren op basis van overeenkomende waarden tussen twee werkbladen. | 24 |
| `opGenereerOnderscheidendeKleurenVerticaal` | Bestandsniveau | `count` – aantal<br>`sheetName` – naam van het werkblad | Genereert onderscheidende kleuren verticaal. | 127 |
| `opConverteerHslNaarHex` | Bestandsniveau | `hue` – kleurwaarde of kleurcomponent<br>`s` – kleurwaarde of kleurcomponent<br>`l` – kleurwaarde of kleurcomponent | Converteert hsl naar hex. | 189 |
| `opConverteerRgbNaarHex` | Bestandsniveau | `r` – kleurwaarde of kleurcomponent<br>`g` – kleurwaarde of kleurcomponent<br>`b` – kleurwaarde of kleurcomponent | Converteert rgb naar hex. | 222 |
| `opBepaalContrasterendeTekstkleur` | Bestandsniveau | `hexColor` – kleurwaarde of kleurcomponent<br>`hue` – kleurwaarde of kleurcomponent | Bepaalt contrasterende tekstkleur. | 238 |
| `opStelAchtergrondkleurenIn` | Bestandsniveau | geen | Stelt achtergrondkleuren in. | 266 |

## Obsolete.js

Aantal: 23

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `cmVerzendRoosterbericht` | Bestandsniveau | geen | Verzendt roosterbericht. | 11 |
| `cmMaakUrlLink` | Bestandsniveau | `url` – URL of link<br>`tekst` – tekst of waarde | Maakt url link. | 39 |
| `cmVerzendDienstenlijst` | Bestandsniveau | geen | Verzendt dienstenlijst. | 44 |
| `cmMaakRoosterbericht` | Bestandsniveau | geen | Maakt roosterbericht. | 51 |
| `cmVerzendLectorBericht` | Bestandsniveau | geen | Verzendt lector bericht. | 63 |
| `cmMaakLectorrooster` | Bestandsniveau | `rptWeekStartDate` – datum of begindatum<br>`rptWeekEndDate` – einddatum<br>`rptSheetName` – naam van het werkblad; standaard: `"Lectorrooster"`<br>`rptTitle` – titel; standaard: `"Lectorrooster"` | Bouwt en formatteert het werkblad met het lectorrooster. | 91 |
| `cmBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 107 |
| `cmMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 113 |
| `crHaalWerkbladOp` | Bestandsniveau | `argSheetName` – naam van het werkblad | Haalt werkblad op. | 268 |
| `exConverteerDocumentNaarPdf` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar pdf. | 275 |
| `exConverteerDocumentNaarDocx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar docx. | 288 |
| `exConverteerDocumentNaarXlsx` | Bestandsniveau | `documentId` – Google Document-ID | Converteert document naar xlsx. | 301 |
| `exMaakHalfjaarroosterXlsx` | Bestandsniveau | geen | Maakt halfjaarrooster xlsx. | 314 |
| `opBepaalKleurtype` | Bestandsniveau | `type` – invoerwaarde<br>`color` – kleurwaarde of kleurcomponent | Bepaalt kleurtype. | 322 |
| `rsSelecteerCriteria` | Bestandsniveau | geen | Selecteert criteria. | 337 |
| `rsMaakMaandRooster` | Bestandsniveau | `argDate` – datum of begindatum; standaard: `new Date()`<br>`argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""` | Maakt maand rooster. | 350 |
| `rsBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 378 |
| `rsBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 384 |
| `rsMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde<br>`fontWeight` – invoerwaarde; standaard: `"bold"`<br>`horizontalAlignment` – invoerwaarde; standaard: `"center"`<br>`verticalAlignment` – invoerwaarde; standaard: `"middle"` | Maakt laatste rij op binnen de bovenliggende functie. | 390 |
| `rsVoegTabelrijMetEenKolomToe` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Voegt tabelrij met een kolom toe. | 580 |
| `ytVerzendLaatsteVideos` | Bestandsniveau | geen | Verzendt laatste videos. | 589 |
| `ytMaakUploadWerkblad` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Maakt upload werkblad. | 597 |
| `ytWerkVideoBij` | Bestandsniveau | geen | Werkt video bij. | 635 |

## RS_Rooster.js

Aantal: 22

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `rsSelecteerGegevens` | Bestandsniveau | `argStartDate` – datum of begindatum; standaard: `new Date()`<br>`argEndDate` – einddatum; standaard: `new Date()` | Leest Voorpagina op kolomnaam en retourneert roostergegevens binnen een datumperiode. | 7 |
| `rsMaakRoosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladnaam. | 155 |
| `rsMaakRoosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkbladtitel. | 166 |
| `rsMaakRoosterWerkblad` | Bestandsniveau | `argSheetName` – naam van het werkblad; standaard: `""`<br>`argSheetTitle` – Spreadsheet-werkbladobject; standaard: `""`<br>`rptStartDate` – datum of begindatum; standaard: `crBepaalBeginVanMaand()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt rooster werkblad. | 180 |
| `rsBereikLaatsteRij` | Lokale helper | geen | Bepaalt het bereik voor laatste rij binnen de bovenliggende functie. | 213 |
| `rsBereikNamenrij` | Lokale helper | geen | Bepaalt het bereik voor namenrij binnen de bovenliggende functie. | 219 |
| `rsMaakLaatsteRijOp` | Lokale helper | `fgColor` – kleurwaarde of kleurcomponent<br>`bgColor` – kleurwaarde of kleurcomponent<br>`fontSize` – invoerwaarde | Maakt laatste rij op binnen de bovenliggende functie. | 225 |
| `rsMaakMaandroosterWerkbladnaam` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladnaam. | 418 |
| `rsMaakMaandroosterWerkbladtitel` | Bestandsniveau | `startDate` – datum of begindatum; standaard: `new Date()` | Maakt maandrooster werkbladtitel. | 424 |
| `rsVerwijderAlleRoosters` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verwijdert alle roosters. | 433 |
| `rsVerwijderWerkbladenMetVoorvoegsel` | Bestandsniveau | `prefix` – voorvoegsel | Verwijdert werkbladen met voorvoegsel. | 446 |
| `rsMaakJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster. | 469 |
| `rsMaakHalfjaarrooster1` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster1. | 474 |
| `rsMaakHalfjaarrooster2` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt halfjaarrooster2. | 498 |
| `rsMaakJaarroosterNaam` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Maakt jaarrooster naam. | 522 |
| `rsVerzendJaarrooster` | Bestandsniveau | `curYear` – jaar; standaard: `2026` | Verzendt jaarrooster. | 527 |
| `rsStelTabelkolommenIn` | Bestandsniveau | `tableRow` – rij of rijgegevens | Stelt tabelkolommen in. | 578 |
| `rsMaakHtmlElementen` | Bestandsniveau | `tag` – HTML-tag<br>`tableRow` – rij of rijgegevens | Maakt html elementen. | 583 |
| `rsMaakHtmlElement` | Bestandsniveau | `tag` – HTML-tag<br>`val` – tekst of waarde | Maakt html element. | 592 |
| `rsMaakHtmlElementMetOptie` | Bestandsniveau | `tag` – HTML-tag<br>`opt` – invoerwaarde<br>`val` – tekst of waarde | Maakt html element met optie. | 597 |
| `rsVoegTabelrijToe` | Bestandsniveau | `tag` – HTML-tag<br>`hdrRow` – rij of rijgegevens | Voegt tabelrij toe. | 602 |
| `rsMaakHtmlRooster` | Bestandsniveau | `rptStartDate` – datum of begindatum; standaard: `crZetOpBeginVanDag()`<br>`rptNumMonths` – maand of aantal maanden; standaard: `3` | Maakt html rooster. | 612 |

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

Aantal: 8

| Functie | Soort | Argumenten | Doel | Regel |
|---|---|---|---|---:|
| `ytMaakUploadLijst` | Bestandsniveau | `n` – aantal; standaard: `4` | Maakt upload lijst. | 7 |
| `ytMaakHtmlElement` | Lokale helper | `tg` – HTML-tag<br>`str` – tekst of waarde | Maakt html element binnen de bovenliggende functie. | 10 |
| `ytMaakHtmlLink` | Lokale helper | `link` – URL of link<br>`text` – tekst of waarde | Maakt html link binnen de bovenliggende functie. | 14 |
| `ytHaalMijnUploadsOp` | Bestandsniveau | `rptSheet` – Spreadsheet-werkbladobject | Haalt mijn uploads op. | 33 |
| `ytLaad` | Lokale helper | `rptSheet` – Spreadsheet-werkbladobject<br>`details` – invoerwaarde<br>`results` – invoerwaarde | Lokale helper voor laad. | 45 |
| `ytMaakYouTubeUitzending` | Bestandsniveau | `title` – titel<br>`date` – datum of begindatum<br>`time` – tijd | Maakt een geplande YouTube-live-uitzending. | 96 |
| `ytMaakLivestream` | Bestandsniveau | `title` – titel | Maakt livestream. | 146 |
| `ytKoppelUitzending` | Bestandsniveau | `broadcastId` – YouTube-broadcast-ID<br>`streamId` – YouTube-stream-ID | Koppelt een YouTube-uitzending aan een livestream. | 177 |
