/**
 * Module: CM_Communicatie.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

var nl = "\n";
var tab = "\t";
function cmVerzendRooster() {
  cmVerzendRoosterNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - Rooster"), 4, 3); // 2 weeks and 3 months
}
function cmVerzendRoosterNaarLijst(emailListSheet, reportWeeks = 6, reportMonths = 6, confirmAddress) {
  var rptTitle = "Rooster " + reportMonths + " maanden";
  var rptSheetName = "Rooster-" + reportMonths + "-maanden";
  var msg = crLeesConfiguratie("Berichttekst - Rooster");
  var curDate = crZetOpBeginVanDag(new Date());

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, reportWeeks));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);
  var rptWeekEndNum = crBepaalWeeknummer(rptWeekEndDate);
  var rptMonthBeginDate = crBepaalBeginVanMaand(rptWeekStartDate);
  rsMaakRoosterWerkblad(rptSheetName, rptTitle, rptMonthBeginDate, reportMonths);
  var rosterHtml = rsMaakHtmlRooster(rptWeekStartDate, reportMonths);
  var htmlWeekRaport = cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate);

  // Alles voor de email is nu gereed

  var emailHtmlBody = msg.replace(/\n/g, "<br >") + "<h4> Weekrooster voor de komende " + reportWeeks + " weken</h4>" + htmlWeekRaport + "<h4> Maandrooster voor de komende " + reportMonths + " maanden</h4>" + rosterHtml;
  var emailAsBcc = false; // send emails in a loop or one by one (mails to Bcc will bounce sending to KPN/Ziggo, incl. hi/planet/xs4all/upc/upcmail)

  // Haal addressen op
  var recipientList = cmLeesEmailadressen(emailListSheet);
  var emailConfirmationTo = confirmAddress || "avandervliet@gmail.com";
  var emailConfirmationMsg = "Weekrooster verzonden\n";
  var emailSubject = 'Dienstenrooster week ' + rptWeekStartNum + " t/m " + rptWeekEndNum;
  var emailName = 'Weekrooster Protestantse Gemeente Didam';
  cmVerzendEmail(recipientList, emailSubject, {
    name: emailName,
    htmlBody: emailHtmlBody,
    mode: emailAsBcc ? "bcc" : "individual",
    to: emailConfirmationTo,
    confirmTo: emailConfirmationTo,
    confirmMessage: emailConfirmationMsg
  });
}

/**
 * Centrale verzendroute voor HTML-mail, bijlagen, BCC en bevestigingen.
 * `mode` is `individual`, `together` of `bcc`; standaard is `individual`.
 */
function cmVerzendEmail(source, subject, options) {
  options = options || {};
  var recipients = cmLeesEmailadressen(source).map(function (row) {
    return String(Array.isArray(row) ? row[0] : row).trim();
  }).filter(function (address) {
    return Boolean(address);
  });
  if (!recipients.length) throw new Error("Geen geldige e-mailadressen gevonden.");
  var mode = options.mode || "individual";
  if (["individual", "together", "bcc"].indexOf(mode) < 0) {
    throw new Error("Onbekende e-mailmodus: " + mode);
  }
  var textBody = options.textBody || "Zie HTML gedeelte";
  var mailOptions = {};
  if (options.name) mailOptions.name = options.name;
  if (options.htmlBody) mailOptions.htmlBody = options.htmlBody;
  if (options.attachments && options.attachments.length) mailOptions.attachments = options.attachments;
  var joined = recipients.join(",");
  if (mode === "bcc") {
    mailOptions.bcc = joined;
    var visibleTo = options.to || options.confirmTo;
    if (!visibleTo) throw new Error("Voor BCC-verzending is 'to' of 'confirmTo' verplicht.");
    MailApp.sendEmail(visibleTo, subject, textBody, mailOptions);
  } else if (mode === "together") {
    MailApp.sendEmail(joined, subject, textBody, mailOptions);
  } else {
    recipients.forEach(function (address) {
      MailApp.sendEmail(address, subject, textBody, mailOptions);
    });
  }
  Logger.log("\nTo: " + joined + "\nSubject: " + subject + "\nMode: " + mode);
  if (options.confirmTo) {
    var modeText = mode === "bcc" ? "als BCC" : mode === "together" ? "gezamenlijk" : "als aparte mails";
    var confirmation = String(options.confirmMessage || "E-mail verzonden") +
      "\nVerzendwijze: " + modeText + "\nVerzonden naar: " + joined;
    MailApp.sendEmail(options.confirmTo, subject + " - verzonden " + modeText, confirmation, {
      name: options.name || "Dienstenrooster",
      htmlBody: cmEscapeHtml(confirmation)
    });
  }
  return { recipients: recipients, mode: mode, sentCount: mode === "individual" ? recipients.length : 1 };
}

/** Leest ontvangers uit een werkblad, kommagescheiden tekst of bestaande lijst. */
function cmLeesEmailadressen(source) {
  if (Array.isArray(source)) return source;
  var text = String(source || "").trim();
  if (!text) return [];
  if (text.indexOf("@") === -1) return crLeesWerkbladInhoud(text);
  return text.split(/[,;\n]+/).map(function (address) {
    return [address.trim()];
  }).filter(function (row) {
    return Boolean(row[0]);
  });
}
function cmMaakHtmlElement(tag, str) {
  return "<" + tag + ">" + str + "</" + tag + ">\n";
}
function cmVoegLijstItemToe(pfx, str) {
  if (str) return "<li>" + pfx + str;else return "";
}

/** Escapet een waarde voordat deze in een HTML-template wordt geplaatst. */
function cmEscapeHtml(value) {
  return String(value === null || value === undefined ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\r?\n/g, "<br>");
}
function cmIsJaWaarde(value) {
  return value === true || ["ja", "true", "1", "x"].indexOf(String(value || "").trim().toLowerCase()) >= 0;
}
function cmIsNeeWaarde(value) {
  return value === false || ["nee", "false", "0"].indexOf(String(value || "").trim().toLowerCase()) >= 0;
}

/** Geeft de zichtbare velden van één dienst in de afgesproken presentatievolgorde. */
function cmMaakDienstvelden(selection, index) {
  var notes = [];
  if (selection.bijzonderheden[index]) notes.push(String(selection.bijzonderheden[index]));
  var hasCommunionText = notes.some(function (note) {
    return note.split(/\s*,\s*/).some(function (part) {
      return part.trim().toLowerCase() === "heilig avondmaal";
    });
  });
  if (cmIsJaWaarde(selection.avondmaal[index]) && !hasCommunionText) notes.push("Heilig Avondmaal");
  var minister = String(selection.voorgangers[index] || "");
  if (minister && notes.length) minister += ", " + notes.join(", ");
  var coffee = cmIsNeeWaarde(selection.koffieDiensten[index]) ? "geen koffie" : selection.koffie[index];
  var fields = [];
  if (minister) {
    fields.push(["Voorganger", minister]);
  } else if (notes.length) {
    // Bij een dienst buiten Didam is Bijzonderheden vaak het enige gevulde veld.
    fields.push(["Bijzonderheden", notes.join(", ")]);
  }
  fields = fields.concat([["Collecte", selection.collectes[index]], ["Uitgangscollecte", selection.uitgangscollectes[index]], ["Lector", selection.lectoren[index]], ["Ambtsdragers", selection.ambtsdragers[index]], ["Koster", selection.kosters[index]], ["Koffie", coffee], ["Ontvangst", selection.ontvangst[index]], ["Klokkenluider", selection.klokkenluiders[index]], ["KerkTV", selection.kerktv[index]], ["Kleur", selection.kleuren[index]], ["Naam van de zondag", selection.zondagnamen[index]]]);
  return fields;
}

/** Maakt een verticaal HTML-overzicht van de eerste `aantal` diensten. */
function cmMaakHtmlDienstenrapport(selection, count) {
  var limit = Math.min(Math.max(Number(count) || 1, 1), selection.datums.length);
  var html = "";
  var previousWeek = null;
  for (var index = 0; index < limit; index++) {
    var week = crBepaalWeeknummer(selection.datums[index]);
    if (week !== previousWeek) {
      html += cmMaakHtmlElement("h3", "Week " + week);
      previousWeek = week;
    }
    html += cmMaakHtmlElement("h4", cmEscapeHtml(crFormatteerDatum(selection.datums[index], crDateFormat.DATUM_TIJD_ZONDER_JAAR)));
    html += "<ul>\n";
    cmMaakDienstvelden(selection, index).forEach(function (veld) {
      if (veld[1] === "" || veld[1] === null || veld[1] === undefined) return;
      html += "<li><strong>" + cmEscapeHtml(veld[0]) + ":</strong> " + cmEscapeHtml(veld[1]) + "</li>\n";
    });
    html += "</ul>\n";
  }
  return html;
}

/** Maakt hetzelfde verticale dienstenoverzicht als platte documenttekst. */
function cmMaakTekstDienstenrapport(selection, count) {
  var limit = Math.min(Math.max(Number(count) || 1, 1), selection.datums.length);
  var blocks = [];
  var previousWeek = null;
  for (var index = 0; index < limit; index++) {
    var week = crBepaalWeeknummer(selection.datums[index]);
    var lines = [];
    if (week !== previousWeek) {
      lines.push("Week " + week);
      previousWeek = week;
    }
    lines.push(crFormatteerDatum(selection.datums[index], crDateFormat.DATUM_TIJD_ZONDER_JAAR));
    cmMaakDienstvelden(selection, index).forEach(function (veld) {
      if (veld[1] === "" || veld[1] === null || veld[1] === undefined) return;
      lines.push("•\t" + veld[0] + ": " + veld[1]);
    });
    blocks.push(lines.join("\n"));
  }
  return blocks.join("\n\n");
}
function cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate) {
  var selection = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);
  return cmMaakHtmlDienstenrapport(selection, selection.datums.length);
}

/** Normaliseert een placeholdernaam, bijvoorbeeld `Naam Zondag` naar `naam zondag`. */
function cmNormaliseerPlaceholder(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** Maakt een tekst- en HTML-waarde voor gebruik door beide templaterenderers. */
function cmMaakTemplateWaarde(text, html) {
  var plainText = String(text === null || text === undefined ? "" : text);
  return {
    tekst: plainText,
    html: html === undefined ? cmEscapeHtml(plainText) : html
  };
}

/** Stelt alle enkelvoudige variabelen van één dienst centraal samen. */
function cmMaakTemplateVariabelen(selection, index, extras) {
  index = index || 0;
  var date = selection.datums[index];
  var values = {
    datum: cmMaakTemplateWaarde(crFormatteerDatum(date, crDateFormat.DATUM_LANG)),
    tijd: cmMaakTemplateWaarde(crFormatteerDatum(date, crDateFormat.TIJD)),
    datumtijd: cmMaakTemplateWaarde(crFormatteerDatum(date, crDateFormat.DATUM_TIJD_ZONDER_JAAR)),
    voorganger: cmMaakTemplateWaarde(selection.voorgangers[index]),
    bijzonderheden: cmMaakTemplateWaarde(selection.bijzonderheden[index]),
    collecte: cmMaakTemplateWaarde(selection.collectes[index]),
    collectecategorie: cmMaakTemplateWaarde(selection.collectecategorieen[index]),
    uitgangscollecte: cmMaakTemplateWaarde(selection.uitgangscollectes[index]),
    lector: cmMaakTemplateWaarde(selection.lectoren[index]),
    ambtsdragers: cmMaakTemplateWaarde(selection.ambtsdragers[index]),
    koster: cmMaakTemplateWaarde(selection.kosters[index]),
    koffie: cmMaakTemplateWaarde(selection.koffie[index]),
    ontvangst: cmMaakTemplateWaarde(selection.ontvangst[index]),
    klokkenluider: cmMaakTemplateWaarde(selection.klokkenluiders[index]),
    kerktv: cmMaakTemplateWaarde(selection.kerktv[index]),
    kleur: cmMaakTemplateWaarde(selection.kleuren[index]),
    heiligavondmaal: cmMaakTemplateWaarde(selection.avondmaal[index] ? "ja" : "nee"),
    avondmaalsvorm: cmMaakTemplateWaarde(selection.havormen[index]),
    naamzondag: cmMaakTemplateWaarde(selection.zondagnamen[index]),
    kwartaal: cmMaakTemplateWaarde(selection.kwartalen[index]),
    koffiedienst: cmMaakTemplateWaarde(selection.koffieDiensten[index]),
    didamdienst: cmMaakTemplateWaarde(selection.didamDiensten[index])
  };
  // Tijdelijke aliases voor bestaande templates.
  values.ha = values.heiligavondmaal;
  values.havorm = values.avondmaalsvorm;
  values.zondagnaam = values.naamzondag;
  Object.keys(extras || {}).forEach(function (name) {
    var value = extras[name];
    values[cmNormaliseerPlaceholder(name)] = value && value.tekst !== undefined ? value : cmMaakTemplateWaarde(value);
  });
  return values;
}

/** Bepaalt het hoogste gevraagde aantal uit `@gegevens@` of `@gegevens <n>@`. */
function cmBepaalAantalDienstenUitTemplate(text) {
  var count = 1;
  var pattern = /@gegevens(?:\s+(\d+))?\s*@/gi;
  var match;
  while ((match = pattern.exec(String(text || ""))) !== null) {
    count = Math.max(count, Number(match[1]) || 1);
  }
  return count;
}

/** Selecteert voldoende toekomstige diensten voor de placeholders in een template. */
function cmSelecteerKomendeDiensten(count, startDate) {
  var begin = crZetOpBeginVanDag(startDate || new Date());
  var end = crZetTijdOpEindeVanDag(crTelMaandenBijDatumOp(new Date(begin), 24));
  var selection = rsSelecteerGegevens(begin, end);
  if (!selection.datums.length) throw new Error("Geen toekomstige diensten gevonden voor de mailtemplate.");
  if (selection.datums.length < count) {
    console.log("Template vraagt " + count + " diensten; slechts " + selection.datums.length + " gevonden.");
  }
  return selection;
}

/** Maakt voorbeeldwaarden voor alle aanvullende placeholders van de mailtypen. */
function cmMaakTesttemplateVariabelen(selection) {
  var htmlLijst = "<ul><li>Voorbeeldregel 1</li><li>Voorbeeldregel 2</li></ul>";
  return cmMaakTemplateVariabelen(selection, 0, {
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
  var serviceCount = cmBepaalAantalDienstenUitTemplate(templateHtml);
  var selection = cmSelecteerKomendeDiensten(serviceCount);
  var vars = cmMaakTesttemplateVariabelen(selection);
  var html = cmVervangHtmlTemplate(templateHtml, vars, selection);
  var recipients = cmLeesEmailadressen(crLeesConfiguratie("Testmail"));
  var result = cmVerzendEmail(recipients, "[TEST] Mailtemplatevariabelen", {
    name: "Test Dienstenrooster",
    htmlBody: html,
    mode: "individual"
  });
  SpreadsheetApp.getUi().alert("Testtemplate verzonden naar " + result.sentCount + " testontvanger(s).");
}

/** Vervangt alle placeholders in geëxporteerde template-HTML. */
function cmVervangHtmlTemplate(html, vars, selection) {
  var unknown = {};
  var result = String(html || "").replace(/@([A-Za-z][A-Za-z0-9 _-]*)@/g, function (volledig, name) {
    var key = cmNormaliseerPlaceholder(name);
    var data = /^gegevens(?:\s+(\d+))?$/.exec(key);
    if (data) return cmMaakHtmlDienstenrapport(selection, Number(data[1]) || 1);
    if (vars[key]) return vars[key].html;
    unknown[key] = true;
    return volledig;
  });
  var unknownNames = Object.keys(unknown);
  if (unknownNames.length) {
    throw new Error("Onbekende placeholder(s) in mailtemplate: @" + unknownNames.join("@, @") + "@");
  }
  return result;
}

/** Vervangt placeholders in documenttekst zonder de overige documentopmaak te verliezen. */
function cmVervangDocumentTemplate(document, vars, selection) {
  var sections = [document.getBody(), document.getHeader(), document.getFooter()].filter(function (section) {
    return Boolean(section);
  });
  sections.forEach(function (section) {
    var match = section.findText("@[A-Za-z][A-Za-z0-9 _-]*@");
    while (match) {
      var textNode = match.getElement().asText();
      var begin = match.getStartOffset();
      var end = match.getEndOffsetInclusive();
      var placeholder = textNode.getText().substring(begin, end + 1);
      var key = cmNormaliseerPlaceholder(placeholder.slice(1, -1));
      var data = /^gegevens(?:\s+(\d+))?$/.exec(key);
      var replacement;
      if (data) {
        replacement = cmMaakTekstDienstenrapport(selection, Number(data[1]) || 1);
      } else if (vars[key]) {
        replacement = vars[key].tekst;
      } else {
        throw new Error("Onbekende placeholder in documenttemplate: @" + key + "@");
      }
      textNode.deleteText(begin, end);
      textNode.insertText(begin, replacement);
      match = section.findText("@[A-Za-z][A-Za-z0-9 _-]*@");
    }
  });
  return document;
}

/** Exporteert een Google Document met behoud van alle template-inhoud naar HTML. */
function cmExporteerDocumentNaarHtml(documentId) {
  var url = "https://docs.google.com/document/d/" + documentId + "/export?format=html";
  return UrlFetchApp.fetch(url, {
    method: "get",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: false
  }).getContentText();
}
function cmVerzendTemplate() {
  cmVerzendTemplateNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - KerkTV"));
}
function cmVerzendTemplateNaarLijst(emailListSheetName, confirmAddress) {
  var calendarName = crLeesConfiguratie("Agenda - KerkTV");
  var notice = crLeesConfiguratie("Berichttekst - KerkTV");
  var templateId = crLeesConfiguratie("Template-ID - KerkTV-liturgie");
  var templateDocument = DocumentApp.openById(templateId);
  var templateText = [templateDocument.getBody(), templateDocument.getHeader(), templateDocument.getFooter()].filter(function (section) {
    return Boolean(section);
  }).map(function (section) {
    return section.getText();
  }).join("\n");
  var templateHtml = cmExporteerDocumentNaarHtml(templateId);
  var serviceCount = Math.max(cmBepaalAantalDienstenUitTemplate(templateText), cmBepaalAantalDienstenUitTemplate(templateHtml));
  var selection = cmSelecteerKomendeDiensten(serviceCount);
  var serviceDate = new Date(selection.datums[0]);
  var subject = "Liturgie voor " + crFormatteerDatum(serviceDate, crDateFormat.DATUM_LANG);
  var dayStart = crZetOpBeginVanDag(new Date(serviceDate));
  var dayEnd = crZetTijdOpEindeVanDag(new Date(serviceDate));
  var events = CalendarApp.getCalendarsByName(calendarName);
  var agendaItems = events.length ? events[0].getEvents(dayStart, dayEnd) : [];
  var calendarTitle = agendaItems.length ? agendaItems[0].getTitle() : "";
  var liturgy = agendaItems.length ? agendaItems[0].getDescription() : "";
  var contactText = ["Contact", "Rechtstreekse uitzending: https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending", "Kerkdienst gemist: https://www.pkn-didam.nl/kerktv/kerkdienst-gemist", "Handleiding: https://www.pkn-didam.nl/kerktv/handleiding", "E-mail: kerktv@pkn-didam.nl"].join("\n");
  var contactHtml = "<h4>Contact</h4>" + '<p>Rechtstreekse uitzending: <a href="https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending">link</a><br>' + 'Kerkdienst gemist: <a href="https://www.pkn-didam.nl/kerktv/kerkdienst-gemist">link</a><br>' + 'Handleiding: <a href="https://www.pkn-didam.nl/kerktv/handleiding">link</a><br>' + 'E-mail: <a href="mailto:kerktv@pkn-didam.nl">kerktv@pkn-didam.nl</a></p>';
  var archiefHtml = "<h4>Vorige 4 diensten</h4>" + ytMaakUploadLijst(4);
  var copy = DriveApp.getFileById(templateId).makeCopy(subject);
  var document = DocumentApp.openById(copy.getId());
  var editUrl = "https://docs.google.com/document/d/" + document.getId() + "/edit?usp=sharing";
  var vars = cmMaakTemplateVariabelen(selection, 0, {
    onderwerp: subject,
    titel: calendarTitle,
    mededeling: notice,
    liturgie: liturgy,
    archief: cmMaakTemplateWaarde("", archiefHtml),
    contactgegevens: cmMaakTemplateWaarde(contactText, contactHtml),
    "url edit": editUrl,
    url_edit: editUrl,
    kerktvpagina: "https://www.pkn-didam.nl/kerktv"
  });
  cmVervangDocumentTemplate(document, vars, selection);
  document.saveAndClose();
  var emailHtml = cmVervangHtmlTemplate(templateHtml, vars, selection);
  var emailadressen = cmLeesEmailadressen(emailListSheetName);
  cmVerzendEmail(emailadressen, subject, {
    name: "Liturgiemail Protestantse Gemeente Didam",
    htmlBody: emailHtml,
    mode: "individual",
    confirmTo: confirmAddress || "avandervliet@gmail.com",
    confirmMessage: "Liturgie verzonden\nDocument: " + editUrl
  });
}
function cmVerzendMededelingen() {
  cmVerzendMededelingenNaarAdres(crLeesConfiguratie("Mailinglijst - Mededelingen"), false);
}
function cmVerzendMededelingenVolgendeWeek() {
  cmVerzendMededelingenNaarAdres(crLeesConfiguratie("Mailinglijst - Mededelingen"), true);
}

/** Leest hoofdtekst, kop- en voettekst van een Google Document in één tekst. */
function cmLeesDocumenttekst(document) {
  return [document.getBody(), document.getHeader(), document.getFooter()].filter(function (section) {
    return Boolean(section);
  }).map(function (section) {
    return section.getText();
  }).join("\n");
}

/** Bepaalt datumafhankelijke namen voor één mededelingenmail en bijlage. */
function cmMaakMededelingenMetadata(selection) {
  var serviceDate = new Date(selection.datums[0]);
  var dateText = crFormatteerDatum(serviceDate, crDateFormat.DATUM_LANG);
  return {
    serviceDate: serviceDate,
    dateText: dateText,
    subject: "Mededelingen voor " + dateText,
    fileName: crFormatteerDatum(serviceDate, crDateFormat.SORTEERDATUM) + " - mededelingen " + dateText + ".docx"
  };
}

/**
 * Leest beide templates en selecteert één keer alle diensten die een van beide
 * templates via `@gegevens <n>@` nodig heeft.
 */
function cmBereidMededelingenVoor(nextWeek) {
  var startDate = crZetOpBeginVanDag(new Date());
  if (nextWeek) startDate = crTelDagenBijDatumOp(startDate, 7);
  var mailTemplateId = crLeesConfiguratie("Template-ID - Mededelingen mail");
  var documentTemplateId = crLeesConfiguratie("Template-ID - Mededelingen document");
  if (!mailTemplateId || !documentTemplateId) {
    throw new Error("Vul zowel 'Template-ID - Mededelingen mail' als 'Template-ID - Mededelingen document' in op Configuratie.");
  }
  var documentTemplate = DocumentApp.openById(documentTemplateId);
  var documentText = cmLeesDocumenttekst(documentTemplate);
  var mailHtml = cmExporteerDocumentNaarHtml(mailTemplateId);
  var serviceCount = Math.max(cmBepaalAantalDienstenUitTemplate(documentText), cmBepaalAantalDienstenUitTemplate(mailHtml));
  var selection = cmSelecteerKomendeDiensten(serviceCount, startDate);
  return {
    documentTemplateId: documentTemplateId,
    mailHtml: mailHtml,
    selection: selection,
    metadata: cmMaakMededelingenMetadata(selection)
  };
}

/** Maakt de gedeelde placeholderwaarden voor mail en documentbijlage. */
function cmMaakMededelingenVariabelen(selection, subject, liturgy, editUrl) {
  return cmMaakTemplateVariabelen(selection, 0, {
    onderwerp: subject,
    organist: "Rolf Zandbergen",
    bloemen: "- INVULLEN -",
    "extra mededelingen": "- Geen -",
    extra_mededelingen: "- Geen -",
    liturgie: liturgy,
    "url edit": editUrl,
    url_edit: editUrl
  });
}

/** Vult de documenttemplate en exporteert de opgeslagen kopie als DOCX. */
function cmMaakMededelingenBijlage(prepared) {
  var meta = prepared.metadata;
  var document = cmMaakDocumentkopie(prepared.documentTemplateId, meta.subject);
  var dayStart = crZetOpBeginVanDag(new Date(meta.serviceDate));
  var dayEnd = crZetTijdOpEindeVanDag(new Date(meta.serviceDate));
  var liturgy = cmLeesLiturgieUitAgenda(crLeesConfiguratie("Agenda - KerkTV"), dayStart, dayEnd);
  var documentId = document.getId();
  var editUrl = "https://docs.google.com/document/d/" + documentId + "/edit?usp=sharing";
  var vars = cmMaakMededelingenVariabelen(prepared.selection, meta.subject, liturgy, editUrl);
  cmVervangDocumentTemplate(document, vars, prepared.selection);
  document.saveAndClose();
  return {
    vars: vars,
    docx: cmExporteerDocumentNaarDocx(documentId, meta.fileName)
  };
}

/**
 * Bouwt de kerkmededelingen uit twee templates met één gedeelde dataset.
 * De mailtemplate levert alleen de mail-HTML; de documenttemplate wordt eerst
 * gekopieerd, ingevuld en daarna als DOCX geëxporteerd. Het grootste gevraagde
 * `@gegevens <n>@` uit beide templates bepaalt hoeveel diensten worden gelezen.
 */
function cmVerzendMededelingenNaarAdres(emailTo, nextWeek) {
  if (!emailTo) return;
  var prepared = cmBereidMededelingenVoor(nextWeek);
  var attachment = cmMaakMededelingenBijlage(prepared);
  var html = cmVervangHtmlTemplate(prepared.mailHtml, attachment.vars, prepared.selection);
  cmVerzendEmail(emailTo, prepared.metadata.subject, {
    htmlBody: html,
    attachments: [attachment.docx],
    mode: "together"
  });
}
function cmZoekEersteDienstIndex(selection) {
  return selection && selection.datums && selection.datums.length ? 0 : -1;
}
function cmMaakDocumentkopie(templateId, documentName) {
  var copy = DriveApp.getFileById(templateId).makeCopy(documentName);
  return DocumentApp.openById(copy.getId());
}
function cmLeesLiturgieUitAgenda(calendarName, startDate, endDate) {
  var calendars = CalendarApp.getCalendarsByName(calendarName);
  if (!calendars.length) throw new Error("Agenda niet gevonden: " + calendarName);
  var events = calendars[0].getEvents(startDate, endDate);
  if (!events.length) return "";
  return events[0].getDescription().replace(/<br\s*\/?>/gi, "\n").replace(/<\/?b>/gi, "");
}
function cmExporteerDocumentNaarDocx(documentId, fileName) {
  var url = "https://docs.google.com/document/d/" + documentId + "/export?format=docx";
  return UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  }).getBlob().setName(fileName);
}

// https://stackoverflow.com/questions/15636543/convert-google-doc-to-docx-using-google-script
// https://gist.github.com/tanaikech/8d639542577a594f6104b7f6fb753064

// De ongebruikte experimentele mededelingenvariant is verwijderd.

var lineBreakTag = "<br />";
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
  } else return null;
}
function cmFormatteerGebeurtenissen(events) {
  var msg = "<ul>";
  for (var i in events) {
    var title = events[i].getTitle();
    var desc = events[i].getDescription();
    var startTime = events[i].getStartTime();
    msg += cmMaakMjHtmlElement("li", crFormatteerDatum(startTime, crDateFormat.DATUM_TIJD_ZONDER_JAAR) + " " + title);
  }
  msg += "</ul>";
  return msg;
}
function cmFormatteerEersteGebeurtenisVolledig(events) {
  var msg = "<p>";
  msg += "</p>";
  return msg;
}
function cmVerzendMjMededelingenNaarAdres(emailTo) {
  var serviceCalendar = crLeesConfiguratie("Agenda - KerkTV");
  var activityCalendar = crLeesConfiguratie("Agenda - Activiteiten");
  var templateDocumentId = crLeesConfiguratie("Template-ID - MJ-mededelingen");
  Logger.log(templateDocumentId);
  Logger.log(emailTo);
  var serviceWeekCount = 2;
  var activityWeekCount = 2;
  var startDate = crTelWekenBijDatumOp(crBepaalVolgendeZondag(), 1); // crBepaalVolgendeZondag returns starttime of next Sunday (0:00)
  var startWeekNum = crBepaalWeeknummer(startDate);
  var lastServiceDate = crTelWekenBijDatumOp(startDate, serviceWeekCount);
  var lastActivityDate = crTelWekenBijDatumOp(startDate, activityWeekCount);
  var serviceEvents = cmHaalGebeurtenissenUitAgenda(serviceCalendar, startDate, lastServiceDate);
  var activityEvents = cmHaalGebeurtenissenUitAgenda(activityCalendar, startDate, lastActivityDate);
  var serviceMessage = cmFormatteerGebeurtenissen(serviceEvents);
  var activityMessage = cmFormatteerGebeurtenissen(activityEvents);
  var activityDescription = "";
  if (activityEvents[0]) activityDescription = cmFormatteerEersteGebeurtenisVolledig(activityEvents);
  var emailSubject = "Kerkberichten Montferland Journaal - Protestantse Gemeente - week " + startWeekNum;
  var templateDoc = DocumentApp.openById(templateDocumentId);
  var emailText = "Zie HTML gedeelte";
  var myself = "avandervliet@gmail.com";
  var url = "https://docs.google.com/document/d/" + templateDoc.getId() + "/export?format=html";
  var param = {
    method: "get",
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true
  };
  var emailHtmlRaw = UrlFetchApp.fetch(url, param).getContentText();
  var mjData = cmSelecteerKomendeDiensten(cmBepaalAantalDienstenUitTemplate(emailHtmlRaw), startDate);
  var mjVars = cmMaakTemplateVariabelen(mjData, 0, {
    kerkdiensten: cmMaakTemplateWaarde("", serviceMessage),
    activiteiten: cmMaakTemplateWaarde("", activityMessage),
    beschrijving: cmMaakTemplateWaarde("", activityDescription)
  });
  var emailHtml = cmVervangHtmlTemplate(emailHtmlRaw, mjVars, mjData);
  cmVerzendEmail(emailTo, emailSubject, {
    textBody: emailText,
    htmlBody: emailHtml,
    mode: "together"
  });
}
var lineBreakTag = "<br />";
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
  } else return null;
}
function cmFormatteerLiemersGebeurtenissen(events) {
  var summary = cmMaakLiemersHtmlElement("h3", "Samenvatting");
  var details = cmMaakLiemersHtmlElement("h3", "Details");
  summary += "<ul>";
  for (var i in events) {
    var startTimeKort = crFormatteerDatum(events[i].getStartTime(), crDateFormat.DATUM_KORT);
    var startTimeLang = crFormatteerDatum(events[i].getStartTime(), crDateFormat.DATUM_TIJD_ZONDER_JAAR);
    var title = startTimeKort + ": " + cmMaakLiemersHtmlElement("b", events[i].getTitle());
    summary += cmMaakLiemersHtmlElement("li", startTimeLang + ":\t" + cmMaakLiemersHtmlElement("b", events[i].getTitle()));
    details += cmMaakLiemersHtmlElement("h4", startTimeLang + ": " + events[i].getTitle());
    details += cmMaakLiemersHtmlElement("li", events[i].getDescription());
  }
  Logger.log("nr of items: " + i + " total length:" + summary.length);
  summary += "</ul>";
  return [summary, details];
}
function cmVerzendLiemersActiviteitenNaarAdres(emailTo) {
  var activityCalendar = crLeesConfiguratie("Agenda - Liemersactiviteiten");
  var templateDocumentId = crLeesConfiguratie("Template-ID - Liemersactiviteiten");
  Logger.log(templateDocumentId);
  Logger.log(emailTo);
  var activityWeekCount = 12;
  var startDate = new Date();
  var lastActivityDate = crTelWekenBijDatumOp(startDate, activityWeekCount);
  var activityEvents = cmLeesAgenda(activityCalendar, startDate, lastActivityDate);
  var periodText = crFormatteerDatum(startDate, crDateFormat.DATUM_ZONDER_JAAR) + " tot en met " + crFormatteerDatum(lastActivityDate, crDateFormat.DATUM_ZONDER_JAAR) + " (" + activityWeekCount + " weken)";
  var messageParts = cmFormatteerLiemersGebeurtenissen(activityEvents);
  var summary = cmMaakLiemersHtmlElement("h2", "Activiteiten in de Liemers van " + periodText) + messageParts[0];
  var details = messageParts[1];
  var emailSubject = "Activiteiten in de Protestantse Gemeenten van " + periodText;
  var templateDoc = DocumentApp.openById(templateDocumentId);
  var emailText = "Zie HTML gedeelte";
  var myself = "avandervliet@gmail.com";
  var url = "https://docs.google.com/document/d/" + templateDoc.getId() + "/export?format=html";
  var param = {
    method: "get",
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true
  };
  var emailHtmlRaw = UrlFetchApp.fetch(url, param).getContentText();
  Logger.log("Length of raw HTML: " + emailHtmlRaw.length);
  var liemersData = cmSelecteerKomendeDiensten(cmBepaalAantalDienstenUitTemplate(emailHtmlRaw), startDate);
  var liemersVars = cmMaakTemplateVariabelen(liemersData, 0, {
    samenvatting: cmMaakTemplateWaarde("", summary),
    details: cmMaakTemplateWaarde("", details),
    periode: periodText
  });
  var emailHtml = cmVervangHtmlTemplate(emailHtmlRaw, liemersVars, liemersData);
  Logger.log("Length of final HTML: " + emailHtml.length);
  cmVerzendEmail(emailTo, emailSubject, {
    textBody: emailText,
    htmlBody: emailHtml,
    mode: "together"
  });
}
function cmVerzendLijstKerkdiensten(emailTo = crLeesConfiguratie("Mailinglijst - Kerkdiensten")) {
  var reportWeeks = 12;
  var reportMonths = 6;
  var curDate = new Date();
  var rptWeekStartDate = crTelWekenBijDatumOp(crBepaalBeginVanWeek(curDate), 1);
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, reportWeeks));
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
  cmVerzendEmail(emailTo, emailSubject, {
    textBody: emailTextBody,
    name: 'Automatisch verzonden email',
    htmlBody: emailBody,
    mode: "bcc",
    to: myself
  });
}
function cmMaakHtmlLijstrapport(rptWeekStartDate, rptWeekEndDate) {
  var hdr = "Dienstrooster voor week " + rptWeekStartDate + " t/m " + rptWeekEndDate;
  var rptHeader;
  var {
    koppen: headers,
    datums: rowDates,
    types: types,
    titels: titles,
    voorgangers: ministers,
    bijzonderheden: notes,
    kosters: sextons,
    kleuren: colors,
    collectes: collections,
    koffie: coffeeHosts,
    ontvangst: greeters,
    avondmaal: communions,
    lectoren: readers,
    ambtsdragers: officers,
    klokkenluiders: bellRingers,
    kerktv: churchTv
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);
  var prtWeekNum = "";
  function cmMaakHtmlElement(tag, str) {
    return "<" + tag + ">" + str + "</" + tag + ">\n";
  }
  function cmVoegLijstItemToe(pfx, str) {
    if (str) return li_tag + pfx + str;else return "";
  }
  var fullMsg = "<ul>";
  for (var i in types) {
    var nl = "\n";
    var indent = nl + "\t";
    var msg = "";
    var cur = "";
    msg += crFormatteerDatum(rowDates[i], crDateFormat.DATUM_KORT) + ", " + titles[i] + "<br />" + nl;
    msg.trim();
    if (fullMsg.length > 0) fullMsg += "\n\n";
    fullMsg += msg;
  }
  fullMsg += "</ul>";
  return fullMsg;
}
var nl = "\n";
var tab = "\t";
const conv = {
  c: function (text, obj) {
    return text.replace(new RegExp(`[${obj.reduce((s, {
      r
    }) => s += r, "")}]`, "g"), e => {
      const t = e.codePointAt(0);
      if (t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122) {
        return obj.reduce((s, {
          r,
          d
        }) => {
          if (new RegExp(`[${r}]`).tsTestDatumFormattering(e)) s = String.fromCodePoint(e.codePointAt(0) + d);
          return s;
        }, "");
      }
      return e;
    });
  },
  bold: function (text) {
    return this.c(text, [{
      r: "0-9",
      d: 120734
    }, {
      r: "A-Z",
      d: 120211
    }, {
      r: "a-z",
      d: 120205
    }]);
  },
  italic: function (text) {
    return this.c(text, [{
      r: "A-Z",
      d: 120263
    }, {
      r: "a-z",
      d: 120257
    }]);
  },
  boldItalic: function (text) {
    return this.c(text, [{
      r: "A-Z",
      d: 120315
    }, {
      r: "a-z",
      d: 120309
    }]);
  },
  underLine: function (text) {
    return text.length > 0 ? [...text].join("\u0332") + "\u0332" : "";
  },
  strikethrough: function (text) {
    return text.length > 0 ? [...text].join("\u0336") + "\u0336" : "";
  }
};

// Please run this function.

function cmVerzendLectorrooster() {
  cmVerzendLectorroosterNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - Lectoren"));
}
function cmVerzendLectorroosterNaarLijst(emailListSheet, confirmAddress) {
  var reportWeeks = 52;
  var curDate = crZetOpBeginVanDag(new Date());

  // zoek de eerstvolgende zondag

  // in plaats van eerstvolgende zondag, gebruik de zondag van deze week + 1, dus op maandag van deze week

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crZetOpBeginVanDag();
  var rptWeekEndDate = crBepaalEindeVanWeek(crTelWekenBijDatumOp(rptWeekStartDate, reportWeeks));
  var rptWeekStartNum = crBepaalWeeknummer(rptWeekStartDate);

  // Alles voor de email is nu gereed

  var emailHtmlBody = cmGenereerLectorroosterLijst(rptWeekStartDate, rptWeekEndDate);
  var emailAsBcc = true; // send emails in a loop or one by one

  // Haal addressen op
  var recipientList = cmLeesEmailadressen(emailListSheet);
  var emailConfirmationTo = confirmAddress || "avandervliet@gmail.com";
  var emailConfirmationMsg = "Lectorrooster verzonden\n";
  var emailSubject = 'Lectorrooster vanaf week ' + rptWeekStartNum;
  var emailName = 'Lectorrooster Protestantse Gemeente Didam';
  var emailTo = recipientList.join(",");
  var myself = "avandervliet@gmail.com";
  cmVerzendEmail(recipientList, emailSubject, {
    name: emailName,
    htmlBody: emailHtmlBody,
    mode: emailAsBcc ? "bcc" : "individual",
    to: emailConfirmationTo,
    confirmTo: emailConfirmationTo,
    confirmMessage: emailConfirmationMsg
  });
}
function cmGenereerLectorroosterLijst(rptWeekStartDate, rptWeekEndDate) {
  var rptHeader;
  var {
    koppen: headers,
    datums: rowDates,
    types: types,
    titels: titles,
    voorgangers: ministers,
    bijzonderheden: notes,
    kosters: sextons,
    kleuren: colors,
    collectes: collections,
    koffie: coffeeHosts,
    ontvangst: greeters,
    avondmaal: communions,
    lectoren: readers,
    ambtsdragers: officers,
    klokkenluiders: bellRingers,
    kerktv: churchTv,
    havormen: communionForms,
    zondagnamen: sundayNames,
    collectecategorieen: collectionCategories,
    uitgangscollectes: exitCollections,
    oorspronkelijkeLectoren: originalReaders
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);
  var prtWeekNum = "";
  var fullMsg = "";
  var rptMonth = "";
  var inList = false;
  for (var i in types) {
    var msg = "";
    var cur = "";
    var listTag = "<li>";
    var newMonth = false;
    var monthName = crFormatteerDatum(rowDates[i], crDateFormat.MAAND);
    if (monthName !== rptMonth) {
      if (inList) {
        msg += "</ul>";
      }
      newMonth = true;
      rptMonth = monthName;
      msg += cmMaakHtmlElement("h4", rptMonth);
      msg += "<ul>";
      inList = true;
    }
    msg += listTag + crFormatteerDatum(rowDates[i], crDateFormat.DAG_TIJD_KORT) + "u&emsp;:&nbsp;";
    if (readers[i].length > 0) msg += readers[i].bold();else msg += "geen lector";
    msg += "&emsp;-&nbsp;" + titles[i];
    msg.trim();
    if (fullMsg.length > 0) fullMsg += "\n\n";
    fullMsg += msg;
  }
  if (inList) {
    msg += "</ul>";
    inList = false;
  }
  return fullMsg;
}
