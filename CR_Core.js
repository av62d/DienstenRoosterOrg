/**
 * Module: CR_Core.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

// Gedeelde achtergrondkleuren voor roosters en exports.
var crCommunionBg = "AliceBlue";
var crRowBg = "White";
var crAltRowBg = "WhiteSmoke";

function crMaakOfLeegWerkblad(argSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var retSheet = ss.getSheetByName(argSheetName);
  if (retSheet) {
    retSheet.getDataRange().breakApart();
    retSheet.clear();
  } else {
    retSheet = ss.insertSheet(argSheetName);
  }
  return retSheet;
}

/**
 * Normaliseert een kolomkop voor robuuste vergelijking. De daadwerkelijke
 * kolomvolgorde blijft vrij; productiecode gebruikt uitsluitend kopnamen.
 */
function crNormaliseerKolomnaam(name) {
  return String(name === null || name === undefined ? "" : name).trim().toLowerCase().replace(/[\s_-]+/g, "");
}

/** Geeft een object met nulgebaseerde kolomindexen, keyed op kolomnaam. */
function crMaakKolomindex(sheet, headerRow) {
  if (!sheet || sheet.getLastColumn() === 0) {
    throw new Error("Kan geen kolommen bepalen: het werkblad ontbreekt of is leeg.");
  }
  headerRow = headerRow || 1;
  var headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  var cols = {};
  headers.forEach(function (kop, index) {
    var key = crNormaliseerKolomnaam(kop);
    if (!key) return;
    if (cols[key] !== undefined) {
      throw new Error("Dubbele kolomkop op werkblad '" + sheet.getName() + "': " + kop);
    }
    cols[key] = index;
  });
  return cols;
}

/** Zoekt een nulgebaseerde kolomindex op naam en meldt ontbrekende koppen. */
function crZoekKolom(cols, name, required) {
  var index = cols[crNormaliseerKolomnaam(name)];
  if (index === undefined && required !== false) {
    throw new Error("Verplichte kolom ontbreekt: " + name);
  }
  return index;
}

/** In-memory cache; bestaat alleen gedurende één Apps Script-uitvoering. */
var crConfigCache = null;
function crLeesAlleConfiguratie() {
  if (crConfigCache !== null) return crConfigCache;
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configuratie");
  if (!configSheet) {
    throw new Error("Werkblad 'Configuratie' ontbreekt. Voer eerst bhMigreerConfiguratie uit.");
  }
  var lastRow = configSheet.getLastRow();
  var config = lastRow ? configSheet.getRange(1, 1, lastRow, 3).getValues() : [];
  var result = {};
  for (var row = 0; row < config.length; row++) {
    // Nieuwe indeling: B = instelling, C = waarde.
    var newKey = String(config[row][1] || "").trim();
    if (newKey) result[newKey] = config[row][2];
    // Tijdelijke achterwaartse compatibiliteit met de oude A:B-indeling.
    var oldKey = String(config[row][0] || "").trim();
    if (oldKey && result[oldKey] === undefined) result[oldKey] = config[row][1];
  }
  crConfigCache = result;
  return result;
}
function crWisConfiguratieCache() {
  crConfigCache = null;
}
function crLeesConfiguratie(key, defaultValue) {
  var config = crLeesAlleConfiguratie();
  if (config.hasOwnProperty(key)) return config[key];
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error("Configuratiesleutel ontbreekt: " + key);
}

/** Start een eenvoudige, centraal gelogde prestatiemeting. */
function crStartMeting() {
  return Date.now();
}

/** Logt en retourneert de verstreken uitvoeringstijd in milliseconden. */
function crEindMeting(name, startTime, details) {
  var milliseconds = Date.now() - startTime;
  console.log(JSON.stringify({
    meting: name,
    milliseconden: milliseconds,
    details: details || {}
  }));
  return milliseconds;
}
function crLeesWerkbladInhoud(argSheetName, argA1Position) {
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

/** Betekenisvolle, centraal beheerde datumformaten voor alle zichtbare uitvoer. */
var crDateFormat = Object.freeze({
  DATUM_LANG: "datumLang",
  DATUM_ZONDER_JAAR: "datumZonderJaar",
  DATUM_KORT: "datumKort",
  DATUM_KORT_MET_LANGE_MAAND: "datumKortMetLangeMaand",
  DATUM_TIJD_ZONDER_JAAR: "datumTijdZonderJaar",
  DAG_TIJD_KORT: "dagTijdKort",
  TIJD: "tijd",
  MAAND: "maand",
  MAAND_JAAR: "maandJaar",
  JAAR: "jaar",
  SORTEERDATUM: "sorteerdatum",
  SORTEERMAAND: "sorteermaand",
  BACKUPTIJDSTEMPEL: "backuptijdstempel"
});
var crDatePatterns = Object.freeze({
  datumLang: "EEEE d MMMM yyyy",
  datumZonderJaar: "EEEE d MMMM",
  datumKort: "EEE d MMM",
  datumKortMetLangeMaand: "EEE d MMMM",
  datumTijdZonderJaar: "EEEE d MMMM HH:mm 'uur'",
  dagTijdKort: "EEE d HH:mm",
  tijd: "HH:mm",
  maand: "MMMM",
  maandJaar: "MMMM yyyy",
  jaar: "yyyy",
  sorteerdatum: "yy-MM-dd",
  sorteermaand: "yy-MM",
  backuptijdstempel: "yyyyMMdd-HHmmss"
});

/** Cache voor hergebruikte Nederlandstalige datumonderdelen. */
var crDateFormatterCache = {};

/**
 * Formatteert een datum met een benoemd formaat uit crDatumFormaat.
 */
function crFormatteerDatum(date, formaat) {
  var value = date === undefined || date === null ? new Date() : new Date(date);
  if (isNaN(value.getTime())) {
    throw new Error("Ongeldige datum voor formattering: " + date);
  }
  var selectedFormat = formaat || crDateFormat.DATUM_TIJD_ZONDER_JAAR;
  var selectedPattern = crDatePatterns[selectedFormat];
  if (!selectedPattern) {
    throw new Error("Onbekend datumformaat: " + selectedFormat);
  }
  var locale = "nl-NL";
  var timeZone = Session.getScriptTimeZone() || "Europe/Amsterdam";
  var cacheKey = locale + "|" + timeZone;
  if (!crDateFormatterCache[cacheKey]) {
    crDateFormatterCache[cacheKey] = {
      maandLang: new Intl.DateTimeFormat(locale, {
        month: "long",
        timeZone: timeZone
      }),
      maandKort: new Intl.DateTimeFormat(locale, {
        month: "short",
        timeZone: timeZone
      }),
      weekdagLang: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        timeZone: timeZone
      }),
      weekdagKort: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        timeZone: timeZone
      })
    };
  }
  var formatter = crDateFormatterCache[cacheKey];
  var parts = {
    yyyy: Utilities.formatDate(value, timeZone, "yyyy"),
    yy: Utilities.formatDate(value, timeZone, "yy"),
    MMMM: formatter.maandLang.format(value),
    MMM: formatter.maandKort.format(value).replace(/\.$/, ""),
    MM: Utilities.formatDate(value, timeZone, "MM"),
    M: String(Number(Utilities.formatDate(value, timeZone, "M"))),
    dd: Utilities.formatDate(value, timeZone, "dd"),
    d: String(Number(Utilities.formatDate(value, timeZone, "d"))),
    EEEE: formatter.weekdagLang.format(value),
    EEE: formatter.weekdagKort.format(value).replace(/\.$/, ""),
    EE: formatter.weekdagKort.format(value).replace(/\.$/, ""),
    HH: Utilities.formatDate(value, timeZone, "HH"),
    H: String(Number(Utilities.formatDate(value, timeZone, "H"))),
    mm: Utilities.formatDate(value, timeZone, "mm"),
    m: String(Number(Utilities.formatDate(value, timeZone, "m"))),
    ss: Utilities.formatDate(value, timeZone, "ss"),
    s: String(Number(Utilities.formatDate(value, timeZone, "s")))
  };
  return selectedPattern.replace(/'[^']*'|yyyy|MMMM|EEEE|MMM|EEE|EE|yy|MM|dd|HH|mm|ss|M|d|H|m|s/g, function (token) {
    return token.charAt(0) === "'" ? token.slice(1, -1) : parts[token];
  });
}
function crVoegTekstToeIndienGevuld(pfx, str) {
  if (str) return pfx + str;else return "";
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
  var singleLineMessage = msg.replace("\n", del);
  if (singleLineMessage.length > 0) return singleLineMessage;else return "";
}
function crBepaalDatumVanWeeknummer(wantWeekDay, wantWeekNumber) {
  var refDate = new Date();
  var nowWeekYear = crBepaalWeeknummer(refDate);
  var nowWeekDay = refDate.getDay();
  var nowDateNum = refDate.getDate();
  if (wantWeekDay == 0) wantWeekDay = nowWeekDay;
  var dayOffset = wantWeekDay % 7 - nowWeekDay;
  var weekOffset = wantWeekNumber - nowWeekYear;
  refDate.setDate(nowDateNum + dayOffset + weekOffset * 7);
  return refDate;
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
  retDate.setMonth(month); // Set end of year
  retDate.setDate(1);
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}
function crBepaalEindeVanMaand(argDate) {
  if (!argDate) argDate = new Date();
  var retDate = new Date(argDate);
  retDate.setMonth(retDate.getMonth() + 1); // Set Next month
  retDate.setDate(0);
  retDate.setHours(23);
  retDate.setMinutes(59);
  retDate.setSeconds(59);
  retDate.setMilliseconds(999);
  return retDate;
}
function crBepaalBeginVanJaar(curYear = 2026) {
  var retDate = new Date();
  retDate.setYear(curYear);
  retDate.setMonth(0); // Set end of year
  retDate.setDate(1);
  retDate.setHours(0);
  retDate.setMinutes(0);
  retDate.setSeconds(0);
  retDate.setMilliseconds(0);
  return retDate;
}
function crBepaalEindeVanJaar() {
  var retDate = new Date();
  retDate.setMonth(12); // Set end of year
  retDate.setDate(0);
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
    retDate.setMonth(maxMonth - 1); // crBepaalEindeVanMaand will add one to month
    retDate = crBepaalEindeVanMaand(retDate);
  } else retDate.setMonth(monthToSet);
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
  return retDate;
}
function crZetTijdOpEindeVanDag(retDate) {
  if (retDate) {
    retDate.setHours(23);
    retDate.setMinutes(59);
    retDate.setSeconds(59);
    retDate.setMilliseconds(999);
  }
  return retDate;
}

// COLORS

var BGHA = "AliceBlue";
var BGMEULENVELDEN = "LemonChiffon";
var BGVESPER = "MistyRose";
var BGCOL1 = "White";
var BGCOL2 = "WhiteSmoke";
