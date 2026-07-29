/**
 * Module: TS_Test.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function tsTestTranslateDate() {
  var date = new Date('2026-03-26');


  var date_type_list = ['full', 'long', 'medium', 'short'];

  for (i in date_type_list) {
    Logger.log(date_type_list[i]);
    Logger.log(crTranslateDate(date, 'nl', date_type_list[i]));
  }
}


function tsTestFormatting() {
  var curDate = new Date();

  crMyDebug("Today : " + curDate);

  crMyDebug("Weeknum : " + crGetWeekNum(curDate));


  crMyDebug("week 1 : " + crGetWeekNumBeginDate(1));
  crMyDebug("week 24 : " + crGetWeekNumBeginDate(24));
  crMyDebug("week 52: " + crGetWeekNumBeginDate(52));
  crMyDebug("week 62: " + crGetWeekNumBeginDate(62));

  // crMyDebug ( "Begin week " + crGetWeekBeginDate(curDate));
  // crMyDebug ( "End week " + crGetWeekEndDate(curDate));
  // crMyDebug ( "End week + " + addWeeks + " :  " +  crAddWeeksToDate(crGetWeekEndDate(), addWeeks));

  // crMyDebug ( "End week " + curWeekNum + " : " + crGetWeekEndDate());
  // crMyDebug ( "End week " + ( curWeekNum + addWeeks ) + " :  " +  crAddWeeksToDate(crGetWeekEndDate(curDate), addWeeks));

  crMyDebug("Begin month " + crFormatDateDutch(crGetMonthBeginDate()));
  crMyDebug("Begin month " + crFormatDateDutch(crGetMonthBeginDate(), "MMMM"));
  crMyDebug("End month " + crGetMonthEndDate());
  crMyDebug("6 month from now" + crAddMonthsToDate(curDate, 6));
  crMyDebug("End 6 month " + crGetMonthEndDate(crAddMonthsToDate(curDate, 6)));
  var ns = crGetNextSundayDate(curDate);
  crMyDebug("NextSundayDate " + ns);
  crMyDebug("NextSundayDate " + crGetNextSundayDate(ns));

}


function tsTstMaakRooster(curYear = 2026) {
  rptStartDate = crSetMonthBeginDate(6, curYear);
  var sheetPos = "3e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatDateDutchNieuw(rptStartDate, "MMMM yyyy");
  rsMaakRoosterSheet(sheetName, sheetTitle, rptStartDate, sheetLen);
}


function tsTst() {
  // x = ["hdrA", "hdrB", "hdrC"];
  // rsSetTableCols(x);
  // msg = rsAddTableRow("th", x);
  // msg += rsAddTableRowSingleCol("th", "test");

  var num_weeks_in_report = 4;
  var num_months_in_report = 3;

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crSetBeginOfDay();

  var rptWeekEndDate = crGetWeekEndDate(crAddWeeksToDate(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crGetWeekNum(rptWeekStartDate);
  var rptWeekEndNum = crGetWeekNum(rptWeekEndDate);

  var rptMonthEnd = crAddMonthsToDate(rptWeekStartDate, num_months_in_report, 6);
  rptMonthEnd.setDate(0);

  //var htmlRooster = rsMaakHtmlRooster(rptWeekStartDate, num_months_in_report);
  //var htmlWeekRaport = cmCreateHtmlWeekReport(rptWeekStartDate, rptWeekEndDate);

  msg = rsMaakHtmlRooster(rptStartDate = crSetBeginOfDay(), 3);

  Logger.log(msg);
}


function tsTestSendRoster() {

  var ui = SpreadsheetApp.getUi();

  var num_weeks = 4;
  var num_months = 3;

  // Display a dialog box with a message, input field, and "Yes" and "No" buttons.
  // The user can also close the dialog by clicking the close button in its title
  // bar.

  cmRealSendRoster(crGetInstelling("Test Mailinglist Sheet"), num_weeks, num_months);

}


function tsTestCreateHtmlWeekReport() {
  var curDate = crSetBeginOfDay(new Date());

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crSetBeginOfDay();

  var rptWeekEndDate = crGetWeekEndDate(crAddWeeksToDate(rptWeekStartDate, 2));

  var msg = cmCreateHtmlWeekReport(rptWeekStartDate, rptWeekEndDate);

}


function tsTestSendTemplate() {
  cmRealSendTemplate();
}


function tsTestZendMededelingen() {
  cmRealZendMededelingen(crGetInstelling("Test Mailinglist Mededelingen"),false);
}


function tsTestSendMJMededelingen() {
    cmSendMJMededelingenToEmail(crGetInstelling("MJ Maillist test"));
}


function tsTestVerzendLiemersActiviteiten() {
  cmVerzendLiemersActiviteitenToEmail(crGetInstelling("Test Liemers Activiteiten Maillist"));
}


function tsTestConv() {
  var text = "Sample value 123\nSample value 456\nSample value 789";
  console.log(text); // Original text
  console.log(conv.bold(text)); // Bold type
  console.log(conv.italic(text)); // Italic type
  console.log(conv.boldItalic(text)); // Bold-italic type
  console.log(conv.underLine(text)); // Underline
  console.log(conv.strikethrough(text)); // Strikethrough
}


function tsTestVerzendLectorRooster() {
  cmRealVerzendLectorRooster(crGetInstelling("Lector TestMailinglist Sheet"));
}


function tsTestCal() {
  var arr = kaReadCal(crCreateOrClearSheet('MJ')) ;
  var x = 1;
}


function tsTestCreateStream() {

  const broadcast = ytCreateYouTubeStream(
      "Sunday Worship Service",
      "2026-07-12",
      "10:00"
  );

  const stream = ytCreateLiveStream("Kerkdienst");

  ytBindBroadcast(
      broadcast.id,
      stream.id
  );

  Logger.log("Broadcast: " + broadcast.id);
  Logger.log("Stream: " + stream.id);
}


function tsPing(){
  var my_url = "https://www.pkn-didam.nl";
  var response = UrlFetchApp.fetch(my_url);
  Logger.log(response.getContentText());
}


function tsTestRetrieve() {
  
  var uploadData = new Array();
  var myChannels =YouTube.Channels.list('contentDetails', {forUsername: 'PKNDidam'});

  // var response = YouTube.Videos.list('contentDetails',{forUsername: 'PKNDidam'});
  // printResults(response);
  
  
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
  return (uploadData);
}


function tsTstColorSheet() {

  var src = SpreadsheetApp.getActive().getSheetByName("NaamKleuren");
  var dst = SpreadsheetApp.getActive().getSheetByName("Rooster-3-maanden");
  opApplyColorsByContainedValue(src, dst, 4,11);

}


function tsTstGenColors() {
  opGenerateDistinctColorsVertical(30, "Colors");
}
