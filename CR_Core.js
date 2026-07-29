/**
 * Module: CR_Core.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function crCreateOrClearSheet(argSheetName) {
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

  var configuratie = configuratieblad.getRange(1, 1, laatsteRij, 2).getValues();
  for (var rij = 0; rij < configuratie.length; rij++) {
    if (String(configuratie[rij][0]).trim() === sleutel) {
      return configuratie[rij][1];
    }
  }

  if (standaardWaarde !== undefined) {
    return standaardWaarde;
  }
  throw new Error("Configuratiesleutel ontbreekt: " + sleutel);
}


function crGetSheetContent(argSheetName, argA1Position) {
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


function crGetSheetByName(argSheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(argSheetName);
}


// function test() {
//   x = FormatDateDutch(null, "sort");
// }



/*** NEWEST */
/**
 * Formats a date using a locale and a custom format string.
 *
 * Date tokens:
 * yyyy  - 4-digit year
 * yy    - 2-digit year
 * MMMM  - full month name
 * MMM   - abbreviated month name
 * MM    - 2-digit month
 * M     - month
 * dd    - 2-digit day
 * d     - day
 * EEEE  - full weekday name
 * EEE   - abbreviated weekday name
 *
 * Time tokens (24-hour):
 * HH    - 2-digit hour (00-23)
 * H     - hour (0-23)
 * mm    - 2-digit minute
 * m     - minute
 * ss    - 2-digit second
 * s     - second
 *
 * @param {Date} date
 * @param {string} locale e.g. "nl-NL", "en-GB", "de-DE"
 * @param {string} format e.g. "EEEE d MMMM yyyy HH:mm:ss"
 * @return {string}
 */


function crFormatDateDutchNieuw(date, format) {
  const locale = "nl-NL";
  const parts = {
    yyyy: String(date.getFullYear()),
    yy: String(date.getFullYear()).slice(-2),

    MMMM: new Intl.DateTimeFormat(locale, {
      month: 'long'
    }).format(date),

    MMM: new Intl.DateTimeFormat(locale, {
      month: 'short'
    }).format(date),

    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: String(date.getMonth() + 1),

    dd: String(date.getDate()).padStart(2, '0'),
    d: String(date.getDate()),

    EEEE: new Intl.DateTimeFormat(locale, {
      weekday: 'long'
    }).format(date),

    EEE: new Intl.DateTimeFormat(locale, {
      weekday: 'short'
    }).format(date),

    HH: String(date.getHours()).padStart(2, '0'),
    H: String(date.getHours()),

    mm: String(date.getMinutes()).padStart(2, '0'),
    m: String(date.getMinutes()),

    ss: String(date.getSeconds()).padStart(2, '0'),
    s: String(date.getSeconds())
  };

  return format.replace(
    /yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|mm|m|ss|s/g,
    token => parts[token]
  );
}


/*** END OF NEWEST */
/**** NEW  */


/**
 * Translate a date into a localized string
 * @param {Date} dateInput - The input date (Date object or string)
 * @param {string} locale - Target locale (e.g. 'nl', 'de', 'en', 'fr')
 * @param {string} formatStyle - 'full', 'long', 'medium', 'short'
 * @return {string}
 */


function crTranslateDate(dateInput, locale, formatStyle) {
  var date = new Date(dateInput);

  var options = {};

  switch (formatStyle) {
    case 'full':
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'long':
      options = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'medium':
      options = { year: 'numeric', month: 'short', day: 'numeric' };
      break;
    case 'short':
      options = { year: '2-digit', month: '2-digit', day: '2-digit' };
      break;
    default:
      options = { year: 'numeric', month: 'long', day: 'numeric' };
  }

  return date.toLocaleDateString(locale, options);
}


/* END NEW */


function crFormatDateDutch(argDate, varFormat) {
  const options = { month: 'long' };
  if (!argDate) argDate = new Date();
  var month = argDate.toLocaleDateString('nl-NL', options);
  if (!varFormat) varFormat = "DMT";
  var formatStr = varFormat;
  switch (varFormat) {
    case "sort": formatStr = "yy-MM-dd"; break; // "22-05-01"
    case "DMJ": formatStr = "EEEE d MMMM yyyy"; break; // "DMJ"); // zondag 7 januari 2020 
    case "DMT": formatStr = "EEEE d MMMM HH:mm 'uur'"; break; // "DMT"); // "zondag 7 januari 10:00u"
    case "DM": formatStr = "EEEE d MMMM"; break; // "DMT"); // "zondag 7 januari"
    case "dm": formatStr = "EEE d MMM"; break; // "DMT"); // "zo 7 jan"
    // case "DMTa":  break;
    case "DMTa": formatStr = "EEE d MMM HH:mm 'uur'"; break; // "DMT"); // "zo 7 jan 10:00u"
    case "T": break;

    case "DMa": break;

    case "M": break;
    case "MJ": formatStr = "MMMM yyyy"; break; // report name year month, e.g. december 2022 
    case "J": formatStr = "yyyy"; break; // report name year e.g.  2022
    case "sMJ": formatStr = "yy-MM"; break; // sheet name year-month, e.g. 22-12 
    case "w": break;
    case "wj": break;
    case "MMMM":
      return month;
      break;
    default: ;
  }
  var retDateFmt = Utilities.formatDate(argDate, "CET", formatStr);
  var retVal = LanguageApp.translate(retDateFmt, 'en', 'nl').toLowerCase();
  var x = 1;
  return retVal;
}


function crIfAddStr(pfx, str) {
  if (str)
    return pfx + str;
  else
    return "";
}


function crAddStr(data, start, count) {
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


function crGetDateOfWeekNum(wantWeekDay, wantWeekNumber) {
  var refDate = new Date();
  var nowWeekYear = crGetWeekNum(refDate);
  var nowWeekDay = refDate.getDay();
  var nowDateNum = refDate.getDate();

  if (wantWeekDay == 0) wantWeekDay = nowWeekDay;
  var dayOffset = (wantWeekDay % 7) - nowWeekDay;

  var weekOffset = wantWeekNumber - nowWeekYear;

  refDate.setDate(nowDateNum + dayOffset + weekOffset * 7);
  return (refDate);
}


function crMyDebug(arg) {
  Logger.log(arg);
  var x = 1;
}


function crGetMonthBeginDate(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(1); // set to first of this month
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crSetBeginOfDay(argDate) {
  if (!argDate) argDate = new Date();
  argDate.setHours(0);
  argDate.setMinutes(0);
  argDate.setSeconds(0);
  argDate.setMilliseconds(0);
  return argDate;
}


function crSetMonthBeginDate(month, curYear = 2026) {
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


function crGetMonthEndDate(argDate) {
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


function crGetYearBeginDate(curYear = 2026) {
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


function crGetYearEndDate() {
  var retDate = new Date();
  retDate.setMonth(12);  // Set end of year
  retDate.setDate(0);// Date == 0 will move to last day of previous month
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}


function crGetWeekNum(argDate) {
  if (!argDate) argDate = new Date();
  return Number(Utilities.formatDate(argDate, "CET", "w"));
}


// function getWeekNumBeginDate(argWeekNum = 1)


function crGetWeekNumBeginDate(argWeekNum) {
  var curDate = new Date();
  var curWeekNum = crGetWeekNum(curDate);
  return crGetWeekBeginDate(crAddWeeksToDate(curDate, argWeekNum - curWeekNum));
}


function crGetWeekBeginDate(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(retDate.getDate() - retDate.getDay());
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crGetWeekEndDate(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new crGetWeekBeginDate(argDate); // get begindate of this week
  retDate.setDate(retDate.getDate() + 6); // add six days
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}


function crAddDaysToDate(argDate, daysOffset) {
  if (!argDate) argDate = new Date();
  if (!daysOffset) daysOffset = 0;
  var retDate = new Date(argDate);
  retDate.setDate(argDate.getDate() + daysOffset);
  return retDate;
}


function crAddWeeksToDate(argDate, weeksOffset) {
  if (!argDate) argDate = new Date();
  if (!weeksOffset) daysOffset = 0;
  var retDate = new Date(argDate);
  retDate.setDate(argDate.getDate() + 7 * weeksOffset);
  return retDate;
}


function crAddMonthsToDate(argDate, monthsOffset, maxMonth = 12) {
  if (!argDate) argDate = new Date();
  if (!monthsOffset) monthsOffset = 0;
  var retDate = new Date(argDate);
  var monthToSet = argDate.getMonth() + monthsOffset;
  if (monthToSet > 12) {
    monthToSet -= 12;
    retDate.setFullYear(retDate.getFullYear() + 1);
  }
  if (monthToSet > maxMonth) {
    retDate.setMonth(maxMonth - 1);   // crGetMonthEndDate will add one to month
    retDate = crGetMonthEndDate(retDate);
  } else
    retDate.setMonth(monthToSet);
  return retDate;
}


function crGetNextSundayDate(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setDate(retDate.getDate() + 7 - retDate.getDay());
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}


function crSetTimeBeginDay(retDate) {
  if (retDate) {
    retDate.setHours(0);
    retDate.setMinutes(0);
    retDate.setSeconds(0);
    retDate.setMilliseconds(0);
  }
  return (retDate);
}


function crSetTimeEndDay(retDate) {
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
