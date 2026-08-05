/**
 * Module: CM_Communicatie.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

var nl = "\n";
var tab = "\t";


function cmVerzendRooster() {
  cmVerzendRoosterNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - Rooster"), 4, 3); // 2 weeks and 3 months
}


function cmVerzendRoosterNaarLijst(emailListSheet = crLeesConfiguratie("Mailinglijstwerkblad - Test"), num_weeks_in_report = 6, num_months_in_report = 6) {

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
  var emailTo_list = crLeesWerkbladInhoud(emailListSheet);

  var emailConfirmationTo = "avandervliet@gmail.com";
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


function cmMaakHtmlElement(tag, str) {
  return "<" + tag + ">" + str + "</" + tag + ">\n";
}


function cmVoegLijstItemToe(pfx, str) {
  if (str)
    return "<li>" + pfx + str;
  else
    return "";
}


function cmMaakHtmlWeekrapport(rptWeekStartDate, rptWeekEndDate) {

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
    uitgangscollectes: a_uitgangscollecte
  } = rsSelecteerGegevens(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  var fullMsg = "";

  for (var i in a_type) {


    var msg = "";
    var cur = "";
    var li_tag = "<li>";

    var rowWeekNum = crBepaalWeeknummer(a_rowDate[i]);

    if (prtWeekNum !== rowWeekNum) {
      msg += cmMaakHtmlElement("h3", "WEEK " + rowWeekNum);
      prtWeekNum = rowWeekNum;
    }

    msg += cmMaakHtmlElement("h4", crFormatteerDatum(a_rowDate[i], "DMT"));

    msg += "<ul>";

    msg += li_tag + a_titel[i].bold();

    if (a_ha[i]) {
      msg += cmVoegLijstItemToe("Viering Heilig Avondmaal: ", a_havorm[i]);
    }

    msg += cmVoegLijstItemToe("Ambtsdragers: ", a_ambtsdragers[i]);
    msg += cmVoegLijstItemToe("Koster: ", a_koster[i]);


    msg += cmVoegLijstItemToe("Lector: ", a_lector[i]);
    msg += cmVoegLijstItemToe("Klokkenluider: ", a_klokkenluider[i]);
    msg += cmVoegLijstItemToe("Koffie: ", a_koffie[i]);
    msg += cmVoegLijstItemToe("Ontvangst: ", a_ontvangst[i]);
    msg += cmVoegLijstItemToe("KerkTV: ", a_kerktv[i]);
    var colmsg = a_collecte[i];
    if (String(a_collectecategorie[i]).localeCompare("Liemers") == true) {
      colmsg = a_collecte[i] + " (" + a_collectecategorie[i] + ")";
    }
    msg += cmVoegLijstItemToe("Collecte: ", colmsg);

    msg += cmVoegLijstItemToe("Uitgangscollecte: ", a_uitgangscollecte[i]);
    msg += cmVoegLijstItemToe("Naam van de zondag: ", a_naamzondag[i]);
    msg += cmVoegLijstItemToe("Kleur: ", a_kleur[i]);
    msg += "</ul>";

    msg.trim();

    if (fullMsg.length > 0)
      fullMsg += "\n\n";

    fullMsg += msg;

  }

  return fullMsg;
}


function cmVerzendTemplate() {
  cmVerzendTemplateNaarLijst(crLeesConfiguratie("Mailinglijstwerkblad - KerkTV"));
}


function cmVerzendTemplateNaarLijst(emailListSheetName = crLeesConfiguratie("Mailinglijstwerkblad - Test")) {
  //function cmVerzendTemplateNaarLijst(emailListSheetName) {
  Logger.log(emailListSheetName);
  var calName = crLeesConfiguratie("Agenda - KerkTV");
  var mededeling = crLeesConfiguratie("Berichttekst - KerkTV");
  var templateDocumentId = crLeesConfiguratie("Template-ID - KerkTV-liturgie");

  Logger.log(templateDocumentId);
  var nowDate = new Date();
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  var nextSundayDate = crBepaalVolgendeZondag(nowDate); // crBepaalVolgendeZondag returns starttime of next Sunday (0:00)
  nextSundayDate.setHours(23);
  nextSundayDate.setMinutes(59);

  var rptHeader = "";
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
  } = rsSelecteerGegevens(nowDate, nextSundayDate);

  if (!a_rowDate.length) {
    throw new Error("Geen dienst gevonden in de geselecteerde periode.");
  }
  var sel_date = 0;

  var startDate = new Date(a_rowDate[sel_date]);
  var lastDate = new Date(a_rowDate[sel_date]);

  var date_str = crFormatteerDatum(startDate, "EEEE d MMMM yyyy");
  var date_time_str = crFormatteerDatum(startDate, "HH:mm");
  var emailSubject = "Liturgie voor " + date_str;

  var templateFile = DriveApp.getFileById(templateDocumentId);
  var instanceDocId = templateFile.makeCopy().getId();
  var templateDoc = DocumentApp.openById(templateDocumentId);
  var instanceDoc = DocumentApp.openById(instanceDocId);
  instanceDoc.setName(emailSubject);


  /// kanaal URL : https://www.youtube.com/user/langenaam/

  ////////////

  startDate.setHours(0);
  startDate.setMinutes(0);
  lastDate.setHours(23);
  lastDate.setMinutes(59);
  var cal = CalendarApp.getCalendarsByName(calName)[0];

  var title = "";
  var desc = "";
  if (cal) {
    var events = cal.getEvents(startDate, lastDate);
    var n_events = events.length;
    title = events[0].getTitle();
    desc = events[0].getDescription();
  }

  var tag_nl = "<br />";
  function cmMaakHtmlElement(tg, str) {
    return "<" + tg + ">" + str + "</" + tg + ">";
  }
  function cmMaakHtmlElementIndienGevuld(tg, pfx, str) {
    if (str)
      return cmMaakHtmlElement(tg, pfx + str);
    else
      return "";
  }
  function cmMaakHtmlLink(link, text) {
    return '<a href="' + link + '">' + text + '</a>';
  }

  function cmMaakWeblink(text) { return cmMaakHtmlLink(text, text); }
  function cmMaakMaillink(text) { return cmMaakHtmlLink("mailto:" + text, text); }

  // =============== ARCHIEF ==================
  var archief = "<h4>Vorige 4 diensten</h4>" + ytMaakUploadLijst(4);

  // var msg =  cmMaakHtmlElement("h4", emailSubject)+
  // "<b>" + date_time_str +  ": " + title + "</b>" + "\n\n" +
  // desc +  "\n\n"+
  // "Uw regisseur vanochtend is: " + a_kerktv[sel_date] ;

  // =============== GEGEVENS ==================
  var gegevens = cmMaakHtmlElement("h4", emailSubject);
  gegevens += "<ul>";
  gegevens += cmMaakHtmlElement("li", title.bold());
  gegevens += cmMaakHtmlElement("li", "Aanvang: " + date_time_str);
  gegevens += cmMaakHtmlElementIndienGevuld("li", "Collecte: ", a_collecte[sel_date]);
  gegevens += cmMaakHtmlElementIndienGevuld("li", "Uw regisseur vanochtend is: ", a_kerktv[sel_date]);
  gegevens += cmMaakHtmlElement("li", "KerkTV pagina : " + cmMaakHtmlLink("https://www.pkn-didam.nl/kerktv", "KLIK HIER"));
  gegevens += "</ul>";
  gegevens += cmMaakHtmlElement("h4", "Orde van dienst");
  // ==== voeg gegevens uit kalender toe
  gegevens += desc.replace(/\n/g, tag_nl);

  var nl = "\n";
  var gegevensText = nl + emailSubject + nl + "------------" + nl;
  gegevensText += title + nl;
  if (mededeling) gegevensText += mededeling + nl;
  gegevensText += " - Aanvang: " + date_time_str + nl;
  gegevensText += " - Collecte: ", a_collecte[sel_date] + nl;
  gegevensText += " - Uw regisseur vanochtend is: " + a_kerktv[sel_date] + nl + nl;
  gegevensText += "Orde van dienst" + nl + "------------" + nl;
  // ==== voeg gegevens uit kalender toe
  gegevensText += nl + desc + nl;

  // =============== CONTACTGEGEVENS ==================
  var contactGegevens = "<h4>Contact</h4>Rechtstreekse uitzending: " + cmMaakWeblink("https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending") + tag_nl;
  contactGegevens += "Kerkdienst gemist: " + cmMaakWeblink("https://www.pkn-didam.nl/kerktv/kerkdienst-gemist") + tag_nl;
  contactGegevens += "Handleiding voor gebruik: " + cmMaakWeblink("https://www.pkn-didam.nl/kerktv/handleiding") + tag_nl;
  contactGegevens += "Vragen en opmerkingen, email naar " + cmMaakMaillink("kerktv@pkn-didam.nl") + tag_nl;

  var body = instanceDoc.getActiveSection();
  body.replaceText("@GEGEVENS@", gegevensText).replaceText("@ARCHIEF@", "").replaceText("@CONTACTGEGEVENS@", "");
  instanceDoc.saveAndClose();

  var url = "https://docs.google.com/document/d/" + templateDoc.getId() + "/export?format=html"
  var param = {
    method: "get",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };

 // Alles voor de email is nu gereed

  var emailHtmlBodyRaw = UrlFetchApp.fetch(url, param).getContentText();
  var emailHtmlBody = emailHtmlBodyRaw.replace("@GEGEVENS@", gegevens).replace("@ARCHIEF@", archief).replace("@CONTACTGEGEVENS@", contactGegevens);

  // var pdf = instanceDoc.getAs(MimeType.PDF).setName(emailSubject + ".pdf");

  var emailAsBcc = false;  // send emails in a loop or one by one

  // Haal addressen op
  var emailTo_list = crLeesWerkbladInhoud(emailListSheetName);

  var emailConfirmationTo = "avandervliet@gmail.com";
  var emailConfirmationMsg = "Liturgie verzonden\n";

  var emailName = 'Liturgiemail Protestantse Gemeente Didam';

  cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc);


/*   // MailApp.sendEmail(myself, emailSubject, emailTekst, {htmlBody: emailHtml, bcc: emailTo, replyTo: myself, attachments: pdf });
  MailApp.sendEmail(myself, emailSubject, emailTekst, { htmlBody: emailHtml, To: myself, bcc: emailTo });
  MailApp.sendEmail("avandervliet@pg-didam.nl", emailSubject + " - controle mail", emailTekst, { htmlBody: controleEmailHtml }); */
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
  var einddatum = crZetTijdOpEindeVanDag(crBepaalVolgendeZondag(begindatum));
  var selectie = rsSelecteerGegevens(begindatum, einddatum);
  var dienstIndex = cmZoekEersteDienstIndex(selectie);
  if (dienstIndex < 0) {
    throw new Error("Geen geschikte kerkdienst gevonden voor de mededelingen.");
  }

  var dienstdatum = new Date(selectie.datums[dienstIndex]);
  var datumtekst = crFormatteerDatum(dienstdatum, "EEEE d MMMM yyyy");
  var onderwerp = "Mededelingen voor " + datumtekst;
  var templateId = crLeesConfiguratie("Template-ID - Mededelingen");
  var document = cmMaakDocumentkopie(templateId, onderwerp);
  var dagBegin = crZetOpBeginVanDag(new Date(dienstdatum));
  var dagEinde = crZetTijdOpEindeVanDag(new Date(dienstdatum));
  var liturgie = cmLeesLiturgieUitAgenda(
    crLeesConfiguratie("Agenda - KerkTV"), dagBegin, dagEinde
  );
  var bewerkUrl = "https://docs.google.com/document/d/" + document.getId() + "/edit?usp=sharing";

  document.getActiveSection()
    .replaceText("@VOORGANGER@", selectie.voorgangers[dienstIndex] || "INVULLEN")
    .replaceText("@ORGANIST@", "Rolf Zandbergen")
    .replaceText("@LECTOR@", selectie.lectoren[dienstIndex] || "INVULLEN")
    .replaceText("@COLLECTE@", selectie.collectes[dienstIndex] || "INVULLEN")
    .replaceText("@DATUM@", datumtekst)
    .replaceText("@BLOEMEN@", "- INVULLEN -")
    .replaceText("@EXTRA_MEDEDELINGEN@", "- Geen -")
    .replaceText("@URL_EDIT@", bewerkUrl)
    .replaceText("@LITURGIE@", liturgie);
  var documentId = document.getId();
  document.saveAndClose();

  var bestandsnaam = crFormatteerDatum(dienstdatum, "sort") +
    " - mededelingen " + datumtekst + ".docx";
  var docx = cmExporteerDocumentNaarDocx(documentId, bestandsnaam);
  var html = cmMaakHtmlWeekrapport(dagBegin, dagEinde);
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
    msg += cmMaakMjHtmlElement("li", crFormatteerDatum(startTime, "DMT") + " " + title);
  }
  msg += "</ul>";
  return msg;
}


function cmFormatteerEersteGebeurtenisVolledig(events) {
  var msg = "<p>";
  //msg += crFormatteerDatum(events[0].getStartTime(), "DMT") + " " + events[0].getTitle().bold() + " " + events[0].getDescription();
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
  var emailHtml = emailHtmlRaw.replace("@KERKDIENSTEN@", msgKerkdiensten).replace("@ACTIVITEITEN@", msgActiviteiten)
    .replace("@BESCHRIJVING@", msgDescActiviteit);
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
    var startTimeKort = crFormatteerDatum(events[i].getStartTime(), "dm");
    var startTimeLang = crFormatteerDatum(events[i].getStartTime(), "DMT");

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

  var txtPeriode = crFormatteerDatum(startDate, "DM") + " tot en met " + crFormatteerDatum(lastDateActiviteiten, "DM") + "(" + numActiviteitWeken + " weken)";

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

  // var emailHtml = emailHtmlRaw.replace("@SAMENVATTING@", msgSamenvatting).replace("@DETAILS@", msgDetails);
  var emailHtml = emailHtmlRaw.replace("@SAMENVATTING@", msgSamenvatting);

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

    msg += crFormatteerDatum(a_rowDate[i], "EEEE d MMM") + ", " + a_titel[i] + "<br />" + nl;

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


function cmVerzendLectorroosterNaarLijst(emailListSheet = crLeesConfiguratie("Mailinglijstwerkblad - Lectoren test")) {

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
  var emailTo_list = crLeesWerkbladInhoud(emailListSheet);

  var emailConfirmationTo = "avandervliet@gmail.com";
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
    var monthName = crFormatteerDatum(a_rowDate[i], "MMMM");

    if (monthName !== rptMonth) {
      if (inList) {
        msg += "</ul>";
      }

      newMonth = true;
      rptMonth = monthName;

      msg += cmMaakHtmlElement("h4", rptMonth);

      msg += "<ul>"; inList = true;
    }

    msg += li_tag + crFormatteerDatum(a_rowDate[i], "EEE d HH:mm") + "u&emsp;:&nbsp;";


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
