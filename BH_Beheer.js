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
  var knownFunctions = new Set(["mnBijOpenen", "kaZetGebeurtenissenInAgenda", "tsTestVerzendRooster", "cmVerzendRooster", "opStelAchtergrondkleurenIn", "cmVerzendTemplate", "tsTestVerzendTemplate", "ytVerzendLaatsteVideos", "tsTestVerzendMjMededelingen", "cmVerzendMjMededelingen", "tsTestVerzendMededelingen", "cmVerzendMededelingen", "cmVerzendMededelingenVolgendeWeek", "cmVerzendLijstKerkdiensten", "rsVerwijderAlleRoosters", "rsMaakHalfjaarrooster1", "rsMaakHalfjaarrooster2", "rsVerzendJaarrooster", "exMaakJaarroosterXlsx", "exVerzendJaarroosterXlsx", "tsTestVerzendLiemersActiviteiten", "cmVerzendLiemersActiviteiten", "tsTestVerzendLectorrooster", "cmVerzendLectorrooster"]);
  var triggers = ScriptApp.getProjectTriggers().map(function (trigger) {
    var handler = trigger.getHandlerFunction();
    return {
      functie: handler,
      gebeurtenis: String(trigger.getEventType()),
      bron: String(trigger.getTriggerSource()),
      bekend: knownFunctions.has(handler)
    };
  });
  var namedRanges = ss.getNamedRanges().map(function (namedRange) {
    return {
      naam: namedRange.getName(),
      bereik: namedRange.getRange().getA1Notation(),
      werkblad: namedRange.getRange().getSheet().getName()
    };
  });
  var report = {
    spreadsheet: ss.getName(),
    tijdzoneScript: Session.getScriptTimeZone(),
    tijdzoneSpreadsheet: ss.getSpreadsheetTimeZone(),
    triggers: triggers,
    benoemdeBereiken: namedRanges,
    bloemen2024ontvangerAanwezig: namedRanges.some(function (item) {
      return item.naam === "Bloemen2024ontvanger";
    })
  };
  console.log(JSON.stringify(report, null, 2));
  return report;
}

/** Centrale, declaratieve beschrijving van de vaste spreadsheetstructuur. */
function bhSpreadsheetSpecificatie() {
  return {
    werkbladen: ["Voorpagina", "Overzicht", "NaamKleuren", "Bloemen 2026", "Lijst Collectes", "Lijst Voorgangers", "Lijst Ambtsdragers", "Lijst Lectoren", "Lijst Kosters", "Lijst Koffiezetters", "Lijst Ontvangst", "Lijst Klokkenluiders", "Lijst KerkTV", "Configuratie", "LectorMaillijst", "Maillijst", "Adressen", "TestMaillijst", "KerkTVMaillijst"],
    benoemdeBereiken: [{
      naam: "LijstKosters",
      werkblad: "Lijst Kosters",
      bereik: "A3:A19"
    }, {
      naam: "LijstAmbtsdragers",
      werkblad: "Lijst Ambtsdragers",
      bereik: "A3:A20"
    }, {
      naam: "LijstOntvangst",
      werkblad: "Lijst Ontvangst",
      bereik: "A3:A12"
    }, {
      naam: "LijstDiakenen",
      werkblad: "Lijst Ambtsdragers",
      bereik: "D4:D9"
    }, {
      naam: "LijstKlokkenluiders",
      werkblad: "Lijst Klokkenluiders",
      bereik: "A3:A11"
    }, {
      naam: "LijstKerkTV",
      werkblad: "Lijst KerkTV",
      bereik: "A3:A16"
    }, {
      naam: "LijstVoorgangers",
      werkblad: "Lijst Voorgangers",
      bereik: "A3:A52"
    }, {
      naam: "LijstLectoren",
      werkblad: "Lijst Lectoren",
      bereik: "A2:A10"
    }, {
      naam: "LijstCollectes",
      werkblad: "Lijst Collectes",
      bereik: "A3:A67"
    }, {
      naam: "LijstKoffiezetters",
      werkblad: "Lijst Koffiezetters",
      bereik: "A3:A12"
    }, {
      naam: "LijstExtra",
      werkblad: "Lijst Ambtsdragers",
      bereik: "E4:E22"
    }]
  };
}

/** Vaste technische namen voor de centrale adressentabel. */
var bhAddressCol = Object.freeze({
  NAME: "Naam",
  SORT_NAME: "Sorteernaam",
  EMAIL: "Email",
  PHONE: "Telefoon",
  COUNCIL: "Kerkenraad",
  PASTORAL_TEAM: "Pastoraal team",
  CHURCH_TV_SUBSCRIBER: "KerkTV Abonnee",
  OFFICER: "Ambtsdrager",
  EXTRA: "Extra",
  READER: "Lector",
  SEXTON: "Koster",
  COFFEE: "Koffie",
  GREETER: "Ontvangst",
  BELL_RINGER: "Klokkenluider",
  CHURCH_TV: "KerkTV"
});

/** Enige bron voor kolomnamen, volgorde, typen en oude namen van Adressen. */
function bhAdressenKolomspecificatie() {
  return [{ name: bhAddressCol.NAME, aliases: [] },
  { name: bhAddressCol.SORT_NAME, aliases: [] },
  { name: bhAddressCol.EMAIL, aliases: ["E-mail", "E-mailadres"] },
  { name: bhAddressCol.PHONE, aliases: ["Telefoonnummer", "Mobiel"] },
  { name: bhAddressCol.COUNCIL, aliases: [], checkbox: true },
  { name: bhAddressCol.PASTORAL_TEAM, aliases: ["Pastoraal Team"], checkbox: true },
  { name: bhAddressCol.CHURCH_TV_SUBSCRIBER, aliases: ["KerkTV-abonnee"], checkbox: true },
  { name: bhAddressCol.OFFICER, aliases: ["Ouderling", "Diaken"], checkbox: true },
  { name: bhAddressCol.EXTRA, aliases: [], checkbox: true },
  { name: bhAddressCol.READER, aliases: [], checkbox: true },
  { name: bhAddressCol.SEXTON, aliases: [], checkbox: true },
  { name: bhAddressCol.COFFEE, aliases: ["Koffiezetter", "Koffiezetters"], checkbox: true },
  { name: bhAddressCol.GREETER, aliases: [], checkbox: true },
  { name: bhAddressCol.BELL_RINGER, aliases: [], checkbox: true },
  { name: bhAddressCol.CHURCH_TV, aliases: [], checkbox: true }];
}

/** Zet `Jan de Jongh` om naar `Jongh, Jan de`. */
function bhMaakSorteernaam(name) {
  var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts.join("");
  var last = parts.pop();
  return last + ", " + parts.join(" ");
}

/** Normaliseert een persoonsnaam voor samenvoegen zonder de schrijfwijze te wijzigen. */
function bhNormaliseerPersoonsnaam(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

/** Geeft alle bronkolommen die bij één nieuwe Adressen-kolom horen. */
function bhVindAdresbronkolommen(headers, col) {
  var candidates = [col.name].concat(col.aliases || []).map(crNormaliseerKolomnaam);
  var indexes = [];
  headers.forEach(function (header, index) {
    if (candidates.indexOf(crNormaliseerKolomnaam(header)) >= 0) indexes.push(index);
  });
  return indexes;
}

/** Maakt of zoekt één uniek persoonrecord in de tijdelijke adresverzameling. */
function bhVindOfMaakAdresrecord(collection, name) {
  var displayName = String(name || "").trim().replace(/\s+/g, " ");
  var key = bhNormaliseerPersoonsnaam(displayName);
  if (!key) return null;
  if (!collection.byName[key]) {
    var record = { values: {} };
    record.values[bhAddressCol.NAME] = displayName;
    bhAdressenKolomspecificatie().forEach(function (col) {
      if (col.checkbox) record.values[col.name] = false;
    });
    collection.byName[key] = record;
    collection.items.push(record);
  }
  return collection.byName[key];
}

/** Leest en consolideert bestaande Adressen-rijen volgens het vaste schema. */
function bhConsolideerAdresrijen(headers, rows) {
  var spec = bhAdressenKolomspecificatie();
  var sources = {};
  spec.forEach(function (col) {
    sources[col.name] = bhVindAdresbronkolommen(headers, col);
  });
  if (!sources[bhAddressCol.NAME].length && rows.some(function (row) { return row.some(function (value) { return value !== ""; }); })) {
    throw new Error("De bestaande Adressen-tabel bevat gegevens, maar geen kolom 'Naam'.");
  }
  var collection = { items: [], byName: {} };
  rows.forEach(function (row, rowIndex) {
    var hasData = row.some(function (value) { return value !== "" && value !== null; });
    if (!hasData) return;
    var name = "";
    sources[bhAddressCol.NAME].some(function (index) {
      name = String(row[index] || "").trim();
      return Boolean(name);
    });
    if (!name) throw new Error("Adressen bevat gegevens zonder Naam op rij " + (rowIndex + 2) + ".");
    var record = bhVindOfMaakAdresrecord(collection, name);
    spec.forEach(function (col) {
      if (col.name === bhAddressCol.NAME || col.name === bhAddressCol.SORT_NAME) return;
      if (col.checkbox) {
        record.values[col.name] = record.values[col.name] || sources[col.name].some(function (index) {
          return bhIsJaWaarde(row[index]);
        });
        return;
      }
      sources[col.name].forEach(function (index) {
        var value = String(row[index] || "").trim();
        if (!value) return;
        var oldValue = String(record.values[col.name] || "").trim();
        if (oldValue && oldValue !== value) {
          throw new Error("Tegenstrijdige waarde voor " + col.name + " bij " + name + ": '" + oldValue + "' en '" + value + "'.");
        }
        record.values[col.name] = value;
      });
    });
  });
  return collection;
}

/** Voegt personen uit de bestaande taaklijsten aan de centrale verzameling toe. */
function bhVoegAdresTaaklijstenToe(ss, collection) {
  var sources = [{ column: bhAddressCol.OFFICER, ranges: ["LijstAmbtsdragers", "LijstDiakenen"] },
  { column: bhAddressCol.EXTRA, ranges: ["LijstExtra"] },
  { column: bhAddressCol.READER, ranges: ["LijstLectoren"] },
  { column: bhAddressCol.SEXTON, ranges: ["LijstKosters"] },
  { column: bhAddressCol.COFFEE, ranges: ["LijstKoffiezetters"] },
  { column: bhAddressCol.GREETER, ranges: ["LijstOntvangst"] },
  { column: bhAddressCol.BELL_RINGER, ranges: ["LijstKlokkenluiders"] },
  { column: bhAddressCol.CHURCH_TV, ranges: ["LijstKerkTV"] }];
  sources.forEach(function (source) {
    source.ranges.forEach(function (rangeName) {
      var range = ss.getRangeByName(rangeName);
      if (!range) return;
      range.getDisplayValues().forEach(function (row) {
        var record = bhVindOfMaakAdresrecord(collection, row[0]);
        if (record) record.values[source.column] = true;
      });
    });
  });
}

/** Zet de tijdelijke adresverzameling om naar de vaste tabelvolgorde. */
function bhMaakAdresuitvoer(collection) {
  var spec = bhAdressenKolomspecificatie();
  return collection.items.map(function (record) {
    record.values[bhAddressCol.SORT_NAME] = bhMaakSorteernaam(record.values[bhAddressCol.NAME]);
    return spec.map(function (col) {
      return col.checkbox ? Boolean(record.values[col.name]) : record.values[col.name] || "";
    });
  }).sort(function (left, right) {
    return String(left[1]).localeCompare(String(right[1]), "nl", { sensitivity: "base" });
  });
}

/** Zoekt de kopregel en begin-/eindkolom van de tabel Adressen. */
function bhVindAdressenTabelpositie(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (!lastRow || !lastCol) return { headerRow: 1, startCol: 1, columnCount: 0 };
  var values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  var known = [];
  bhAdressenKolomspecificatie().forEach(function (col) {
    [col.name].concat(col.aliases || []).forEach(function (name) {
      known.push(crNormaliseerKolomnaam(name));
    });
  });
  var best = null;
  values.forEach(function (row, rowIndex) {
    row.forEach(function (value, colIndex) {
      if (crNormaliseerKolomnaam(value) !== crNormaliseerKolomnaam(bhAddressCol.NAME)) return;
      var score = row.slice(colIndex).filter(function (header) {
        return known.indexOf(crNormaliseerKolomnaam(header)) >= 0;
      }).length;
      if (!best || score > best.score) best = { headerRow: rowIndex + 1, startCol: colIndex + 1, score: score };
    });
  });
  if (!best) throw new Error("De bestaande Adressen-tabel bevat gegevens, maar de kolom 'Naam' is nergens gevonden.");
  var headerValues = values[best.headerRow - 1];
  var endCol = best.startCol;
  for (var col = best.startCol; col <= lastCol; col++) {
    if (!String(headerValues[col - 1] || "").trim()) break;
    endCol = col;
  }
  return { headerRow: best.headerRow, startCol: best.startCol, columnCount: endCol - best.startCol + 1 };
}

/**
 * Werkt Adressen bij naar het vaste schema en importeert de bestaande taken.
 * Maakt altijd eerst een volledige backup van het werkblad.
 */
function bhWerkAdressenBij(showMessage) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Adressen") || ss.insertSheet("Adressen");
  var position = bhVindAdressenTabelpositie(sheet);
  var lastRow = sheet.getLastRow();
  var headers = position.columnCount ? sheet.getRange(position.headerRow, position.startCol, 1, position.columnCount).getDisplayValues()[0] : [];
  var rows = lastRow > position.headerRow && position.columnCount
    ? sheet.getRange(position.headerRow + 1, position.startCol, lastRow - position.headerRow, position.columnCount).getValues() : [];
  var knownHeaders = [];
  bhAdressenKolomspecificatie().forEach(function (col) {
    [col.name].concat(col.aliases || []).forEach(function (name) {
      knownHeaders.push(crNormaliseerKolomnaam(name));
    });
  });
  var unknownHeaders = headers.filter(function (header) {
    return String(header || "").trim() && knownHeaders.indexOf(crNormaliseerKolomnaam(header)) < 0;
  });
  if (showMessage !== false) {
    var warning = unknownHeaders.length ? " Niet-herkende kolommen blijven alleen in de backup bewaard: " + unknownHeaders.join(", ") + "." : "";
    var answer = SpreadsheetApp.getUi().alert("Adressen bijwerken", "Er wordt eerst een backup gemaakt. Daarna worden de vaste kolommen opgebouwd, dubbele taakvelden samengevoegd en bestaande taaklijsten geïmporteerd. Voorgangers worden niet geïmporteerd." + warning + " Doorgaan?", SpreadsheetApp.getUi().ButtonSet.YES_NO);
    if (answer !== SpreadsheetApp.getUi().Button.YES) return { gewijzigd: false, reden: "geannuleerd" };
  }
  var collection = bhConsolideerAdresrijen(headers, rows);
  bhVoegAdresTaaklijstenToe(ss, collection);
  var output = bhMaakAdresuitvoer(collection);
  var spec = bhAdressenKolomspecificatie();
  var backupName = "Adressen backup " + crFormatteerDatum(new Date(), crDateFormat.BACKUPTIJDSTEMPEL);
  sheet.copyTo(ss).setName(backupName);
  var columnCount = spec.length;
  var requiredLastCol = position.startCol + columnCount - 1;
  var requiredLastRow = position.headerRow + Math.max(output.length, 1);
  if (sheet.getMaxColumns() < requiredLastCol) sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredLastCol - sheet.getMaxColumns());
  if (sheet.getMaxRows() < requiredLastRow) sheet.insertRowsAfter(sheet.getMaxRows(), requiredLastRow - sheet.getMaxRows());
  var clearRows = Math.max(sheet.getLastRow() - position.headerRow + 1, output.length + 1, 2);
  var clearCols = Math.max(position.columnCount, columnCount);
  sheet.getRange(position.headerRow, position.startCol, clearRows, clearCols).clearContent().clearDataValidations();
  sheet.getRange(position.headerRow, position.startCol, 1, columnCount).setValues([spec.map(function (col) { return col.name; })]);
  if (output.length) {
    var checkboxOffset = spec.findIndex(function (col) { return col.checkbox; });
    sheet.getRange(position.headerRow + 1, position.startCol + checkboxOffset, output.length, columnCount - checkboxOffset).insertCheckboxes();
    sheet.getRange(position.headerRow + 1, position.startCol, output.length, columnCount).setValues(output);
    sheet.getRange(position.headerRow + 1, position.startCol, output.length, columnCount).sort({ column: position.startCol + 1, ascending: true });
  }
  sheet.setFrozenRows(position.headerRow);
  sheet.getRange(position.headerRow, position.startCol, 1, columnCount).setFontWeight("bold");
  sheet.getRange(position.headerRow + 1, position.startCol + 2, Math.max(output.length, 1), 2).setNumberFormat("@");
  sheet.autoResizeColumns(position.startCol, columnCount);
  var result = { gewijzigd: true, personen: output.length, backup: backupName, kolommen: columnCount, kopregel: position.headerRow, beginkolom: position.startCol, verwijderdeKolommen: unknownHeaders };
  console.log(JSON.stringify(result, null, 2));
  if (showMessage !== false) SpreadsheetApp.getUi().alert("Adressen bijgewerkt. Personen: " + output.length + ". Backup: " + backupName + ".");
  return result;
}

/** Werkt Sorteernaam direct bij wanneer een Naam in Adressen wordt gewijzigd. */
function bhBijWijzigingAdressen(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Adressen") return;
  var position = bhVindAdressenTabelpositie(sheet);
  if (e.range.getRow() <= position.headerRow) return;
  var cols = crMaakKolomindex(sheet, position.headerRow);
  var nameCol = crZoekKolom(cols, bhAddressCol.NAME) + 1;
  var sortCol = crZoekKolom(cols, bhAddressCol.SORT_NAME) + 1;
  var firstChangedCol = e.range.getColumn();
  var lastChangedCol = firstChangedCol + e.range.getNumColumns() - 1;
  if (nameCol < firstChangedCol || nameCol > lastChangedCol) return;
  var firstRow = e.range.getRow();
  var rowCount = e.range.getNumRows();
  var names = sheet.getRange(firstRow, nameCol, rowCount, 1).getDisplayValues();
  var sortNames = names.map(function (row) { return [bhMaakSorteernaam(row[0])]; });
  sheet.getRange(firstRow, sortCol, rowCount, 1).setValues(sortNames);
}

/** Vaste technische namen waarmee de Voorpagina-kolommen in code worden aangesproken. */
var bhFrontCol = Object.freeze({
  DATUM: "Datum",
  VOORGANGER: "Voorganger",
  BIJZONDERHEDEN: "Bijzonderheden",
  COLLECTE: "Collecte",
  LECTOR: "Lector",
  AMBTSDRAGER: "Ambtsdrager",
  EXTRA: "Extra",
  KOSTER: "Koster",
  KOFFIE: "Koffie",
  ONTVANGST: "Ontvangst",
  KLOKKENLUIDER: "Klokkenluider",
  KERKTV: "KerkTV",
  KLEUR: "Kleur",
  HEILIG_AVONDMAAL: "HeiligAvondmaal",
  AVONDMAALSVORM: "Avondmaalsvorm",
  NAAM_ZONDAG: "NaamZondag",
  COLLECTECATEGORIE: "CollecteCategorie",
  UITGANGSCOLLECTE: "Uitgangscollecte",
  KWARTAAL: "Kwartaal",
  MAAND: "Maand",
  KOFFIEDIENST: "KoffieDienst",
  DIDAMDIENST: "DidamDienst",
  YOUTUBE_LINK: "YouTubeLink",
  YOUTUBE_TITEL: "YouTubeTitel",
  BROADCAST_ID: "BroadcastId"
});
var bhFrontColSchemaCache = null;

/**
 * Enige bron voor technische namen, zichtbare titels, volgorde en gedrag van
 * alle Voorpagina-kolommen.
 */
function bhVoorpaginaKolomspecificatie() {
  if (bhFrontColSchemaCache) return bhFrontColSchemaCache;
  bhFrontColSchemaCache = [{
    naam: bhFrontCol.DATUM,
    titel: "Datum",
    type: "datumtijd",
    aliases: []
  }, {
    naam: bhFrontCol.VOORGANGER,
    titel: "Voorganger",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.BIJZONDERHEDEN,
    titel: "Bijzonderheden",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.COLLECTE,
    titel: "Collecte",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.LECTOR,
    titel: "Lector",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.AMBTSDRAGER,
    titel: "Ambtsdrager",
    type: "tekst",
    aliases: ["Ouderling"]
  }, {
    naam: bhFrontCol.EXTRA,
    titel: "Extra",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.KOSTER,
    titel: "Koster",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.KOFFIE,
    titel: "Koffie",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.ONTVANGST,
    titel: "Ontvangst",
    type: "tekst",
    aliases: ["Comm. van ontvangst"]
  }, {
    naam: bhFrontCol.KLOKKENLUIDER,
    titel: "Klokkenluider",
    type: "tekst",
    aliases: ["Klokken- luider"]
  }, {
    naam: bhFrontCol.KERKTV,
    titel: "KerkTV",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.KLEUR,
    titel: "Kleur",
    type: "keuze",
    aliases: []
  }, {
    naam: bhFrontCol.HEILIG_AVONDMAAL,
    titel: "Heilig Avondmaal",
    type: "selectievakje",
    aliases: ["HA"]
  }, {
    naam: bhFrontCol.AVONDMAALSVORM,
    titel: "Vorm Heilig Avondmaal",
    type: "tekst",
    aliases: ["HAvorm"]
  }, {
    naam: bhFrontCol.NAAM_ZONDAG,
    titel: "Naam van de zondag",
    type: "tekst",
    aliases: ["ZondagNaam", "Naam van Zondag"]
  }, {
    naam: bhFrontCol.COLLECTECATEGORIE,
    titel: "Collectecategorie",
    type: "afgeleid",
    bron: bhFrontCol.COLLECTE,
    aliases: ["CollecteCategorie", "Collecte (Categorie)"]
  }, {
    naam: bhFrontCol.UITGANGSCOLLECTE,
    titel: "Uitgangscollecte",
    type: "tekst",
    aliases: []
  }, {
    naam: bhFrontCol.KWARTAAL,
    titel: "Kwartaal",
    type: "afgeleid",
    bron: bhFrontCol.DATUM,
    aliases: []
  }, {
    naam: bhFrontCol.MAAND,
    titel: "Maand",
    type: "afgeleid",
    bron: bhFrontCol.DATUM,
    aliases: []
  }, {
    naam: bhFrontCol.KOFFIEDIENST,
    titel: "Koffiedienst",
    type: "jaNeeKeuze",
    aliases: ["KoffieDienst", "Koffie Dienst"]
  }, {
    naam: bhFrontCol.DIDAMDIENST,
    titel: "Dienst in Didam",
    type: "jaNeeKeuze",
    aliases: ["DidamDienst", "Didam Dienst"]
  }, {
    naam: bhFrontCol.YOUTUBE_LINK,
    titel: "YouTube-link",
    type: "url",
    aliases: ["YouTubeLink"]
  }, {
    naam: bhFrontCol.YOUTUBE_TITEL,
    titel: "YouTube-titel",
    type: "tekst",
    aliases: ["YouTubeTitel", "Titel"]
  }, {
    naam: bhFrontCol.BROADCAST_ID,
    titel: "Broadcast-ID",
    type: "tekst",
    aliases: ["BroadcastId"]
  }].map(function (col) {
    return Object.freeze(col);
  });
  return Object.freeze(bhFrontColSchemaCache);
}

/** Koppelt de zichtbare kopteksten van Voorpagina aan de vaste technische namen. */
function bhMaakVoorpaginaKolomindex(sheet) {
  var presentCols = crMaakKolomindex(sheet);
  var result = {};
  bhVoorpaginaKolomspecificatie().forEach(function (col) {
    var candidates = [col.titel, col.naam].concat(col.aliases || []);
    for (var i = 0; i < candidates.length; i++) {
      var index = crZoekKolom(presentCols, candidates[i], false);
      if (index !== undefined) {
        result[col.naam] = index;
        return;
      }
    }
    throw new Error("Verplichte Voorpagina-kolom ontbreekt: " + col.titel + " (" + col.naam + ")");
  });
  return result;
}

/** Geeft de nulgebaseerde positie van een vaste Voorpagina-kolom. */
function bhZoekVoorpaginaKolom(cols, name) {
  var index = cols[name];
  if (index === undefined) throw new Error("Onbekende Voorpagina-kolom: " + name);
  return index;
}

/** Zet één fysieke Voorpagina-rij om in een object met vaste veldnamen. */
function bhMaakDienstVanRij(row, cols) {
  var service = {};
  bhVoorpaginaKolomspecificatie().forEach(function (col) {
    service[col.naam] = row[bhZoekVoorpaginaKolom(cols, col.naam)];
  });
  return service;
}

/**
 * Eenmalige migratie van Voorpagina. Maakt eerst een volledige backupkopie en
 * vervangt daarna de inhoud door uitsluitend de opgegeven kolommen.
 */
function bhMigreerVoorpagina() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Voorpagina");
  if (!sheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var spec = bhVoorpaginaKolomspecificatie();
  var oldHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var oldIndex = {};
  oldHeaders.forEach(function (kop, index) {
    var key = crNormaliseerKolomnaam(kop);
    if (key) oldIndex[key] = index;
  });
  var sources = spec.map(function (col) {
    var candidates = [col.titel, col.naam].concat(col.aliases || []);
    for (var i = 0; i < candidates.length; i++) {
      var index = oldIndex[crNormaliseerKolomnaam(candidates[i])];
      if (index !== undefined) return index;
    }
    throw new Error("Migratie gestopt; bronkolom ontbreekt voor: " + col.titel + " (" + col.naam + ")");
  });
  var alreadyDone = oldHeaders.length === spec.length && spec.every(function (col, index) {
    return crNormaliseerKolomnaam(oldHeaders[index]) === crNormaliseerKolomnaam(col.titel);
  });
  var answer = SpreadsheetApp.getUi().alert(alreadyDone ? "Voorpagina herstellen" : "Voorpagina migreren", "Er wordt eerst een backupwerkblad gemaakt. Daarna worden de " + spec.length + " afgesproken kolommen " + (alreadyDone ? "opnieuw opgebouwd en gevalideerd." : "in de nieuwe volgorde opgebouwd.") + " Doorgaan?", SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (answer !== SpreadsheetApp.getUi().Button.YES) return {
    gewijzigd: false,
    reden: "geannuleerd"
  };
  var backupName = "Voorpagina backup " + crFormatteerDatum(new Date(), crDateFormat.BACKUPTIJDSTEMPEL);
  var backup = sheet.copyTo(ss).setName(backupName);
  var rowCount = Math.max(backup.getMaxRows(), backup.getLastRow(), 2);
  var wantedCount = spec.length;
  if (sheet.getMaxColumns() < wantedCount) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), wantedCount - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();
  sheet.clear();
  spec.forEach(function (col, doelIndex) {
    var sourceIndex = sources[doelIndex];
    backup.getRange(1, sourceIndex + 1, rowCount, 1).copyTo(sheet.getRange(1, doelIndex + 1, rowCount, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
    sheet.setColumnWidth(doelIndex + 1, backup.getColumnWidth(sourceIndex + 1));
  });
  sheet.getRange(1, 1, 1, wantedCount).setValues([spec.map(function (col) {
    return col.titel;
  })]);
  if (sheet.getMaxColumns() > wantedCount) {
    sheet.deleteColumns(wantedCount + 1, sheet.getMaxColumns() - wantedCount);
  }
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    bhControleerEnHerberekenVoorpagina(false);
  }
  sheet.setFrozenRows(backup.getFrozenRows());
  sheet.setFrozenColumns(Math.min(backup.getFrozenColumns(), wantedCount));
  ss.setNamedRange("VolledigRooster", sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), wantedCount));
  ss.setNamedRange("BenoemdBereik1", sheet.getRange(1, 1, sheet.getMaxRows(), wantedCount));
  if (ss.getNamedRanges().some(function (range) {
    return range.getName() === "RoosterTypes";
  })) {
    ss.removeNamedRange("RoosterTypes");
  }
  var result = {
    gewijzigd: true,
    backup: backupName,
    kolommen: spec.map(function (col) {
      return {
        naam: col.naam,
        titel: col.titel
      };
    })
  };
  console.log(JSON.stringify(result, null, 2));
  SpreadsheetApp.getUi().alert("Voorpagina is gemigreerd. Backup: " + backupName);
  return result;
}

/**
 * Bouwt draaitabellen met een verkeerde of onleesbare bron opnieuw op dezelfde
 * ankercel op. Groepen, waarden, filters, sortering en totalen blijven behouden.
 */
function bhHerstelDraaitabelbronnen(showMessage) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var frontSheet = ss.getSheetByName("Voorpagina");
  if (!frontSheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var sourceRange = frontSheet.getRange(1, 1, Math.max(frontSheet.getLastRow(), 2), bhVoorpaginaKolomspecificatie().length);
  function bhLeesGroep(group) {
    var dateRule = group.getDateTimeGroupingRule();
    var groupLimit = group.getGroupLimit();
    return {
      bronkolom: group.getSourceDataColumn(),
      datumgroepering: dateRule ? dateRule.getRuleType() : null,
      groepslimiet: groupLimit ? groupLimit.getCountLimit() : null
    };
  }
  function bhVoegGroepToe(pivot, group, isRowGroup) {
    var updated = isRowGroup ? pivot.addRowGroup(group.bronkolom) : pivot.addColumnGroup(group.bronkolom);
    if (group.datumgroepering) updated.setDateTimeGroupingRule(group.datumgroepering);
    if (group.groepslimiet) updated.setGroupLimit(group.groepslimiet);
  }
  var changed = [];
  var alreadyCorrect = [];
  var backups = [];
  var backupBySheet = {};
  var timestamp = crFormatteerDatum(new Date(), crDateFormat.BACKUPTIJDSTEMPEL);
  ss.getSheets().forEach(function (sheet) {
    sheet.getPivotTables().forEach(function (pivot) {
      var anchorCell = pivot.getAnchorCell();
      var location = sheet.getName() + "!" + anchorCell.getA1Notation();
      var oldSource = "onleesbare bron";
      try {
        oldSource = pivot.getSourceDataRange().getSheet().getName();
        if (oldSource === "Voorpagina") {
          alreadyCorrect.push(location);
          return;
        }
      } catch (fout) {
        console.log("Bron van " + location + " kon niet worden gelezen: " + fout.message);
      }
      var rowGroups = pivot.getRowGroups().map(bhLeesGroep);
      var colGroups = pivot.getColumnGroups().map(bhLeesGroep);
      var valueOrientation = pivot.getValuesDisplayOrientation();
      var values = pivot.getPivotValues().map(function (value) {
        return {
          bronkolom: value.getSourceDataColumn(),
          formule: value.getFormula(),
          samenvatting: value.getSummarizedBy(),
          weergave: value.getDisplayType()
        };
      });
      if (values.some(function (value) {
        return Boolean(value.formule);
      })) {
        throw new Error("Draaitabel " + location + " bevat een berekende waarde en kan niet veilig automatisch worden herbouwd.");
      }
      var filters = pivot.getFilters().map(function (filter) {
        return {
          bronkolom: filter.getSourceDataColumn(),
          criterium: filter.getFilterCriteria()
        };
      });
      if (!backupBySheet[sheet.getSheetId()]) {
        var suffix = "-" + sheet.getSheetId();
        var baseName = "Draaitabelbackup " + timestamp + " - " + sheet.getName();
        var backupName = baseName.slice(0, 100 - suffix.length) + suffix;
        sheet.copyTo(ss).setName(backupName);
        backupBySheet[sheet.getSheetId()] = backupName;
        backups.push(backupName);
      }
      pivot.remove();
      var newPivot = anchorCell.createPivotTable(sourceRange);
      if (valueOrientation) newPivot.setValuesDisplayOrientation(valueOrientation);
      rowGroups.forEach(function (group) {
        bhVoegGroepToe(newPivot, group, true);
      });
      colGroups.forEach(function (group) {
        bhVoegGroepToe(newPivot, group, false);
      });
      values.forEach(function (value) {
        var updated = newPivot.addPivotValue(value.bronkolom, value.samenvatting);
        if (value.weergave) updated.showAs(value.weergave);
      });
      filters.forEach(function (filter) {
        newPivot.addFilter(filter.bronkolom, filter.criterium);
      });
      changed.push({
        draaitabel: location,
        oudeBron: oldSource,
        nieuweBron: "Voorpagina"
      });
    });
  });
  var result = {
    aangepast: changed,
    reedsCorrect: alreadyCorrect,
    backups: backups,
    aantalAangepast: changed.length,
    aantalReedsCorrect: alreadyCorrect.length
  };
  console.log(JSON.stringify(result, null, 2));
  if (showMessage !== false) {
    SpreadsheetApp.getUi().alert(changed.length + " draaitabelbron(nen) gewijzigd naar Voorpagina; " + alreadyCorrect.length + " waren al correct. Backupwerkbladen: " + backups.length + ".");
  }
  return result;
}

/** Herkent de verschillende waarden die in oude roosters als `ja` golden. */
function bhIsJaWaarde(value) {
  return value === true || ["ja", "x", "ha", "true", "1"].indexOf(String(value === null || value === undefined ? "" : value).trim().toLowerCase()) >= 0;
}

/** Normaliseert een waarde voor de ja/nee-keuzelijsten. */
function bhNormaliseerJaNee(value) {
  var text = String(value === null || value === undefined ? "" : value).trim().toLowerCase();
  if (bhIsJaWaarde(value)) return "ja";
  if (value === false || ["nee", "false", "0"].indexOf(text) >= 0) return "nee";
  return "";
}

/** Houdt de afgeleide tekst `Heilig Avondmaal` synchroon met het selectievakje. */
function bhSynchroniseerAvondmaalBijzonderheden(value, hasCommunion) {
  var parts = String(value === null || value === undefined ? "" : value).split(/\s*,\s*/).map(function (part) {
    return part.trim();
  }).filter(function (part) {
    return part && part.toLowerCase() !== "heilig avondmaal";
  });
  if (hasCommunion) parts.push("Heilig Avondmaal");
  return parts.join(", ");
}

/**
 * Controleert keuzes en herberekent alle afgeleide waarden op Voorpagina.
 * Bij `onEdit` beperken opties de verwerking tot gewijzigde rijen en kolommen;
 * een handmatige beheeractie controleert standaard alle rijen en afleidingen.
 */
function bhControleerEnHerberekenVoorpagina(showMessage, firstRow, rowCount, options) {
  var startTime = crStartMeting();
  options = options || {};
  var calcDate = options.calcDate !== false;
  var calcCollection = options.calcCollection !== false;
  var syncCommunion = options.syncCommunion !== false;
  var restoreChoices = options.restoreChoices !== false;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Voorpagina");
  if (!sheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var cols = bhMaakVoorpaginaKolomindex(sheet);
  var dateCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.DATUM) + 1;
  var collectionCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.COLLECTE) + 1;
  var categoryCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.COLLECTECATEGORIE) + 1;
  var quarterCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.KWARTAAL) + 1;
  var monthCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.MAAND) + 1;
  var communionCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.HEILIG_AVONDMAAL) + 1;
  var notesCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.BIJZONDERHEDEN) + 1;
  var coffeeServiceCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.KOFFIEDIENST) + 1;
  var didamServiceCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.DIDAMDIENST) + 1;
  var categoryByTarget = {};
  if (calcCollection !== false) {
    var collectionSheet = ss.getSheetByName("Lijst Collectes");
    if (!collectionSheet || collectionSheet.getLastRow() < 3) {
      throw new Error("Werkblad 'Lijst Collectes' ontbreekt of bevat geen collectes.");
    }
    var collectionCols = crMaakKolomindex(collectionSheet, 2);
    var targetCol = crZoekKolom(collectionCols, "Doel") + 1;
    var catCol = crZoekKolom(collectionCols, "Categorie") + 1;
    var collectionCount = collectionSheet.getLastRow() - 2;
    var collectionData = collectionSheet.getRange(3, 1, collectionCount, collectionSheet.getLastColumn()).getValues();
    collectionData.forEach(function (row) {
      var target = String(row[targetCol - 1] || "").trim();
      if (target) categoryByTarget[target] = row[catCol - 1] || "";
    });
  }
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return {
    bijgewerkteRijen: 0
  };
  var startRow = Math.max(2, firstRow || 2);
  var endRow = Math.min(lastRow, rowCount ? startRow + rowCount - 1 : lastRow);
  if (endRow < startRow) return {
    bijgewerkteRijen: 0
  };
  var actualRowCount = endRow - startRow + 1;
  var data = sheet.getRange(startRow, 1, actualRowCount, sheet.getLastColumn()).getValues();
  var quarters = [];
  var months = [];
  var categories = [];
  var communionValues = [];
  var notesValues = [];
  var coffeeServiceValues = [];
  var didamServiceValues = [];
  data.forEach(function (row) {
    var date = row[dateCol - 1];
    var validDate = date instanceof Date && !isNaN(date.getTime());
    var month = validDate ? date.getMonth() + 1 : "";
    months.push([month]);
    quarters.push([month ? Math.ceil(month / 3) : ""]);
    var collection = String(row[collectionCol - 1] || "").trim();
    categories.push([collection && categoryByTarget.hasOwnProperty(collection) ? categoryByTarget[collection] : ""]);
    var hasCommunion = bhIsJaWaarde(row[communionCol - 1]);
    communionValues.push([hasCommunion]);
    notesValues.push([bhSynchroniseerAvondmaalBijzonderheden(row[notesCol - 1], hasCommunion)]);
    coffeeServiceValues.push([bhNormaliseerJaNee(row[coffeeServiceCol - 1])]);
    didamServiceValues.push([bhNormaliseerJaNee(row[didamServiceCol - 1])]);
  });
  if (calcDate !== false) {
    sheet.getRange(startRow, quarterCol, quarters.length, 1).setValues(quarters);
    sheet.getRange(startRow, monthCol, months.length, 1).setValues(months);
  }
  if (calcCollection !== false) {
    sheet.getRange(startRow, categoryCol, categories.length, 1).setValues(categories);
  }
  if (syncCommunion) {
    sheet.getRange(startRow, notesCol, notesValues.length, 1).setValues(notesValues);
  }
  if (restoreChoices) {
    sheet.getRange(startRow, communionCol, communionValues.length, 1).clearDataValidations().insertCheckboxes().setValues(communionValues);
    var yesNoRule = SpreadsheetApp.newDataValidation().requireValueInList(["ja", "nee"], true).setAllowInvalid(false).build();
    sheet.getRange(startRow, coffeeServiceCol, coffeeServiceValues.length, 1).clearDataValidations().setDataValidation(yesNoRule).setValues(coffeeServiceValues);
    sheet.getRange(startRow, didamServiceCol, didamServiceValues.length, 1).clearDataValidations().setDataValidation(yesNoRule).setValues(didamServiceValues);
  }
  var result = {
    bijgewerkteRijen: actualRowCount,
    datumHerberekend: calcDate,
    collecteCategorieHerberekend: calcCollection,
    avondmaalGesynchroniseerd: syncCommunion,
    keuzesHersteld: restoreChoices
  };
  result.milliseconden = crEindMeting("bhControleerEnHerberekenVoorpagina", startTime, result);
  console.log(JSON.stringify(result, null, 2));
  if (showMessage !== false) {
    SpreadsheetApp.getUi().alert("Voorpagina gecontroleerd: keuzes hersteld en alle afgeleide waarden opnieuw berekend.");
  }
  return result;
}

/** Werkt relevante afgeleide waarden bij na wijziging van Datum, Collecte of HA. */
function bhBijWijzigingVoorpagina(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Voorpagina" || e.range.getRow() === 1) return;
  var cols = bhMaakVoorpaginaKolomindex(sheet);
  var firstChangedCol = e.range.getColumn() - 1;
  var lastChangedCol = firstChangedCol + e.range.getNumColumns() - 1;
  var dateCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.DATUM);
  var collectionCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.COLLECTE);
  var communionCol = bhZoekVoorpaginaKolom(cols, bhFrontCol.HEILIG_AVONDMAAL);
  var dateChanged = dateCol >= firstChangedCol && dateCol <= lastChangedCol;
  var collectionChanged = collectionCol >= firstChangedCol && collectionCol <= lastChangedCol;
  var communionChanged = communionCol >= firstChangedCol && communionCol <= lastChangedCol;
  if (!dateChanged && !collectionChanged && !communionChanged) return;
  var firstRow = Math.max(2, e.range.getRow());
  var lastChangedRow = e.range.getRow() + e.range.getNumRows() - 1;
  var rowCount = Math.max(0, lastChangedRow - firstRow + 1);
  if (!rowCount) return;
  bhControleerEnHerberekenVoorpagina(false, firstRow, rowCount, {
    calcDate: dateChanged,
    calcCollection: collectionChanged,
    syncCommunion: communionChanged,
    restoreChoices: false
  });
}

/** Enige bron voor de toegestane configuratieregels en hun presentatievolgorde. */
function bhConfiguratieSpecificatie() {
  return [{
    categorie: "Agenda's",
    sleutel: "Agenda - Kerkdiensten",
    aliases: ["Kalender Kerkdiensten", "Agenda - KerkTV", "Kalender KerkTV"],
    toelichting: "Naam van de agenda met kerkdiensten en KerkTV-gegevens."
  }, {
    categorie: "Agenda's",
    sleutel: "Agenda - Activiteiten",
    aliases: ["Kalender Activiteiten"],
    toelichting: "Naam van de algemene activiteitenagenda."
  }, {
    categorie: "Agenda's",
    sleutel: "Agenda - Liemersactiviteiten",
    aliases: ["Kalender Liemers Activiteiten"],
    toelichting: "Naam van de agenda met Liemersactiviteiten."
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - KerkTV-liturgie",
    aliases: ["KerkTV MailTemplate Doc", "KerkTV MailTemplate Doc ID"],
    toelichting: "Google Document-ID van de KerkTV-liturgietemplate.",
    documentId: true
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - Mededelingen mail",
    aliases: ["Mededelingen Mail", "Mededelingen Mail Template", "Mededelingen Mail Template ID"],
    toelichting: "Google Document-ID van de template voor de tekst en opmaak van de mededelingenmail.",
    documentId: true
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - Mededelingen document",
    aliases: ["Mededelingen Template", "Mededelingen Template ID", "Template-ID - Mededelingen"],
    toelichting: "Google Document-ID van de mededelingentemplate die als DOCX-bijlage wordt meegestuurd.",
    documentId: true
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - MJ-mededelingen",
    aliases: ["MJ Mededeling Template Doc", "MJ Mededeling Template Doc ID"],
    toelichting: "Google Document-ID van de Montferland Journaal-template.",
    documentId: true
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - Liemersactiviteiten",
    aliases: ["Liemers Activiteiten Template Doc", "Liemers Activiteiten Template Doc ID"],
    toelichting: "Google Document-ID van de template voor Liemersactiviteiten.",
    documentId: true
  }, {
    categorie: "Templates",
    sleutel: "Template-ID - Testmail",
    aliases: ["Testmail Template", "Testmail Template ID"],
    toelichting: "Google Document-ID van de template waarmee alle mailvariabelen worden getest.",
    documentId: true
  }, {
    categorie: "Mailinglijstwerkbladen",
    sleutel: "Mailinglijstwerkblad - Rooster",
    aliases: ["Rooster Mailinglist Sheet"],
    toelichting: "Werkblad met ontvangers van het rooster."
  }, {
    categorie: "Mailinglijstwerkbladen",
    sleutel: "Mailinglijstwerkblad - KerkTV",
    aliases: ["KerkTV Mailinglist Sheet"],
    toelichting: "Werkblad met ontvangers van KerkTV-berichten."
  }, {
    categorie: "Mailinglijstwerkbladen",
    sleutel: "Mailinglijstwerkblad - Lectoren",
    aliases: ["Lector Mailinglist Sheet"],
    toelichting: "Werkblad met ontvangers van het lectorrooster."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Mailinglijst - Jaarrooster",
    aliases: ["Mailinglist JaarRooster"],
    toelichting: "Ontvangers van het jaarrooster."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Mailinglijst - Mededelingen",
    aliases: ["Mailinglist Mededelingen"],
    toelichting: "Ontvangers van de kerkmededelingen."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Mailinglijst - Kerkdiensten",
    aliases: ["Mailinglist lijst kerkdiensten"],
    toelichting: "Ontvangers van de lijst met kerkdiensten."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Mailinglijst - MJ",
    aliases: ["MJ Maillist"],
    toelichting: "Ontvangers van Montferland Journaal-berichten."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Mailinglijst - Liemersactiviteiten",
    aliases: ["Liemers Activiteiten Maillist"],
    toelichting: "Ontvangers van Liemersactiviteiten."
  }, {
    categorie: "Mailinglijsten",
    sleutel: "Testmail",
    aliases: ["Testmailadressen"],
    toelichting: "Kommagescheiden ontvangers voor alle testmails.",
    standaardwaarde: "avandervliet@gmail.com, avandervliet@xs4all.nl"
  }, {
    categorie: "Berichtteksten",
    sleutel: "Berichttekst - Rooster",
    aliases: ["Rooster Mededeling"],
    toelichting: "Standaardtekst voor roosterberichten."
  }, {
    categorie: "Berichtteksten",
    sleutel: "Berichttekst - KerkTV",
    aliases: ["KerkTV Mededeling", "KerkTV Mededeling "],
    toelichting: "Standaardtekst voor KerkTV-berichten."
  }];
}

/**
 * Behoudt uitsluitend gebruikte configuratie, migreert oude namen en bouwt een
 * leesbare, vaste tabelindeling op.
 */
function bhSchoonConfiguratieOp() {
  bhMigreerConfiguratie(false);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Configuratie");
  var spec = bhConfiguratieSpecificatie();
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 4);
  var old = lastRow ? sheet.getRange(1, 1, lastRow, lastCol).getValues() : [];
  var values = {};
  var knownNames = new Set();
  spec.forEach(function (item) {
    knownNames.add(item.sleutel);
    item.aliases.forEach(function (alias) {
      knownNames.add(alias);
    });
  });
  old.forEach(function (row) {
    var newKey = String(row[1] || "").trim();
    var oldKey = String(row[0] || "").trim();
    if (knownNames.has(newKey)) {
      values[newKey] = row[2];
    } else if (knownNames.has(oldKey)) {
      values[oldKey] = row[1];
    }
  });
  var output = spec.map(function (item) {
    var value = values[item.sleutel];
    if (value === undefined || value === "") {
      for (var i = 0; i < item.aliases.length; i++) {
        if (values[item.aliases[i]] !== undefined && values[item.aliases[i]] !== "") {
          value = values[item.aliases[i]];
          break;
        }
      }
    }
    value = value === undefined || value === "" ? item.standaardwaarde || "" : value;
    if (item.documentId && String(value).trim()) {
      value = bhBepaalDocumentId(String(value).trim());
    }
    return [item.categorie, item.sleutel, value, item.toelichting];
  });
  sheet.clear();
  sheet.getRange("A1:D1").merge().setValue("Configuratie Dienstenrooster");
  sheet.getRange("A2:D2").setValues([["Categorie", "Instelling", "Waarde", "Toelichting"]]);
  if (output.length) {
    sheet.getRange(3, 1, output.length, 4).setValues(output);
  }
  sheet.setFrozenRows(2);
  sheet.setHiddenGridlines(true);
  sheet.getRange("A1:D1").setBackground("#1F4E78").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(14).setHorizontalAlignment("left");
  sheet.getRange("A2:D2").setBackground("#D9EAF7").setFontWeight("bold");
  sheet.getRange(3, 1, output.length, 4).setVerticalAlignment("top");
  sheet.getRange(3, 3, output.length, 1).setNumberFormat("@");
  sheet.getRange(3, 4, output.length, 1).setWrap(true).setFontColor("#555555");
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 290);
  sheet.setColumnWidth(3, 360);
  sheet.setColumnWidth(4, 390);
  var categoryColors = {
    "Agenda's": "#EAF2F8",
    "Templates": "#FDF2E9",
    "Mailinglijstwerkbladen": "#E8F8F5",
    "Mailinglijsten": "#F4ECF7",
    "Berichtteksten": "#FEF9E7"
  };
  var backgrounds = output.map(function (row) {
    return [categoryColors[row[0]] || "#FFFFFF"];
  });
  sheet.getRange(3, 1, output.length, 1).setBackgrounds(backgrounds).setFontWeight("bold");
  var emptyValueRule = SpreadsheetApp.newConditionalFormatRule().whenCellEmpty().setBackground("#FCE8E6").setRanges([sheet.getRange(3, 3, output.length, 1)]).build();
  sheet.setConditionalFormatRules([emptyValueRule]);
  var result = {
    behoudenInstellingen: output.length,
    verwijderdeRegels: Math.max(0, old.length - output.length),
    ontbrekendeWaarden: output.filter(function (row) {
      return row[2] === "";
    }).map(function (row) {
      return row[1];
    })
  };
  crWisConfiguratieCache();
  console.log(JSON.stringify(result, null, 2));
  SpreadsheetApp.getUi().alert("Configuratie opgeschoond. Behouden instellingen: " + output.length + ". Ontbrekende waarden: " + result.ontbrekendeWaarden.length + ".");
  return result;
}

/**
 * Hernoemt het bestaande instellingenblad en zet templatebestandsnamen eenmalig
 * om naar stabiele Google Document-ID's.
 */
function bhMigreerConfiguratie(showMessage) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var oldSheet = ss.getSheetByName("Instellingen");
  var configSheet = ss.getSheetByName("Configuratie");
  if (oldSheet && configSheet && oldSheet.getSheetId() !== configSheet.getSheetId()) {
    throw new Error("Zowel 'Instellingen' als 'Configuratie' bestaat. Voeg deze eerst handmatig samen.");
  }
  if (!configSheet && oldSheet) {
    oldSheet.setName("Configuratie");
    configSheet = oldSheet;
  }
  if (!configSheet) {
    configSheet = ss.insertSheet("Configuratie");
  }
  var keyMigrations = [{
    oud: "KerkTV MailTemplate Doc",
    nieuw: "Template-ID - KerkTV-liturgie"
  }, {
    oud: "Mededelingen Mail",
    nieuw: "Template-ID - Mededelingen mail"
  }, {
    oud: "Mededelingen Template",
    nieuw: "Template-ID - Mededelingen document"
  }, {
    oud: "Template-ID - Mededelingen",
    nieuw: "Template-ID - Mededelingen document"
  }, {
    oud: "MJ Mededeling Template Doc",
    nieuw: "Template-ID - MJ-mededelingen"
  }, {
    oud: "Liemers Activiteiten Template Doc",
    nieuw: "Template-ID - Liemersactiviteiten"
  }, {
    oud: "Testmail Template",
    nieuw: "Template-ID - Testmail"
  }];
  var lastRow = configSheet.getLastRow();
  var data = lastRow ? configSheet.getRange(1, 1, lastRow, 2).getValues() : [];
  var changes = [];
  keyMigrations.forEach(function (migratie) {
    for (var row = 0; row < data.length; row++) {
      var key = String(data[row][0]).trim();
      if (key === migratie.oud || key === migratie.nieuw) {
        var oldValue = String(data[row][1] || "").trim();
        var documentId = bhBepaalDocumentId(oldValue);
        configSheet.getRange(row + 1, 1, 1, 2).setValues([[migratie.nieuw, documentId]]);
        changes.push({
          rij: row + 1,
          sleutel: migratie.nieuw,
          documentId: documentId
        });
        return;
      }
    }
  });
  var result = {
    werkblad: configSheet.getName(),
    templateMigraties: changes
  };
  crWisConfiguratieCache();
  console.log(JSON.stringify(result, null, 2));
  if (showMessage !== false) {
    SpreadsheetApp.getUi().alert("Configuratiemigratie voltooid. Template-ID's bijgewerkt: " + changes.length + ".");
  }
  return result;
}

/** Accepteert een bestaand ID, een document-URL of een oude bestandsnaam. */
function bhBepaalDocumentId(value) {
  if (!value) {
    throw new Error("Een mailtemplate heeft geen document-ID of bestandsnaam.");
  }
  var urlMatch = value.match(/\/d\/([a-zA-Z0-9_-]+)/);
  var candidate = urlMatch ? urlMatch[1] : value;
  try {
    DriveApp.getFileById(candidate).getName();
    return candidate;
  } catch (fout) {
    var files = DriveApp.getFilesByName(value);
    if (!files.hasNext()) {
      throw new Error("Mailtemplate niet gevonden: " + value);
    }
    var documentId = files.next().getId();
    if (files.hasNext()) {
      throw new Error("Meerdere mailtemplates met dezelfde naam gevonden: " + value);
    }
    return documentId;
  }
}

/** Alleen-lezen controle van werkbladen, benoemde bereiken en tijdzones. */
function bhControleerSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var spec = bhSpreadsheetSpecificatie();
  var existingSheets = new Set(ss.getSheets().map(function (sheet) {
    return sheet.getName();
  }));
  var existingRanges = {};
  ss.getNamedRanges().forEach(function (namedRange) {
    existingRanges[namedRange.getName()] = {
      werkblad: namedRange.getRange().getSheet().getName(),
      bereik: namedRange.getRange().getA1Notation()
    };
  });
  var missingSheets = spec.werkbladen.filter(function (name) {
    return !existingSheets.has(name);
  });
  var missingRanges = [];
  var invalidRanges = [];
  spec.benoemdeBereiken.forEach(function (verwacht) {
    var current = existingRanges[verwacht.naam];
    if (!current) {
      missingRanges.push(verwacht);
    } else if (current.werkblad !== verwacht.werkblad || current.bereik !== verwacht.bereik) {
      invalidRanges.push({
        verwacht: verwacht,
        huidig: current
      });
    }
  });
  var missingFrontCols = [];
  var invalidFrontTitles = [];
  var frontSheet = ss.getSheetByName("Voorpagina");
  if (frontSheet && frontSheet.getLastColumn() > 0) {
    var frontHeaders = frontSheet.getRange(1, 1, 1, frontSheet.getLastColumn()).getValues()[0];
    var presentCols = crMaakKolomindex(frontSheet);
    bhVoorpaginaKolomspecificatie().forEach(function (col) {
      var candidates = [col.titel, col.naam].concat(col.aliases || []);
      var foundIndex;
      var foundTitle;
      for (var i = 0; i < candidates.length; i++) {
        foundIndex = crZoekKolom(presentCols, candidates[i], false);
        if (foundIndex !== undefined) {
          foundTitle = frontHeaders[foundIndex];
          break;
        }
      }
      if (foundIndex === undefined) {
        missingFrontCols.push({
          naam: col.naam,
          titel: col.titel
        });
      } else if (crNormaliseerKolomnaam(foundTitle) !== crNormaliseerKolomnaam(col.titel)) {
        invalidFrontTitles.push({
          naam: col.naam,
          verwacht: col.titel,
          huidig: foundTitle
        });
      }
    });
  } else if (frontSheet) {
    missingFrontCols = bhVoorpaginaKolomspecificatie().map(function (col) {
      return {
        naam: col.naam,
        titel: col.titel
      };
    });
  }
  var report = {
    geldig: missingSheets.length === 0 && missingRanges.length === 0 && invalidRanges.length === 0 && missingFrontCols.length === 0 && invalidFrontTitles.length === 0,
    spreadsheet: ss.getName(),
    tijdzoneScript: Session.getScriptTimeZone(),
    tijdzoneSpreadsheet: ss.getSpreadsheetTimeZone(),
    ontbrekendeWerkbladen: missingSheets,
    ontbrekendeBereiken: missingRanges,
    afwijkendeBereiken: invalidRanges,
    ontbrekendeVoorpaginaKolommen: missingFrontCols,
    afwijkendeVoorpaginaTitels: invalidFrontTitles
  };
  console.log(JSON.stringify(report, null, 2));
  SpreadsheetApp.getUi().alert(report.geldig ? "De vaste spreadsheetstructuur is in orde." : "Er zijn afwijkingen gevonden. Bekijk het uitvoeringslogboek.");
  return report;
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
  var spec = bhSpreadsheetSpecificatie();
  var createdSheets = [];
  var createdRanges = [];
  spec.werkbladen.forEach(function (name) {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
      createdSheets.push(name);
    }
  });
  var frontSheet = ss.getSheetByName("Voorpagina");
  if (frontSheet.getLastRow() === 0 || frontSheet.getLastColumn() === 0) {
    var frontSchema = bhVoorpaginaKolomspecificatie();
    if (frontSheet.getMaxColumns() < frontSchema.length) {
      frontSheet.insertColumnsAfter(frontSheet.getMaxColumns(), frontSchema.length - frontSheet.getMaxColumns());
    }
    frontSheet.getRange(1, 1, 1, frontSchema.length).setValues([frontSchema.map(function (col) {
      return col.titel;
    })]);
    frontSheet.setFrozenRows(1);
  }
  var existingNames = new Set(ss.getNamedRanges().map(function (namedRange) {
    return namedRange.getName();
  }));
  spec.benoemdeBereiken.forEach(function (item) {
    if (!existingNames.has(item.naam)) {
      ss.setNamedRange(item.naam, ss.getSheetByName(item.werkblad).getRange(item.bereik));
      createdRanges.push(item.naam);
    }
  });
  var result = {
    aangemaakteWerkbladen: createdSheets,
    aangemaakteBereiken: createdRanges
  };
  console.log(JSON.stringify(result, null, 2));
  SpreadsheetApp.getUi().alert("Initialisatie voltooid. Nieuwe werkbladen: " + createdSheets.length + "; nieuwe benoemde bereiken: " + createdRanges.length + ".");
  return result;
}
