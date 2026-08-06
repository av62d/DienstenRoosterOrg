/**
 * Module: RS_Rooster.js
 * Gegenereerd tijdens de functionele herstructurering.
 */


function rsSelecteerGegevens(argStartDate = new Date(), argEndDate = new Date()) {

  // Zet tijd van begindatum op 0:00 en van einddatum op 23:59
  argStartDate.setHours(0);
  argStartDate.setMinutes(0);

  argEndDate.setHours(23);
  argEndDate.setMinutes(59);

  var a_type = [];
  var a_rowDate = [];
  var a_voorganger = [];
  var a_bijz = [];
  var a_collecte = [];
  var a_lector = [];
  var a_ambtsdragers = [];
  var a_koster = [];
  var a_koffie = [];
  var a_ontvangst = [];
  var a_klokkenluider = [];
  var a_kerktv = [];
  var a_kleur = [];
  var a_ha = [];
  var a_havorm = [];
  var a_naamzondag = [];
  var a_collectecategorie = [];
  var a_uitgangscollecte = [];
  var a_lectorOrg = [];
  var a_lectorWissel = [];
  var a_kwartaal = [];
  var a_koffieDienst = [];
  var a_didamDienst = [];

  var a_titel = new Array();

  var actSheet = SpreadsheetApp.getActiveSpreadsheet();
  var srcSheet = actSheet.getSheetByName('Voorpagina');
  if (!srcSheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var kolommen = bhMaakVoorpaginaKolomindex(srcSheet);

  actSheet.setSpreadsheetLocale("nl.nl");

  var startRow = 2;
  var endRow = srcSheet.getLastRow();
  var numRows = endRow - startRow + 1;

  var startCol = 1;
  var endCol = srcSheet.getLastColumn();
  var numCols = endCol;


  var rawData = srcSheet.getRange(startRow, 1, numRows, numCols).getValues();

  var dataIdx = -1;
  for (var i in rawData) {
    var dienst = bhMaakDienstVanRij(rawData[i], kolommen);
    var rowDate = new Date(dienst.Datum);
    if (isNaN(rowDate.getTime())) continue;

    if ((rowDate < argStartDate) || (rowDate > argEndDate))
      continue;

    dataIdx++;
    a_rowDate.push(rowDate);
    a_type.push("");
    var titelVolledig = dienst.Voorganger;
    if (dienst.Bijzonderheden) titelVolledig += ", " + dienst.Bijzonderheden;

    if (dienst.HeiligAvondmaal) titelVolledig += ", Heilig Avondmaal";

    a_titel.push(titelVolledig);

    var bijzVolledig = dienst.Bijzonderheden;

    if (dienst.HeiligAvondmaal) {
      if (bijzVolledig) bijzVolledig += ", ";
      bijzVolledig += "Heilig Avondmaal";
    }

    a_voorganger.push(dienst.Voorganger);
    a_bijz.push(bijzVolledig);
    a_koster.push(dienst.Koster);
    a_kleur.push(dienst.Kleur);
    a_kerktv.push(dienst.KerkTV);
    a_collecte.push(dienst.Collecte);
    a_koffie.push(String(dienst.Koffie || "").replace(/\n/g, ", "));
    a_ontvangst.push(String(dienst.Ontvangst || "").replace(/\n/g, ", "));
    a_ha.push(dienst.HeiligAvondmaal);
    a_lector.push(dienst.Lector);
    var ambtsdragers = dienst.Ouderling || "";
    if (dienst.Extra) ambtsdragers += (ambtsdragers ? ", " : "") + dienst.Extra;
    a_ambtsdragers.push(ambtsdragers);
    a_klokkenluider.push(dienst.Klokkenluider);

    // extra toegevoegd d.d. 20-12-2024

    a_havorm.push(dienst.Avondmaalsvorm);
    a_naamzondag.push(dienst.NaamZondag);
    a_collectecategorie.push(dienst.CollecteCategorie);
    a_uitgangscollecte.push(dienst.Uitgangscollecte);
    // Behoud de bestaande uitvoerstructuur voor afnemende rapportfuncties.
    a_lectorOrg.push(dienst.Lector);
    a_lectorWissel.push(false);
    a_kwartaal.push(dienst.Kwartaal);
    a_koffieDienst.push(dienst.KoffieDienst);
    a_didamDienst.push(dienst.DidamDienst);
  }

  var a_headers = ["Headers", "Datum", "Type", "Titel", "Voorganger", "Bijzonderheden", "Koster", "kleur",
    "Collecte", "Koffie", "Ontvangst", "HA", "Lector", "Ambtsdragers", "Klokkenluider", "KerkTV", "HA vorm",
    "Naam van de Zondag", "Collecte Categorie", "Uitgangscollecte", "LectorOrig", "LectorWissel", "Kwartaal", "KoffieDienst", "DidamDienst"
  ];

  return {
    koppen: a_headers,
    datums: a_rowDate,
    types: a_type,
    titels: a_titel,
    voorgangers: a_voorganger,
    bijzonderheden: a_bijz,
    kosters: a_koster,
    kleuren: a_kleur,
    collectes: a_collecte,
    koffie: a_koffie,
    ontvangst: a_ontvangst,
    avondmaal: a_ha,
    lectoren: a_lector,
    ambtsdragers: a_ambtsdragers,
    klokkenluiders: a_klokkenluider,
    kerktv: a_kerktv,
    havormen: a_havorm,
    zondagnamen: a_naamzondag,
    collectecategorieen: a_collectecategorie,
    uitgangscollectes: a_uitgangscollecte,
    oorspronkelijkeLectoren: a_lectorOrg,
    lectorWissels: a_lectorWissel,
    kwartalen: a_kwartaal,
    koffieDiensten: a_koffieDienst,
    didamDiensten: a_didamDienst
  };
}


function rsMaakRoosterWerkbladnaam(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6: title = 'half jaar'; break;
    case 12: title = 'heel jaar'; break;
    default: title = rptNumMonths + " maanden"; break;
  }
  return "Rooster-" + crFormatteerDatum(startDate, crDatumFormaat.JAAR) + " " + title;
}


function rsMaakRoosterWerkbladtitel(startDate = new Date(), rptNumMonths = 3) {
  var title = "";
  switch (rptNumMonths) {
    case 6: title = 'half jaar'; break;
    case 12: title = 'heel jaar'; break;
    default: title = rptNumMonths + " maanden"; break;
  }
  return "Rooster " + title + " vanaf " + crFormatteerDatum(startDate, crDatumFormaat.MAAND_JAAR);
}


// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden


function rsMaakRoosterWerkblad(argSheetName = "", argSheetTitle = "", rptStartDate = crBepaalBeginVanMaand(), rptNumMonths = 3) {
  var startMeting = crStartMeting();
  var rptSheetName = argSheetName || rsMaakRoosterWerkbladnaam(rptStartDate, rptNumMonths);
  var rptTitle = argSheetTitle || rsMaakRoosterWerkbladtitel(rptStartDate, rptNumMonths);
  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);
  rptEndDate.setDate(0);
  if (!rptSheetName || !rptTitle || !rptStartDate || !rptEndDate) return;

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Lector", "Ambtsdragers", "Koster", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];
  var hdrRowSize = [80, 150, 120, 200, 105, 105, 105, 130, 105, 105, 105];
  var rptNumCols = hdrRow.length;
  var rooster = rsSelecteerGegevens(rptStartDate, rptEndDate);
  var reportSheet = crMaakOfLeegWerkblad(rptSheetName);
  var rijen = [];
  var typen = [];
  var achtergronden = [];
  var gegevensSegmenten = [];
  var huidigSegment = null;

  function rsVoegRapportRijToe(waarden, type, achtergrond, liturgischeKleur) {
    var rij = waarden.slice(0, rptNumCols);
    while (rij.length < rptNumCols) rij.push("");
    rijen.push(rij);
    typen.push(type);
    var kleuren = new Array(rptNumCols).fill(achtergrond || "white");
    if (liturgischeKleur) kleuren[0] = liturgischeKleur;
    achtergronden.push(kleuren);
  }

  rsVoegRapportRijToe([rptTitle], "titel", "white");
  rsVoegRapportRijToe(["Afgedrukt: " + crFormatteerDatum(new Date(), crDatumFormaat.DATUM_TIJD_ZONDER_JAAR)], "afdruk", "white");
  var vorigeMaand = "";
  var wisselkleur = BG_COL1;
  var nl = "\n";

  for (var i = 0; i < rooster.datums.length; i++) {
    var maandnaam = crFormatteerDatum(rooster.datums[i], crDatumFormaat.MAAND);
    if (maandnaam !== vorigeMaand) {
      rsVoegRapportRijToe([maandnaam], "maand", "white");
      rsVoegRapportRijToe(hdrRow, "kop", "blue");
      vorigeMaand = maandnaam;
      huidigSegment = { start: rijen.length + 1, aantal: 0 };
      gegevensSegmenten.push(huidigSegment);
    }

    wisselkleur = wisselkleur === BG_COL1 ? BG_COL2 : BG_COL1;
    var achtergrond = rooster.avondmaal[i] ? BG_HA : wisselkleur;
    var kleurNaam = String(rooster.kleuren[i] || "").toLowerCase();
    var liturgischeKleur = { wit: "white", roze: "pink", paars: "plum", groen: "lightgreen", rood: "red" }[kleurNaam] || "white";
    var isDidam = String(rooster.didamDiensten[i] || "").toLowerCase() === "ja";
    var rij;
    if (isDidam) {
      rij = [
        crFormatteerDatum(rooster.datums[i], crDatumFormaat.DATUM_KORT) + nl +
          crFormatteerDatum(rooster.datums[i], crDatumFormaat.TIJD) + " uur",
        rooster.voorgangers[i], String(rooster.bijzonderheden[i] || "").replace(/,\s*/g, nl), rooster.collectes[i],
        rooster.lectoren[i], String(rooster.ambtsdragers[i] || "").replace(/,\s*/g, nl),
        String(rooster.kosters[i] || "").replace(/,\s*/g, nl),
        String(rooster.ontvangst[i] || "").replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl),
        String(rooster.klokkenluiders[i] || "").replace(/,\s*/g, nl),
        String(rooster.koffie[i] || "").replace(/,\s*/g, nl),
        String(rooster.kerktv[i] || "").replace(/,\s*/g, nl)
      ];
    } else {
      rij = [crFormatteerDatum(rooster.datums[i], crDatumFormaat.DATUM_KORT), rooster.voorgangers[i],
        String(rooster.bijzonderheden[i] || "").replace(/,\s*/g, nl), "", "", "", "", "", "", "", ""];
    }
    rsVoegRapportRijToe(rij, "gegevens", achtergrond, liturgischeKleur);
    huidigSegment.aantal++;
  }

  if (reportSheet.getMaxRows() < rijen.length) reportSheet.insertRowsAfter(reportSheet.getMaxRows(), rijen.length - reportSheet.getMaxRows());
  if (reportSheet.getMaxColumns() < rptNumCols) reportSheet.insertColumnsAfter(reportSheet.getMaxColumns(), rptNumCols - reportSheet.getMaxColumns());
  var volledigBereik = reportSheet.getRange(1, 1, rijen.length, rptNumCols);
  volledigBereik.setValues(rijen).setBackgrounds(achtergronden).setVerticalAlignment("middle").setWrap(true);

  typen.forEach(function (type, index) {
    var rijNummer = index + 1;
    if (type === "titel" || type === "afdruk" || type === "maand") {
      var bereik = reportSheet.getRange(rijNummer, 1, 1, rptNumCols);
      bereik.mergeAcross().setHorizontalAlignment("center").setFontWeight("bold");
      if (type === "titel") bereik.setFontSize(24);
      if (type === "afdruk") bereik.setFontSize(9);
      if (type === "maand") bereik.setFontSize(18);
      reportSheet.setRowHeight(rijNummer, type === "afdruk" ? 21 : 60);
    } else if (type === "kop") {
      reportSheet.getRange(rijNummer, 1, 1, rptNumCols).setFontColor("white").setFontWeight("bold").setFontSize(10);
    }
  });

  gegevensSegmenten.forEach(function (segment) {
    if (!segment.aantal) return;
    reportSheet.setRowHeights(segment.start, segment.aantal, 40);
    reportSheet.getRange(segment.start, 5, segment.aantal, rptNumCols - 4)
      .setHorizontalAlignment("center").setBorder(true, null, true, null, true, true);
  });
  reportSheet.getRange(1, 1, rijen.length, 1).setHorizontalAlignment("center");
  hdrRowSize.forEach(function (breedte, index) { reportSheet.setColumnWidth(index + 1, breedte); });

  var overbodigeRijen = reportSheet.getMaxRows() - rijen.length;
  if (overbodigeRijen > 0) reportSheet.deleteRows(rijen.length + 1, overbodigeRijen);
  var overbodigeKolommen = reportSheet.getMaxColumns() - rptNumCols;
  if (overbodigeKolommen > 0) reportSheet.deleteColumns(rptNumCols + 1, overbodigeKolommen);

  var kleurenblad = SpreadsheetApp.getActive().getSheetByName("NaamKleuren");
  opPasKleurenToeOpWaarde(kleurenblad, reportSheet, 4, 11);
  crEindMeting("rsMaakRoosterWerkblad", startMeting, { rijen: rijen.length, kolommen: rptNumCols });
  return reportSheet;
}


function rsMaakMaandroosterWerkbladnaam(startDate = new Date()) {
  var title = "";
  return "Rooster-" + crFormatteerDatum(startDate, crDatumFormaat.SORTEERMAAND);
}


function rsMaakMaandroosterWerkbladtitel(startDate = new Date()) {
  var title = "";
  return crFormatteerDatum(startDate, crDatumFormaat.MAAND_JAAR);
}


// Maak Rooster voor één maand


function rsVerwijderAlleRoosters(curYear = 2026) {
  rsVerwijderWerkbladenMetVoorvoegsel("Rooster-" + curYear);
}


/**
 * Deletes all sheets whose name starts with the specified prefix.
 *
 * @param {string} prefix
 * @return {number} Number of sheets deleted.
 */


function rsVerwijderWerkbladenMetVoorvoegsel(prefix) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  // Don't delete the last remaining sheet.
  const matchingSheets = sheets.filter(sheet =>
    sheet.getName().startsWith(prefix)
  );

  if (matchingSheets.length >= sheets.length) {
    throw new Error('Cannot delete all sheets in the spreadsheet.');
  }

Logger.log(matchingSheets.length);
  matchingSheets.forEach(sheet => {
    Logger.log("Deleting " + sheet.getName());
    ss.deleteSheet(sheet);
  });

  return matchingSheets.length;
}


function rsMaakJaarrooster(curYear = 2026) {
  rsMaakRoosterWerkblad(rsMaakJaarroosterNaam(curYear), "Rooster - " + curYear, crBepaalBeginVanJaar(curYear), 12);
}


function rsMaakHalfjaarrooster1(curYear = 2026) {

  rptStartDate = crMaakBegindatumVanMaand(0, curYear);

  var sheetPos = "1e halfjaar"; var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(0, curYear);
  var sheetPos = "1e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(3, curYear);
  var sheetPos = "2e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

}


function rsMaakHalfjaarrooster2(curYear = 2026) {

  rptStartDate = crMaakBegindatumVanMaand(6, curYear);

  var sheetPos = "2e halfjaar"; var sheetLen = 6;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(6, curYear);
  var sheetPos = "3e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

  rptStartDate = crMaakBegindatumVanMaand(9, curYear);
  var sheetPos = "4e kwartaal"; var sheetLen = 3;
  var sheetName = "Rooster-" + curYear + " " + sheetPos;
  var sheetTitle = "Rooster " + sheetPos + " vanaf " + crFormatteerDatum(rptStartDate, crDatumFormaat.MAAND_JAAR);
  rsMaakRoosterWerkblad(sheetName, sheetTitle, rptStartDate, sheetLen);

}


function rsMaakJaarroosterNaam(curYear = 2026) {
  return "Rooster-" + curYear;
}


function rsVerzendJaarrooster(curYear = 2026) {

  var rptSheetName = rsMaakJaarroosterNaam(curYear);

  var ss = SpreadsheetApp.getActive().getSheetByName(rptSheetName);
  var ui = SpreadsheetApp.getUi();

  if (!ss)
    rsMaakJaarrooster(curYear);

  var emailTo = crLeesConfiguratie("Mailinglijst - Jaarrooster");
  if (!emailTo) {
    Logger.log("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt: " + emailTo);
    SpreadsheetApp.getUi().alert("Configuratie 'Mailinglijst - Jaarrooster' ontbreekt");
    return;
  }


  var pdf = exConverteerWerkbladNaarPdf(rptSheetName);
  var xlsx = exConverteerWerkbladNaarXlsx(rptSheetName);

  var emailBody = "Jaar rooster " + curYear + "";

  var emailTextBody = 'Zie HTML gedeelte';
  var emailSubject = 'JaarRooster';
  var myself = "avandervliet@pg-didam.nl";

  Logger.log("\nJaar Rooster verzenden aan :" + emailTo);
  Logger.log("\nSubj:" + emailSubject);
  Logger.log("\nText=" + emailTextBody);
  Logger.log("\nbcc=" + emailTo);


  MailApp.sendEmail(
    "",
    emailSubject,
    emailTextBody,
    {
      bcc: emailTo,
      name: 'Automatisch verzonden email',
      htmlBody: emailBody,
      attachments: [xlsx, pdf]
    }
  );

}


var colcount = 1;


function rsStelTabelkolommenIn(tableRow) {
  colcount = tableRow.length;
}


function rsMaakHtmlElementen(tag, tableRow) {
  var msg = "";
  for (i in tableRow) {
    msg += rsMaakHtmlElement(tag, tableRow[i]);
  }
  return msg;
}


function rsMaakHtmlElement(tag, val) {
  return ("<" + tag + ">" + val + "</" + tag + ">");
}


function rsMaakHtmlElementMetOptie(tag, opt, val) {
  return ("<" + tag + " " + opt + ">" + val + "</" + tag + ">");
}


function rsVoegTabelrijToe(tag, hdrRow) {

  return rsMaakHtmlElement("tr", rsMaakHtmlElementen(tag, hdrRow));

}


// Maak volledig rooster : Naam van sheet; Titel ; startdatum ; aantal maanden


function rsMaakHtmlRooster(rptStartDate = crZetOpBeginVanDag(), rptNumMonths = 3) {


  // HACK -- don't go past June!; 3rd arg to AddMonthsToDate !

  var rptEndDate = crTelMaandenBijDatumOp(rptStartDate, rptNumMonths);

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Collecte", "Koster", "Ambtsdragers", "Lector", "Ontvangst", "Klokkenluider", "Koffie", "KerkTV"];

  var htmlFullResult = "";  // hier komt de volledige HTML broncode in terecht (titels + tabellen)
  var htmlTable = "";   // dit is voor de tabel per maand

  var curInTable = false; // dit geeft aan of we momenteel in een tabel zitten

  rsStelTabelkolommenIn(hdrRow);

  var {
    koppen: a_headers,
    datums: a_rowDate,
    types: a_type,
    titels: a_titel,
    voorgangers: a_voorganger,
    bijzonderheden: a_bijz,
    kosters: a_koster,
    kleuren: a_kleur,
    collectes: a_collecte,
    koffie: a_koffie,
    ontvangst: a_ontvangst,
    avondmaal: a_ha,
    lectoren: a_lector,
    ambtsdragers: a_ambtsdragers,
    klokkenluiders: a_klokkenluider,
    kerktv: a_kerktv,
    havormen: a_havorm,
    zondagnamen: a_naamzondag,
    collectecategorieen: a_collectecategorie,
    uitgangscollectes: a_uitgangscollecte
  } = rsSelecteerGegevens(rptStartDate, rptEndDate);

  var rptMonth = "";

  for (var i in a_type) {
    var t = a_type[i];
    var monthName = crFormatteerDatum(a_rowDate[i], crDatumFormaat.MAAND);
    if (monthName !== rptMonth) {
      if (curInTable) {
        htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
        htmlTable = ""; // wis tabel
      }
      htmlFullResult += rsMaakHtmlElement("h2", monthName);  // voeg titel met maandnaam toe

      htmlTable = rsVoegTabelrijToe("th", hdrRow); // voeg kolomhoofden toe aan de tabel
      rptMonth = monthName;
      curInTable = true;
    }

    var rowArray = [
      crFormatteerDatum(a_rowDate[i], crDatumFormaat.DATUM_KORT_MET_LANGE_MAAND) + nl
      + crFormatteerDatum(a_rowDate[i], crDatumFormaat.TIJD)
      // + nl + 'week ' + crBepaalWeeknummer(a_rowDate[i]).toString()           // week aanduiding
      ,
      // a_titel[i] + nl +
      // 'Voorganger: ' +
      a_voorganger[i]
      // + nl + crVoegTekstToeIndienGevuld('Koster: ', a_koster[i])
      // + crVoegTekstToeIndienGevuld(', Kerktv: ', a_kerktv[i])
      // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
      , a_bijz[i].replace(/,\s*/g, nl)
      , a_collecte[i]
      , a_koster[i].replace(/,\s*/g, nl)
      , a_ambtsdragers[i].replace(/,\s*/g, nl)
      , a_lector[i]
      , a_ontvangst[i].replace(/\s*,\s*/g, nl).replace(/\s*\/\s*/g, nl)  // replace , and / by newline
      , a_klokkenluider[i].replace(/,\s*/g, nl)
      , a_koffie[i].replace(/,\s*/g, nl)
      , a_kerktv[i].replace(/,\s*/g, nl)

    ];


    htmlTable += rsVoegTabelrijToe("td", rowArray);

  }

  if (curInTable) {
    htmlFullResult += rsMaakHtmlElement("table border=\"1\"", htmlTable); // beeindig de vorige tabel en voeg toe aan eindresultaat
  }
  return htmlFullResult;
}
