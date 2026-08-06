/**
 * Module: CM_Communicatie.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

var nl = "\n";
var tab = "\t";


function cmVerzendRooster() {
  cmVerzendRoosterNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - Rooster"), 4, 3); // 2 weeks and 3 months
}


function cmVerzendRoosterNaarLijst(emailListSheet, num_weeks_in_report = 6, num_months_in_report = 6, bevestigingsadres) {

  //var num_weeks_in_report = 4;
  //var num_months_in_report = 6;

  var rptTitle = "Rooster " + num_months_in_report + " maanden";
  var rptSheetName = "Rooster-" + num_months_in_report + "-maanden";

  var msg = crLeesConfiguratie("Berichttekst - Rooster");

  var curDate = crZetOpBeginVanDag(new Date());

  // zoek de eerstvolgende zondag
  // var rptWeekStartDate = crTelWekenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);

  // in plaats van eerstvolgende zondag, gebruik de zondag van deze week + 1, dus op maandag van deze week
  // var rptWeekStartDate = crTelDagenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();

  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);
  var rptWeekEndNum = crBepaalWeeknummer(rptWeekEndDate);

  var rptMonthBeginDate = crBepaalBeginVanMaand(rptWeekStartDate);

  rsMaakRoosterWerkblad(rptSheetName, rptTitle, rptMonthBeginDate, num_months_in_report);

  var htmlRooster = rsMaakHtmlRooster(rptWeekStartDate, num_months_in_report);
  var htmlWeekRaport = cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate);

  // var pdf_link = exConverteerWerkbladNaarPdf(rptSheetName);
  // var xlsx = exConverteerWerkbladNaarXlsx(rptSheetName);

  // Alles voor de email is nu gereed

  var emailHtmlBody = msg.replace(/\n/g, "<br >") +
    // "<p />Klik voor rooster als PDF: " + cmMaakUrlLink(pdf_link, rptSheetName) + "<p />" +
    "<h4> Weekrooster voor de komende " + num_weeks_in_report + " weken</h4>" +
    htmlWeekRaport +
    "<h4> Maandrooster voor de komende " + num_months_in_report + " maanden</h4>" +
    htmlRooster;


  var emailAsBcc = false;  // send emails in a loop or one by one (mails to Bcc will bounce sending to KPN/Ziggo, incl. hi/planet/xs4all/upc/upcmail)

  // Haal addressen op
  var emailTo_list = cmLeesEmailadressen(emailListSheet);

  var emailConfirmationTo = bevestigingsadres || "avandervliet@gmail.com";
  var emailConfirmationMsg = "Weekrooster verzonden\n";

  var emailSubject = 'Dienstenrooster week ' + rptWeekStartNum + " t/m " + rptWeekEndNum;
  var emailName = 'Weekrooster Protestantse Gemeente Didam';

  cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc);
}


function cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc) {

  var emailTo = emailTo_list.join(',');

  emailConfirmationMsg += "\nEmail verzonden als Bcc: " + emailAsBcc + "\nVerzonden naar: " + emailTo;

  Logger.log("\nTo:" + emailTo);
  Logger.log("\nSubj:" + emailSubject);
  Logger.log("\nConfirmation:" + emailConfirmationMsg);

  var emailTextBody = 'Zie HTML gedeelte';

  var conf_text;

  if (emailAsBcc) {
    conf_text = "als Bcc";
    MailApp.sendEmail(
      emailConfirmationTo,
      emailSubject,
      emailTextBody,
      {
        bcc: emailTo,
        name: emailName,
        htmlBody: emailHtmlBody
      }
    );

  } else {
    conf_text = "als aparte mails";
    for (var i in emailTo_list) {
      var mail_to = emailTo_list[i][0];
      if (mail_to) {
        MailApp.sendEmail(
          mail_to,
          emailSubject,
          emailTextBody,
          {
            name: emailName,
            htmlBody: emailHtmlBody
          }
        );
      }
    }
  }

  MailApp.sendEmail(
    emailConfirmationTo,
    emailSubject + " - verzonden " + conf_text,
    emailConfirmationMsg,
    {
      name: emailName,
      htmlBody: emailConfirmationMsg
    }
  );
}

/** Leest ontvangers uit een werkblad, kommagescheiden tekst of bestaande lijst. */
function cmLeesEmailadressen(bron) {
  if (Array.isArray(bron)) return bron;
  var tekst = String(bron || "").trim();
  if (!tekst) return [];
  if (tekst.indexOf("@") === -1) return crLeesWerkbladInhoud(tekst);
  return tekst.split(/[,;\n]+/).map(function (adres) {
    return [adres.trim()];
  }).filter(function (rij) {
    return Boolean(rij[0]);
  });
}


function cmMaakHtmlElement(tag, str) {
  return "<" + tag + ">" + str + "</" + tag + ">\n";
}


function cmVoegLijstItemToe(pfx, str) {
  if (str)
    return "<li>" + pfx + str;
  else
    return "";
}


/** Escapet een waarde voordat deze in een HTML-template wordt geplaatst. */
function cmEscapeHtml(waarde) {
  return String(waarde === null || waarde === undefined ? "" : waarde)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\r?\n/g, "<br>");
}

function cmIsJaWaarde(waarde) {
  return waarde === true || ["ja", "true", "1", "x"].indexOf(String(waarde || "").trim().toLowerCase()) >= 0;
}

function cmIsNeeWaarde(waarde) {
  return waarde === false || ["nee", "false", "0"].indexOf(String(waarde || "").trim().toLowerCase()) >= 0;
}

/** Geeft de zichtbare velden van één dienst in de afgesproken presentatievolgorde. */
function cmMaakDienstvelden(selectie, index) {
  var bijzonderheden = [];
  if (selectie.bijzonderheden[index]) bijzonderheden.push(String(selectie.bijzonderheden[index]));
  if (cmIsJaWaarde(selectie.avondmaal[index])) bijzonderheden.push("Heilig Avondmaal");

  var voorganger = String(selectie.voorgangers[index] || "");
  if (voorganger && bijzonderheden.length) voorganger += ", " + bijzonderheden.join(", ");
  var koffie = cmIsNeeWaarde(selectie.koffieDiensten[index])
    ? "geen koffie"
    : selectie.koffie[index];

  var velden = [];
  if (voorganger) {
    velden.push(["Voorganger", voorganger]);
  } else if (bijzonderheden.length) {
    // Bij een dienst buiten Didam is Bijzonderheden vaak het enige gevulde veld.
    velden.push(["Bijzonderheden", bijzonderheden.join(", ")]);
  }
  velden = velden.concat([
    ["Collecte", selectie.collectes[index]],
    ["Uitgangscollecte", selectie.uitgangscollectes[index]],
    ["Lector", selectie.lectoren[index]],
    ["Ambtsdragers", selectie.ambtsdragers[index]],
    ["Koster", selectie.kosters[index]],
    ["Koffie", koffie],
    ["Ontvangst", selectie.ontvangst[index]],
    ["Klokkenluider", selectie.klokkenluiders[index]],
    ["KerkTV", selectie.kerktv[index]],
    ["Kleur", selectie.kleuren[index]],
    ["Naam van de zondag", selectie.zondagnamen[index]]
  ]);
  return velden;
}

/** Maakt een verticaal HTML-overzicht van de eerste `aantal` diensten. */
function cmMaakHtmlDienstenrapport(selectie, aantal) {
  var limiet = Math.min(Math.max(Number(aantal) || 1, 1), selectie.datums.length);
  var html = "";
  var vorigeWeek = null;
  for (var index = 0; index < limiet; index++) {
    var week = crBepaalWeeknummer(selectie.datums[index]);
    if (week !== vorigeWeek) {
      html += cmMaakHtmlElement("h3", "Week " + week);
      vorigeWeek = week;
    }
    html += cmMaakHtmlElement(
      "h4",
      cmEscapeHtml(crFormatteerDatum(selectie.datums[index], crDatumFormaat.DATUM_TIJD_ZONDER_JAAR))
    );
    html += "<ul>\n";
    cmMaakDienstvelden(selectie, index).forEach(function (veld) {
      if (veld[1] === "" || veld[1] === null || veld[1] === undefined) return;
      html += "<li><strong>" + cmEscapeHtml(veld[0]) + ":</strong> " + cmEscapeHtml(veld[1]) + "</li>\n";
    });
    html += "</ul>\n";
  }
  return html;
}

/** Maakt hetzelfde verticale dienstenoverzicht als platte documenttekst. */
function cmMaakTekstDienstenrapport(selectie, aantal) {
  var limiet = Math.min(Math.max(Number(aantal) || 1, 1), selectie.datums.length);
  var blokken = [];
  var vorigeWeek = null;
  for (var index = 0; index < limiet; index++) {
    var week = crBepaalWeeknummer(selectie.datums[index]);
    var regels = [];
    if (week !== vorigeWeek) {
      regels.push("Week " + week);
      vorigeWeek = week;
    }
    regels.push(crFormatteerDatum(selectie.datums[index], crDatumFormaat.DATUM_TIJD_ZONDER_JAAR));
    cmMaakDienstvelden(selectie, index).forEach(function (veld) {
      if (veld[1] === "" || veld[1] === null || veld[1] === undefined) return;
      regels.push("•\t" + veld[0] + ": " + veld[1]);
    });
    blokken.push(regels.join("\n"));
  }
  return blokken.join("\n\n");
}

function cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate) {
  var selectie = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);
  return cmMaakHtmlDienstenrapport(selectie, selectie.datums.length);
}

/** Normaliseert een placeholdernaam, bijvoorbeeld `Naam Zondag` naar `naam zondag`. */
function cmNormaliseerPlaceholder(naam) {
  return String(naam || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** Maakt een tekst- en HTML-waarde voor gebruik door beide templaterenderers. */
function cmMaakTemplateWaarde(tekst, html) {
  var platteTekst = String(tekst === null || tekst === undefined ? "" : tekst);
  return { tekst: platteTekst, html: html === undefined ? cmEscapeHtml(platteTekst) : html };
}

/** Stelt alle enkelvoudige variabelen van één dienst centraal samen. */
function cmMaakTemplateVariabelen(selectie, index, aanvullingen) {
  index = index || 0;
  var datum = selectie.datums[index];
  var waarden = {
    datum: cmMaakTemplateWaarde(crFormatteerDatum(datum, crDatumFormaat.DATUM_LANG)),
    tijd: cmMaakTemplateWaarde(crFormatteerDatum(datum, crDatumFormaat.TIJD)),
    datumtijd: cmMaakTemplateWaarde(crFormatteerDatum(datum, crDatumFormaat.DATUM_TIJD_ZONDER_JAAR)),
    voorganger: cmMaakTemplateWaarde(selectie.voorgangers[index]),
    bijzonderheden: cmMaakTemplateWaarde(selectie.bijzonderheden[index]),
    collecte: cmMaakTemplateWaarde(selectie.collectes[index]),
    collectecategorie: cmMaakTemplateWaarde(selectie.collectecategorieen[index]),
    uitgangscollecte: cmMaakTemplateWaarde(selectie.uitgangscollectes[index]),
    lector: cmMaakTemplateWaarde(selectie.lectoren[index]),
    ambtsdragers: cmMaakTemplateWaarde(selectie.ambtsdragers[index]),
    koster: cmMaakTemplateWaarde(selectie.kosters[index]),
    koffie: cmMaakTemplateWaarde(selectie.koffie[index]),
    ontvangst: cmMaakTemplateWaarde(selectie.ontvangst[index]),
    klokkenluider: cmMaakTemplateWaarde(selectie.klokkenluiders[index]),
    kerktv: cmMaakTemplateWaarde(selectie.kerktv[index]),
    kleur: cmMaakTemplateWaarde(selectie.kleuren[index]),
    heiligavondmaal: cmMaakTemplateWaarde(selectie.avondmaal[index] ? "ja" : "nee"),
    avondmaalsvorm: cmMaakTemplateWaarde(selectie.havormen[index]),
    naamzondag: cmMaakTemplateWaarde(selectie.zondagnamen[index]),
    kwartaal: cmMaakTemplateWaarde(selectie.kwartalen[index]),
    koffiedienst: cmMaakTemplateWaarde(selectie.koffieDiensten[index]),
    didamdienst: cmMaakTemplateWaarde(selectie.didamDiensten[index])
  };
  // Tijdelijke aliases voor bestaande templates.
  waarden.ha = waarden.heiligavondmaal;
  waarden.havorm = waarden.avondmaalsvorm;
  waarden.zondagnaam = waarden.naamzondag;

  Object.keys(aanvullingen || {}).forEach(function (naam) {
    var waarde = aanvullingen[naam];
    waarden[cmNormaliseerPlaceholder(naam)] = waarde && waarde.tekst !== undefined
      ? waarde
      : cmMaakTemplateWaarde(waarde);
  });
  return waarden;
}

/** Bepaalt het hoogste gevraagde aantal uit `@gegevens@` of `@gegevens <n>@`. */
function cmBepaalAantalDienstenUitTemplate(tekst) {
  var aantal = 1;
  var patroon = /@gegevens(?:\s+(\d+))?\s*@/gi;
  var gevonden;
  while ((gevonden = patroon.exec(String(tekst || ""))) !== null) {
    aantal = Math.max(aantal, Number(gevonden[1]) || 1);
  }
  return aantal;
}

/** Selecteert voldoende toekomstige diensten voor de placeholders in een template. */
function cmSelecteerKomendeDiensten(aantal, begindatum) {
  var begin = crZetOpBeginVanDag(begindatum || new Date());
  var einde = crZetTijdOpEindeVanDag(crTelMaandenBijDatumOp(new Date(begin), 24));
  var selectie = rsSelecteerGegevens(begin, einde);
  if (!selectie.datums.length) throw new Error("Geen toekomstige diensten gevonden voor de mailtemplate.");
  if (selectie.datums.length < aantal) {
    console.log("Template vraagt " + aantal + " diensten; slechts " + selectie.datums.length + " gevonden.");
  }
  return selectie;
}

/** Maakt voorbeeldwaarden voor alle aanvullende placeholders van de mailtypen. */
function cmMaakTesttemplateVariabelen(selectie) {
  var htmlLijst = "<ul><li>Voorbeeldregel 1</li><li>Voorbeeldregel 2</li></ul>";
  return cmMaakTemplateVariabelen(selectie, 0, {
    onderwerp: "TEST – onderwerp",
    titel: "TEST – titel",
    mededeling: "TEST – mededeling",
    liturgie: "TEST – liturgie",
    archief: cmMaakTemplateWaarde("TEST – archieflink", '<a href="https://example.invalid/archief">TEST – archieflink</a>'),
    contactgegevens: cmMaakTemplateWaarde("TEST – contactgegevens", "<strong>TEST</strong> – contactgegevens"),
    kerktvpagina: cmMaakTemplateWaarde("TEST – KerkTV-pagina", '<a href="https://example.invalid/kerktv">TEST – KerkTV-pagina</a>'),
    organist: "TEST – organist",
    bloemen: "TEST – bloemen",
    extra_mededelingen: "TEST – extra mededelingen",
    "extra mededelingen": "TEST – extra mededelingen",
    url_edit: "https://example.invalid/bewerken",
    "url edit": "https://example.invalid/bewerken",
    kerkdiensten: cmMaakTemplateWaarde("TEST – lijst met kerkdiensten", htmlLijst),
    activiteiten: cmMaakTemplateWaarde("TEST – lijst met activiteiten", htmlLijst),
    beschrijving: "TEST – beschrijving",
    samenvatting: "TEST – samenvatting",
    details: cmMaakTemplateWaarde("TEST – details", htmlLijst),
    periode: "TEST – periode"
  });
}

/** Leest de testtemplate, vervangt alle variabelen en mailt hem naar de testlijst. */
function cmVerzendTesttemplate() {
  var templateId = crLeesConfiguratie("Template-ID - Testmail");
  if (!String(templateId || "").trim()) {
    throw new Error("Vul eerst 'Template-ID - Testmail' in op het werkblad Configuratie.");
  }

  var templateHtml = cmExporteerDocumentNaarHtml(templateId);
  var aantalDiensten = cmBepaalAantalDienstenUitTemplate(templateHtml);
  var selectie = cmSelecteerKomendeDiensten(aantalDiensten);
  var variabelen = cmMaakTesttemplateVariabelen(selectie);
  var html = cmVervangHtmlTemplate(templateHtml, variabelen, selectie);
  var ontvangers = cmLeesEmailadressen(crLeesConfiguratie("Testmail"));
  var verzonden = 0;

  ontvangers.forEach(function (rij) {
    var adres = Array.isArray(rij) ? rij[0] : rij;
    if (!String(adres || "").trim()) return;
    MailApp.sendEmail(String(adres).trim(), "[TEST] Mailtemplatevariabelen", "Zie HTML-gedeelte", {
      name: "Test Dienstenrooster",
      htmlBody: html
    });
    verzonden++;
  });

  if (!verzonden) throw new Error("De configuratie-instelling 'Testmail' bevat geen e-mailadressen.");
  SpreadsheetApp.getUi().alert("Testtemplate verzonden naar " + verzonden + " testontvanger(s).");
}

/** Vervangt alle placeholders in geëxporteerde template-HTML. */
function cmVervangHtmlTemplate(html, variabelen, selectie) {
  var onbekend = {};
  var resultaat = String(html || "").replace(/@([A-Za-z][A-Za-z0-9 _-]*)@/g, function (volledig, naam) {
    var sleutel = cmNormaliseerPlaceholder(naam);
    var gegevens = /^gegevens(?:\s+(\d+))?$/.exec(sleutel);
    if (gegevens) return cmMaakHtmlDienstenrapport(selectie, Number(gegevens[1]) || 1);
    if (variabelen[sleutel]) return variabelen[sleutel].html;
    onbekend[sleutel] = true;
    return volledig;
  });
  var onbekendeNamen = Object.keys(onbekend);
  if (onbekendeNamen.length) {
    throw new Error("Onbekende placeholder(s) in mailtemplate: @" + onbekendeNamen.join("@, @") + "@");
  }
  return resultaat;
}

/** Vervangt placeholders in documenttekst zonder de overige documentopmaak te verliezen. */
function cmVervangDocumentTemplate(document, variabelen, selectie) {
  var secties = [document.getBody(), document.getHeader(), document.getFooter()].filter(function (sectie) {
    return Boolean(sectie);
  });
  secties.forEach(function (sectie) {
    var gevonden = sectie.findText("@[A-Za-z][A-Za-z0-9 _-]*@");
    while (gevonden) {
      var tekstElement = gevonden.getElement().asText();
      var begin = gevonden.getStartOffset();
      var einde = gevonden.getEndOffsetInclusive();
      var placeholder = tekstElement.getText().substring(begin, einde + 1);
      var sleutel = cmNormaliseerPlaceholder(placeholder.slice(1, -1));
      var gegevens = /^gegevens(?:\s+(\d+))?$/.exec(sleutel);
      var vervanging;
      if (gegevens) {
        vervanging = cmMaakTekstDienstenrapport(selectie, Number(gegevens[1]) || 1);
      } else if (variabelen[sleutel]) {
        vervanging = variabelen[sleutel].tekst;
      } else {
        throw new Error("Onbekende placeholder in documenttemplate: @" + sleutel + "@");
      }
      tekstElement.deleteText(begin, einde);
      tekstElement.insertText(begin, vervanging);
      gevonden = sectie.findText("@[A-Za-z][A-Za-z0-9 _-]*@");
    }
  });
  return document;
}

/** Exporteert een Google Document met behoud van alle template-inhoud naar HTML. */
function cmExporteerDocumentNaarHtml(documentId) {
  var url = "https://docs.google.com/document/d/" + documentId + "/export?format=html";
  return UrlFetchApp.fetch(url, {
    method: "get",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: false
  }).getContentText();
}


function cmVerzendTemplate() {
  cmVerzendTemplateNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - KerkTV"));
}


function cmVerzendTemplateNaarLijst(emailListSheetName, bevestigingsadres) {
  var agendanaam = crLeesConfiguratie("Agenda - KerkTV");
  var mededeling = crLeesConfiguratie("Berichttekst - KerkTV");
  var templateId = crLeesConfiguratie("Template-ID - KerkTV-liturgie");
  var templateDocument = DocumentApp.openById(templateId);
  var templateTekst = [templateDocument.getBody(), templateDocument.getHeader(), templateDocument.getFooter()]
    .filter(function (sectie) { return Boolean(sectie); })
    .map(function (sectie) { return sectie.getText(); })
    .join("\n");
  var templateHtml = cmExporteerDocumentNaarHtml(templateId);
  var aantalDiensten = Math.max(
    cmBepaalAantalDienstenUitTemplate(templateTekst),
    cmBepaalAantalDienstenUitTemplate(templateHtml)
  );
  var selectie = cmSelecteerKomendeDiensten(aantalDiensten);
  var dienstdatum = new Date(selectie.datums[0]);
  var onderwerp = "Liturgie voor " + crFormatteerDatum(dienstdatum, crDatumFormaat.DATUM_LANG);

  var dagBegin = crZetOpBeginVanDag(new Date(dienstdatum));
  var dagEinde = crZetTijdOpEindeVanDag(new Date(dienstdatum));
  var gebeurtenissen = CalendarApp.getCalendarsByName(agendanaam);
  var agendaItems = gebeurtenissen.length ? gebeurtenissen[0].getEvents(dagBegin, dagEinde) : [];
  var agendaTitel = agendaItems.length ? agendaItems[0].getTitle() : "";
  var liturgie = agendaItems.length ? agendaItems[0].getDescription() : "";

  var contactTekst = [
    "Contact",
    "Rechtstreekse uitzending: https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending",
    "Kerkdienst gemist: https://www.pkn-didam.nl/kerktv/kerkdienst-gemist",
    "Handleiding: https://www.pkn-didam.nl/kerktv/handleiding",
    "E-mail: kerktv@pkn-didam.nl"
  ].join("\n");
  var contactHtml = "<h4>Contact</h4>" +
    '<p>Rechtstreekse uitzending: <a href="https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending">link</a><br>' +
    'Kerkdienst gemist: <a href="https://www.pkn-didam.nl/kerktv/kerkdienst-gemist">link</a><br>' +
    'Handleiding: <a href="https://www.pkn-didam.nl/kerktv/handleiding">link</a><br>' +
    'E-mail: <a href="mailto:kerktv@pkn-didam.nl">kerktv@pkn-didam.nl</a></p>';
  var archiefHtml = "<h4>Vorige 4 diensten</h4>" + ytMaakUploadLijst(4);

  var kopie = DriveApp.getFileById(templateId).makeCopy(onderwerp);
  var document = DocumentApp.openById(kopie.getId());
  var bewerkUrl = "https://docs.google.com/document/d/" + document.getId() + "/edit?usp=sharing";
  var variabelen = cmMaakTemplateVariabelen(selectie, 0, {
    onderwerp: onderwerp,
    titel: agendaTitel,
    mededeling: mededeling,
    liturgie: liturgie,
    archief: cmMaakTemplateWaarde("", archiefHtml),
    contactgegevens: cmMaakTemplateWaarde(contactTekst, contactHtml),
    "url edit": bewerkUrl,
    url_edit: bewerkUrl,
    kerktvpagina: "https://www.pkn-didam.nl/kerktv"
  });

  cmVervangDocumentTemplate(document, variabelen, selectie);
  document.saveAndClose();
  var emailHtml = cmVervangHtmlTemplate(templateHtml, variabelen, selectie);
  var emailadressen = cmLeesEmailadressen(emailListSheetName);
  cmVerzendEmail(
    emailadressen,
    onderwerp,
    "Liturgiemail Protestantse Gemeente Didam",
    emailHtml,
    bevestigingsadres || "avandervliet@gmail.com",
    "Liturgie verzonden\nDocument: " + bewerkUrl,
    false
  );
}


function cmVerzendMededelingen() {
  cmVerzendMededelingenNaarAdres(crLeesConfiguratie("Mailinglijst - Mededelingen"), false);
}


function cmVerzendMededelingenVolgendeWeek() {
  cmVerzendMededelingenNaarAdres(crLeesConfiguratie("Mailinglijst - Mededelingen"), true);
}


function cmVerzendMededelingenNaarAdres(emailTo, volgendeWeek) {
  if (!emailTo) return;

  var begindatum = crZetOpBeginVanDag(new Date());
  if (volgendeWeek) begindatum = crTelDagenBijDatumOp(begindatum, 7);
  var mailTemplateId = crLeesConfiguratie("Template-ID - Mededelingen mail");
  var documentTemplateId = crLeesConfiguratie("Template-ID - Mededelingen document");
  if (!mailTemplateId || !documentTemplateId) {
    throw new Error("Vul zowel 'Template-ID - Mededelingen mail' als 'Template-ID - Mededelingen document' in op Configuratie.");
  }
  var documentTemplate = DocumentApp.openById(documentTemplateId);
  var documentTemplateTekst = [documentTemplate.getBody(), documentTemplate.getHeader(), documentTemplate.getFooter()]
    .filter(function (sectie) { return Boolean(sectie); })
    .map(function (sectie) { return sectie.getText(); })
    .join("\n");
  var mailTemplateHtml = cmExporteerDocumentNaarHtml(mailTemplateId);
  var aantalDiensten = Math.max(
    cmBepaalAantalDienstenUitTemplate(documentTemplateTekst),
    cmBepaalAantalDienstenUitTemplate(mailTemplateHtml)
  );
  var selectie = cmSelecteerKomendeDiensten(aantalDiensten, begindatum);
  var dienstdatum = new Date(selectie.datums[0]);
  var datumtekst = crFormatteerDatum(dienstdatum, crDatumFormaat.DATUM_LANG);
  var onderwerp = "Mededelingen voor " + datumtekst;
  var document = cmMaakDocumentkopie(documentTemplateId, onderwerp);
  var dagBegin = crZetOpBeginVanDag(new Date(dienstdatum));
  var dagEinde = crZetTijdOpEindeVanDag(new Date(dienstdatum));
  var liturgie = cmLeesLiturgieUitAgenda(
    crLeesConfiguratie("Agenda - KerkTV"), dagBegin, dagEinde
  );
  var bewerkUrl = "https://docs.google.com/document/d/" + document.getId() + "/edit?usp=sharing";
  var variabelen = cmMaakTemplateVariabelen(selectie, 0, {
    onderwerp: onderwerp,
    organist: "Rolf Zandbergen",
    bloemen: "- INVULLEN -",
    "extra mededelingen": "- Geen -",
    extra_mededelingen: "- Geen -",
    liturgie: liturgie,
    "url edit": bewerkUrl,
    url_edit: bewerkUrl
  });

  cmVervangDocumentTemplate(document, variabelen, selectie);
  var documentId = document.getId();
  document.saveAndClose();

  var bestandsnaam = crFormatteerDatum(dienstdatum, crDatumFormaat.SORTEERDATUM) +
    " - mededelingen " + datumtekst + ".docx";
  var docx = cmExporteerDocumentNaarDocx(documentId, bestandsnaam);
  var html = cmVervangHtmlTemplate(mailTemplateHtml, variabelen, selectie);
  MailApp.sendEmail(emailTo, onderwerp, "Zie HTML gedeelte", {
    htmlBody: html,
    attachments: [docx]
  });
}


function cmZoekEersteDienstIndex(selectie) {
  return selectie && selectie.datums && selectie.datums.length ? 0 : -1;
}


function cmMaakDocumentkopie(templateId, documentnaam) {
  var kopie = DriveApp.getFileById(templateId).makeCopy(documentnaam);
  return DocumentApp.openById(kopie.getId());
}


function cmLeesLiturgieUitAgenda(agendanaam, begindatum, einddatum) {
  var agendas = CalendarApp.getCalendarsByName(agendanaam);
  if (!agendas.length) throw new Error("Agenda niet gevonden: " + agendanaam);
  var gebeurtenissen = agendas[0].getEvents(begindatum, einddatum);
  if (!gebeurtenissen.length) return "";
  return gebeurtenissen[0].getDescription()
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?b>/gi, "");
}


function cmExporteerDocumentNaarDocx(documentId, bestandsnaam) {
  var url = "https://docs.google.com/document/d/" + documentId + "/export?format=docx";
  return UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() }
  }).getBlob().setName(bestandsnaam);
}


// https://stackoverflow.com/questions/15636543/convert-google-doc-to-docx-using-google-script
// https://gist.github.com/tanaikech/8d639542577a594f6104b7f6fb753064


// De ongebruikte experimentele mededelingenvariant is verwijderd.

var tag_nl = "<br />";


function cmVerzendMjMededelingen() {
    cmVerzendMjMededelingenNaarAdres(crLeesConfiguratie("Mailinglijst - MJ"));
}


function cmMaakMjHtmlElement(tg, str) {
  return "<" + tg + ">" + str + "</" + tg + ">";
}


function cmHaalGebeurtenissenUitAgenda(calName, startDate, endDate) {
  var cal = CalendarApp.getCalendarsByName(calName);
  if (cal) {
    return cal[0].getEvents(startDate, endDate);
  }
  else
    return null;
  // title = events[0].getTitle();
  // desc = events[0].getDescription();
}


function cmFormatteerGebeurtenissen(events) {
  var msg = "<ul>";
  for (var i in events) {
    var title = events[i].getTitle();
    var desc = events[i].getDescription();
    var startTime = events[i].getStartTime();
    msg += cmMaakMjHtmlElement("li", crFormatteerDatum(startTime, crDatumFormaat.DATUM_TIJD_ZONDER_JAAR) + " " + title);
  }
  msg += "</ul>";
  return msg;
}


function cmFormatteerEersteGebeurtenisVolledig(events) {
  var msg = "<p>";
  // msg += crFormatteerDatum(events[0].getStartTime(), crDatumFormaat.DATUM_TIJD_ZONDER_JAAR) + " " + events[0].getTitle().bold();
  msg += "</p>";
  return msg;
}


function cmVerzendMjMededelingenNaarAdres(emailTo) {

  var calKerkdiensten = crLeesConfiguratie("Agenda - KerkTV");
  var calActiviteiten = crLeesConfiguratie("Agenda - Activiteiten");
  var templateDocumentId = crLeesConfiguratie("Template-ID - MJ-mededelingen");

  Logger.log(templateDocumentId);
  Logger.log(emailTo);
  var numKerkdienstWeken = 2;
  var numActiviteitWeken = 2;

  var startDate = crTelWekenBijDatumOp(crBepaalVolgendeZondag(), 1); // crBepaalVolgendeZondag returns starttime of next Sunday (0:00)
  var startWeekNum = crBepaalWeeknummer(startDate);

  var lastDateKerkdiensten = crTelWekenBijDatumOp(startDate, numKerkdienstWeken);
  var lastDateActiviteiten = crTelWekenBijDatumOp(startDate, numActiviteitWeken);

  var eventsKerkdiensten = cmHaalGebeurtenissenUitAgenda(calKerkdiensten, startDate, lastDateKerkdiensten);
  var eventsActiviteiten = cmHaalGebeurtenissenUitAgenda(calActiviteiten, startDate, lastDateActiviteiten);


  var msgKerkdiensten = cmFormatteerGebeurtenissen(eventsKerkdiensten);
  var msgActiviteiten = cmFormatteerGebeurtenissen(eventsActiviteiten);
  var msgDescActiviteit = "";
  if (eventsActiviteiten[0])
    msgDescActiviteit = cmFormatteerEersteGebeurtenisVolledig(eventsActiviteiten);

  var emailSubject = "Kerkberichten Montferland Journaal - Protestantse Gemeente - week " + startWeekNum;
  var templateDoc = DocumentApp.openById(templateDocumentId);

  var emailTekst = "Zie HTML gedeelte";
  // var myself = "kerktv@pkn-didam.nl";
  var myself = "avandervliet@gmail.com";

  var url = "https://docs.google.com/document/d/" + templateDoc.getId() + "/export?format=html"
  var param = {
    method: "get",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };

  var emailHtmlRaw = UrlFetchApp.fetch(url, param).getContentText();
  var mjSelectie = cmSelecteerKomendeDiensten(cmBepaalAantalDienstenUitTemplate(emailHtmlRaw), startDate);
  var mjVariabelen = cmMaakTemplateVariabelen(mjSelectie, 0, {
    kerkdiensten: cmMaakTemplateWaarde("", msgKerkdiensten),
    activiteiten: cmMaakTemplateWaarde("", msgActiviteiten),
    beschrijving: cmMaakTemplateWaarde("", msgDescActiviteit)
  });
  var emailHtml = cmVervangHtmlTemplate(emailHtmlRaw, mjVariabelen, mjSelectie);
  //var controleEmailHtml = emailHtmlRaw.replace("@GEGEVENS@", gegevens).replace("@ARCHIEF@", archief).replace("@CONTACTGEGEVENS@", alleContactGegevens);

  // var pdf = instanceDoc.getAs(MimeType.PDF).setName(emailSubject + ".pdf");

  // MailApp.sendEmail(myself, emailSubject, emailTekst, {htmlBody: emailHtml, bcc: emailTo, replyTo: myself, attachments: pdf });
  MailApp.sendEmail(emailTo, emailSubject, emailTekst, { htmlBody: emailHtml, To: emailTo });
}


var tag_nl = "<br />";


function cmVerzendLiemersActiviteiten() {
  cmVerzendLiemersActiviteitenNaarAdres(crLeesConfiguratie("Mailinglijst - Liemersactiviteiten"));
}


function cmMaakLiemersHtmlElement(tg, str) {
  return "<" + tg + ">" + str + "</" + tg + ">";
}


function cmLeesAgenda(calName, startDate, endDate) {
  var cal = CalendarApp.getCalendarsByName(calName);
  if (cal) {
    return cal[0].getEvents(startDate, endDate);
  }
  else
    return null;
}


function cmFormatteerLiemersGebeurtenissen(events) {
  var msgSamenvatting = cmMaakLiemersHtmlElement("h3", "Samenvatting");
  var msgDetails = cmMaakLiemersHtmlElement("h3", "Details");

  msgSamenvatting += "<ul>";
  // msgDetails += "<ul>";

  for (var i in events) {
    var startTimeKort = crFormatteerDatum(events[i].getStartTime(), crDatumFormaat.DATUM_KORT);
    var startTimeLang = crFormatteerDatum(events[i].getStartTime(), crDatumFormaat.DATUM_TIJD_ZONDER_JAAR);

    var title = startTimeKort + ": " + cmMaakLiemersHtmlElement("b", events[i].getTitle());
    msgSamenvatting += cmMaakLiemersHtmlElement("li", startTimeLang + ":\t" + cmMaakLiemersHtmlElement("b", events[i].getTitle()));

    msgDetails += cmMaakLiemersHtmlElement("h4", startTimeLang + ": " + events[i].getTitle());
    msgDetails += cmMaakLiemersHtmlElement("li", events[i].getDescription());
  }

  Logger.log("nr of items: "+i+ " total length:"+ msgSamenvatting.length)
  msgSamenvatting += "</ul>";
  // msgDetails += "</ul>";

  return [msgSamenvatting, msgDetails];
}


function cmVerzendLiemersActiviteitenNaarAdres(emailTo) {

  var calActiviteiten = crLeesConfiguratie("Agenda - Liemersactiviteiten");
  var templateDocumentId = crLeesConfiguratie("Template-ID - Liemersactiviteiten");

  Logger.log(templateDocumentId);
  Logger.log(emailTo);

  var numActiviteitWeken = 12;

  // var startDate = crTelWekenBijDatumOp(crBepaalVolgendeZondag(), 1); // crBepaalVolgendeZondag returns starttime of next Sunday (0:00)
  var startDate = new Date();

  // var startWeekNum = crBepaalWeeknummer(startDate);


  var lastDateActiviteiten = crTelWekenBijDatumOp(startDate, numActiviteitWeken);


  var eventsActiviteiten = cmLeesAgenda(calActiviteiten, startDate, lastDateActiviteiten);

  var txtPeriode = crFormatteerDatum(startDate, crDatumFormaat.DATUM_ZONDER_JAAR) + " tot en met " +
    crFormatteerDatum(lastDateActiviteiten, crDatumFormaat.DATUM_ZONDER_JAAR) + " (" + numActiviteitWeken + " weken)";

  var msg_array = cmFormatteerLiemersGebeurtenissen(eventsActiviteiten);
  var msgSamenvatting = cmMaakLiemersHtmlElement("h2", "Activiteiten in de Liemers van " + txtPeriode) + msg_array[0];
  var msgDetails = msg_array[1];


  var emailSubject = "Activiteiten in de Protestantse Gemeenten van " + txtPeriode;
  var templateDoc = DocumentApp.openById(templateDocumentId);

  var emailTekst = "Zie HTML gedeelte";
  // var myself = "kerktv@pkn-didam.nl";
  var myself = "avandervliet@gmail.com";

  var url = "https://docs.google.com/document/d/" + templateDoc.getId() + "/export?format=html"
  var param = {
    method: "get",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };


  var emailHtmlRaw = UrlFetchApp.fetch(url, param).getContentText();

  Logger.log("Length of raw HTML: " + emailHtmlRaw.length);

  var liemersSelectie = cmSelecteerKomendeDiensten(cmBepaalAantalDienstenUitTemplate(emailHtmlRaw), startDate);
  var liemersVariabelen = cmMaakTemplateVariabelen(liemersSelectie, 0, {
    samenvatting: cmMaakTemplateWaarde("", msgSamenvatting),
    details: cmMaakTemplateWaarde("", msgDetails),
    periode: txtPeriode
  });
  var emailHtml = cmVervangHtmlTemplate(emailHtmlRaw, liemersVariabelen, liemersSelectie);

  Logger.log("Length of final HTML: " + emailHtml.length);


  //var controleEmailHtml = emailHtmlRaw.replace("@GEGEVENS@", gegevens).replace("@ARCHIEF@", archief).replace("@CONTACTGEGEVENS@", alleContactGegevens);

  // var pdf = instanceDoc.getAs(MimeType.PDF).setName(emailSubject + ".pdf");

  // MailApp.sendEmail(myself, emailSubject, emailTekst, {htmlBody: emailHtml, bcc: emailTo, replyTo: myself, attachments: pdf });
  MailApp.sendEmail(emailTo, emailSubject, emailTekst, { htmlBody: emailHtml, To: emailTo });
}


function cmVerzendLijstKerkdiensten(emailTo = crLeesConfiguratie("Mailinglijst - Kerkdiensten")) {


  var num_weeks_in_report = 12;
  var num_months_in_report = 6;
  var curDate = new Date();

  var rptWeekStartDate = crTelWekenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);
  var rptWeekEndNum = crBepaalWeeknummer(rptWeekEndDate);

  var msg = "";

  var emailBody = msg.replace(/\n/g, "<br >") + "<br />-------------------<br />" + cmMaakHtmlLijstrapport(rptWeekStartDate, rptWeekEndDate);

  var emailTextBody = 'Zie HTML gedeelte';
  var emailSubject = 'Lijst kerkdiensten week ' + rptWeekStartNum + " t/m " + rptWeekEndNum;
  var myself = "avandervliet@pg-didam.nl";

  Logger.log("\nTo=" + emailTo + "=");
  Logger.log("\nSubj:" + emailSubject + "=");
  Logger.log("\nText=" + emailTextBody + "=");
  Logger.log("\nbcc=" + emailTo + "=");

  MailApp.sendEmail(
    "",
    emailSubject,
    emailTextBody,
    {
      bcc: emailTo,
      name: 'Automatisch verzonden email',
      htmlBody: emailBody,
    }
  );

}


function cmMaakHtmlLijstrapport(rptWeekStartDate, rptWeekEndDate) {

  var hdr = "Dienstrooster voor week " + rptWeekStartDate + " t/m " + rptWeekEndDate;

  var rptHeader;
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
    kerktv: a_kerktv
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  function cmMaakHtmlElement(tag, str) {
    return "<" + tag + ">" + str + "</" + tag + ">\n";
  }

  function cmVoegLijstItemToe(pfx, str) {
    if (str)
      return li_tag + pfx + str;
    else
      return "";
  }

  var fullMsg = "<ul>";

  for (var i in a_type) {

    var nl = "\n";
    var nl_indent1 = nl + "\t";
    var msg = "";
    var cur = "";

    msg += crFormatteerDatum(a_rowDate[i], crDatumFormaat.DATUM_KORT) + ", " + a_titel[i] + "<br />" + nl;

    msg.trim();

    if (fullMsg.length > 0)
      fullMsg += "\n\n";

    fullMsg += msg;

  }
  fullMsg += "</ul>";
  return fullMsg;
}


var nl = "\n";
var tab = "\t";

const conv = {
  c: function (text, obj) {
    return text.replace(
      new RegExp(`[${obj.reduce((s, { r }) => (s += r), "")}]`, "g"),
      (e) => {
        const t = e.codePointAt(0);
        if (
          (t >= 48 && t <= 57) ||
          (t >= 65 && t <= 90) ||
          (t >= 97 && t <= 122)
        ) {
          return obj.reduce((s, { r, d }) => {
            if (new RegExp(`[${r}]`).tsTestDatumFormattering(e))
              s = String.fromCodePoint(e.codePointAt(0) + d);
            return s;
          }, "");
        }
        return e;
      }
    );
  },
  bold: function (text) {
    return this.c(text, [
      { r: "0-9", d: 120734 },
      { r: "A-Z", d: 120211 },
      { r: "a-z", d: 120205 },
    ]);
  },
  italic: function (text) {
    return this.c(text, [
      { r: "A-Z", d: 120263 },
      { r: "a-z", d: 120257 },
    ]);
  },
  boldItalic: function (text) {
    return this.c(text, [
      { r: "A-Z", d: 120315 },
      { r: "a-z", d: 120309 },
    ]);
  },
  underLine: function (text) {
    return text.length > 0 ? [...text].join("\u0332") + "\u0332" : "";
  },
  strikethrough: function (text) {
    return text.length > 0 ? [...text].join("\u0336") + "\u0336" : "";
  },
};

// Please run this function.


function cmVerzendLectorrooster() {
  cmVerzendLectorroosterNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - Lectoren"));
}


function cmVerzendLectorroosterNaarLijst(emailListSheet, bevestigingsadres) {

  var num_weeks_in_report = 52;

  var curDate = crZetOpBeginVanDag(new Date());

  // zoek de eerstvolgende zondag
  // var rptWeekStartDate = crTelWekenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);

  // in plaats van eerstvolgende zondag, gebruik de zondag van deze week + 1, dus op maandag van deze week
  // var rptWeekStartDate = crTelDagenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();

  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);

  // Alles voor de email is nu gereed


  /* var rptSheetName = "Lectorrooster"; var rptTitle = "Lectorrooster";

  cmMaakLectorrooster(rptWeekStartDate, rptWeekEndDate, rptSheetName, rptTitle);

  var pdf = exConverteerWerkbladNaarPdf(rptSheetName);
  var xlsx = exConverteerWerkbladNaarXlsx(rptSheetName);

  var xlsx_file = UrlFetchApp.fetch(xlsx, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  }).getBlob();

  xlsx_file.setName(rptSheetName + ".xlsx"); */


  var emailHtmlBody = cmGenereerLectorroosterLijst(rptWeekStartDate, rptWeekEndDate);

  var emailAsBcc = true;  // send emails in a loop or one by one

  // Haal addressen op
  var emailTo_list = cmLeesEmailadressen(emailListSheet);

  var emailConfirmationTo = bevestigingsadres || "avandervliet@gmail.com";
  var emailConfirmationMsg = "Lectorrooster verzonden\n";

  var emailSubject = 'Lectorrooster vanaf week ' + rptWeekStartNum;
  var emailName = 'Lectorrooster Protestantse Gemeente Didam';

  var emailTo = emailTo_list.join(",");
  var myself = "avandervliet@gmail.com";

  // MailApp.sendEmail(myself, emailSubject, "See HTML part", { htmlBody: emailHtmlBody, bcc: emailTo, replyTo: myself, attachments: xlsx_file });

  cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc);
}


function cmGenereerLectorroosterLijst(rptWeekStartDate, rptWeekEndDate) {

  var rptHeader;
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
    uitgangscollectes: a_uitgangscollecte,
    oorspronkelijkeLectoren: a_lectorOrg
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  var fullMsg = "";

  var rptMonth = "";

  var inList = false;

  for (var i in a_type) {

    var msg = "";
    var cur = "";
    var li_tag = "<li>";

    var newMonth = false;
    var monthName = crFormatteerDatum(a_rowDate[i], crDatumFormaat.MAAND);

    if (monthName !== rptMonth) {
      if (inList) {
        msg += "</ul>";
      }

      newMonth = true;
      rptMonth = monthName;

      msg += cmMaakHtmlElement("h4", rptMonth);

      msg += "<ul>"; inList = true;
    }

    msg += li_tag + crFormatteerDatum(a_rowDate[i], crDatumFormaat.DAG_TIJD_KORT) + "u&emsp;:&nbsp;";


    if (a_lector[i].length > 0)
      msg += a_lector[i].bold();
    else
      msg += "geen lector";

    /* if (a_lector[i].localeCompare(a_lectorOrg[i])) {
      msg += " (was: <s>" + a_lectorOrg[i] + "</s>)&nbsp;&nbsp;";
    } */

    msg += "&emsp;-&nbsp;" + a_titel[i];

    // msg += cmVoegLijstItemToe("Ambtsdragers: ", a_ambtsdragers[i]);
    // msg += cmVoegLijstItemToe("Koster: ", a_koster[i]);


    msg.trim();

    if (fullMsg.length > 0)
      fullMsg += "\n\n";

    fullMsg += msg;

  }

  if (inList) {
    msg += "</ul>";
    inList = false;
  }

  return fullMsg;
}
