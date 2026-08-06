/**
 * Module: KA_Kalender.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function kaZetGebeurtenissenInAgenda() {
  var calName = crLeesConfiguratie("Agenda - Kerkdiensten");
  var nowDate = new Date();
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  var endDate = crBepaalEindeVanJaar();
  endDate.setFullYear(endDate.getFullYear() + 2); // end of next year

  var cal = CalendarApp.getCalendarsByName(calName)[0];
  var ui = SpreadsheetApp.getUi();
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
  } = rsSelecteerGegevens(nowDate, endDate);
  if (cal) {
    var events = cal.getEvents(nowDate, endDate);
    for (e in events) {
      events[e].deleteEvent();
    }
    for (var i in types) {
      var tstart = new Date(rowDates[i]);
      var tstop = new Date(tstart);
      tstop.setHours(tstop.getHours() + 1);
      var title = titles[i]; // voorganger
      var desc = "Collecte: " + collections[i];
      var loc = "Protestantse Kerk, Torenstraat 10, Didam";
      var event = cal.createEvent(title, tstart, tstop, {
        description: desc,
        location: loc
      });
    }
  } else {
    Browser.msgBox('Agenda niet bekend: ' + calName);
    return;
  }
}
function kaLeesAgenda(reportSheet) {
  var calendars = new Array();
  var allEntries = new Array();
  calendars.push(crLeesConfiguratie("Agenda - Kerkdiensten"));
  calendars.push(crLeesConfiguratie("Agenda - Activiteiten"));
  var reportWeeks = 2;
  var curWeekNum = crBepaalWeeknummer();
  // The begindate is : the begin day of this week + 1 week and 1 day (i.e. Monday of next week)
  var beginDate = crTelDagenBijDatumOp(crTelWekenBijDatumOp(crBepaalBeginVanWeek(), 1), 1);
  var beginWeekNum = crBepaalWeeknummer(beginDate);
  var endDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(beginDate, reportWeeks));
  if (reportSheet) reportSheet.appendRow(["Week " + beginWeekNum + " t/m  " + (beginWeekNum + reportWeeks - 1)]);
  for (i in calendars) {
    var calName = calendars[i];
    var cal = CalendarApp.getCalendarsByName(calName)[0];
    var n = 0;
    if (cal) {
      var events = cal.getEvents(beginDate, endDate);
      for (var i in events) {
        var entry = [calName + " nr. " + i, crFormatteerDatum(events[i].getStartTime(), crDateFormat.DATUM_TIJD_ZONDER_JAAR) + ",\n" + events[i].getTitle().replace(', ', ",\n")
        // , events[i].getEndTime()
        // , events[i].getId()
        // , events[i].getDescription()
        ];
        allEntries.push(entry);
        if (reportSheet) reportSheet.appendRow(entry);
      }
    }
  }
}
