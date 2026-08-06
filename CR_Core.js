/**
 * Module: CR_Core.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function crMaakOfLeegWerkblad(argSheetName) {
  // argSheetName = 'Sheet 1';
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
function crNormaliseerKolomnaam(naam) {
  return String(naam === null || naam === undefined ? "" : naam)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

/** Geeft een object met nulgebaseerde kolomindexen, keyed op kolomnaam. */
function crMaakKolomindex(werkblad, koprij) {
  if (!werkblad || werkblad.getLastColumn() === 0) {
    throw new Error("Kan geen kolommen bepalen: het werkblad ontbreekt of is leeg.");
  }

  koprij = koprij || 1;
  var koppen = werkblad.getRange(koprij, 1, 1, werkblad.getLastColumn()).getValues()[0];
  var kolommen = {};
  koppen.forEach(function (kop, index) {
    var sleutel = crNormaliseerKolomnaam(kop);
    if (!sleutel) return;
    if (kolommen[sleutel] !== undefined) {
      throw new Error("Dubbele kolomkop op werkblad '" + werkblad.getName() + "': " + kop);
    }
    kolommen[sleutel] = index;
  });
  return kolommen;
}

/** Zoekt een nulgebaseerde kolomindex op naam en meldt ontbrekende koppen. */
function crZoekKolom(kolommen, naam, verplicht) {
  var index = kolommen[crNormaliseerKolomnaam(naam)];
  if (index === undefined && verplicht !== false) {
    throw new Error("Verplichte kolom ontbreekt: " + naam);
  }
  return index;
}


/** In-memory cache; bestaat alleen gedurende één Apps Script-uitvoering. */
var crConfiguratieCache = null;

function crLeesAlleConfiguratie() {
  if (crConfiguratieCache !== null) return crConfiguratieCache;

  var configuratieblad = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configuratie");
  if (!configuratieblad) {
    throw new Error("Werkblad 'Configuratie' ontbreekt. Voer eerst bhMigreerConfiguratie uit.");
  }

  var laatsteRij = configuratieblad.getLastRow();
  var configuratie = laatsteRij ? configuratieblad.getRange(1, 1, laatsteRij, 3).getValues() : [];
  var resultaat = {};
  for (var rij = 0; rij < configuratie.length; rij++) {
    // Nieuwe indeling: B = instelling, C = waarde.
    var nieuweSleutel = String(configuratie[rij][1] || "").trim();
    if (nieuweSleutel) resultaat[nieuweSleutel] = configuratie[rij][2];
    // Tijdelijke achterwaartse compatibiliteit met de oude A:B-indeling.
    var oudeSleutel = String(configuratie[rij][0] || "").trim();
    if (oudeSleutel && resultaat[oudeSleutel] === undefined) resultaat[oudeSleutel] = configuratie[rij][1];
  }
  crConfiguratieCache = resultaat;
  return resultaat;
}

function crWisConfiguratieCache() {
  crConfiguratieCache = null;
}

function crLeesConfiguratie(sleutel, standaardWaarde) {
  var configuratie = crLeesAlleConfiguratie();
  if (configuratie.hasOwnProperty(sleutel)) return configuratie[sleutel];

  if (standaardWaarde !== undefined) {
    return standaardWaarde;
  }
  throw new Error("Configuratiesleutel ontbreekt: " + sleutel);
}

/** Start een eenvoudige, centraal gelogde prestatiemeting. */
function crStartMeting() {
  return Date.now();
}

/** Logt en retourneert de verstreken uitvoeringstijd in milliseconden. */
function crEindMeting(naam, starttijd, details) {
  var milliseconden = Date.now() - starttijd;
  console.log(JSON.stringify({ meting: naam, milliseconden: milliseconden, details: details || {} }));
  return milliseconden;
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


/** Betekenisvolle, centraal beheerde datumformaten voor alle zichtbare uitvoer. */
var crDatumFormaat = Object.freeze({
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

var crDatumPatronen = Object.freeze({
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
var crDatumFormatterCache = {};

/**
 * Formatteert een datum met een benoemd formaat uit crDatumFormaat.
 */
function crFormatteerDatum(datum, formaat) {
  var waarde = datum === undefined || datum === null ? new Date() : new Date(datum);
  if (isNaN(waarde.getTime())) {
    throw new Error("Ongeldige datum voor formattering: " + datum);
  }

  var gekozenFormaat = formaat || crDatumFormaat.DATUM_TIJD_ZONDER_JAAR;
  var gekozenPatroon = crDatumPatronen[gekozenFormaat];
  if (!gekozenPatroon) {
    throw new Error("Onbekend datumformaat: " + gekozenFormaat);
  }

  var land = "nl-NL";
  var tijdzone = Session.getScriptTimeZone() || "Europe/Amsterdam";

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
