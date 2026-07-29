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
      "Configuratie",
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

/**
 * Hernoemt het bestaande instellingenblad en zet templatebestandsnamen eenmalig
 * om naar stabiele Google Document-ID's.
 */
function bhMigreerConfiguratie(toonMelding) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var oudBlad = ss.getSheetByName("Instellingen");
  var configuratieblad = ss.getSheetByName("Configuratie");

  if (oudBlad && configuratieblad && oudBlad.getSheetId() !== configuratieblad.getSheetId()) {
    throw new Error("Zowel 'Instellingen' als 'Configuratie' bestaat. Voeg deze eerst handmatig samen.");
  }
  if (!configuratieblad && oudBlad) {
    oudBlad.setName("Configuratie");
    configuratieblad = oudBlad;
  }
  if (!configuratieblad) {
    configuratieblad = ss.insertSheet("Configuratie");
  }

  var sleutelMigraties = [
    { oud: "KerkTV MailTemplate Doc", nieuw: "KerkTV MailTemplate Doc ID" },
    { oud: "Mededelingen Template", nieuw: "Mededelingen Template ID" },
    { oud: "MJ Mededeling Template Doc", nieuw: "MJ Mededeling Template Doc ID" },
    { oud: "Liemers Activiteiten Template Doc", nieuw: "Liemers Activiteiten Template Doc ID" }
  ];
  var laatsteRij = configuratieblad.getLastRow();
  var gegevens = laatsteRij ? configuratieblad.getRange(1, 1, laatsteRij, 2).getValues() : [];
  var wijzigingen = [];

  sleutelMigraties.forEach(function (migratie) {
    for (var rij = 0; rij < gegevens.length; rij++) {
      var sleutel = String(gegevens[rij][0]).trim();
      if (sleutel === migratie.oud || sleutel === migratie.nieuw) {
        var oudeWaarde = String(gegevens[rij][1] || "").trim();
        var documentId = bhBepaalDocumentId(oudeWaarde);
        configuratieblad.getRange(rij + 1, 1, 1, 2)
          .setValues([[migratie.nieuw, documentId]]);
        wijzigingen.push({
          rij: rij + 1,
          sleutel: migratie.nieuw,
          documentId: documentId
        });
        return;
      }
    }
  });

  var resultaat = {
    werkblad: configuratieblad.getName(),
    templateMigraties: wijzigingen
  };
  console.log(JSON.stringify(resultaat, null, 2));
  if (toonMelding !== false) {
    SpreadsheetApp.getUi().alert(
      "Configuratiemigratie voltooid. Template-ID's bijgewerkt: " + wijzigingen.length + "."
    );
  }
  return resultaat;
}

/** Accepteert een bestaand ID, een document-URL of een oude bestandsnaam. */
function bhBepaalDocumentId(waarde) {
  if (!waarde) {
    throw new Error("Een mailtemplate heeft geen document-ID of bestandsnaam.");
  }

  var urlTreffer = waarde.match(/\/d\/([a-zA-Z0-9_-]+)/);
  var kandidaat = urlTreffer ? urlTreffer[1] : waarde;
  try {
    DriveApp.getFileById(kandidaat).getName();
    return kandidaat;
  } catch (fout) {
    var bestanden = DriveApp.getFilesByName(waarde);
    if (!bestanden.hasNext()) {
      throw new Error("Mailtemplate niet gevonden: " + waarde);
    }
    var documentId = bestanden.next().getId();
    if (bestanden.hasNext()) {
      throw new Error("Meerdere mailtemplates met dezelfde naam gevonden: " + waarde);
    }
    return documentId;
  }
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
  if (ss.getSheetByName("Instellingen") && !ss.getSheetByName("Configuratie")) {
    bhMigreerConfiguratie(false);
  }
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
