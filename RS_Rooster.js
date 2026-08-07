/**
 * Module: RS_Rooster.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

/**
 * Leest Voorpagina één keer en bouwt benoemde arrays voor alle roosterfuncties.
 * Kolommen worden uitsluitend via het centrale schema gevonden; de fysieke
 * kolomvolgorde in het werkblad speelt hierdoor geen rol.
 */
function rsSelecteerGegevens(argStartDate = new Date(), argEndDate = new Date()) {
  // Zet tijd van begindatum op 0:00 en van einddatum op 23:59
  argStartDate.setHours(0);
  argStartDate.setMinutes(0);
  argEndDate.setHours(23);
  argEndDate.setMinutes(59);
  var types = [];
  var rowDates = [];
  var ministers = [];
  var notes = [];
  var collections = [];
  var readers = [];
  var officers = [];
  var sextons = [];
  var coffeeHosts = [];
  var greeters = [];
  var bellRingers = [];
  var churchTv = [];
  var colors = [];
  var communions = [];
  var communionForms = [];
  var sundayNames = [];
  var collectionCategories = [];
  var exitCollections = [];
  var originalReaders = [];
  var readerChanges = [];
  var quarters = [];
  var coffeeServices = [];
  var didamServices = [];
  var titles = new Array();
  var actSheet = SpreadsheetApp.getActiveSpreadsheet();
  var srcSheet = actSheet.getSheetByName('Voorpagina');
  if (!srcSheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var cols = bhMaakVoorpaginaKolomindex(srcSheet);
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
    var service = bhMaakDienstVanRij(rawData[i], cols);
    var rowDate = new Date(service.Datum);
    if (isNaN(rowDate.getTime())) continue;
    if (rowDate < argStartDate || rowDate > argEndDate) continue;
    dataIdx++;
    rowDates.push(rowDate);
    types.push("");
    var fullTitle = service.Voorganger;
    if (service.Bijzonderheden) fullTitle += ", " + service.Bijzonderheden;
    titles.push(fullTitle);
    var fullNotes = service.Bijzonderheden;
    ministers.push(service.Voorganger);
    notes.push(fullNotes);
    sextons.push(service.Koster);
    colors.push(service.Kleur);
    churchTv.push(service.KerkTV);
    collections.push(service.Collecte);
    coffeeHosts.push(String(service.Koffie || "").replace(/\n/g, ", "));
    greeters.push(String(service.Ontvangst || "").replace(/\n/g, ", "));
    communions.push(service.HeiligAvondmaal);
    readers.push(service.Lector);
    var officerText = service.Ouderling || "";
    if (service.Extra) officerText += (officerText ? ", " : "") + service.Extra;
    officers.push(officerText);
    bellRingers.push(service.Klokkenluider);

    // extra toegevoegd d.d. 20-12-2024

    communionForms.push(service.Avondmaalsvorm);
    sundayNames.push(service.NaamZondag);
    collectionCategories.push(service.CollecteCategorie);
    exitCollections.push(service.Uitgangscollecte);
    // Behoud de bestaande uitvoerstructuur voor afnemende rapportfuncties.
    originalReaders.push(service.Lector);
    readerChanges.push(false);
    quarters.push(service.Kwartaal);
    coffeeServices.push(service.KoffieDienst);
    didamServices.push(service.DidamDienst);
  }
  var headers = ["Headers", "Datum", "Type", "Titel", "Voorganger", "Bijzonderheden", "Koster", "kleur", "Collecte", "Koffie", "Ontvangst", "HA", "Lector", "Ambtsdragers", "Klokkenluider", "KerkTV", "HA vorm", "Naam van de Zondag", "Collecte Categorie", "Uitgangscollecte", "LectorOrig", "LectorWissel", "Kwartaal", "KoffieDienst", "DidamDienst"];
  return {
    koppen: headers,
    datums: rowDates,
    types: types,
    titels: titles,
    voorgangers: ministers,
    bijzonderheden: notes,
    kosters: sextons,
    kleuren: colors,
    collectes: collections,
    koffie: coffeeHosts,
    ontvangst: greeters,
    avondmaal: communions,
    lectoren: readers,
    ambtsdragers: officers,
    klokkenluiders: bellRingers,
    kerktv: churchTv,
    havormen: communionForms,
    zondagnamen: sundayNames,
    collectecategorieen: collectionCategories,
    uitgangscollectes: exitCollections,
    oorspronkelijkeLectoren: originalReaders,
    lectorWissels: readerChanges,
    kwartalen: quarters,
    koffieDiensten: coffeeServices,
    didamDiensten: didamServices
  };
}
function rsMaakRoosterWerkbladnaam(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6:
      title = 'half jaar';
      break;
    case 12:
      title = 'heel jaar';
      break;
    default:
      title = rptNumMonths + " maanden";
      break;
  }
  return "Rooster-" + crFormatteerDatum(startDate, crDateFormat.JAAR) + " " + title;
}
function rsMaakRoosterWerkbladtitel(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6:
      title = 'half jaar';
      break;
    case 12:
      title = 'heel jaar';
      break;
    default:
      title = rptNumMonths + " maanden";
      break;
  }
  return "Rooster " + title + " vanaf " + crFormatteerDatum(startDate, crDateFormat.MAAND_JAAR);
}

// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden

function rsMaakRoosterWerkblad(argSheetName = "", argSheetTitle = "", rptStartDate = crBepaalBeginVanMaand(), rptNumMonths = 3) {
  var startTime = crStartMeting();
  var rptSheetName = argSheetName || rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = argSheetTitle || rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);
  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);
  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate) return;
  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Lector", "Ambtsdragers", "Koster", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [80, 150, 120, 200, 105, 105, 105, 130, 105, 105, 105];
  var rptNumCols = hdrRow.length;
  var roster = rsSelecteerGegevens(rptStartDate, rptEndDate);
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  var rows = [];
  var types = [];
  var backgrounds = [];
  var dataSegments = [];
  var currentSegment = null;
  function rsVoegRapportRijToe(values, type, background, liturgicalColor) {
    var row = values.slice(0, rptNumCols);
    while (row.length < rptNumCols) row.push("");
    rows.push(row);
    types.push(type);
    var colors = new Array(rptNumCols).fill(background || "white");
    if (liturgicalColor) colors[0] = liturgicalColor;
    backgrounds.push(colors);
  }
  rsVoegRapportRijToe([rptTitle], "titel", "white");
  rsVoegRapportRijToe(["Afgedrukt: " + crFormatteerDatum(new Date(), crDateFormat.DATUM_TIJD_ZONDER_JAAR)], "afdruk", "white");
  var previousMonth = "";
  var alternateColor = crRowBg;
  var nl = "\n";
  for (var i = 0; i < roster.datums.length; i++) {
    var monthName = crFormatteerDatum(roster.datums[i], crDateFormat.MAAND);
    if (monthName !== previousMonth) {
      rsVoegRapportRijToe([monthName], "maand", "white");
      rsVoegRapportRijToe(hdrRow, "kop", "blue");
      previousMonth = monthName;
      currentSegment = {
        start: rows.length + 1,
        aantal: 0
      };
      dataSegments.push(currentSegment);
    }
    alternateColor = alternateColor === crRowBg ? crAltRowBg : crRowBg;
    var background = alternateColor;
    var colorName = String(roster.kleuren[i] || "").toLowerCase();
    var liturgicalColor = {
      wit: "white",
      roze: "pink",
      paars: "plum",
      groen: "lightgreen",
      rood: "red"
    }[colorName] || "white";
    var isDidam = String(roster.didamDiensten[i] || "").toLowerCase() === "ja";
    var row;
    if (isDidam) {
      row = [crFormatteerDatum(roster.datums[i], crDateFormat.DATUM_KORT) + nl + crFormatteerDatum(roster.datums[i], crDateFormat.TIJD) + " uur", roster.voorgangers[i], String(roster.bijzonderheden[i] || "").replace(/,\s*/g, nl), roster.collectes[i], roster.lectoren[i], String(roster.ambtsdragers[i] || "").replace(/,\s*/g, nl), String(roster.kosters[i] || "").replace(/,\s*/g, nl), String(roster.ontvangst[i] || "").replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl), String(roster.klokkenluiders[i] || "").replace(/,\s*/g, nl), String(roster.koffie[i] || "").replace(/,\s*/g, nl), String(roster.kerktv[i] || "").replace(/,\s*/g, nl)];
    } else {
      row = [crFormatteerDatum(roster.datums[i], crDateFormat.DATUM_KORT), roster.voorgangers[i], String(roster.bijzonderheden[i] || "").replace(/,\s*/g, nl), "", "", "", "", "", "", "", ""];
    }
    rsVoegRapportRijToe(row, "gegevens", background, liturgicalColor);
    currentSegment.aantal++;
  }
  if (reportSheet.getMaxRows() < rows.length) reportSheet.insertRowsAfter(reportSheet.getMaxRows(), rows.length - reportSheet.getMaxRows());
  if (reportSheet.getMaxColumns() < rptNumCols) reportSheet.insertColumnsAfter(reportSheet.getMaxColumns(), rptNumCols - reportSheet.getMaxColumns());
  var fullRange = reportSheet.getRange(1, 1, rows.length, rptNumCols);
  fullRange.setValues(rows).setBackgrounds(backgrounds).setVerticalAlignment("middle").setWrap(true);
  types.forEach(function (type, index) {
    var rowNum = index + 1;
    if (type === "titel" || type === "afdruk" || type === "maand") {
      var range = reportSheet.getRange(rowNum, 1, 1, rptNumCols);
      range.mergeAcross().setHorizontalAlignment("center").setFontWeight("bold");
      if (type === "titel") range.setFontSize(24);
      if (type === "afdruk") range.setFontSize(9);
      if (type === "maand") range.setFontSize(18);
      reportSheet.setRowHeight(rowNum, type === "afdruk" ? 21 : 60);
    } else if (type === "kop") {
      reportSheet.getRange(rowNum, 1, 1, rptNumCols).setFontColor("white").setFontWeight("bold").setFontSize(10);
    }
  });
  dataSegments.forEach(function (segment) {
    if (!segment.aantal) return;
    reportSheet.setRowHeights(segment.start, segment.aantal, 40);
    reportSheet.getRange(segment.start, 5, segment.aantal, rptNumCols - 4).setHorizontalAlignment("center").setBorder(true, null, true, null, true, true);
  });
  reportSheet.getRange(1, 1, rows.length, 1).setHorizontalAlignment("center");
  hdrRowSize.forEach(function (breedte, index) {
    reportSheet.setColumnWidth(index + 1, breedte);
  });
  var extraRows = reportSheet.getMaxRows() - rows.length;
  if (extraRows > 0) reportSheet.deleteRows(rows.length + 1, extraRows);
  var extraCols = reportSheet.getMaxColumns() - rptNumCols;
  if (extraCols > 0) reportSheet.deleteColumns(rptNumCols + 1, extraCols);
  var colorSheet = SpreadsheetApp.getActive().getSheetByName("NaamKleuren");
  opPasKleurenToeOpWaarde(colorSheet, reportSheet, 4, 11);
  crEindMeting("rsMaakRoosterWerkblad", startTime, {
    rijen: rows.length,
    kolommen: rptNumCols
  });
  return reportSheet;
}
function rsMaakMaandroosterWerkbladnaam(startDate = new Date()) {
  var title = "";
  return "Rooster-" + crFormatteerDatum(startDate, crDateFormat.SORTEERMAAND);
}
function rsMaakMaandroosterWerkbladtitel(startDate = new Date()) {
  var title = "";
  return crFormatteerDatum(startDate, crDateFormat.MAAND_JAAR);
}

// Maak Rooster voor één maand

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
  const matchingSheets = sheets.filter(sheet => sheet.getName().startsWith(prefix));
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
  var sheetPos = "1e halfjaar";
  var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
  rptStartDate = crMaakBegindatumVanMaand(0, curYear);
  var sheetPos = "1e kwartaal";
  var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
  rptStartDate = crMaakBegindatumVanMaand(3, curYear);
  var sheetPos = "2e kwartaal";
  var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
}
function rsMaakHalfjaarrooster2(curYear = 2026) {
  rptStartDate = crMaakBegindatumVanMaand(6, curYear);
  var sheetPos = "2e halfjaar";
  var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
  rptStartDate = crMaakBegindatumVanMaand(6, curYear);
  var sheetPos = "3e kwartaal";
  var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
  rptStartDate = crMaakBegindatumVanMaand(9, curYear);
  var sheetPos = "4e kwartaal";
  var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
}
function rsMaakJaarroosterNaam(curYear = 2026) {
  return "Rooster-" + curYear;
}
function rsVerzendJaarrooster(curYear = 2026) {
  var rptSheetName = rsMaakJaarroosterNaam(curYear);
  var ss = SpreadsheetApp.getActive().getSheetByName(rptSheetName);
  var ui = SpreadsheetApp.getUi();
  if (!ss) rsMaakJaarrooster(curYear);
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
  cmVerzendEmail(emailTo, emailSubject, {
    textBody: emailTextBody,
    name: 'Automatisch verzonden email',
    htmlBody: emailBody,
    attachments: [xlsx, pdf],
    mode: "bcc",
    to: myself
  });
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
  return "<" + tag + ">" + val + "</" + tag + ">";
}
function rsMaakHtmlElementMetOptie(tag, opt, val) {
  return "<" + tag + " " + opt + ">" + val + "</" + tag + ">";
}
function rsVoegTabelrijToe(tag, hdrRow) {
  return rsMaakHtmlElement("tr", rsMaakHtmlElementen(tag, hdrRow));
}

// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden

function rsMaakHtmlRooster(rptStartDate = crZetOpBeginVanDag(), rptNumMonths = 3) {
  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var htmlFullResult = ""; // hier komt de volledige HTML broncode in terecht (titels + tabellen)
  var htmlTable = ""; // dit is voor de tabel per maand

  var curInTable = false; // dit geeft aan of we momenteel in een tabel zitten

  rsStelTabelkolommenIn(hdrRow);
  var {
    koppen: headers,
    datums: rowDates,
    types: types,
    titels: titles,
    voorgangers: ministers,
    bijzonderheden: notes,
    kosters: sextons,
    kleuren: colors,
    collectes: collections,
    koffie: coffeeHosts,
    ontvangst: greeters,
    avondmaal: communions,
    lectoren: readers,
    ambtsdragers: officers,
    klokkenluiders: bellRingers,
    kerktv: churchTv,
    havormen: communionForms,
    zondagnamen: sundayNames,
    collectecategorieen: collectionCategories,
    uitgangscollectes: exitCollections
  } = rsSelecteerGegevens(rptStartDate, rptEndDate);
  var rptMonth = "";
  for (var i in types) {
    var t = types[i];
    var monthName = crFormatteerDatum(rowDates[i], crDateFormat.MAAND);
    if (monthName !== rptMonth) {
      if (curInTable) {
        htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
        htmlTable = ""; // wis tabel
      }
      htmlFullResult += rsMaakHtmlElement("h2", monthName); // voeg titel met maandnaam toe

      htmlTable = rsVoegTabelrijToe("th", hdrRow); // voeg kolomhoofden toe aan de tabel
      rptMonth = monthName;
      curInTable = true;
    }
    var rowArray = [crFormatteerDatum(rowDates[i], crDateFormat.DATUM_KORT_MET_LANGE_MAAND) + nl + crFormatteerDatum(rowDates[i], crDateFormat.TIJD)
    // + nl + 'week ' + crBepaalWeeknummer(a_rowDate[i]).toString()           // week aanduiding
    ,
    // a_titel[i] + nl +
    // 'Voorganger: ' +
    ministers[i]
    // + nl + crVoegTekstToeIndienGevuld('Koster: ', a_koster[i])
    // + crVoegTekstToeIndienGevuld(', Kerktv: ', a_kerktv[i])
    // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
    , notes[i].replace(/,\s*/g, nl), collections[i], sextons[i].replace(/,\s*/g, nl), officers[i].replace(/,\s*/g, nl), readers[i], greeters[i].replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl) // replace , and / by newline
    , bellRingers[i].replace(/,\s*/g, nl), coffeeHosts[i].replace(/,\s*/g, nl), churchTv[i].replace(/,\s*/g, nl)];
    htmlTable += rsVoegTabelrijToe("td", rowArray);
  }
  if (curInTable) {
    htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
  }
  return htmlFullResult;
}
