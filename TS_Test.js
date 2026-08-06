/**
 * Module: TS_Test.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function tsTestVertaalDatum() {
  var date = new Date("2026-03-26T10:15:00");
  Object.keys(crDateFormat).forEach(function (name) {
    Logger.log(name + ": " + crFormatteerDatum(date, crDateFormat[name]));
  });
}
function tsTestOpmaak() {
  var curDate = new Date();
  crLogFoutopsporing("Today : " + curDate);
  crLogFoutopsporing("Weeknum : " + crBepaalWeeknummer(curDate));
  crLogFoutopsporing("week 1 : " + crBepaalBegindatumVanWeeknummer(1));
  crLogFoutopsporing("week 24 : " + crBepaalBegindatumVanWeeknummer(24));
  crLogFoutopsporing("week 52: " + crBepaalBegindatumVanWeeknummer(52));
  crLogFoutopsporing("week 62: " + crBepaalBegindatumVanWeeknummer(62));
  crLogFoutopsporing("Begin month " + crFormatteerDatum(crBepaalBeginVanMaand()));
  crLogFoutopsporing("Begin month " + crFormatteerDatum(crBepaalBeginVanMaand(), crDateFormat.MAAND));
  crLogFoutopsporing("End month " + crBepaalEindeVanMaand());
  crLogFoutopsporing("6 month from now" + crTelMaandenBijDatumOp(curDate, 6));
  crLogFoutopsporing("End 6 month " + crBepaalEindeVanMaand(crTelMaandenBijDatumOp(curDate, 6)));
  var ns = crBepaalVolgendeZondag(curDate);
  crLogFoutopsporing("NextSundayDate " + ns);
  crLogFoutopsporing("NextSundayDate " + crBepaalVolgendeZondag(ns));
}
function tsTestMaakRooster(curYear = 2026) {
  rptStartDate = crMaakBegindatumVanMaand(6, curYear);
  var sheetPos = "3e kwartaal";
  var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDateFormat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);
}
function tsTestHtmlRooster() {
  var reportWeeks = 4;
  var reportMonths = 3;

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, reportWeeks));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);
  var rptWeekEndNum = crBepaalWeeknummer(rptWeekEndDate);
  var rptMonthEnd = crTelMaandenBijDatumOp(rptWeekStartDate, reportMonths, 6);
  rptMonthEnd.setDate(0);
  msg = rsMaakHtmlRooster(rptStartDate = crZetOpBeginVanDag(), 3);
  Logger.log(msg);
}
function tsTestVerzendRooster() {
  var ui = SpreadsheetApp.getUi();
  var weekCount = 4;
  var monthCount = 3;

  // Display a dialog box with a message, input field, and "Yes" and "No" buttons.
  // The user can also close the dialog by clicking the close button in its title
  // bar.

  cmVerzendRoosterNaarLijst(tsLeesTestmailadressen(), weekCount, monthCount, tsEersteTestmailadres());
}
function tsTestMaakHtmlWeekrapport() {
  var curDate = crZetOpBeginVanDag(new Date());

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, 2));
  var msg = cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate);
}
function tsTestVerzendTemplate() {
  cmVerzendTemplateNaarLijst(tsLeesTestmailadressen(), tsEersteTestmailadres());
}

/** Verzendt de algemene testtemplate naar de ingestelde testadressen. */
function tsVerzendTesttemplate() {
  cmVerzendTesttemplate();
}
function tsTestVerzendMededelingen() {
  cmVerzendMededelingenNaarAdres(crLeesConfiguratie("Testmail"), false);
}
function tsTestVerzendMjMededelingen() {
  cmVerzendMjMededelingenNaarAdres(crLeesConfiguratie("Testmail"));
}
function tsTestVerzendLiemersActiviteiten() {
  cmVerzendLiemersActiviteitenNaarAdres(crLeesConfiguratie("Testmail"));
}
function tsTestConversie() {
  var text = "Sample value 123\nSample value 456\nSample value 789";
  console.log(text); // Original text
  console.log(conv.bold(text)); // Bold type
  console.log(conv.italic(text)); // Italic type
  console.log(conv.boldItalic(text)); // Bold-italic type
  console.log(conv.underLine(text)); // Underline
  console.log(conv.strikethrough(text)); // Strikethrough
}
function tsTestVerzendLectorrooster() {
  cmVerzendLectorroosterNaarLijst(tsLeesTestmailadressen(), tsEersteTestmailadres());
}

/** Leest de centrale ontvangerslijst voor alle testmails. */
function tsLeesTestmailadressen() {
  var addresses = cmLeesEmailadressen(crLeesConfiguratie("Testmail"));
  if (!addresses.length) throw new Error("De configuratie-instelling 'Testmail' bevat geen e-mailadressen.");
  return addresses;
}

/** Geeft het eerste testadres terug voor verzendbevestigingen. */
function tsEersteTestmailadres() {
  return tsLeesTestmailadressen()[0][0];
}
function tsTestAgenda() {
  var arr = kaLeesAgenda(crMaakOfLeegWerkblad('MJ'));
  var x = 1;
}
function tsTestMaakUitzending() {
  const broadcast = ytMaakYouTubeUitzending("Sunday Worship Service", "2026-07-12", "10:00");
  const stream = ytMaakLivestream("Kerkdienst");
  ytKoppelUitzending(broadcast.id, stream.id);
  Logger.log("Broadcast: " + broadcast.id);
  Logger.log("Stream: " + stream.id);
}
function tsTestBereikbaarheid() {
  var url = "https://www.pkn-didam.nl";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}
function tsTestOphalen() {
  var uploadData = new Array();
  var myChannels = YouTube.Channels.list('contentDetails', {
    forUsername: 'PKNDidam'
  });

  // 2. Iterate through the channels and get the uploads playlist ID
  for (var i = 0; i < myChannels.items.length; i++) {
    var item = myChannels.items[i];
    var uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;
    uploadsPlaylistId = 'PLoPwuTRfRbknunOLDue1P2Wa3EJEcFfTI';
    var playlistResponse = YouTube.PlaylistItems.list('snippet', {
      playlistId: uploadsPlaylistId,
      maxResults: 1
    });

    // Get the videoID of the first video in the list
    var video = playlistResponse.items[0];
    var originalDescription = video.snippet.title;
    var updatedDescription = originalDescription + ' Description updated via Google Apps Script';
    video.snippet.description = updatedDescription;
    var resource = {
      snippet: {
        title: video.snippet.title,
        description: updatedDescription,
        categoryId: '22'
      },
      id: video.snippet.resourceId.videoId
    };
  }
  return uploadData;
}
function tsTestKleurwerkblad() {
  var src = SpreadsheetApp.getActive().getSheetByName("NaamKleuren");
  var dst = SpreadsheetApp.getActive().getSheetByName("Rooster-3-maanden");
  opPasKleurenToeOpWaarde(src, dst, 4, 11);
}
function tsTestGenereerKleuren() {
  opGenereerOnderscheidendeKleurenVerticaal(30, "Colors");
}
