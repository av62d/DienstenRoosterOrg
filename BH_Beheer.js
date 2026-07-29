/**
 * Module: BH_Beheer.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

/**
 * Voert alleen-lezen controles uit op configuratie die niet in de broncode staat.
 * Start deze functie handmatig vanuit Apps Script na een deployment.
 */


function bhControleerProjectConfiguratie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var bekendeFuncties = new Set([
    "mnOnOpen",
    "kaEventsToCalendar",
    "tsTestSendRoster",
    "cmSendRoster",
    "opSetBackgroundColors",
    "cmSendTemplate",
    "tsTestSendTemplate",
    "ytSendLastVideos",
    "tsTestSendMJMededelingen",
    "cmSendMJMededelingen",
    "tsTestZendMededelingen",
    "cmZendMededelingen",
    "cmZendMededelingenVolgendeWeek",
    "cmSendLijstKerkdiensten",
    "rsDeleteAllRoosters",
    "rsMaakHalfJaarRooster1",
    "rsMaakHalfJaarRooster2",
    "rsVerzendJaarRooster",
    "exMaakJaarRoosterXlsx",
    "exVerzendJaarRoosterXlsx",
    "tsTestVerzendLiemersActiviteiten",
    "cmVerzendLiemersActiviteiten",
    "tsTestVerzendLectorRooster",
    "cmVerzendLectorRooster"
  ]);

  var triggers = ScriptApp.getProjectTriggers().map(function (trigger) {
    var handler = trigger.getHandlerFunction();
    return {
      functie: handler,
      gebeurtenis: String(trigger.getEventType()),
      bron: String(trigger.getTriggerSource()),
      bekend: bekendeFuncties.has(handler)
    };
  });

  var benoemdeBereiken = ss.getNamedRanges().map(function (namedRange) {
    return {
      naam: namedRange.getName(),
      bereik: namedRange.getRange().getA1Notation(),
      werkblad: namedRange.getRange().getSheet().getName()
    };
  });

  var rapport = {
    spreadsheet: ss.getName(),
    tijdzoneScript: Session.getScriptTimeZone(),
    tijdzoneSpreadsheet: ss.getSpreadsheetTimeZone(),
    triggers: triggers,
    benoemdeBereiken: benoemdeBereiken,
    bloemen2024ontvangerAanwezig: benoemdeBereiken.some(function (item) {
      return item.naam === "Bloemen2024ontvanger";
    })
  };

  console.log(JSON.stringify(rapport, null, 2));
  return rapport;
}

/** Centrale, declaratieve beschrijving van de vaste spreadsheetstructuur. */
function bhSpreadsheetSpecificatie() {
  return {
    werkbladen: [
      "Voorpagina",
      "Overzicht",
      "NaamKleuren",
      "Bloemen 2026",
      "Lijst Collectes",
      "Lijst Voorgangers",
      "Lijst Ambtsdragers",
      "Lijst Lectoren",
      "Lijst Kosters",
      "Lijst Koffiezetters",
      "Lijst Ontvangst",
      "Lijst Klokkenluiders",
      "Lijst KerkTV",
      "Instellingen",
      "LectorMaillijst",
      "Maillijst",
      "Adressen",
      "TestMaillijst",
      "KerkTVMaillijst"
    ],
    benoemdeBereiken: [
      { naam: "LijstKosters", werkblad: "Lijst Kosters", bereik: "A3:A19" },
      { naam: "LijstAmbtsdragers", werkblad: "Lijst Ambtsdragers", bereik: "A3:A20" },
      { naam: "VolledigRooster", werkblad: "Voorpagina", bereik: "A1:S1" },
      { naam: "LijstOntvangst", werkblad: "Lijst Ontvangst", bereik: "A3:A12" },
      { naam: "LijstDiakenen", werkblad: "Lijst Ambtsdragers", bereik: "D4:D9" },
      { naam: "BenoemdBereik1", werkblad: "Voorpagina", bereik: "A:T" },
      { naam: "LijstKlokkenluiders", werkblad: "Lijst Klokkenluiders", bereik: "A3:A11" },
      { naam: "LijstKerkTV", werkblad: "Lijst KerkTV", bereik: "A3:A16" },
      { naam: "LijstVoorgangers", werkblad: "Lijst Voorgangers", bereik: "A3:A52" },
      { naam: "LijstLectoren", werkblad: "Lijst Lectoren", bereik: "A2:A10" },
      { naam: "RoosterTypes", werkblad: "Voorpagina", bereik: "A1" },
      { naam: "LijstCollectes", werkblad: "Lijst Collectes", bereik: "A3:A67" },
      { naam: "LijstKoffiezetters", werkblad: "Lijst Koffiezetters", bereik: "A3:A12" },
      { naam: "LijstExtra", werkblad: "Lijst Ambtsdragers", bereik: "E4:E22" }
    ]
  };
}

/** Alleen-lezen controle van werkbladen, benoemde bereiken en tijdzones. */
function bhControleerSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var specificatie = bhSpreadsheetSpecificatie();
  var bestaandeWerkbladen = new Set(ss.getSheets().map(function (sheet) {
    return sheet.getName();
  }));
  var bestaandeBereiken = {};

  ss.getNamedRanges().forEach(function (namedRange) {
    bestaandeBereiken[namedRange.getName()] = {
      werkblad: namedRange.getRange().getSheet().getName(),
      bereik: namedRange.getRange().getA1Notation()
    };
  });

  var ontbrekendeWerkbladen = specificatie.werkbladen.filter(function (naam) {
    return !bestaandeWerkbladen.has(naam);
  });
  var ontbrekendeBereiken = [];
  var afwijkendeBereiken = [];

  specificatie.benoemdeBereiken.forEach(function (verwacht) {
    var huidig = bestaandeBereiken[verwacht.naam];
    if (!huidig) {
      ontbrekendeBereiken.push(verwacht);
    } else if (huidig.werkblad !== verwacht.werkblad || huidig.bereik !== verwacht.bereik) {
      afwijkendeBereiken.push({ verwacht: verwacht, huidig: huidig });
    }
  });

  var rapport = {
    geldig: ontbrekendeWerkbladen.length === 0 &&
      ontbrekendeBereiken.length === 0 && afwijkendeBereiken.length === 0,
    spreadsheet: ss.getName(),
    tijdzoneScript: Session.getScriptTimeZone(),
    tijdzoneSpreadsheet: ss.getSpreadsheetTimeZone(),
    ontbrekendeWerkbladen: ontbrekendeWerkbladen,
    ontbrekendeBereiken: ontbrekendeBereiken,
    afwijkendeBereiken: afwijkendeBereiken
  };

  console.log(JSON.stringify(rapport, null, 2));
  SpreadsheetApp.getUi().alert(
    rapport.geldig
      ? "De vaste spreadsheetstructuur is in orde."
      : "Er zijn afwijkingen gevonden. Bekijk het uitvoeringslogboek."
  );
  return rapport;
}

/**
 * Niet-destructieve initialisatie: maakt uitsluitend ontbrekende werkbladen en
 * benoemde bereiken. Bestaande inhoud, opmaak en bereiken worden niet gewijzigd.
 */
function bhInitialiseerSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var specificatie = bhSpreadsheetSpecificatie();
  var aangemaakteWerkbladen = [];
  var aangemaakteBereiken = [];

  specificatie.werkbladen.forEach(function (naam) {
    if (!ss.getSheetByName(naam)) {
      ss.insertSheet(naam);
      aangemaakteWerkbladen.push(naam);
    }
  });

  var bestaandeNamen = new Set(ss.getNamedRanges().map(function (namedRange) {
    return namedRange.getName();
  }));
  specificatie.benoemdeBereiken.forEach(function (item) {
    if (!bestaandeNamen.has(item.naam)) {
      ss.setNamedRange(item.naam, ss.getSheetByName(item.werkblad).getRange(item.bereik));
      aangemaakteBereiken.push(item.naam);
    }
  });

  var resultaat = {
    aangemaakteWerkbladen: aangemaakteWerkbladen,
    aangemaakteBereiken: aangemaakteBereiken
  };
  console.log(JSON.stringify(resultaat, null, 2));
  SpreadsheetApp.getUi().alert(
    "Initialisatie voltooid. Nieuwe werkbladen: " + aangemaakteWerkbladen.length +
    "; nieuwe benoemde bereiken: " + aangemaakteBereiken.length + "."
  );
  return resultaat;
}
