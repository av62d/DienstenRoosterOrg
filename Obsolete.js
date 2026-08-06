/**
 * Tijdelijk archief voor functies zonder actieve statische aanroep.
 *
 * De oorspronkelijke functienamen en prefixes zijn bewust behouden, zodat
 * handmatige aanroepen vanuit de Apps Script-editor mogelijk blijven.
 */

// Oorspronkelijk uit CM_Communicatie.js

function cmVerzendRoosterbericht() {
  var done = false;
  while (!done) {
    const ui = SpreadsheetApp.getUi();
    const answer = ui.prompt('Extra mededeling:');
    var msg = answer.getResponseText();
    const response = ui.alert(msg, ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response === ui.Button.YES) {
      done = true;
      Logger.log('The user clicked' + answer);
    }
  }
  x = 1;
}
function cmMaakUrlLink(url, text) {
  return "<a href=\"" + url + "\">" + text + "</a>";
}
function cmVerzendDienstenlijst() {
  var n = 4;
  var email = "<h4>Vorige " + n + " diensten</h4>" + ytMaakUploadLijst(n);
  cmVerzendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", {
    textBody: email,
    mode: "together"
  });
}
function cmMaakRoosterbericht() {
  var curDate = new Date();
  var rptWeekStartDate = crTelWekenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);
  var rptWeekEndDate = crTelDagenBijDatumOp(rptWeekStartDate, 1);
  // ambtsdragers

  var msg = cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate);
  return msg;
}
function cmVerzendLectorBericht() {
  var done = false;
  while (!done) {
    const ui = SpreadsheetApp.getUi();
    const answer = ui.prompt('Extra mededeling:');
    var msg = answer.getResponseText();
    const response = ui.alert(msg, ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response === ui.Button.YES) {
      done = true;
      Logger.log('The user clicked' + answer);
    }
  }
  x = 1;
}
function cmMaakLectorrooster(rptWeekStartDate, rptWeekEndDate, rptSheetName = "Lectorrooster", rptTitle = "Lectorrooster") {
  if (!rptSheetName || !rptTitle || !rptWeekStartDate || !rptWeekEndDate) return;
  var sizeNameCol = 105;
  var sizeSpecCol = 125;
  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Lector"];
  var hdrRowSize = [80, sizeSpecCol, sizeSpecCol, sizeNameCol];
  var rptNumCols = hdrRow.length;
  var fgTitle = "black";
  var titleBg = "white";
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  function cmBereikLaatsteRij() {
    var l = reportSheet.getLastRow();
    if (l == 0) l += 1;
    return reportSheet.getRange(l, 1, 1, rptNumCols);
  }
  function cmMaakLaatsteRijOp(fgColor, bgColor, fontSize) {
    var lrow = cmBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setFontSize(fontSize);
    lrow.setFontColor(fgColor);
    lrow.setFontWeight('bold');
    lrow.setVerticalAlignment("top");
    lrow.setWrap(true);
    return lrow;
  }
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
    uitgangscollectes: exitCollections,
    oorspronkelijkeLectoren: originalReaders
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);
  var bgColor = crRowBg;
  var nowDate = new Date();
  reportSheet.appendRow([rptTitle]);
  var lrow = cmMaakLaatsteRijOp(fgTitle, titleBg, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  reportSheet.setRowHeight(1, 60);
  reportSheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, crDateFormat.DATUM_TIJD_ZONDER_JAAR)]);
  lrow = cmMaakLaatsteRijOp(fgTitle, titleBg, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center"); // gecentreerd

  var rptMonth = "";
  var altColor = crRowBg;
  var nl = "\n";
  for (var i in types) {
    var t = types[i];
    if (altColor == crRowBg) altColor = crAltRowBg;else altColor = crRowBg;
    bgColor = altColor;
    var monthName = crFormatteerDatum(rowDates[i], crDateFormat.MAAND);
    if (monthName !== rptMonth) {
      reportSheet.appendRow([monthName]);
      rptMonth = monthName;
      lrow = cmMaakLaatsteRijOp(fgTitle, titleBg, 18); // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center"); // gecentreerd
      lrow.setVerticalAlignment("middle"); // gecentreerd

      reportSheet.setRowHeight(reportSheet.getLastRow(), 60);
      reportSheet.appendRow(hdrRow);
      lrow = cmMaakLaatsteRijOp(fgTitle, titleBg, 10);
    }
    switch (t) {
      case "M":
        bgColor = 'LemonChiffon';
        break;
      case "B HA":
        bgColor = 'AliceBlue';
        break;
      case "Z HA":
        bgColor = 'AliceBlue';
        break;
      case "AV":
        bgColor = 'MistyRose';
        break;
    }
    if (communions[i] != "") {
      bgColor = crCommunionBg;
    }
    var currentReader = "";
    if (readers[i].localeCompare(originalReaders[i])) {
      currentReader += conv.strikethrough(originalReaders[i]);
      currentReader += " - ";
    }
    currentReader += readers[i];
    var rowArray = [crFormatteerDatum(rowDates[i], crDateFormat.DATUM_KORT_MET_LANGE_MAAND) + nl + crFormatteerDatum(rowDates[i], crDateFormat.TIJD)
    // + nl + 'week ' + crBepaalWeeknummer(a_rowDate[i]).toString()           // week aanduiding
    ,
    // a_titel[i] + nl +
    // 'Voorganger: ' +
    ministers[i]
    // + nl + crVoegTekstToeIndienGevuld('Koster: ', a_koster[i])
    // + crVoegTekstToeIndienGevuld(', Kerktv: ', a_kerktv[i])
    // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
    , notes[i].replace(/,\s*/g, nl), currentReader];
    var bgLitColor = "white";
    switch (colors[i]) {
      case "wit":
        bgLitColor = "white";
        break;
      case "roze":
        bgLitColor = "pink";
        break;
      case "paars":
        bgLitColor = "plum";
        break;
      case "groen":
        bgLitColor = "lightgreen";
        break;
      case "rood":
        bgLitColor = "red";
        break;
    }
    reportSheet.appendRow(rowArray);
    var lrow = cmBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);
    var dateCell = lrow.getCell(1, 1);
    dateCell.setBackground(bgLitColor);
  }
  reportSheet.setColumnWidth(1, 50);
  var cell = reportSheet.getRange("A:A");
  cell.setHorizontalAlignment("center");
  for (i = 0; i < hdrRowSize.length; i++) {
    reportSheet.setColumnWidth(i + 1, hdrRowSize[i]);
  }
  var numRows = reportSheet.getLastRow();
  var maxRows = reportSheet.getMaxRows();
  if (maxRows > numRows) reportSheet.deleteRows(numRows + 1, maxRows - numRows);
  var numRows = reportSheet.getLastRow();
  var numCols = reportSheet.getLastColumn();
  var maxCols = reportSheet.getMaxColumns();
  if (maxCols > numCols) reportSheet.deleteColumns(numCols + 1, maxCols - numCols);

  // Conditional formatting

  return reportSheet;
}

// Oorspronkelijk uit CR_Core.js

function crHaalWerkbladOp(argSheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(argSheetName);
}

// Oorspronkelijk uit EX_Export.js

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
function exMaakHalfjaarroosterXlsx() {
  curYear = 2026;
  exMaakRoosterXlsx("Rooster-" + curYear + "-6maand-xlsx", "Rooster - " + curYear + "xlsx", crBepaalBeginVanMaand(), 6);
}

// Oorspronkelijk uit OP_Opmaak.js

function opBepaalKleurtype(type, color) {
  switch (type) {
    case "T":
      color = '#ff00ff';
      break;
    case "Z HA":
    case "B HA":
      color = "#cfe2f3";
      break;
    case "M":
      color = "#fff2cc";
      break;
    case "AV":
      color = "#ead1dc";
      break;
  }
  return color;
}

// Oorspronkelijk uit RS_Rooster.js

function rsSelecteerCriteria() {
  var result;
  var beginDate = new Date();
  beginDate.setHours(0);
  beginDate.setMinutes(0);
  var lastDate = crBepaalEindeVanJaar();
  result = rsSelecteerGegevens(beginDate, crTelMaandenBijDatumOp(beginDate, 3));
  var a = 1;
}
function rsMaakMaandRooster(argDate = new Date(), argSheetName = "", argSheetTitle = "") {
  rptStartDate = crBepaalBeginVanMaand(argDate);
  var rptEndDate = crBepaalEindeVanMaand(argDate);
  var rptSheetName = argSheetName ? argSheetName : rsMaakMaandroosterWerkbladnaam(rptStartDate);
  var rptTitle = argSheetTitle ? argSheetTitle : rsMaakMaandroosterWerkbladtitel(rptStartDate);
  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate) return;
  var sizeNameCol = 105;
  var sizeNameWideCol = 130;
  var sizeSpecCol = 125;
  var sizeOfferCol = 180;
  var hdrRowTitle = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [80, sizeSpecCol, sizeSpecCol, sizeOfferCol, sizeNameCol, sizeNameCol, sizeNameCol, sizeNameWideCol, sizeNameCol, sizeNameCol, sizeNameCol];
  var rptNumCols = hdrRowTitle.length;
  var fgTitle = "black";
  var titleBg = "white";
  var headerColor = "white";
  var headerBg = "black";
  var headerFontSize = 10;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  function rsBereikLaatsteRij() {
    var l = reportSheet.getLastRow();
    if (l == 0) l += 1;
    return reportSheet.getRange(l, 1, 1, rptNumCols);
  }
  function rsBereikNamenrij() {
    var l = reportSheet.getLastRow();
    if (l == 0) l += 1;
    return reportSheet.getRange(l, 5, 1, rptNumCols);
  }
  function rsMaakLaatsteRijOp(fgColor, bgColor, fontSize, fontWeight = "bold", horizontalAlignment = "center", verticalAlignment = "middle") {
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
  var rowNum = 1;
  var startCol = 29;
  var firstCol = 5;
  var secondColOffset = 2;
  var secondCol = 4;
  var bgColor = crRowBg;
  var nowDate = new Date();
  reportSheet.appendRow([rptTitle]);
  var lrow = rsMaakLaatsteRijOp(fgTitle, titleBg, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  reportSheet.setRowHeight(1, 60);
  reportSheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, crDateFormat.DATUM_TIJD_ZONDER_JAAR)]);
  lrow = rsMaakLaatsteRijOp(fgTitle, titleBg, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center"); // gecentreerd

  var rptMonth = "";
  var altColor = crRowBg;
  var nl = "\n";
  for (var i in types) {
    var t = types[i];
    if (altColor == crRowBg) altColor = crAltRowBg;else altColor = crRowBg;
    bgColor = altColor;
    var monthName = crFormatteerDatum(rowDates[i], crDateFormat.MAAND);
    if (monthName !== rptMonth) {
      reportSheet.appendRow([monthName]);
      rptMonth = monthName;
      lrow = rsMaakLaatsteRijOp(fgTitle, titleBg, 18); // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center"); // gecentreerd
      lrow.setVerticalAlignment("middle"); // gecentreerd

      reportSheet.setRowHeight(reportSheet.getLastRow(), 60);
      reportSheet.appendRow(hdrRowTitle);
      lrow = rsMaakLaatsteRijOp(headerColor, headerBg, headerFontSize, "bold", "center");
      lrow = rsBereikNamenrij(); // Center name cells
      lrow.setHorizontalAlignment("center");
    }
    switch (t) {
      case "M":
        bgColor = 'LemonChiffon';
        break;
      case "B HA":
        bgColor = 'AliceBlue';
        break;
      case "Z HA":
        bgColor = 'AliceBlue';
        break;
      case "AV":
        bgColor = 'MistyRose';
        break;
    }
    var communionService = "";
    if (communions[i] != "") {
      bgColor = crCommunionBg;
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
    var bgLitColor = "white";
    switch (colors[i]) {
      case "wit":
        bgLitColor = "white";
        break;
      case "roze":
        bgLitColor = "pink";
        break;
      case "paars":
        bgLitColor = "plum";
        break;
      case "groen":
        bgLitColor = "lightgreen";
        break;
      case "rood":
        bgLitColor = "red";
        break;
    }
    reportSheet.appendRow(rowArray);
    var lrow = rsBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);
    var dateCell = lrow.getCell(1, 1);
    dateCell.setBackground(bgLitColor);
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
  reportSheet.setColumnWidth(1, 50);
  var cell = reportSheet.getRange("A:A");
  cell.setHorizontalAlignment("center");

  // Conditional formatting

  for (i = 0; i < hdrRowSize.length; i++) {
    var col = i + 1;
    var w = hdrRowSize[i];
    reportSheet.setColumnWidth(i + 1, hdrRowSize[i]);
  }
  var numRows = reportSheet.getLastRow();
  var maxRows = reportSheet.getMaxRows();
  if (maxRows > numRows) reportSheet.deleteRows(numRows + 1, maxRows - numRows);
  var numRows = reportSheet.getLastRow();
  var numCols = reportSheet.getLastColumn();
  var maxCols = reportSheet.getMaxColumns();
  if (maxCols > numCols) reportSheet.deleteColumns(numCols + 1, maxCols - numCols);

  // Conditional formatting

  return reportSheet;
}
function rsVoegTabelrijMetEenKolomToe(tag, val) {
  return rsMaakHtmlElement("tr", rsMaakHtmlElementMetOptie(tag, "colspan=\"" + colcount + "\"   style=\"text-align:center;\" ", val));
}

// Oorspronkelijk uit YT_YouTube.js

function ytVerzendLaatsteVideos() {
  var videoCount = 16;
  var email = "<h4>Vorige " + videoCount + " diensten</h4>" + ytMaakUploadLijst(videoCount);
  cmVerzendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", {
    textBody: email,
    mode: "together"
  });
  var x = 2;
}
function ytMaakUploadWerkblad(rptSheet) {
  var uploadData = ytHaalMijnUploadsOp();
  for (var i in uploadData) {
    var s = uploadData[i];
    if (1) rptSheet.appendRow([s]);
    var x1 = s.getChannelId();
    var x2 = s.getChannelTitle();
    var x3 = s.getDescription();
    var x4 = s.getPlaylistId();
    var x5 = s.getPosition();
    var d = new Date(s.getPublishedAt());
    var x9 = s.getTitle();
    if (1) {
      rptSheet.appendRow([s.getChannelId(), s.getChannelTitle(), s.getResourceId().getVideoId(), s.getDescription(), s.getPlaylistId(), s.getPosition(), s.getPublishedAt(), s.getTitle(), d]);
    }
  }
  var x = 1;
}
function ytWerkVideoBij() {
  // 1. Fetch all the channels owned by active user
  var myChannels = YouTube.Channels.list('contentDetails', {
    mine: true
  });
  // 2. Iterate through the channels and get the uploads playlist ID
  for (var i = 0; i < myChannels.items.length; i++) {
    var item = myChannels.items[i];
    var uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;
    var playlistResponse = YouTube.PlaylistItems.list('snippet', {
      playlistId: uploadsPlaylistId,
      maxResults: 1
    });

    // Get the videoID of the first video in the list
    var video = playlistResponse.items[0];
    var originalDescription = video.snippet.description;
    var updatedDescription = originalDescription + ' Description updated via Google Apps Script';
    Logger.log('[%d] Title: %s -- %s', playlistResponse.items.length, video.snippet.title, video.snippet.description);
    video.snippet.description = updatedDescription;
    var resource = {
      snippet: {
        title: video.snippet.title,
        description: updatedDescription,
        categoryId: '22'
      },
      id: video.snippet.resourceId.videoId
    };
    Logger.log('[%s] Title: %s -- %s', video.snippet.resourceId.videoId, resource.snippet.title, resource.snippet.description);
  }
}
