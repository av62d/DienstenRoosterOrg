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

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider, a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelecteerGegevens(nowDate, endDate);

  if (cal) {
    var events = cal.getEvents(nowDate, endDate);

    //  if (ui.alert('Tussen ' + nowDate.toLocaleDateString() + ' en ' + endDate.toLocaleDateString() + ' zijn er ' + events.length +' gebeurtenissen in kalender '+ calName + '.\nVerwijderen?', ui.ButtonSet.YES_NO) != ui.Button.YES) {
    //    return;
    //   }

    for (e in events) {
      events[e].deleteEvent();
    }

    for (var i in a_type) {
      var tstart = new Date(a_rowDate[i]);
      var tstop = new Date(tstart);
      tstop.setHours(tstop.getHours() + 1);
      var title = a_titel[i]; // voorganger
      var desc = "Collecte: " + a_collecte[i];
      var loc = "Protestantse Kerk, Torenstraat 10, Didam";
      var event = cal.createEvent(title, tstart, tstop, { description: desc, location: loc });
    }
  } else {
    Browser.msgBox('Agenda niet bekend: ' + calName);
    return;
  }
}


function kaLeesAgenda(report_sheet)
{
  var calendars = new Array();
  var allEntries = new Array();
  calendars.push (crLeesConfiguratie("Agenda - Kerkdiensten"));
  calendars.push (crLeesConfiguratie("Agenda - Activiteiten"));


  var num_weeks_in_report = 2;

  var curWeekNum = crBepaalWeeknummer();
  // The begindate is : the begin day of this week + 1 week and 1 day (i.e. Monday of next week)
  var beginDate = crTelDagenBijDatumOp (crTelWekenBijDatumOp(crBepaalBeginVanWeek(), 1), 1) ;
  var beginWeekNum = crBepaalWeeknummer(beginDate);
  var endDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(beginDate, num_weeks_in_report));

  if (report_sheet) report_sheet.appendRow([ "Week " + beginWeekNum + " t/m  " + (beginWeekNum + num_weeks_in_report - 1) ] );

  for (i in calendars) {
    var calName = calendars[i];

    var cal = CalendarApp.getCalendarsByName(calName)[0];
    var n = 0;
    if (cal) {
      var events = cal.getEvents(beginDate, endDate);

      for (var i in events) {
        var entry = [ calName + " nr. " + i
                     , crFormatteerDatumNederlandsNieuw(events[i].getStartTime(), "EEEE d MMMM HH:mm") +" uur,\n" + events[i].getTitle().replace(', ', ",\n")
        // , events[i].getEndTime()
        // , events[i].getId()
        // , events[i].getDescription()
        ] ;
        allEntries.push (entry);
        if (report_sheet) report_sheet.appendRow(entry );
      }
    }
  }
}
