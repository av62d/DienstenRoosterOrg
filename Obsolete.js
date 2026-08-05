/**
 * Tijdelijk archief voor functies zonder actieve statische aanroep.
 *
 * De oorspronkelijke functienamen en prefixes zijn bewust behouden, zodat
 * handmatige aanroepen vanuit de Apps Script-editor mogelijk blijven.
 */


// Oorspronkelijk uit CM_Communicatie.js

function cmVerzendRoosterbericht() {

  var klaar = false;

  while (!klaar) {

    const ui = SpreadsheetApp.getUi();
    const antwoord = ui.prompt('Extra mededeling:');

    var msg = antwoord.getResponseText();

    const response = ui.alert(
      msg,
      ui.ButtonSet.YES_NO,
    );

    // Process the user's response.
    if (response === ui.Button.YES) {
      klaar = true;
      Logger.log('The user clicked' + antwoord);
    }

  }

  x = 1;
}


function cmMaakUrlLink(url, tekst) {
  return "<a href=\"" + url + "\">" + tekst + "</a>";
}


function cmVerzendDienstenlijst() {
  var n = 4;
  var email = "<h4>Vorige " + n + " diensten</h4>" + ytMaakUploadLijst(n);
  MailApp.sendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", email);
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

  var klaar = false;

  while (!klaar) {

    const ui = SpreadsheetApp.getUi();
    const antwoord = ui.prompt('Extra mededeling:');

    var msg = antwoord.getResponseText();

    const response = ui.alert(
      msg,
      ui.ButtonSet.YES_NO,
    );

    // Process the user's response.
    if (response === ui.Button.YES) {
      klaar = true;
      Logger.log('The user clicked' + antwoord);
    }

  }

  x = 1;
}


function cmMaakLectorrooster(rptWeekStartDate, rptWeekEndDate, rptSheetName = "Lectorrooster", rptTitle = "Lectorrooster") {

  if (!rptSheetName || !rptTitle || !rptWeekStartDate || !rptWeekEndDate)
    return;

  var sizeNameCol = 105;
  var sizeSpecCol = 125;

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Lector"];
  var hdrRowSize = [80, sizeSpecCol, sizeSpecCol, sizeNameCol];
  var rptNumCols = hdrRow.length;

  var fg_title = "black"; var bg_title = "white";

  var report_sheet = crMaakOfLeegWerkblad(rptSheetName);

  function cmBereikLaatsteRij() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 1, 1, rptNumCols);
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

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg] = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);

  var bgColor = BG_COL1;

  var nowDate = new Date();
  report_sheet.appendRow([rptTitle]);
  var lrow = cmMaakLaatsteRijOp(fg_title, bg_title, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  report_sheet.setRowHeight(1, 60);

  report_sheet.appendRow(["Afgedrukt: " + crFormatteerDatum(nowDate, "DMT")])
  lrow = cmMaakLaatsteRijOp(fg_title, bg_title, 9);
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
      lrow = cmMaakLaatsteRijOp(fg_title, bg_title, 18);    // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center");        // gecentreerd
      lrow.setVerticalAlignment("middle");        // gecentreerd

      report_sheet.setRowHeight(report_sheet.getLastRow(), 60);

      report_sheet.appendRow(hdrRow);
      lrow = cmMaakLaatsteRijOp(fg_title, bg_title, 10);


    }



    switch (t) {
      case "M": bgColor = 'LemonChiffon'; break;
      case "B HA": bgColor = 'AliceBlue'; break;
      case "Z HA": bgColor = 'AliceBlue'; break;
      case "AV": bgColor = 'MistyRose'; break;
    }


    if (a_ha[i] != "") {
      bgColor = BG_HA;
    }

    var cur_lector = "";

    if (a_lector[i].localeCompare(a_lectorOrg[i])) {
      cur_lector += conv.strikethrough(a_lectorOrg[i]);
      cur_lector += " - ";
    }

    cur_lector += a_lector[i];



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
      , cur_lector
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

    var lrow = cmBereikLaatsteRij();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);

    var datumCell = lrow.getCell(1, 1);
    datumCell.setBackground(bgLitColor);



  }
  report_sheet.setColumnWidth(1, 50);
  var cell = report_sheet.getRange("A:A");
  cell.setHorizontalAlignment("center");


  for (i = 0; i < hdrRowSize.length; i++) {
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

function opBepaalKleurtype(type, color)
{
  switch (type) {
    case "T" : color = '#ff00ff'; break;
    case "Z HA":
    case "B HA": color = "#cfe2f3";break ;
    case "M": color = "#fff2cc";break;
    case "AV": color = "#ead1dc";break;
  }
  return (color);
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


function rsVoegTabelrijMetEenKolomToe(tag, val) {

  return rsMaakHtmlElement("tr", rsMaakHtmlElementMetOptie(tag, "colspan=\"" + colcount + "\"   style=\"text-align:center;\" ", val));

}


// Oorspronkelijk uit YT_YouTube.js

function ytVerzendLaatsteVideos() {
  var nr_videos = 16;
  var email = "<h4>Vorige " + nr_videos + " diensten</h4>" + ytMaakUploadLijst(nr_videos);
  MailApp.sendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", email);
  var x = 2;
}


function ytMaakUploadWerkblad(rptSheet) {
  var uploadData = ytHaalMijnUploadsOp();
  // Logger.log("Kind === "+ uploadData + "===");
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
      rptSheet.appendRow([
        s.getChannelId(),
        s.getChannelTitle(),
        s.getResourceId().getVideoId(),
        s.getDescription(),
        s.getPlaylistId(),
        s.getPosition(),
        s.getPublishedAt(),
        s.getTitle(),
        d
      ]);

    }
  }

  var x = 1;

}


function ytWerkVideoBij() {
  // 1. Fetch all the channels owned by active user
  var myChannels = YouTube.Channels.list('contentDetails', {mine: true});
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

    Logger.log('[%d] Title: %s -- %s',
               playlistResponse.items.length,
               video.snippet.title,
               video.snippet.description
              );
    video.snippet.description = updatedDescription;

    var resource = {
      snippet: {
        title: video.snippet.title,
        description: updatedDescription,
        categoryId: '22'
      },
      id: video.snippet.resourceId.videoId
    };
    Logger.log('[%s] Title: %s -- %s',
               video.snippet.resourceId.videoId,
               resource.snippet.title,
               resource.snippet.description
              );
    // YouTube.Videos.update(resource, 'id,snippet');
  }
}
