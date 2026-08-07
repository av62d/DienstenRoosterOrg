/**
 * Module: EX_Export.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function exConverteerWerkbladNaarXlsx(sheetName) {
  return exExporteerWerkblad(sheetName, "xlsx");
}
function exConverteerWerkbladNaarPdf(sheetName) {
  return exExporteerWerkblad(sheetName, "pdf");
}

/** Exporteert één werkblad en vervangt een eerder exportbestand met dezelfde naam. */
function exExporteerWerkblad(sheetName, formaat) {
  var allowed = new Set(["xlsx", "pdf"]);
  if (!allowed.has(formaat)) {
    throw new Error("Niet-ondersteund exportformaat: " + formaat);
  }
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName || "Jaarrooster");
  if (!sheet) {
    throw new Error("Werkblad voor export ontbreekt: " + sheetName);
  }
  var parameters = ["exportFormat=" + formaat, "format=" + formaat, "size=A4", "portrait=false", "fitw=true", "sheetnames=false", "printtitle=false", "pagenumbers=false", "gridlines=false", "fzr=false", "gid=" + sheet.getSheetId()].join("&");
  var url = "https://docs.google.com/spreadsheets/d/" + spreadsheet.getId() + "/export?" + parameters;
  var respons = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  });
  var fileName = sheet.getName() + "." + formaat;
  var existingFiles = DriveApp.getFilesByName(fileName);
  while (existingFiles.hasNext()) {
    existingFiles.next().setTrashed(true);
  }
  var exportblob = respons.getBlob().setName(fileName);
  var exportFile = DriveApp.createFile(exportblob);
  exportFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  return exportblob;
}

/* The following functions convert Documents to PDF/xlsx/docx */

/*
 See formats in https://developers.google.com/drive/api/v3/ref-export-formats

  PDF	application/pdf
  MS Word document	application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Spreadsheets	  MS Excel	                  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                  Open Office sheet	          application/x-vnd.oasis.opendocument.spreadsheet
*/

function exMaakJaarroosterXlsx(curYear = new Date().getFullYear()) {
  exMaakRoosterXlsx("Rooster-" + curYear + "-xlsx", "Rooster - " + curYear + " xlsx", crBepaalBeginVanJaar(curYear), 12);
}

// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden

function exMaakRoosterXlsx(argSheetName = "", argSheetTitle = "", rptStartDate = crBepaalBeginVanMaand(), rptNumMonths = 3) {
  var startTime = crStartMeting();
  var rptSheetName = argSheetName || rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = argSheetTitle || rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);
  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);
  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate) return;
  var hdrRow = ["Datum en tijd", "Voorganger", "Bijzonderheden", "Collectie", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [155, 125, 125, 180, 105, 105, 105, 130, 105, 105, 105];
  var rptNumCols = hdrRow.length;
  var roster = rsSelecteerGegevens(rptStartDate, rptEndDate);
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  var rows = [hdrRow];
  var backgrounds = [new Array(rptNumCols).fill("white")];
  var alignments = [new Array(rptNumCols).fill("center")];
  var nl = "\n";
  var personColors = {
    Blom: "Ivory",
    Blij: "Lavender",
    Boelee: "DarkSalmon",
    Steenblik: "MistyRose",
    Ketterink: "lightblue",
    Kroon: "lightblue",
    Vliet: "gold",
    Luitwieler: "cyan",
    Geven: "lightgreen"
  };
  for (var i = 0; i < roster.datums.length; i++) {
    var row = [roster.datums[i], roster.voorgangers[i], String(roster.bijzonderheden[i] || "").replace(/,\s*/g, nl), roster.collectes[i], String(roster.kosters[i] || "").replace(/,\s*/g, nl), String(roster.ambtsdragers[i] || "").replace(/,\s*/g, nl), roster.lectoren[i], String(roster.ontvangst[i] || "").replace(/,\s*/g, nl), String(roster.klokkenluiders[i] || "").replace(/,\s*/g, nl), String(roster.koffie[i] || "").replace(/,\s*/g, nl), String(roster.kerktv[i] || "").replace(/,\s*/g, nl)];
    rows.push(row);
    var colorName = String(roster.kleuren[i] || "").toLowerCase();
    var liturgicalColor = {
      wit: "white",
      roze: "pink",
      paars: "plum",
      groen: "lightgreen",
      rood: "red"
    }[colorName] || "white";
    var colors = new Array(rptNumCols).fill(crRowBg);
    colors[0] = liturgicalColor;
    for (var col = 3; col < rptNumCols; col++) {
      var text = String(row[col] || "");
      Object.keys(personColors).some(function (name) {
        if (text.indexOf(name) >= 0) {
          colors[col] = personColors[name];
          return true;
        }
        return false;
      });
    }
    backgrounds.push(colors);
    alignments.push(row.map(function (_, index) {
      return index >= 3 ? "center" : "left";
    }));
  }
  if (reportSheet.getMaxRows() < rows.length) reportSheet.insertRowsAfter(reportSheet.getMaxRows(), rows.length - reportSheet.getMaxRows());
  if (reportSheet.getMaxColumns() < rptNumCols) reportSheet.insertColumnsAfter(reportSheet.getMaxColumns(), rptNumCols - reportSheet.getMaxColumns());
  var fullRange = reportSheet.getRange(1, 1, rows.length, rptNumCols);
  fullRange.setValues(rows).setBackgrounds(backgrounds).setHorizontalAlignments(alignments).setVerticalAlignment("middle").setWrap(true);
  reportSheet.getRange(1, 1, 1, rptNumCols).setFontWeight("bold").setFontSize(10);
  if (rows.length > 1) reportSheet.getRange(2, 1, rows.length - 1, 1).setNumberFormat("d mmmm yyyy HH:mm");
  if (rows.length > 1) {
    reportSheet.setRowHeights(2, rows.length - 1, 40);
    reportSheet.getRange(2, 4, rows.length - 1, rptNumCols - 3).setBorder(true, null, true, null, true, true);
  }
  reportSheet.getRange(1, 1, rows.length, 1).setHorizontalAlignment("center");
  hdrRowSize.forEach(function (breedte, index) {
    reportSheet.setColumnWidth(index + 1, breedte);
  });
  var extraRows = reportSheet.getMaxRows() - rows.length;
  if (extraRows > 0) reportSheet.deleteRows(rows.length + 1, extraRows);
  var extraCols = reportSheet.getMaxColumns() - rptNumCols;
  if (extraCols > 0) reportSheet.deleteColumns(rptNumCols + 1, extraCols);
  crEindMeting("exMaakRoosterXlsx", startTime, {
    rijen: rows.length,
    kolommen: rptNumCols
  });
  return reportSheet;
}
function exVerzendJaarroosterXlsx(curYear = 2026) {
  var rptSheetName = "Rooster-" + curYear + "-xlsx";
  var ss = SpreadsheetApp.getActive().getSheetByName(rptSheetName);
  if (!ss) exMaakJaarroosterXlsx(curYear);
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
  cmVerzendEmail(emailTo, emailSubject, {
    textBody: emailTextBody,
    name: 'Automatisch verzonden email',
    htmlBody: emailBody,
    attachments: [xlsx, pdf],
    mode: "bcc",
    to: myself
  });
}
