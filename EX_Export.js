/**
 * Module: EX_Export.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function exConverteerWerkbladNaarXlsx(werkbladnaam) {
  return exExporteerWerkblad(werkbladnaam, "xlsx");
}


function exConverteerWerkbladNaarPdf(werkbladnaam) {
  return exExporteerWerkblad(werkbladnaam, "pdf");
}


/** Exporteert één werkblad en vervangt een eerder exportbestand met dezelfde naam. */
function exExporteerWerkblad(werkbladnaam, formaat) {
  var toegestaan = new Set(["xlsx", "pdf"]);
  if (!toegestaan.has(formaat)) {
    throw new Error("Niet-ondersteund exportformaat: " + formaat);
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var werkblad = spreadsheet.getSheetByName(werkbladnaam || "Jaarrooster");
  if (!werkblad) {
    throw new Error("Werkblad voor export ontbreekt: " + werkbladnaam);
  }

  var parameters = [
    "exportFormat=" + formaat,
    "format=" + formaat,
    "size=A4",
    "portrait=false",
    "fitw=true",
    "sheetnames=false",
    "printtitle=false",
    "pagenumbers=false",
    "gridlines=false",
    "fzr=false",
    "gid=" + werkblad.getSheetId()
  ].join("&");
  var url = "https://docs.google.com/spreadsheets/d/" + spreadsheet.getId() + "/export?" + parameters;
  var respons = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() }
  });

  var bestandsnaam = werkblad.getName() + "." + formaat;
  var bestaandeBestanden = DriveApp.getFilesByName(bestandsnaam);
  while (bestaandeBestanden.hasNext()) {
    bestaandeBestanden.next().setTrashed(true);
  }

  var exportbestand = DriveApp.createFile(respons.getBlob().setName(bestandsnaam));
  exportbestand.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  return exportbestand.getDownloadUrl();
}


/* The following functions convert Documents to PDF/xlsx/docx */


function exConverteerDocumentNaarPdf(documentId) {
  var file = Drive.Files.get(documentId);
  var url = file.exportLinks['application/pdf'];
  var oauthToken = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + oauthToken
    }
  });
  return response.getBlob();
}


/*
 See formats in https://developers.google.com/drive/api/v3/ref-export-formats

  PDF	application/pdf
  MS Word document	application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Spreadsheets	  MS Excel	                  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                  Open Office sheet	          application/x-vnd.oasis.opendocument.spreadsheet
*/


function exConverteerDocumentNaarDocx(documentId) {
  var file = Drive.Files.get(documentId);
  var url = file.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  var oauthToken = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + oauthToken
    }
  });
  return response.getBlob();
}


function exConverteerDocumentNaarXlsx(documentId) {
  var file = Drive.Files.get(documentId);
  var url = file.exportLinks['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  var oauthToken = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + oauthToken
    }
  });
  return response.getBlob();
}


function exMaakJaarroosterXlsx() {
  curYear = 2026;
  exMaakRoosterXlsx("Rooster-" + curYear + "-xlsx", "Rooster - " + curYear + "xlsx", crBepaalBeginVanJaar(curYear), 12);
}


function exMaakHalfjaarroosterXlsx() {
  curYear = 2026;
  exMaakRoosterXlsx("Rooster-" + curYear + "-6maand-xlsx", "Rooster - " + curYear + "xlsx", crBepaalBeginVanMaand(), 6);
}


// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden


function exMaakRoosterXlsx(argSheetName = "", argSheetTitle = "", rptStartDate = crBepaalBeginVanMaand(), rptNumMonths = 3) {

  /*
  Local functions
  */

  function exVoegKoprijToe() {
    report_sheet.appendRow(hdrRow);
    lrow = exMaakLaatsteRijOp(fg_title, bg_title, 10);
    lrow = exBereikNamenrij(); // Center name cells
    lrow.setHorizontalAlignment("center");
  }

  var rptSheetName = (argSheetName) ? argSheetName : rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = (argSheetTitle) ? argSheetTitle : rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);

  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);


  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate)
    return;

  var sizeDateCol = 80;
  var sizeDateWideCol = 120;
  var sizeTimeCol = 60;
  var sizeNameCol = 105;
  var sizeNameWideCol = 130;
  var sizeSpecCol = 125;
  var sizeOfferCol = 180;

  var hdrRow = ["DatumTijd", "Datum", "Tijd", "Voorganger", "Bijzonderheden", "Collectie", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [sizeDateWideCol, sizeDateCol, sizeTimeCol, sizeSpecCol, sizeSpecCol, sizeOfferCol, sizeNameCol, sizeNameCol, sizeNameCol, sizeNameWideCol, sizeNameCol, sizeNameCol, sizeNameCol];

  var rptNumCols = hdrRow.length;

  var fg_title = "black"; var bg_title = "white";

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var report_sheet = crMaakOfLeegWerkblad(rptSheetName);

  function exBereikLaatsteRij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 1, 1, rptNumCols);
  }

  function exBereikNamenrij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 5, 1, rptNumCols);
  }

  function exMaakLaatsteRijOp(fgColor, bgColor, fontSize) {
    var lrow = exBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setFontSize(fontSize);
    lrow.setFontColor(fgColor);
    lrow.setFontWeight('bold');
    lrow.setVerticalAlignment("top");
    lrow.setWrap(true);
    return lrow;
  }

  /*
  Haal alle gegevens op in één grote array
  tussen begindatum en einddatum
  */
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider, a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelecteerGegevens(rptStartDate, rptEndDate);

  var bgColor = BG_COL1;

  /* Begin met sheet te vullen */
  var nowDate = new Date();

  /* report_sheet.appendRow([rptTitle]);
  var lrow = exMaakLaatsteRijOp(fg_title, bg_title, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  report_sheet.setRowHeight(1, 60);

  report_sheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, "DMT")])
  lrow = exMaakLaatsteRijOp(fg_title, bg_title, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");        // gecentreerd */

  var rptMonth = "";

  var altColor = BG_COL1;

  var nl = "\n";

  exVoegKoprijToe();

  /* loop over de array met gegevens */
  for (var i in a_type) {
    var t = a_type[i];



    bgColor = altColor;

    var monthName = crFormatteerDatum(a_rowDate[i], "MMMM");

    if (monthName !== rptMonth) {   // Als niet gelijk aan vorige maand, dan beginnen we aan een nieuwe maand

      rptMonth = monthName;

      /* Wissel achtergrondkleur */
      if (altColor == BG_COL1)
        altColor = BG_COL2;
      else
        altColor = BG_COL1;

      /* commented out
      report_sheet.appendRow([monthName]);

      lrow = exMaakLaatsteRijOp(fg_title, bg_title, 18);    // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center");        // gecentreerd
      lrow.setVerticalAlignment("middle");        // gecentreerd

      report_sheet.setRowHeight(report_sheet.getLastRow(), 60);



      */
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
      // crFormatteerDatum(a_rowDate[i], "EE d MMMM")
      a_rowDate[i]
      , crFormatteerDatum(a_rowDate[i], "EE d MMMM")
      , crFormatteerDatum(a_rowDate[i], "HH:mm")
      , a_voorganger[i]
      , a_bijz[i].replace(/,\s*/g, nl)
      , a_collecte[i]
      , a_koster[i].replace(/,\s*/g, nl)
      , a_ambtsdragers[i].replace(/,\s*/g, nl)
      , a_lector[i]
      , a_ontvangst[i].replace(/,\s*/g, nl)
      , a_klokkenluider[i].replace(/,\s*/g, nl)
      , a_koffie[i].replace(/,\s*/g, nl)
      , a_kerktv[i].replace(/,\s*/g, nl)
      // , a_kleur[i]                                // kleur aanduiding
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

    var lrow = exBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);

    var datumCell;

    for (var i = 1; i <= 3; i++) {
      datumCell = lrow.getCell(1,i);
      datumCell.setBackground(bgLitColor);
    }

    var n = lrow.getNumColumns();

    for (var i = 6; i <= n; i++) {
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


function exVerzendJaarroosterXlsx(curYear = 2026) {

  var rptSheetName = "Rooster-" + curYear + "-xlsx";

  var ss = SpreadsheetApp.getActive().getSheetByName(rptSheetName);

  if (!ss)
    exMaakJaarroosterXlsx(curYear);

  var emailTo = crLeesConfiguratie("Mailinglijst - Jaarrooster");
  if (!emailTo) {
    Logger.log("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt: " + emailTo);
    SpreadsheetApp.getUi().alert("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt");
    return;
  }

  var pdf = exConverteerWerkbladNaarPdf(rptSheetName);
  var xlsx = exConverteerWerkbladNaarXlsx(rptSheetName);


  var emailBody = "Jaar rooster " + curYear;

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
