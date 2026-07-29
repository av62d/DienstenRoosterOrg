/**
 * Module: RS_Rooster.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function rsSelecteerCriteria() {
  var result;
  var beginDate = new Date();
  beginDate.setHours(0);
  beginDate.setMinutes(0);
  var lastDate = crBepaalEindeVanJaar();

  result = rsSelecteerGegevens(beginDate, crTelMaandenBijDatumOp(beginDate, 3));

  var a = 1;
}


function rsSelecteerGegevens(argStartDate = new Date(), argEndDate = new Date()) {

  // Zet tijd van begindatum op 0:00 en van einddatum op 23:59
  argStartDate.setHours(0);
  argStartDate.setMinutes(0);

  argEndDate.setHours(23);
  argEndDate.setMinutes(59);

  var data = new Array();

  /* Kolomindeling op Voorpagina  */

  //                               Kolom
  var a_type = new Array(); var p_type = 0;                             // A  Type
  var a_rowDate = new Array(); var p_datum = 1;                         // B	Datum
  var a_voorganger = new Array(); var p_voorganger = 2;                 // C  Voorganger
  var a_bijz = new Array(); var p_bijzonderheden = 3;                   // D  Bijzonderheden
  var a_collecte = new Array(); var p_collecte = 4;                     // E  Collecte
  var a_lector = new Array(); var p_lector = 5;                         // F  Lector
  var a_ambtsdragers = new Array(); var p_ambtsdragers = 6;             // G  Ouderling
  var p_extra = 7;                                                      // H  Extra
  var a_koster = new Array(); var p_koster = 8;                         // I  Koster
  var a_koffie = new Array(); var p_koffie = 9;                         // J  Koffie
  var a_ontvangst = new Array(); var p_ontvangst = 10;                  // K Comm. van ontvangst
  var a_klokkenluider = new Array(); var p_klokkenluider = 11;          // L  Klokkenluider
  var a_kerktv = new Array(); var p_kerktv = 12;                        // M  KerkTV
  var a_kleur = new Array(); var p_kleur = 13;                          // N  Kleur
  var a_ha = new Array(); var p_ha = 14;                                // O  HA
  var a_havorm = new Array(); var p_havorm = 15;                        // P  HAvorm
  var a_naamzondag = new Array(); var p_naamzondag = 16;                // Q Naam van Zondag
  var a_collectecategorie = new Array(); var p_collectecategorie = 17;  // R  Collecte (Categorie)
  var a_uitgangscollecte = new Array(); var p_uitgangscollecte = 18;    // S  Uitgangscollecte
  var a_lectorOrg = new Array(); var p_lectorOrg = 19;                  // T  LectorOrg
  var a_lectorWissel = new Array(); var p_lectorWissel = 20;            // U  LectorWissel
  var a_kwartaal = new Array(); var p_kwartaal = 21;                    // V  Kwartaal
  var a_koffieDienst = new Array(); var p_koffieDienst = 22;            // W  KoffieDienst
  var a_didamDienst = new Array(); var p_didamDienst = 23;              // X  DidamDienst

  var a_titel = new Array();

  var actSheet = SpreadsheetApp.getActiveSpreadsheet();
  var srcSheet = actSheet.getSheetByName('Voorpagina');

  actSheet.setSpreadsheetLocale("nl.nl");

  var startRow = 2;
  var endRow = srcSheet.getLastRow();
  var numRows = endRow - startRow + 1;

  var startCol = 1;
  var endCol = srcSheet.getLastColumn();
  var numCols = endCol;



  var rawData = srcSheet.getRange(startRow, 1, numRows, numCols).getValues();

  var dataIdx = -1;
  for (var i in rawData) {
    var rowType = rawData[i][0];
    if (rowType === "T")
      continue;

    var rowDate = new Date(rawData[i][1]);

    if ((rowDate < argStartDate) || (rowDate > argEndDate))
      continue;

    var c_dat = rawData[i];
    dataIdx++;
    a_rowDate.push(rowDate);
    a_type.push(rawData[i][p_type]);
    var titelVolledig = c_dat[p_voorganger];
    if (c_dat[p_bijzonderheden]) titelVolledig += ", " + c_dat[p_bijzonderheden];

    if (c_dat[p_ha]) titelVolledig += ", Heilig Avondmaal";

    a_titel.push(titelVolledig);

    var bijzVolledig = c_dat[p_bijzonderheden];

    if (c_dat[p_ha]) {
      if (bijzVolledig) bijzVolledig += ", ";
      bijzVolledig += "Heilig Avondmaal";
    }

    a_voorganger.push(c_dat[p_voorganger]);
    a_bijz.push(bijzVolledig);
    a_koster.push(c_dat[p_koster]);
    a_kleur.push(c_dat[p_kleur]);
    a_kerktv.push(c_dat[p_kerktv]);
    a_collecte.push(c_dat[p_collecte]);
    a_koffie.push(c_dat[p_koffie].replace("\n", ", "));
    a_ontvangst.push(c_dat[p_ontvangst].replace("\n", ", "));
    a_ha.push(c_dat[p_ha]);
    a_lector.push(c_dat[p_lector]);
    var ambtsdragers = c_dat[p_ambtsdragers];
    if (c_dat[p_extra]) ambtsdragers += ", " + c_dat[p_extra];
    a_ambtsdragers.push(ambtsdragers);
    a_klokkenluider.push(c_dat[p_klokkenluider]);

    // extra toegevoegd d.d. 20-12-2024

    a_havorm.push(c_dat[p_havorm]);
    a_naamzondag.push(c_dat[p_naamzondag]);
    a_collectecategorie.push(c_dat[p_collectecategorie]);
    a_uitgangscollecte.push(c_dat[p_uitgangscollecte]);
    // toegevoegd 17-2-2026
    a_lectorOrg.push(c_dat[p_lectorOrg]);
    // toegevoegd 1-6-2026
    a_lectorWissel.push(c_dat[p_lectorWissel]);
    a_kwartaal.push(c_dat[p_kwartaal]);
    a_koffieDienst.push(c_dat[p_koffieDienst]);
    a_didamDienst.push(c_dat[p_didamDienst]);
  }

  var a_headers = ["Headers", "Datum", "Type", "Titel", "Voorganger", "Bijzonderheden", "Koster", "kleur",
    "Collecte", "Koffie", "Ontvangst", "HA", "Lector", "Ambtsdragers", "Klokkenluider", "KerkTV", "HA vorm",
    "Naam van de Zondag", "Collecte Categorie", "Uitgangscollecte", "LectorOrig", "LectorWissel", "Kwartaal", "KoffieDienst", "DidamDienst"
  ];

  return ([a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg,
    a_lectorWissel, a_kwartaal, a_koffieDienst, a_didamDienst]);
}


/* aanroepen als:
  var [ a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
       a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
       a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg, a_lectorWissel, a_kwartaal, a_koffieDienst, a_didamDienst ] = SelectData(nowDate, endDate);
*/


function rsMaakRoosterWerkbladnaam(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6: title = 'half jaar'; break;
    case 12: title = 'heel jaar'; break;
    default: title = rptNumMonths + " maanden"; break;
  }
  return "Rooster-" + crFormatteerDatum(startDate, "J") + " " + title;
}


function rsMaakRoosterWerkbladtitel(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6: title = 'half jaar'; break;
    case 12: title = 'heel jaar'; break;
    default: title = rptNumMonths + " maanden"; break;
  }
  return "Rooster " + title + " vanaf " + crFormatteerDatum(startDate, "MJ");
}


// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden


function rsMaakRoosterWerkblad(argSheetName = "", argSheetTitle = "", rptStartDate = crBepaalBeginVanMaand(), rptNumMonths = 3) {

  var rptSheetName = (argSheetName) ? argSheetName : rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = (argSheetTitle) ? argSheetTitle : rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);

  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);

  // rptEndDate.setMonth(5); // HACK Rooster maximaal tot Juli!
  // rptEndDate.setMonth(11); // HACK Rooster maximaal tot December!


  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate)
    return;

  var sizeNameCol = 105;
  var sizeVoorgangerCol = 150;
  var sizeBijzCol = 120;
  var sizeNameWideCol = 130;
  var sizeCollecteCol = 200;

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Lector", "Ambtsdragers", "Koster", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [80, sizeVoorgangerCol, sizeBijzCol, sizeCollecteCol, sizeNameCol, sizeNameCol, sizeNameCol, sizeNameWideCol, sizeNameCol, sizeNameCol, sizeNameCol];

  var rptNumCols = hdrRow.length;

  var fg_title = "black"; var bg_title = "white";
  var fg_header = "white"; var bg_header = "blue";

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var report_sheet = crMaakOfLeegWerkblad(rptSheetName);

  function rsBereikLaatsteRij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 1, 1, rptNumCols);
  }

  function rsBereikNamenrij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 5, 1, rptNumCols);
  }

  function rsMaakLaatsteRijOp(fgColor, bgColor, fontSize) {
    var lrow = rsBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setFontSize(fontSize);
    lrow.setFontColor(fgColor);
    lrow.setFontWeight('bold');
    lrow.setVerticalAlignment("top");
    lrow.setWrap(true);
    return lrow;
  }

  var rptHeader = "";

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg, a_lectorWissel, a_kwartaal, a_koffieDienst, a_didamDienst] = rsSelecteerGegevens(rptStartDate, rptEndDate);

  var num_row = 1;
  var start_col = 29;
  var num_col1 = 5;
  var col2_offset = 2;
  var num_col2 = 4;

  var bgColor = BG_COL1;

  var nowDate = new Date();
  report_sheet.appendRow([rptTitle]);
  var lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  report_sheet.setRowHeight(1, 60);

  report_sheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, "DMT")])
  lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");        // gecentreerd

  var rptMonth = "";

  var altColor = BG_COL1;

  var nl = "\n";

  for (var i in a_type) {
    var t = a_type[i];

    if (altColor == BG_COL1)
      altColor = BG_COL2;
    else
      altColor = BG_COL1;

    bgColor = altColor;

    var monthName = crFormatteerDatum(a_rowDate[i], "MMMM");
    if (monthName !== rptMonth) {


      report_sheet.appendRow([monthName]);
      rptMonth = monthName;
      lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 18);    // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center");        // gecentreerd
      lrow.setVerticalAlignment("middle");        // gecentreerd

      report_sheet.setRowHeight(report_sheet.getLastRow(), 60);

      report_sheet.appendRow(hdrRow);
      lrow = rsMaakLaatsteRijOp(fg_header, bg_header, 10);


      lrow = rsBereikNamenrij(); // Center name cells
      lrow.setHorizontalAlignment("center");

    }



    switch (t) {
      case "M": bgColor = 'LemonChiffon'; break;
      case "B HA": bgColor = 'AliceBlue'; break;
      case "Z HA": bgColor = 'AliceBlue'; break;
      case "AV": bgColor = 'MistyRose'; break;
    }


    var vieringHA = "";

    if (a_ha[i] != "") {
      bgColor = BG_HA;
    }

    var date_str = crFormatteerDatum(a_rowDate[i], "EEE d MMM") + nl
      + crFormatteerDatum(a_rowDate[i], "HH:mm") + " uur";

    if (a_didamDienst[i].localeCompare("ja") == 0) {

      var rowArray = [
        date_str
        , a_voorganger[i]
        , a_bijz[i].replace(/,\s*/g, nl)
        , a_collecte[i]
        , a_lector[i]
        , a_ambtsdragers[i].replace(/,\s*/g, nl)
        , a_koster[i].replace(/,\s*/g, nl)
        , a_ontvangst[i].replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl)  // replace , and / by newline
        , a_klokkenluider[i].replace(/,\s*/g, nl)
        , a_koffie[i].replace(/,\s*/g, nl)
        , a_kerktv[i].replace(/,\s*/g, nl)

      ];
    } else {
      var rowArray = [
        crFormatteerDatum(a_rowDate[i], "EEE d MMM")
        , a_voorganger[i]
        , a_bijz[i].replace(/,\s*/g, nl)
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""
        , ""

      ];
    }

    var bgLitColor = "white";
    switch (a_kleur[i]) {
      case "wit": bgLitColor = "white"; break;
      case "roze": bgLitColor = "pink"; break;
      case "paars": bgLitColor = "plum"; break;
      case "groen": bgLitColor = "lightgreen"; break;
      case "rood": bgLitColor = "red"; break;

    }

    report_sheet.appendRow(rowArray);
    report_sheet.setRowHeight(report_sheet.getLastRow(), 40);   // Height of data row

    var lrow = rsBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);

    var datumCell = lrow.getCell(1, 1);
    datumCell.setBackground(bgLitColor);

    var n = lrow.getNumColumns();

    for (var i = 5; i <= n; i++) {
      var nameCell = lrow.getCell(1, i);
      nameCell.setHorizontalAlignment("center");

      nameCell.setBorder(true, null, true, null, true, true);

    }

  }
  report_sheet.setColumnWidth(1, 50);
  var cell = report_sheet.getRange("A:A");
  cell.setHorizontalAlignment("center");


  // Conditional formatting

  for (i = 0; i < hdrRowSize.length; i++) {
    var col = i + 1;
    var w = hdrRowSize[i];
    //report_sheet.setColumnWidth(col, w);
    report_sheet.setColumnWidth(i + 1, hdrRowSize[i]);
  }

  var numRows = report_sheet.getLastRow();
  var maxRows = report_sheet.getMaxRows();
  if (maxRows > numRows)
    report_sheet.deleteRows(numRows + 1, maxRows - numRows);
  var numRows = report_sheet.getLastRow();
  var numCols = report_sheet.getLastColumn();
  var maxCols = report_sheet.getMaxColumns();
  if (maxCols > numCols)
    report_sheet.deleteColumns(numCols + 1, maxCols - numCols);

  // Conditional formatting

  /* Color sheet */
  var src = SpreadsheetApp.getActive().getSheetByName("NaamKleuren");
  opPasKleurenToeOpWaarde(src, report_sheet, 4, 11);

  return report_sheet;
}


function rsMaakMaandroosterWerkbladnaam(startDate = new Date()) {
  var title = "";
  return "Rooster-" + crFormatteerDatum(startDate, "sMJ");
}


function rsMaakMaandroosterWerkbladtitel(startDate = new Date()) {
  var title = "";
  return crFormatteerDatum(startDate, "MJ");
}


// Maak Rooster voor één maand


function rsMaakMaandRooster(argDate = new Date(), argSheetName = "", argSheetTitle = "",) {

  rptStartDate = crBepaalBeginVanMaand(argDate);
  var rptEndDate = crBepaalEindeVanMaand(argDate);
  var rptSheetName = (argSheetName) ? argSheetName : rsMaakMaandroosterWerkbladnaam(rptStartDate);
  var rptTitle = (argSheetTitle) ? argSheetTitle : rsMaakMaandroosterWerkbladtitel(rptStartDate);


  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate)
    return;

  var sizeNameCol = 105;
  var sizeNameWideCol = 130;
  var sizeSpecCol = 125;
  var sizeOfferCol = 180;

  var hdrRowTitle = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [80, sizeSpecCol, sizeSpecCol, sizeOfferCol, sizeNameCol, sizeNameCol, sizeNameCol, sizeNameWideCol, sizeNameCol, sizeNameCol, sizeNameCol];

  var rptNumCols = hdrRowTitle.length;

  var fg_title = "black"; var bg_title = "white";
  var hdrRow_fg = "white"; var hdrRow_bg = "black"; var hdrRow_fs = 10;

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var report_sheet = crMaakOfLeegWerkblad(rptSheetName);

  function rsBereikLaatsteRij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 1, 1, rptNumCols);
  }

  function rsBereikNamenrij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 5, 1, rptNumCols);
  }

  function rsMaakLaatsteRijOp(fgColor, bgColor, fontSize, fontWeight = "bold", horizontalAlignment="center",  verticalAlignment = "middle") {
    var lrow = rsBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setFontSize(fontSize);
    lrow.setFontColor(fgColor);
    lrow.setFontWeight(fontWeight);
    lrow.setHorizontalAlignment(horizontalAlignment);
    lrow.setVerticalAlignment(verticalAlignment);
    lrow.setWrap(true);
    return lrow;
  }

  var rptHeader = "";
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelecteerGegevens(rptStartDate, rptEndDate);

  var num_row = 1;
  var start_col = 29;
  var num_col1 = 5;
  var col2_offset = 2;
  var num_col2 = 4;

  var bgColor = BG_COL1;

  var nowDate = new Date();
  report_sheet.appendRow([rptTitle]);
  var lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  report_sheet.setRowHeight(1, 60);

  report_sheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, "DMT")])
  lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");        // gecentreerd

  var rptMonth = "";

  var altColor = BG_COL1;

  var nl = "\n";

  for (var i in a_type) {
    var t = a_type[i];

    if (altColor == BG_COL1)
      altColor = BG_COL2;
    else
      altColor = BG_COL1;

    bgColor = altColor;

    var monthName = crFormatteerDatum(a_rowDate[i], "MMMM");
    if (monthName !== rptMonth) {


      report_sheet.appendRow([monthName]);
      rptMonth = monthName;
      lrow = rsMaakLaatsteRijOp(fg_title, bg_title, 18);    // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center");        // gecentreerd
      lrow.setVerticalAlignment("middle");        // gecentreerd

      report_sheet.setRowHeight(report_sheet.getLastRow(), 60);

      report_sheet.appendRow(hdrRowTitle);
      lrow = rsMaakLaatsteRijOp(hdrRow_fg, hdrRow_bg, hdrRow_fs, "bold", "center");

      lrow = rsBereikNamenrij(); // Center name cells
      lrow.setHorizontalAlignment("center");

    }



    switch (t) {
      case "M": bgColor = 'LemonChiffon'; break;
      case "B HA": bgColor = 'AliceBlue'; break;
      case "Z HA": bgColor = 'AliceBlue'; break;
      case "AV": bgColor = 'MistyRose'; break;
    }


    var vieringHA = "";

    if (a_ha[i] != "") {
      bgColor = BG_HA;
    }

    var rowArray = [
      crFormatteerDatum(a_rowDate[i], "EEE d MMMM") + nl
      + crFormatteerDatum(a_rowDate[i], "HH:mm")
      // + nl + 'week ' + crBepaalWeeknummer(a_rowDate[i]).toString()           // week aanduiding
      ,
      // a_titel[i] + nl +
      // 'Voorganger: ' +
      a_voorganger[i]
      // + nl + crVoegTekstToeIndienGevuld('Koster: ', a_koster[i])
      // + crVoegTekstToeIndienGevuld(', Kerktv: ', a_kerktv[i])
      // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
      , a_bijz[i].replace(/,\s*/g, nl)
      , a_collecte[i]
      , a_koster[i].replace(/,\s*/g, nl)
      , a_ambtsdragers[i].replace(/,\s*/g, nl)
      , a_lector[i]
      , a_ontvangst[i].replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl)  // replace , and / by newline
      , a_klokkenluider[i].replace(/,\s*/g, nl)
      , a_koffie[i].replace(/,\s*/g, nl)
      , a_kerktv[i].replace(/,\s*/g, nl)

    ];

    var bgLitColor = "white";
    switch (a_kleur[i]) {
      case "wit": bgLitColor = "white"; break;
      case "roze": bgLitColor = "pink"; break;
      case "paars": bgLitColor = "plum"; break;
      case "groen": bgLitColor = "lightgreen"; break;
      case "rood": bgLitColor = "red"; break;

    }

    report_sheet.appendRow(rowArray);

    var lrow = rsBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);

    var datumCell = lrow.getCell(1, 1);
    datumCell.setBackground(bgLitColor);



    var n = lrow.getNumColumns();

    for (var i = 5; i <= n; i++) {
      var nameCell = lrow.getCell(1, i);
      nameCell.setHorizontalAlignment("center");

      nameCell.setBorder(true, null, true, null, true, true);


      var cellContent = nameCell.getValues().toString();
      var bgCellColor = "white";
      if (cellContent.includes("Blom")) bgCellColor = "Ivory";
      if (cellContent.includes("Blij")) bgCellColor = "Lavender";
      if (cellContent.includes("Boelee")) bgCellColor = "DarkSalmon";
      if (cellContent.includes("Steenblik")) bgCellColor = "MistyRose";
      if (cellContent.includes("Ketterink")) bgCellColor = "lightblue";
      if (cellContent.includes("Kroon")) bgCellColor = "lightblue";
      if (cellContent.includes("Vliet")) bgCellColor = "gold";
      if (cellContent.includes("Luitwieler")) bgCellColor = "cyan";
      if (cellContent.includes("Geven")) bgCellColor = "lightgreen";
      nameCell.setBackground(bgCellColor);
    }

  }
  report_sheet.setColumnWidth(1, 50);
  var cell = report_sheet.getRange("A:A");
  cell.setHorizontalAlignment("center");


  // Conditional formatting

  for (i = 0; i < hdrRowSize.length; i++) {
    var col = i + 1;
    var w = hdrRowSize[i];
    //report_sheet.setColumnWidth(col, w);
    report_sheet.setColumnWidth(i + 1, hdrRowSize[i]);
  }

  var numRows = report_sheet.getLastRow();
  var maxRows = report_sheet.getMaxRows();
  if (maxRows > numRows)
    report_sheet.deleteRows(numRows + 1, maxRows - numRows);
  var numRows = report_sheet.getLastRow();
  var numCols = report_sheet.getLastColumn();
  var maxCols = report_sheet.getMaxColumns();
  if (maxCols > numCols)
    report_sheet.deleteColumns(numCols + 1, maxCols - numCols);

  // Conditional formatting

  return report_sheet;
}


function rsVerwijderAlleRoosters(curYear = 2026) {
  rsVerwijderWerkbladenMetVoorvoegsel("Rooster-" + curYear);
}


/**
 * Deletes all sheets whose name starts with the specified prefix.
 *
 * @param {string} prefix
 * @return {number} Number of sheets deleted.
 */


function rsVerwijderWerkbladenMetVoorvoegsel(prefix) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  // Don't delete the last remaining sheet.
  const matchingSheets = sheets.filter(sheet =>
    sheet.getName().startsWith(prefix)
  );

  if (matchingSheets.length >= sheets.length) {
    throw new Error('Cannot delete all sheets in the spreadsheet.');
  }

Logger.log(matchingSheets.length);
  matchingSheets.forEach(sheet => {
    Logger.log("Deleting " + sheet.getName());
    ss.deleteSheet(sheet);
  });

  return matchingSheets.length;
}


function rsMaakJaarrooster(curYear = 2026) {
  rsMaakRoosterWerkblad(rsMaakJaarroosterNaam(curYear), "Rooster - " + curYear, crBepaalBeginVanJaar(curYear), 12);
}


function rsMaakHalfjaarrooster1(curYear = 2026) {

  rptStartDate = crMaakBegindatumVanMaand(0, curYear);

  var sheetPos = "1e halfjaar"; var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(0, curYear);
  var sheetPos = "1e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(3, curYear);
  var sheetPos = "2e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

}


function rsMaakHalfjaarrooster2(curYear = 2026) {

  rptStartDate = crMaakBegindatumVanMaand(6, curYear);

  var sheetPos = "2e halfjaar"; var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(6, curYear);
  var sheetPos = "3e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(9, curYear);
  var sheetPos = "4e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, "MMMM yyyy");
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

}


function rsMaakJaarroosterNaam(curYear = 2026) {
  return "Rooster-" + curYear;
}


function rsVerzendJaarrooster(curYear = 2026) {

  var rptSheetName = rsMaakJaarroosterNaam(curYear);

  var ss = SpreadsheetApp.getActive().getSheetByName(rptSheetName);
  var ui = SpreadsheetApp.getUi();

  if (!ss)
    rsMaakJaarrooster(curYear);

  var emailTo = crLeesConfiguratie("Mailinglijst - Jaarrooster");
  if (!emailTo) {
    Logger.log("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt: " + emailTo);
    SpreadsheetApp.getUi().alert("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt");
    return;
  }


  var pdf = exConverteerWerkbladNaarPdf(rptSheetName);
  var xlsx = exConverteerWerkbladNaarXlsx(rptSheetName);

  var emailBody = "Jaar rooster " + curYear + "";

  var emailTextBody = 'Zie HTML gedeelte';
  var emailSubject = 'JaarRooster';
  var myself = "avandervliet@pg-didam.nl";

  Logger.log("\nJaar Rooster verzenden aan :" + emailTo);
  Logger.log("\nSubj:" + emailSubject);
  Logger.log("\nText=" + emailTextBody);
  Logger.log("\nbcc=" + emailTo);


  MailApp.sendEmail(
    "",
    emailSubject,
    emailTextBody,
    {
      bcc: emailTo,
      name: 'Automatisch verzonden email',
      htmlBody: emailBody,
      attachments: [xlsx, pdf]
    }
  );

}


var colcount = 1;


function rsStelTabelkolommenIn(tableRow) {
  colcount = tableRow.length;
}


function rsMaakHtmlElementen(tag, tableRow) {
  var msg = "";
  for (i in tableRow) {
    msg += rsMaakHtmlElement(tag, tableRow[i]);
  }
  return msg;
}


function rsMaakHtmlElement(tag, val) {
  return ("<" + tag + ">" + val + "</" + tag + ">");
}


function rsMaakHtmlElementMetOptie(tag, opt, val) {
  return ("<" + tag + " " + opt + ">" + val + "</" + tag + ">");
}


function rsVoegTabelrijMetEenKolomToe(tag, val) {

  return rsMaakHtmlElement("tr", rsMaakHtmlElementMetOptie(tag, "colspan=\"" + colcount + "\"   style=\"text-align:center;\" ", val));

}


function rsVoegTabelrijToe(tag, hdrRow) {

  return rsMaakHtmlElement("tr", rsMaakHtmlElementen(tag, hdrRow));

}


// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden


function rsMaakHtmlRooster(rptStartDate = crZetOpBeginVanDag(), rptNumMonths = 3) {


  // HACK -- don't go past June!; 3rd arg to AddMonthsToDate !

  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];

  var htmlFullResult = "";  // hier komt de volledige HTML broncode in terecht (titels + tabellen)
  var htmlTable = "";   // dit is voor de tabel per maand

  var curInTable = false; // dit geeft aan of we momenteel in een tabel zitten

  rsStelTabelkolommenIn(hdrRow);

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelecteerGegevens(rptStartDate, rptEndDate);

  var rptMonth = "";

  for (var i in a_type) {
    var t = a_type[i];
    var monthName = crFormatteerDatum(a_rowDate[i], "MMMM");
    if (monthName !== rptMonth) {
      if (curInTable) {
        htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
        htmlTable = ""; // wis tabel
      }
      htmlFullResult += rsMaakHtmlElement("h2", monthName);  // voeg titel met maandnaam toe

      htmlTable = rsVoegTabelrijToe("th", hdrRow); // voeg kolomhoofden toe aan de tabel
      rptMonth = monthName;
      curInTable = true;
    }

    var rowArray = [
      crFormatteerDatum(a_rowDate[i], "EEE d MMMM") + nl
      + crFormatteerDatum(a_rowDate[i], "HH:mm")
      // + nl + 'week ' + crBepaalWeeknummer(a_rowDate[i]).toString()           // week aanduiding
      ,
      // a_titel[i] + nl +
      // 'Voorganger: ' +
      a_voorganger[i]
      // + nl + crVoegTekstToeIndienGevuld('Koster: ', a_koster[i])
      // + crVoegTekstToeIndienGevuld(', Kerktv: ', a_kerktv[i])
      // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
      , a_bijz[i].replace(/,\s*/g, nl)
      , a_collecte[i]
      , a_koster[i].replace(/,\s*/g, nl)
      , a_ambtsdragers[i].replace(/,\s*/g, nl)
      , a_lector[i]
      , a_ontvangst[i].replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl)  // replace , and / by newline
      , a_klokkenluider[i].replace(/,\s*/g, nl)
      , a_koffie[i].replace(/,\s*/g, nl)
      , a_kerktv[i].replace(/,\s*/g, nl)

    ];


    htmlTable += rsVoegTabelrijToe("td", rowArray);

  }

  if (curInTable) {
    htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
  }
  return htmlFullResult;
}
