/**
 * Module: CR_Core.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function crMaakOfLeegWerkblad(argSheetName) {
  // argSheetName = 'Sheet 1';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var retSheet = ss.getSheetByName(argSheetName);

  if (retSheet)
    retSheet.clear();
  else
    retSheet = ss.insertSheet(argSheetName);
  return retSheet;
}


function crLeesConfiguratie(sleutel, standaardWaarde) {
  var configuratieblad = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configuratie");
  if (!configuratieblad) {
    throw new Error("Werkblad 'Configuratie' ontbreekt. Voer eerst bhMigreerConfiguratie uit.");
  }

  var laatsteRij = configuratieblad.getLastRow();
  if (laatsteRij === 0) {
    return standaardWaarde === undefined ? "" : standaardWaarde;
  }

  var configuratie = configuratieblad.getRange(1, 1, laatsteRij, 3).getValues();
  for (var rij = 0; rij < configuratie.length; rij++) {
    // Nieuwe indeling: B = instelling, C = waarde.
    if (String(configuratie[rij][1]).trim() === sleutel) {
      return configuratie[rij][2];
    }
    // Tijdelijke achterwaartse compatibiliteit met de oude A:B-indeling.
    if (String(configuratie[rij][0]).trim() === sleutel) {
      return configuratie[rij][1];
    }
  }

  if (standaardWaarde !== undefined) {
    return standaardWaarde;
  }
  throw new Error("Configuratiesleutel ontbreekt: " + sleutel);
}


function crLeesWerkbladInhoud(argSheetName, argA1Position) {
  // argSheetName = 'TestMaillijst', argA1Position = "A:A"
  var retData;
  if (argSheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(argSheetName);
    if (sheet) {
      var nRows = sheet.getLastRow();
      retData = sheet.getRange(1, 1, nRows).getValues();
    }
  }
  return retData;
}


function crHaalWerkbladOp(argSheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(argSheetName);
}


// function tsTestDatumFormattering() {
//   x = FormatDateDutch(null, "sort");
// }



/*** NEWEST */
/** Cache voor hergebruikte Nederlandstalige datumformatters. */
var crDatumFormatterCache = {};

/**
 * Centrale datumformatter voor alle rapporten, e-mails en werkbladnamen.
 * Ondersteunt zowel betekenisvolle korte patronen als expliciete datumtokens.
 */
function crFormatteerDatum(datum, patroon, landinstelling) {
  var waarde = datum === undefined || datum === null ? new Date() : new Date(datum);
  if (isNaN(waarde.getTime())) {
    throw new Error("Ongeldige datum voor formattering: " + datum);
  }

  var land = landinstelling || "nl-NL";
  var tijdzone = Session.getScriptTimeZone() || "Europe/Amsterdam";
  var gekozenPatroon = patroon || "DMT";
  var aliassen = {
    sort: "yy-MM-dd",
    DMJ: "EEEE d MMMM yyyy",
    DMT: "EEEE d MMMM HH:mm 'uur'",
    DM: "EEEE d MMMM",
    dm: "EEE d MMM",
    DMTa: "EEE d MMM HH:mm 'uur'",
    DMa: "EEE d MMM",
    T: "HH:mm",
    M: "MMMM",
    MJ: "MMMM yyyy",
    J: "yyyy",
    sMJ: "yy-MM"
  };
  gekozenPatroon = aliassen[gekozenPatroon] || gekozenPatroon;

  var stijlen = {
    full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    medium: { year: "numeric", month: "short", day: "numeric" },
    short: { year: "2-digit", month: "2-digit", day: "2-digit" }
  };
  if (stijlen[gekozenPatroon]) {
    return new Intl.DateTimeFormat(land, Object.assign({ timeZone: tijdzone }, stijlen[gekozenPatroon]))
      .format(waarde);
  }

  var cacheSleutel = land + "|" + tijdzone;
  if (!crDatumFormatterCache[cacheSleutel]) {
    crDatumFormatterCache[cacheSleutel] = {
      maandLang: new Intl.DateTimeFormat(land, { month: "long", timeZone: tijdzone }),
      maandKort: new Intl.DateTimeFormat(land, { month: "short", timeZone: tijdzone }),
      weekdagLang: new Intl.DateTimeFormat(land, { weekday: "long", timeZone: tijdzone }),
      weekdagKort: new Intl.DateTimeFormat(land, { weekday: "short", timeZone: tijdzone })
    };
  }
  var formatter = crDatumFormatterCache[cacheSleutel];
  var onderdelen = {
    yyyy: Utilities.formatDate(waarde, tijdzone, "yyyy"),
    yy: Utilities.formatDate(waarde, tijdzone, "yy"),
    MMMM: formatter.maandLang.format(waarde),
    MMM: formatter.maandKort.format(waarde).replace(/\.$/, ""),
    MM: Utilities.formatDate(waarde, tijdzone, "MM"),
    M: String(Number(Utilities.formatDate(waarde, tijdzone, "M"))),
    dd: Utilities.formatDate(waarde, tijdzone, "dd"),
    d: String(Number(Utilities.formatDate(waarde, tijdzone, "d"))),
    EEEE: formatter.weekdagLang.format(waarde),
    EEE: formatter.weekdagKort.format(waarde).replace(/\.$/, ""),
    EE: formatter.weekdagKort.format(waarde).replace(/\.$/, ""),
    HH: Utilities.formatDate(waarde, tijdzone, "HH"),
    H: String(Number(Utilities.formatDate(waarde, tijdzone, "H"))),
    mm: Utilities.formatDate(waarde, tijdzone, "mm"),
    m: String(Number(Utilities.formatDate(waarde, tijdzone, "m"))),
    ss: Utilities.formatDate(waarde, tijdzone, "ss"),
    s: String(Number(Utilities.formatDate(waarde, tijdzone, "s")))
  };

  return gekozenPatroon.replace(
    /'[^']*'|yyyy|MMMM|EEEE|MMM|EEE|EE|yy|MM|dd|HH|mm|ss|M|d|H|m|s/g,
    function (token) {
      return token.charAt(0) === "'" ? token.slice(1, -1) : onderdelen[token];
    }
  );
}


function crVoegTekstToeIndienGevuld(pfx, str) {
  if (str)
    return pfx + str;
  else
    return "";
}


function crVoegTekstToe(data, start, count) {
  var msg = "";
  var del = "\n";
  var mydel = "";

  for (var i = start; i < start + count; i++) {
    var str = data[i];
    if (str.length > 0) {
      msg += mydel + data[i];
      mydel = del;
    }
  }

  // replace new lines with delimiters
  var no_nl_msg = msg.replace("\n", del);

  if (no_nl_msg.length > 0)
    return no_nl_msg;
  else
    return "";
}


function crBepaalDatumVanWeeknummer(wantWeekDay, wantWeekNumber) {
  var refDate = new Date();
  var nowWeekYear = crBepaalWeeknummer(refDate);
  var nowWeekDay = refDate.getDay();
  var nowDateNum = refDate.getDate();

  if (wantWeekDay == 0) wantWeekDay = nowWeekDay;
  var dayOffset = (wantWeekDay % 7) - nowWeekDay;

  var weekOffset = wantWeekNumber - nowWeekYear;

  refDate.setDate(nowDateNum + dayOffset + weekOffset * 7);
  return (refDate);
}


function crLogFoutopsporing(arg) {
  Logger.log(arg);
  var x = 1;
}


function crBepaalBeginVanMaand(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(1); // set to first of this month
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crZetOpBeginVanDag(argDate) {
  if (!argDate) argDate = new Date();
  argDate.setHours(0);
  argDate.setMinutes(0);
  argDate.setSeconds(0);
  argDate.setMilliseconds(0);
  return argDate;
}


function crMaakBegindatumVanMaand(month, curYear = 2026) {
  var retDate = new Date();
  retDate.setYear(curYear);
  retDate.setMonth(month);  // Set end of year
  retDate.setDate(1);// Date == 0 will move to last day of previous month
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crBepaalEindeVanMaand(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setMonth(retDate.getMonth() + 1);  // Set Next month
  retDate.setDate(0);// Date == 0 will move to last day of previous month
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}


function crBepaalBeginVanJaar(curYear = 2026) {
  var retDate = new Date();
  retDate.setYear(curYear);
  retDate.setMonth(0);  // Set end of year
  retDate.setDate(1);// Date == 0 will move to last day of previous month
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crBepaalEindeVanJaar() {
  var retDate = new Date();
  retDate.setMonth(12);  // Set end of year
  retDate.setDate(0);// Date == 0 will move to last day of previous month
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}


function crBepaalWeeknummer(argDate) {
  if (!argDate) argDate = new Date();
  return Number(Utilities.formatDate(argDate, "CET", "w"));
}


// function crBepaalBegindatumVanWeeknummer(argWeekNum = 1)


function crBepaalBegindatumVanWeeknummer(argWeekNum) {
  var curDate = new Date();
  var curWeekNum = crBepaalWeeknummer(curDate);
  return crBepaalBeginVanWeek(crTelWekenBijDatumOp(curDate, argWeekNum - curWeekNum));
}


function crBepaalBeginVanWeek(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(retDate.getDate() - retDate.getDay());
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crBepaalEindeVanWeek(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new crBepaalBeginVanWeek(argDate); // get begindate of this week
  retDate.setDate(retDate.getDate() + 6); // add six days
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}


function crTelDagenBijDatumOp(argDate, daysOffset) {
  if (!argDate) argDate = new Date();
  if (!daysOffset) daysOffset = 0;
  var retDate = new Date(argDate);
  retDate.setDate(argDate.getDate() + daysOffset);
  return retDate;
}


function crTelWekenBijDatumOp(argDate, weeksOffset) {
  if (!argDate) argDate = new Date();
  if (!weeksOffset) daysOffset = 0;
  var retDate = new Date(argDate);
  retDate.setDate(argDate.getDate() + 7 * weeksOffset);
  return retDate;
}


function crTelMaandenBijDatumOp(argDate, monthsOffset, maxMonth = 12) {
  if (!argDate) argDate = new Date();
  if (!monthsOffset) monthsOffset = 0;
  var retDate = new Date(argDate);
  var monthToSet = argDate.getMonth() + monthsOffset;
  if (monthToSet > 12) {
    monthToSet -= 12;
    retDate.setFullYear(retDate.getFullYear() + 1);
  }
  if (monthToSet > maxMonth) {
    retDate.setMonth(maxMonth - 1);   // crBepaalEindeVanMaand will add one to month
    retDate = crBepaalEindeVanMaand(retDate);
  } else
    retDate.setMonth(monthToSet);
  return retDate;
}


function crBepaalVolgendeZondag(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(retDate.getDate() + 7 - retDate.getDay());
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crZetTijdOpBeginVanDag(retDate) {
  if (retDate) {
    retDate.setHours(0);
    retDate.setMinutes(0);
    retDate.setSeconds(0);
    retDate.setMilliseconds(0);
  }
  return (retDate);
}


function crZetTijdOpEindeVanDag(retDate) {
  if (retDate) {
    retDate.setHours(23);
    retDate.setMinutes(59);
    retDate.setSeconds(59);
    retDate.setMilliseconds(999);
  }
  return (retDate);
}


// COLORS

var BG_HA = "AliceBlue";
var BG_MEULENVELDEN = "LemonChiffon";
var BG_VESPER = "MistyRose";
var BG_COL1 = "White";
var BG_COL2 = "WhiteSmoke";

  //  if ((alt_color++ % 2) == 0)
