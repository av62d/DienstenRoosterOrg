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
    "mnBijOpenen",
    "kaZetGebeurtenissenInAgenda",
    "tsTestVerzendRooster",
    "cmVerzendRooster",
    "opStelAchtergrondkleurenIn",
    "cmVerzendTemplate",
    "tsTestVerzendTemplate",
    "ytVerzendLaatsteVideos",
    "tsTestVerzendMjMededelingen",
    "cmVerzendMjMededelingen",
    "tsTestVerzendMededelingen",
    "cmVerzendMededelingen",
    "cmVerzendMededelingenVolgendeWeek",
    "cmVerzendLijstKerkdiensten",
    "rsVerwijderAlleRoosters",
    "rsMaakHalfjaarrooster1",
    "rsMaakHalfjaarrooster2",
    "rsVerzendJaarrooster",
    "exMaakJaarroosterXlsx",
    "exVerzendJaarroosterXlsx",
    "tsTestVerzendLiemersActiviteiten",
    "cmVerzendLiemersActiviteiten",
    "tsTestVerzendLectorrooster",
    "cmVerzendLectorrooster"
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
      { naam: "LijstOntvangst", werkblad: "Lijst Ontvangst", bereik: "A3:A12" },
      { naam: "LijstDiakenen", werkblad: "Lijst Ambtsdragers", bereik: "D4:D9" },
      { naam: "LijstKlokkenluiders", werkblad: "Lijst Klokkenluiders", bereik: "A3:A11" },
      { naam: "LijstKerkTV", werkblad: "Lijst KerkTV", bereik: "A3:A16" },
      { naam: "LijstVoorgangers", werkblad: "Lijst Voorgangers", bereik: "A3:A52" },
      { naam: "LijstLectoren", werkblad: "Lijst Lectoren", bereik: "A2:A10" },
      { naam: "LijstCollectes", werkblad: "Lijst Collectes", bereik: "A3:A67" },
      { naam: "LijstKoffiezetters", werkblad: "Lijst Koffiezetters", bereik: "A3:A12" },
      { naam: "LijstExtra", werkblad: "Lijst Ambtsdragers", bereik: "E4:E22" }
    ]
  };
}

/** Gewenste kolommen van Voorpagina, in de definitieve volgorde. */
function bhVoorpaginaKolomspecificatie() {
  return [
    { naam: "Datum", aliases: ["Datum"] },
    { naam: "Voorganger", aliases: ["Voorganger"] },
    { naam: "Bijzonderheden", aliases: ["Bijzonderheden"] },
    { naam: "Collecte", aliases: ["Collecte"] },
    { naam: "Lector", aliases: ["Lector"] },
    { naam: "Ouderling", aliases: ["Ouderling"] },
    { naam: "Extra", aliases: ["Extra"] },
    { naam: "Koster", aliases: ["Koster"] },
    { naam: "Koffie", aliases: ["Koffie"] },
    { naam: "Ontvangst", aliases: ["Ontvangst", "Comm. van ontvangst"] },
    { naam: "Klokkenluider", aliases: ["Klokkenluider", "Klokken- luider"] },
    { naam: "KerkTV", aliases: ["KerkTV"] },
    { naam: "Kleur", aliases: ["Kleur"] },
    { naam: "HA", aliases: ["HA"], selectievakje: true },
    { naam: "HAvorm", aliases: ["HAvorm"] },
    { naam: "ZondagNaam", aliases: ["ZondagNaam", "Naam van Zondag"] },
    { naam: "CollecteCategorie", aliases: ["CollecteCategorie", "Collecte (Categorie)"] },
    { naam: "Uitgangscollecte", aliases: ["Uitgangscollecte"] },
    { naam: "Kwartaal", aliases: ["Kwartaal"], berekend: "kwartaal" },
    { naam: "Maand", aliases: ["Maand"], berekend: "maand" },
    { naam: "KoffieDienst", aliases: ["KoffieDienst", "Koffie Dienst"], selectievakje: true },
    { naam: "DidamDienst", aliases: ["DidamDienst", "Didam Dienst"], selectievakje: true },
    { naam: "YouTubeLink", aliases: ["YouTubeLink"] },
    { naam: "YouTubeTitel", aliases: ["YouTubeTitel", "Titel"] },
    { naam: "Broadcast-ID", aliases: ["Broadcast-ID"] }
  ];
}

/**
 * Eenmalige migratie van Voorpagina. Maakt eerst een volledige backupkopie en
 * vervangt daarna de inhoud door uitsluitend de opgegeven kolommen.
 */
function bhMigreerVoorpagina() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blad = ss.getSheetByName("Voorpagina");
  if (!blad) throw new Error("Werkblad 'Voorpagina' ontbreekt.");

  var specificatie = bhVoorpaginaKolomspecificatie();
  var oudeKoppen = blad.getRange(1, 1, 1, blad.getLastColumn()).getValues()[0];
  var oudeIndex = {};
  oudeKoppen.forEach(function (kop, index) {
    var sleutel = crNormaliseerKolomnaam(kop);
    if (sleutel) oudeIndex[sleutel] = index;
  });

  var bronnen = specificatie.map(function (kolom) {
    for (var i = 0; i < kolom.aliases.length; i++) {
      var index = oudeIndex[crNormaliseerKolomnaam(kolom.aliases[i])];
      if (index !== undefined) return index;
    }
    throw new Error("Migratie gestopt; bronkolom ontbreekt voor: " + kolom.naam);
  });

  var alGereed = oudeKoppen.length === specificatie.length && specificatie.every(function (kolom, index) {
    return crNormaliseerKolomnaam(oudeKoppen[index]) === crNormaliseerKolomnaam(kolom.naam);
  });
  var antwoord = SpreadsheetApp.getUi().alert(
    alGereed ? "Voorpagina herstellen" : "Voorpagina migreren",
    "Er wordt eerst een backupwerkblad gemaakt. Daarna worden de 25 afgesproken kolommen " +
      (alGereed ? "opnieuw opgebouwd en gevalideerd." : "in de nieuwe volgorde opgebouwd.") + " Doorgaan?",
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  if (antwoord !== SpreadsheetApp.getUi().Button.YES) return { gewijzigd: false, reden: "geannuleerd" };

  var backupnaam = "Voorpagina backup " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
  var backup = blad.copyTo(ss).setName(backupnaam);
  var aantalRijen = Math.max(backup.getMaxRows(), backup.getLastRow(), 2);
  var gewenstAantal = specificatie.length;

  if (blad.getMaxColumns() < gewenstAantal) {
    blad.insertColumnsAfter(blad.getMaxColumns(), gewenstAantal - blad.getMaxColumns());
  }
  blad.getRange(1, 1, blad.getMaxRows(), blad.getMaxColumns()).clearDataValidations();
  blad.clear();

  specificatie.forEach(function (kolom, doelIndex) {
    var bronIndex = bronnen[doelIndex];
    backup.getRange(1, bronIndex + 1, aantalRijen, 1).copyTo(
      blad.getRange(1, doelIndex + 1, aantalRijen, 1),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );
    blad.setColumnWidth(doelIndex + 1, backup.getColumnWidth(bronIndex + 1));
  });
  blad.getRange(1, 1, 1, gewenstAantal).setValues([specificatie.map(function (kolom) { return kolom.naam; })]);

  if (blad.getMaxColumns() > gewenstAantal) {
    blad.deleteColumns(gewenstAantal + 1, blad.getMaxColumns() - gewenstAantal);
  }

  var laatsteRij = blad.getLastRow();
  if (laatsteRij > 1) {
    var nieuweKolommen = crMaakKolomindex(blad);
    var datumKolom = crZoekKolom(nieuweKolommen, "Datum") + 1;
    var collecteKolom = crZoekKolom(nieuweKolommen, "Collecte") + 1;
    var collectecategorieKolom = crZoekKolom(nieuweKolommen, "CollecteCategorie") + 1;
    var kwartaalKolom = crZoekKolom(nieuweKolommen, "Kwartaal") + 1;
    var maandKolom = crZoekKolom(nieuweKolommen, "Maand") + 1;
    blad.getRange(2, kwartaalKolom, laatsteRij - 1, 1).setFormulaR1C1(
      '=IF(RC[' + (datumKolom - kwartaalKolom) + ']="","",ROUNDUP(MONTH(RC[' + (datumKolom - kwartaalKolom) + '])/3,0))'
    );
    blad.getRange(2, maandKolom, laatsteRij - 1, 1).setFormulaR1C1(
      '=IF(RC[' + (datumKolom - maandKolom) + ']="","",MONTH(RC[' + (datumKolom - maandKolom) + ']))'
    );
    blad.getRange(2, collectecategorieKolom, laatsteRij - 1, 1).setFormulaR1C1(
      '=IF(RC[' + (collecteKolom - collectecategorieKolom) + ']="","",IFERROR(VLOOKUP(RC[' +
      (collecteKolom - collectecategorieKolom) + '],\'Lijst Collectes\'!C1:C2,2,FALSE),""))'
    );

    specificatie.filter(function (kolom) { return kolom.selectievakje; }).forEach(function (kolom) {
      var kolomnummer = crZoekKolom(nieuweKolommen, kolom.naam) + 1;
      var bereik = blad.getRange(2, kolomnummer, laatsteRij - 1, 1);
      var waarden = bereik.getValues().map(function (rij) {
        var waarde = String(rij[0] === null || rij[0] === undefined ? "" : rij[0]).trim().toLowerCase();
        return [rij[0] === true || waarde === "ja" || waarde === "x" || waarde === "ha" || waarde === "true" || waarde === "1"];
      });
      bereik.insertCheckboxes();
      bereik.setValues(waarden);
    });
  }

  blad.setFrozenRows(backup.getFrozenRows());
  blad.setFrozenColumns(Math.min(backup.getFrozenColumns(), gewenstAantal));
  ss.setNamedRange("VolledigRooster", blad.getRange(1, 1, Math.max(blad.getLastRow(), 1), gewenstAantal));
  ss.setNamedRange("BenoemdBereik1", blad.getRange(1, 1, blad.getMaxRows(), gewenstAantal));
  if (ss.getNamedRanges().some(function (bereik) { return bereik.getName() === "RoosterTypes"; })) {
    ss.removeNamedRange("RoosterTypes");
  }

  var resultaat = { gewijzigd: true, backup: backupnaam, kolommen: specificatie.map(function (kolom) { return kolom.naam; }) };
  console.log(JSON.stringify(resultaat, null, 2));
  SpreadsheetApp.getUi().alert("Voorpagina is gemigreerd. Backup: " + backupnaam);
  return resultaat;
}

/** Enige bron voor de toegestane configuratieregels en hun presentatievolgorde. */
function bhConfiguratieSpecificatie() {
  return [
    { categorie: "Agenda's", sleutel: "Agenda - Kerkdiensten", aliases: ["Kalender Kerkdiensten"], toelichting: "Naam van de agenda met kerkdiensten." },
    { categorie: "Agenda's", sleutel: "Agenda - Activiteiten", aliases: ["Kalender Activiteiten"], toelichting: "Naam van de algemene activiteitenagenda." },
    { categorie: "Agenda's", sleutel: "Agenda - KerkTV", aliases: ["Kalender KerkTV"], toelichting: "Naam van de agenda die voor KerkTV wordt gebruikt." },
    { categorie: "Agenda's", sleutel: "Agenda - Liemersactiviteiten", aliases: ["Kalender Liemers Activiteiten"], toelichting: "Naam van de agenda met Liemersactiviteiten." },

    { categorie: "Templates", sleutel: "Template-ID - KerkTV-liturgie", aliases: ["KerkTV MailTemplate Doc", "KerkTV MailTemplate Doc ID"], toelichting: "Google Document-ID van de KerkTV-liturgietemplate.", documentId: true },
    { categorie: "Templates", sleutel: "Template-ID - Mededelingen", aliases: ["Mededelingen Template", "Mededelingen Template ID"], toelichting: "Google Document-ID van de mededelingentemplate.", documentId: true },
    { categorie: "Templates", sleutel: "Template-ID - MJ-mededelingen", aliases: ["MJ Mededeling Template Doc", "MJ Mededeling Template Doc ID"], toelichting: "Google Document-ID van de Montferland Journaal-template.", documentId: true },
    { categorie: "Templates", sleutel: "Template-ID - Liemersactiviteiten", aliases: ["Liemers Activiteiten Template Doc", "Liemers Activiteiten Template Doc ID"], toelichting: "Google Document-ID van de template voor Liemersactiviteiten.", documentId: true },

    { categorie: "Mailinglijstwerkbladen", sleutel: "Mailinglijstwerkblad - Rooster", aliases: ["Rooster Mailinglist Sheet"], toelichting: "Werkblad met ontvangers van het rooster." },
    { categorie: "Mailinglijstwerkbladen", sleutel: "Mailinglijstwerkblad - Test", aliases: ["Test Mailinglist Sheet"], toelichting: "Werkblad met algemene testontvangers." },
    { categorie: "Mailinglijstwerkbladen", sleutel: "Mailinglijstwerkblad - KerkTV", aliases: ["KerkTV Mailinglist Sheet"], toelichting: "Werkblad met ontvangers van KerkTV-berichten." },
    { categorie: "Mailinglijstwerkbladen", sleutel: "Mailinglijstwerkblad - Lectoren", aliases: ["Lector Mailinglist Sheet"], toelichting: "Werkblad met ontvangers van het lectorrooster." },
    { categorie: "Mailinglijstwerkbladen", sleutel: "Mailinglijstwerkblad - Lectoren test", aliases: ["Lector TestMailinglist Sheet"], toelichting: "Werkblad met testontvangers van het lectorrooster." },

    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Jaarrooster", aliases: ["Mailinglist JaarRooster"], toelichting: "Ontvangers van het jaarrooster." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Mededelingen", aliases: ["Mailinglist Mededelingen"], toelichting: "Ontvangers van de kerkmededelingen." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Mededelingen test", aliases: ["Test Mailinglist Mededelingen"], toelichting: "Testontvangers van de kerkmededelingen." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Kerkdiensten", aliases: ["Mailinglist lijst kerkdiensten"], toelichting: "Ontvangers van de lijst met kerkdiensten." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - MJ", aliases: ["MJ Maillist"], toelichting: "Ontvangers van Montferland Journaal-berichten." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - MJ test", aliases: ["MJ Maillist test", "MJ Maillist tsTestDatumFormattering"], toelichting: "Testontvangers van Montferland Journaal-berichten." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Liemersactiviteiten", aliases: ["Liemers Activiteiten Maillist"], toelichting: "Ontvangers van Liemersactiviteiten." },
    { categorie: "Mailinglijsten", sleutel: "Mailinglijst - Liemersactiviteiten test", aliases: ["Test Liemers Activiteiten Maillist"], toelichting: "Testontvangers van Liemersactiviteiten." },

    { categorie: "Berichtteksten", sleutel: "Berichttekst - Rooster", aliases: ["Rooster Mededeling"], toelichting: "Standaardtekst voor roosterberichten." },
    { categorie: "Berichtteksten", sleutel: "Berichttekst - KerkTV", aliases: ["KerkTV Mededeling", "KerkTV Mededeling "], toelichting: "Standaardtekst voor KerkTV-berichten." }
  ];
}

/**
 * Behoudt uitsluitend gebruikte configuratie, migreert oude namen en bouwt een
 * leesbare, vaste tabelindeling op.
 */
function bhSchoonConfiguratieOp() {
  bhMigreerConfiguratie(false);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blad = ss.getSheetByName("Configuratie");
  var specificatie = bhConfiguratieSpecificatie();
  var laatsteRij = blad.getLastRow();
  var laatsteKolom = Math.max(blad.getLastColumn(), 4);
  var oud = laatsteRij ? blad.getRange(1, 1, laatsteRij, laatsteKolom).getValues() : [];
  var waarden = {};
  var bekendeNamen = new Set();

  specificatie.forEach(function (item) {
    bekendeNamen.add(item.sleutel);
    item.aliases.forEach(function (alias) { bekendeNamen.add(alias); });
  });

  oud.forEach(function (rij) {
    var nieuweSleutel = String(rij[1] || "").trim();
    var oudeSleutel = String(rij[0] || "").trim();
    if (bekendeNamen.has(nieuweSleutel)) {
      waarden[nieuweSleutel] = rij[2];
    } else if (bekendeNamen.has(oudeSleutel)) {
      waarden[oudeSleutel] = rij[1];
    }
  });

  var uitvoer = specificatie.map(function (item) {
    var waarde = waarden[item.sleutel];
    if (waarde === undefined || waarde === "") {
      for (var i = 0; i < item.aliases.length; i++) {
        if (waarden[item.aliases[i]] !== undefined && waarden[item.aliases[i]] !== "") {
          waarde = waarden[item.aliases[i]];
          break;
        }
      }
    }
    waarde = waarde === undefined ? "" : waarde;
    if (item.documentId && String(waarde).trim()) {
      waarde = bhBepaalDocumentId(String(waarde).trim());
    }
    return [item.categorie, item.sleutel, waarde, item.toelichting];
  });

  blad.clear();
  blad.getRange("A1:D1").merge().setValue("Configuratie Dienstenrooster");
  blad.getRange("A2:D2").setValues([["Categorie", "Instelling", "Waarde", "Toelichting"]]);
  if (uitvoer.length) {
    blad.getRange(3, 1, uitvoer.length, 4).setValues(uitvoer);
  }

  blad.setFrozenRows(2);
  blad.setHiddenGridlines(true);
  blad.getRange("A1:D1").setBackground("#1F4E78").setFontColor("#FFFFFF")
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("left");
  blad.getRange("A2:D2").setBackground("#D9EAF7").setFontWeight("bold");
  blad.getRange(3, 1, uitvoer.length, 4).setVerticalAlignment("top");
  blad.getRange(3, 3, uitvoer.length, 1).setNumberFormat("@");
  blad.getRange(3, 4, uitvoer.length, 1).setWrap(true).setFontColor("#555555");
  blad.setColumnWidth(1, 170);
  blad.setColumnWidth(2, 290);
  blad.setColumnWidth(3, 360);
  blad.setColumnWidth(4, 390);

  var categoriekleuren = {
    "Agenda's": "#EAF2F8",
    "Templates": "#FDF2E9",
    "Mailinglijstwerkbladen": "#E8F8F5",
    "Mailinglijsten": "#F4ECF7",
    "Berichtteksten": "#FEF9E7"
  };
  var achtergronden = uitvoer.map(function (rij) {
    return [categoriekleuren[rij[0]] || "#FFFFFF"];
  });
  blad.getRange(3, 1, uitvoer.length, 1).setBackgrounds(achtergronden).setFontWeight("bold");
  var legeWaardenRegel = SpreadsheetApp.newConditionalFormatRule()
    .whenCellEmpty().setBackground("#FCE8E6")
    .setRanges([blad.getRange(3, 3, uitvoer.length, 1)]).build();
  blad.setConditionalFormatRules([legeWaardenRegel]);

  var resultaat = {
    behoudenInstellingen: uitvoer.length,
    verwijderdeRegels: Math.max(0, oud.length - uitvoer.length),
    ontbrekendeWaarden: uitvoer.filter(function (rij) { return rij[2] === ""; })
      .map(function (rij) { return rij[1]; })
  };
  console.log(JSON.stringify(resultaat, null, 2));
  SpreadsheetApp.getUi().alert(
    "Configuratie opgeschoond. Behouden instellingen: " + uitvoer.length +
    ". Ontbrekende waarden: " + resultaat.ontbrekendeWaarden.length + "."
  );
  return resultaat;
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
    { oud: "KerkTV MailTemplate Doc", nieuw: "Template-ID - KerkTV-liturgie" },
    { oud: "Mededelingen Template", nieuw: "Template-ID - Mededelingen" },
    { oud: "MJ Mededeling Template Doc", nieuw: "Template-ID - MJ-mededelingen" },
    { oud: "Liemers Activiteiten Template Doc", nieuw: "Template-ID - Liemersactiviteiten" }
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
