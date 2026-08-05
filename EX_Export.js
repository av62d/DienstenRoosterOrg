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

  var exportblob = respons.getBlob().setName(bestandsnaam);
  var exportbestand = DriveApp.createFile(exportblob);
  exportbestand.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
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
  var startMeting = crStartMeting();
  var rptSheetName = argSheetName || rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = argSheetTitle || rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);
  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);
  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate) return;

  var hdrRow = ["Datum en tijd", "Voorganger", "Bijzonderheden", "Collectie", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [155, 125, 125, 180, 105, 105, 105, 130, 105, 105, 105];
  var rptNumCols = hdrRow.length;
  var rooster = rsSelecteerGegevens(rptStartDate, rptEndDate);
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  var rijen = [hdrRow];
  var achtergronden = [new Array(rptNumCols).fill("white")];
  var uitlijningen = [new Array(rptNumCols).fill("center")];
  var nl = "\n";
  var persoonskleuren = {
    Blom: "Ivory", Blij: "Lavender", Boelee: "DarkSalmon", Steenblik: "MistyRose",
    Ketterink: "lightblue", Kroon: "lightblue", Vliet: "gold", Luitwieler: "cyan", Geven: "lightgreen"
  };

  for (var i = 0; i < rooster.datums.length; i++) {
    var rij = [
      rooster.datums[i],
      rooster.voorgangers[i], String(rooster.bijzonderheden[i] || "").replace(/,\s*/g, nl), rooster.collectes[i],
      String(rooster.kosters[i] || "").replace(/,\s*/g, nl), String(rooster.ambtsdragers[i] || "").replace(/,\s*/g, nl),
      rooster.lectoren[i], String(rooster.ontvangst[i] || "").replace(/,\s*/g, nl),
      String(rooster.klokkenluiders[i] || "").replace(/,\s*/g, nl), String(rooster.koffie[i] || "").replace(/,\s*/g, nl),
      String(rooster.kerktv[i] || "").replace(/,\s*/g, nl)
    ];
    rijen.push(rij);

    var kleurNaam = String(rooster.kleuren[i] || "").toLowerCase();
    var liturgischeKleur = { wit: "white", roze: "pink", paars: "plum", groen: "lightgreen", rood: "red" }[kleurNaam] || "white";
    var kleuren = new Array(rptNumCols).fill(rooster.avondmaal[i] ? BG_HA : BG_COL1);
    kleuren[0] = liturgischeKleur;
    for (var kolom = 3; kolom < rptNumCols; kolom++) {
      var tekst = String(rij[kolom] || "");
      Object.keys(persoonskleuren).some(function (naam) {
        if (tekst.indexOf(naam) >= 0) { kleuren[kolom] = persoonskleuren[naam]; return true; }
        return false;
      });
    }
    achtergronden.push(kleuren);
    uitlijningen.push(rij.map(function (_, index) { return index >= 3 ? "center" : "left"; }));
  }

  if (reportSheet.getMaxRows() < rijen.length) reportSheet.insertRowsAfter(reportSheet.getMaxRows(), rijen.length - reportSheet.getMaxRows());
  if (reportSheet.getMaxColumns() < rptNumCols) reportSheet.insertColumnsAfter(reportSheet.getMaxColumns(), rptNumCols - reportSheet.getMaxColumns());
  var volledigBereik = reportSheet.getRange(1, 1, rijen.length, rptNumCols);
  volledigBereik.setValues(rijen).setBackgrounds(achtergronden).setHorizontalAlignments(uitlijningen)
    .setVerticalAlignment("middle").setWrap(true);
  reportSheet.getRange(1, 1, 1, rptNumCols).setFontWeight("bold").setFontSize(10);
  if (rijen.length > 1) reportSheet.getRange(2, 1, rijen.length - 1, 1).setNumberFormat("d mmmm yyyy HH:mm");
  if (rijen.length > 1) {
    reportSheet.setRowHeights(2, rijen.length - 1, 40);
    reportSheet.getRange(2, 4, rijen.length - 1, rptNumCols - 3).setBorder(true, null, true, null, true, true);
  }
  reportSheet.getRange(1, 1, rijen.length, 1).setHorizontalAlignment("center");
  hdrRowSize.forEach(function (breedte, index) { reportSheet.setColumnWidth(index + 1, breedte); });

  var overbodigeRijen = reportSheet.getMaxRows() - rijen.length;
  if (overbodigeRijen > 0) reportSheet.deleteRows(rijen.length + 1, overbodigeRijen);
  var overbodigeKolommen = reportSheet.getMaxColumns() - rptNumCols;
  if (overbodigeKolommen > 0) reportSheet.deleteColumns(rptNumCols + 1, overbodigeKolommen);
  crEindMeting("exMaakRoosterXlsx", startMeting, { rijen: rijen.length, kolommen: rptNumCols });
  return reportSheet;
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
