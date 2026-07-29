/**
 * Module: CM_Communicatie.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

var nl = "\n";
var tab = "\t";


function cmSendRosterMessage() {

  var klaar = false;

  while (!klaar) {

    const ui = SpreadsheetApp.getUi();
    const antwoord = ui.prompt('Extra mededeling:');

    var msg = antwoord.getResponseText();

    const response = ui.alert(
      msg,
      ui.ButtonSet.YES_NO,
    );

    // Process the user's response.
    if (response === ui.Button.YES) {
      klaar = true;
      Logger.log('The user clicked' + antwoord);
    }

  }

  x = 1;
}


function cmSendRoster() {
  cmRealSendRoster(crGetInstelling("Rooster Mailinglist Sheet"), 4, 3); // 2 weeks and 3 months
}


function cmRealSendRoster(emailListSheet = crGetInstelling("Test Mailinglist Sheet"), num_weeks_in_report = 6, num_months_in_report = 6) {

  //var num_weeks_in_report = 4;
  //var num_months_in_report = 6;

  var rptTitle = "Rooster " + num_months_in_report + " maanden";
  var rptSheetName = "Rooster-" + num_months_in_report + "-maanden";

  var msg = crGetInstelling("Rooster Mededeling");

  var curDate = crSetBeginOfDay(new Date());

  // zoek de eerstvolgende zondag
  // var rptWeekStartDate = crAddWeeksToDate(crGetWeekBeginDate(curDate), 1);

  // in plaats van eerstvolgende zondag, gebruik de zondag van deze week + 1, dus op maandag van deze week
  // var rptWeekStartDate = crAddDaysToDate(crGetWeekBeginDate(curDate), 1);

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crSetBeginOfDay();

  var rptWeekEndDate = crGetWeekEndDate(crAddWeeksToDate(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crGetWeekNum(rptWeekStartDate);
  var rptWeekEndNum = crGetWeekNum(rptWeekEndDate);

  var rptMonthBeginDate = crGetMonthBeginDate(rptWeekStartDate);

  rsMaakRoosterSheet(rptSheetName, rptTitle, rptMonthBeginDate, num_months_in_report);

  var htmlRooster = rsMaakHtmlRooster(rptWeekStartDate, num_months_in_report);
  var htmlWeekRaport = cmCreateHtmlWeekReport(rptWeekStartDate, rptWeekEndDate);

  // var pdf_link = exConvertSheetToPdf(rptSheetName);
  // var xlsx = exConvertSheetToXlsx(rptSheetName);

  // Alles voor de email is nu gereed

  var emailHtmlBody = msg.replace(/\n/g, "<br >") +
    // "<p />Klik voor rooster als PDF: " + cmUrlLink(pdf_link, rptSheetName) + "<p />" +
    "<h4> Weekrooster voor de komende " + num_weeks_in_report + " weken</h4>" +
    htmlWeekRaport +
    "<h4> Maandrooster voor de komende " + num_months_in_report + " maanden</h4>" +
    htmlRooster;


  var emailAsBcc = false;  // send emails in a loop or one by one (mails to Bcc will bounce sending to KPN/Ziggo, incl. hi/planet/xs4all/upc/upcmail)

  // Haal addressen op
  var emailTo_list = crGetSheetContent(emailListSheet);

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


function cmUrlLink(url, tekst) {
  return "<a href=\"" + url + "\">" + tekst + "</a>";
}


function cmHtmlTag(tag, str) {
  return "<" + tag + ">" + str + "</" + tag + ">\n";
}


function cmVoegLijstItemToe(pfx, str) {
  if (str)
    return "<li>" + pfx + str;
  else
    return "";
}


function cmCreateHtmlWeekReport(rptWeekStartDate, rptWeekEndDate) {

  var rptHeader;
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelectData(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  var fullMsg = "";

  for (var i in a_type) {



    var msg = "";
    var cur = "";
    var li_tag = "<li>";

    var rowWeekNum = crGetWeekNum(a_rowDate[i]);

    if (prtWeekNum !== rowWeekNum) {
      msg += cmHtmlTag("h3", "WEEK " + rowWeekNum);
      prtWeekNum = rowWeekNum;
    }

    msg += cmHtmlTag("h4", crFormatDateDutch(a_rowDate[i], "DMT"));

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


function cmSendListOfServices() {
  var n = 4;
  var email = "<h4>Vorige " + n + " diensten</h4>" + ytYouTubeCreateUploadList(n);
  MailApp.sendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", email);
}


function cmSendTemplate() {
  cmRealSendTemplate(crGetInstelling("KerkTV Mailinglist Sheet"));
}


function cmRealSendTemplate(emailListSheetName = crGetInstelling("Test Mailinglist Sheet")) {
  //function cmRealSendTemplate(emailListSheetName) {
  Logger.log(emailListSheetName);
  var calName = crGetInstelling("Kalender KerkTV");
  var mededeling = crGetInstelling("KerkTV Mededeling ");
  var templateMailName = crGetInstelling("KerkTV MailTemplate Doc");

  Logger.log(templateMailName);
  var nowDate = new Date();
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  var nextSundayDate = crGetNextSundayDate(nowDate); // crGetNextSundayDate returns starttime of next Sunday (0:00) 
  nextSundayDate.setHours(23);
  nextSundayDate.setMinutes(59);

  var rptHeader = "";
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider, a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelectData(nowDate, nextSundayDate);

  var sel_date = 0;
  for (i in a_type) {
    switch (a_type[i]) {
      case "B":
      case "Z":
      case "Z HA": break;
      default: continue; break;
    }
    sel_date = i;
    break;
  }

  var startDate = new Date(a_rowDate[sel_date]);
  var lastDate = new Date(a_rowDate[sel_date]);

  var date_str = crFormatDateDutch(startDate, "EEEE d MMMM yyyy");
  var date_time_str = crFormatDateDutch(startDate, "HH:mm");
  var emailSubject = "Liturgie voor " + date_str;

  var templateId = DriveApp.getFilesByName(templateMailName);

  if (templateId.hasNext())
    var file = templateId.next();

  var templateId = file.getId();
  var instanceDocId = file.makeCopy().getId();
  var templateDoc = DocumentApp.openById(templateId);
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
  function cmTag(tg, str) {
    return "<" + tg + ">" + str + "</" + tg + ">";
  }
  function cmIfTag(tg, pfx, str) {
    if (str)
      return cmTag(tg, pfx + str);
    else
      return "";
  }
  function cmTagLink(link, text) {
    return '<a href="' + link + '">' + text + '</a>';
  }

  function cmRefUrl(text) { return cmTagLink(text, text); }
  function cmMailUrl(text) { return cmTagLink("mailto:" + text, text); }

  // =============== ARCHIEF ==================
  var archief = "<h4>Vorige 4 diensten</h4>" + ytYouTubeCreateUploadList(4);

  // var msg =  cmTag("h4", emailSubject)+ 
  // "<b>" + date_time_str +  ": " + title + "</b>" + "\n\n" + 
  // desc +  "\n\n"+ 
  // "Uw regisseur vanochtend is: " + a_kerktv[sel_date] ;

  // =============== GEGEVENS ==================
  var gegevens = cmTag("h4", emailSubject);
  gegevens += "<ul>";
  gegevens += cmTag("li", title.bold());
  gegevens += cmTag("li", "Aanvang: " + date_time_str);
  gegevens += cmIfTag("li", "Collecte: ", a_collecte[sel_date]);
  gegevens += cmIfTag("li", "Uw regisseur vanochtend is: ", a_kerktv[sel_date]);
  gegevens += cmTag("li", "KerkTV pagina : " + cmTagLink("https://www.pkn-didam.nl/kerktv", "KLIK HIER"));
  gegevens += "</ul>";
  gegevens += cmTag("h4", "Orde van dienst");
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
  var contactGegevens = "<h4>Contact</h4>Rechtstreekse uitzending: " + cmRefUrl("https://www.pkn-didam.nl/kerktv/rechtstreekse-uitzending") + tag_nl;
  contactGegevens += "Kerkdienst gemist: " + cmRefUrl("https://www.pkn-didam.nl/kerktv/kerkdienst-gemist") + tag_nl;
  contactGegevens += "Handleiding voor gebruik: " + cmRefUrl("https://www.pkn-didam.nl/kerktv/handleiding") + tag_nl;
  contactGegevens += "Vragen en opmerkingen, email naar " + cmMailUrl("kerktv@pkn-didam.nl") + tag_nl;

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
  var emailTo_list = crGetSheetContent(emailListSheetName);

  var emailConfirmationTo = "avandervliet@gmail.com";
  var emailConfirmationMsg = "Liturgie verzonden\n";

  var emailName = 'Liturgiemail Protestantse Gemeente Didam';

  cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc);


/*   // MailApp.sendEmail(myself, emailSubject, emailTekst, {htmlBody: emailHtml, bcc: emailTo, replyTo: myself, attachments: pdf });
  MailApp.sendEmail(myself, emailSubject, emailTekst, { htmlBody: emailHtml, To: myself, bcc: emailTo });
  MailApp.sendEmail("avandervliet@pg-didam.nl", emailSubject + " - controle mail", emailTekst, { htmlBody: controleEmailHtml }); */
}


function cmZendMededelingen() {
  cmRealZendMededelingen(crGetInstelling("Mailinglist Mededelingen"), false);
}


function cmZendMededelingenVolgendeWeek() {
  cmRealZendMededelingen(crGetInstelling("Mailinglist Mededelingen"), true);
}


function cmRealZendMededelingen(emailTo = null, VolgendeWeek = false) {
  if (emailTo == null) {
    return;
  }

  Logger.log(emailTo + "volgende week = " + VolgendeWeek);

  var calName = crGetInstelling("Kalender KerkTV");
  var mededeling = crGetInstelling("KerkTV Mededeling ");
  var templateMailName = crGetInstelling("Mededelingen Template");

  var var_voorganger = "INVULLEN";
  var var_organist = "Rolf Zandbergen";
  var var_lector = "INVULLEN";
  var var_collecte = "INVULLEN";
  var var_datum = "";
  var var_bloemen = "- INVULLEN -";
  var var_extra_mededelingen = "- Geen - ";

  Logger.log('Template name: ' + templateMailName);
  var nowDate = new Date();

  if (VolgendeWeek)
    nowDate = crAddDaysToDate(nowDate, 7);
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  var nextSundayDate = crGetNextSundayDate(nowDate); // crGetNextSundayDate returns starttime of next Sunday (0:00) 
  nextSundayDate.setHours(23);
  nextSundayDate.setMinutes(59);

  Logger.log('NowDate: ' + nowDate + '\n' + 'NextSunday: '+nextSundayDate);


  var rptHeader = "";

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelectData(nowDate, nextSundayDate);

  var sel_date = 0;
  for (i in a_type) {
    switch (a_type[i]) {
      case "B":
      case "Z":
      case "AV":
      case "Z HA": break;
      default: continue; break;
    }
    sel_date = i;
    break;
  }

  /* sel_date++; add for next */

  var startDate = new Date(a_rowDate[sel_date]);
  var lastDate = new Date(a_rowDate[sel_date]);

  Logger.log('startDate: ' + startDate + '\n' + 'lastDate: '+lastDate);

  var var_datum = crFormatDateDutch(startDate, "EEEE d MMMM yyyy");
  var date_time_str = crFormatDateDutch(startDate, "HH:mm");
  var emailSubject = "Mededelingen voor " + var_datum;
  var sort_date = crFormatDateDutch(startDate, "sort");

  var templateId = DriveApp.getFilesByName(templateMailName);

  if (templateId.hasNext())
    var file = templateId.next();

  var templateId = file.getId();
  var instanceDocId = file.makeCopy().getId();
  var templateDoc = DocumentApp.openById(templateId);
  var instanceDoc = DocumentApp.openById(instanceDocId);
  instanceDoc.setName(emailSubject);



  startDate.setHours(0);
  startDate.setMinutes(0);
  lastDate.setHours(23);
  lastDate.setMinutes(59);

  Logger.log('startDate: ' + startDate + '\n' + 'lastDate: '+lastDate + '\n' + 'Titel: ' + emailSubject);

  var cal = CalendarApp.getCalendarsByName(calName)[0];

  var title = "";
  var liturgie = "";
  if (cal) {
    var events = cal.getEvents(startDate, lastDate);
    var n_events = events.length;
    title = events[0].getTitle();
    desc = events[0].getDescription();
  }

  var liturgie = desc.replace(/<br>/g, "\n").replace(/<b>/g, "").replace(/<\/b>/g, "");

  var_collecte = a_collecte[sel_date];
  var_voorganger = a_voorganger[sel_date];
  var_lector = a_lector[sel_date];


  var emailTekst = "Zie HTML gedeelte";

  var myself = "a.van.der.vliet@gmail.com";

  var body = instanceDoc.getActiveSection();

  var url_edit = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/edit?usp=sharing";
  // var url = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/export?format=html";


  body.replaceText("@VOORGANGER@", var_voorganger)
    .replaceText("@ORGANIST@", var_organist)
    .replaceText("@LECTOR@", var_lector)
    .replaceText("@COLLECTE@", var_collecte)
    .replaceText("@DATUM@", var_datum)
    .replaceText("@BLOEMEN@", var_bloemen)
    .replaceText("@EXTRA_MEDEDELINGEN@", var_extra_mededelingen)
    .replaceText("@URL_EDIT@", url_edit)
    .replaceText("@LITURGIE@", liturgie);

  instanceDoc.saveAndClose();

  var url_docx = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/export?format=docx";

  var docx = UrlFetchApp.fetch(url_docx, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  }).getBlob();

  docx.setName(sort_date + " - " + "mededelingen " + var_datum + ".docx");

  /* var emailHtml = cmGenRosterMsg(); */
  var emailHtml = cmCreateHtmlWeekReport(startDate, lastDate);
  MailApp.sendEmail(emailTo, emailSubject, emailTekst, { htmlBody: emailHtml, To: emailTo, attachments: docx });
}


function cmGenRosterMsg() {
  var curDate = new Date();
  var rptWeekStartDate = crAddWeeksToDate(crGetWeekBeginDate(curDate), 1);
  var rptWeekEndDate = crAddDaysToDate(rptWeekStartDate, 1);
  // ambtsdragers

  var msg = cmCreateHtmlWeekReport(rptWeekStartDate, rptWeekEndDate);

  return msg;
}


// https://stackoverflow.com/questions/15636543/convert-google-doc-to-docx-using-google-script
// https://gist.github.com/tanaikech/8d639542577a594f6104b7f6fb753064


function cmNieuwTestZendMededelingen() {
  cmNieuwRealZendMededelingen(crGetInstelling("Test Mailinglist Mededelingen"));
}


function cmNieuwZendMededelingen() {
  cmNieuwRealZendMededelingen(crGetInstelling("Mailinglist Mededelingen"));
}


function cmNieuwRealZendMededelingen(emailTo) {
  if (emailTo == null) {
    return;
  }
  Logger.log(emailTo);
  var calName = crGetInstelling("Kalender KerkTV");
  var mededeling = crGetInstelling("KerkTV Mededeling ");
  var templateMailName = crGetInstelling("Mededelingen Template");

  var var_voorganger = "INVULLEN";
  var var_organist = "Rolf Zandbergen";
  var var_lector = "INVULLEN";
  var var_collecte = "INVULLEN";
  var var_datum = "";
  var var_bloemen = "- INVULLEN -";
  var var_extra_mededelingen = "- Geen - ";

  Logger.log(templateMailName);
  var nowDate = new Date();
  // nowDate = crAddDaysToDate(nowDate, 1);    // HACK send next week
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  var nextSundayDate = crGetNextSundayDate(nowDate); // crGetNextSundayDate returns starttime of next Sunday (0:00) 
  nextSundayDate.setHours(23);
  nextSundayDate.setMinutes(59);

  var rptHeader = "";

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte] = rsSelectData(nowDate, nextSundayDate);

  var startDate = new Date(a_rowDate[1]);
  var lastDate = new Date(a_rowDate[a_rowDate.length-1]);

  var var_datum = crFormatDateDutch(startDate, "EEEE d MMMM yyyy");
  var date_time_str = crFormatDateDutch(startDate, "HH:mm");
  var emailSubject = "Mededelingen voor " + var_datum;
  var sort_date = crFormatDateDutch(startDate, "sort");

  var templateId = DriveApp.getFilesByName(templateMailName);

  if (templateId.hasNext())
    var file = templateId.next();

  var templateId = file.getId();
  var instanceDocId = file.makeCopy().getId();
  var templateDoc = DocumentApp.openById(templateId);
  var instanceDoc = DocumentApp.openById(instanceDocId);
  instanceDoc.setName(emailSubject);



  startDate.setHours(0);
  startDate.setMinutes(0);
  lastDate.setHours(23);
  lastDate.setMinutes(59);
  var cal = CalendarApp.getCalendarsByName(calName)[0];

  var title = "";
  var liturgie = "";
  if (cal) {
    var events = cal.getEvents(startDate, lastDate);
    var n_events = events.length;
    title = events[0].getTitle();
    desc = events[0].getDescription();
  }

  var liturgie = desc.replace(/<br>/g, "\n").replace(/<b>/g, "").replace(/<\/b>/g, "");
var sel_date = 1;
  var_collecte = a_collecte[sel_date];
  var_voorganger = a_voorganger[sel_date];
  var_lector = a_lector[sel_date];


  var emailTekst = "Zie HTML gedeelte";

  var myself = "avandervliet@gmail.com";

  var body = instanceDoc.getActiveSection();

  var url_edit = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/edit?usp=sharing";
  // var url = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/export?format=html";


  body.replaceText("@VOORGANGER@", var_voorganger)
    .replaceText("@ORGANIST@", var_organist)
    .replaceText("@LECTOR@", var_lector)
    .replaceText("@COLLECTE@", var_collecte)
    .replaceText("@DATUM@", var_datum)
    .replaceText("@BLOEMEN@", var_bloemen)
    .replaceText("@EXTRA_MEDEDELINGEN@", var_extra_mededelingen)
    .replaceText("@URL_EDIT@", url_edit)
    .replaceText("@LITURGIE@", liturgie);

  instanceDoc.saveAndClose();

  var url_docx = "https://docs.google.com/document/d/" + instanceDoc.getId() + "/export?format=docx";

  var docx = UrlFetchApp.fetch(url_docx, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  }).getBlob();

  docx.setName(sort_date + " - " + "mededelingen " + var_datum + ".docx");

  /* var emailHtml = cmGenRosterMsg(); */
  var emailHtml = cmCreateHtmlWeekReport(startDate, lastDate);
  MailApp.sendEmail(emailTo, emailSubject, emailTekst, { htmlBody: emailHtml, To: emailTo, attachments: docx });
}


var tag_nl = "<br />";


function cmSendMJMededelingen() {
    cmSendMJMededelingenToEmail(crGetInstelling("MJ Maillist"));
}


function cmMjTag(tg, str) {
  return "<" + tg + ">" + str + "</" + tg + ">";
}


function cmGetEventsFromCalendar(calName, startDate, endDate) {
  var cal = CalendarApp.getCalendarsByName(calName);
  if (cal) {
    return cal[0].getEvents(startDate, endDate);
  }
  else
    return null;
  // title = events[0].getTitle();
  // desc = events[0].getDescription();
}


function cmFormatEvents(events) {
  var msg = "<ul>";
  for (var i in events) {
    var title = events[i].getTitle();
    var desc = events[i].getDescription();
    var startTime = events[i].getStartTime();
    msg += cmMjTag("li", crFormatDateDutch(startTime, "DMT") + " " + title);
  }
  msg += "</ul>";
  return msg;
}


function cmFullFormatFirstEvent(events) {
  var msg = "<p>";
  //msg += crFormatDateDutch(events[0].getStartTime(), "DMT") + " " + events[0].getTitle().bold() + " " + events[0].getDescription();
  msg += "</p>";
  return msg;
}


function cmSendMJMededelingenToEmail(emailTo) {

  var calKerkdiensten = crGetInstelling("Kalender KerkTV");
  var calActiviteiten = crGetInstelling("Kalender Activiteiten");
  var templateMailName = crGetInstelling("MJ Mededeling Template Doc");

  Logger.log(templateMailName);
  Logger.log(emailTo);
  var numKerkdienstWeken = 2;
  var numActiviteitWeken = 2;

  var startDate = crAddWeeksToDate(crGetNextSundayDate(), 1); // crGetNextSundayDate returns starttime of next Sunday (0:00) 
  var startWeekNum = crGetWeekNum(startDate);

  var lastDateKerkdiensten = crAddWeeksToDate(startDate, numKerkdienstWeken);
  var lastDateActiviteiten = crAddWeeksToDate(startDate, numActiviteitWeken);

  var eventsKerkdiensten = cmGetEventsFromCalendar(calKerkdiensten, startDate, lastDateKerkdiensten);
  var eventsActiviteiten = cmGetEventsFromCalendar(calActiviteiten, startDate, lastDateActiviteiten);


  var msgKerkdiensten = cmFormatEvents(eventsKerkdiensten);
  var msgActiviteiten = cmFormatEvents(eventsActiviteiten);
  var msgDescActiviteit = "";
  if (eventsActiviteiten[0])
    msgDescActiviteit = cmFullFormatFirstEvent(eventsActiviteiten);

  var emailSubject = "Kerkberichten Montferland Journaal - Protestantse Gemeente - week " + startWeekNum;
  var templateId = DriveApp.getFilesByName(templateMailName);

  if (templateId.hasNext())
    var file = templateId.next();

  var templateId = file.getId();
  var templateDoc = DocumentApp.openById(templateId);

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
  cmVerzendLiemersActiviteitenToEmail(crGetInstelling("Liemers Activiteiten Maillist"));
}


function cmLaTag(tg, str) {
  return "<" + tg + ">" + str + "</" + tg + ">";
}


function cmLeesKalender(calName, startDate, endDate) {
  var cal = CalendarApp.getCalendarsByName(calName);
  if (cal) {
    return cal[0].getEvents(startDate, endDate);
  }
  else
    return null;
}


function cmFormatLiemersEvents(events) {
  var msgSamenvatting = cmLaTag("h3", "Samenvatting");
  var msgDetails = cmLaTag("h3", "Details");

  msgSamenvatting += "<ul>";
  // msgDetails += "<ul>";

  for (var i in events) {
    var startTimeKort = crFormatDateDutch(events[i].getStartTime(), "dm");
    var startTimeLang = crFormatDateDutch(events[i].getStartTime(), "DMT");

    var title = startTimeKort + ": " + cmLaTag("b", events[i].getTitle());
    msgSamenvatting += cmLaTag("li", startTimeLang + ":\t" + cmLaTag("b", events[i].getTitle()));

    msgDetails += cmLaTag("h4", startTimeLang + ": " + events[i].getTitle());
    msgDetails += cmLaTag("li", events[i].getDescription());
  }

  Logger.log("nr of items: "+i+ " total length:"+ msgSamenvatting.length)
  msgSamenvatting += "</ul>";
  // msgDetails += "</ul>";

  return [msgSamenvatting, msgDetails];
}


function cmVerzendLiemersActiviteitenToEmail(emailTo) {

  var calActiviteiten = crGetInstelling("Kalender Liemers Activiteiten");
  var templateMailName = crGetInstelling("Liemers Activiteiten Template Doc");

  Logger.log(templateMailName);
  Logger.log(emailTo);

  var numActiviteitWeken = 12;

  // var startDate = crAddWeeksToDate(crGetNextSundayDate(), 1); // crGetNextSundayDate returns starttime of next Sunday (0:00) 
  var startDate = new Date();

  // var startWeekNum = crGetWeekNum(startDate);


  var lastDateActiviteiten = crAddWeeksToDate(startDate, numActiviteitWeken);


  var eventsActiviteiten = cmLeesKalender(calActiviteiten, startDate, lastDateActiviteiten);

  var txtPeriode = crFormatDateDutch(startDate, "DM") + " tot en met " + crFormatDateDutch(lastDateActiviteiten, "DM") + "(" + numActiviteitWeken + " weken)";

  var msg_array = cmFormatLiemersEvents(eventsActiviteiten);
  var msgSamenvatting = cmLaTag("h2", "Activiteiten in de Liemers van " + txtPeriode) + msg_array[0];
  var msgDetails = msg_array[1];



  var emailSubject = "Activiteiten in de Protestantse Gemeenten van " + txtPeriode;
  var templateId = DriveApp.getFilesByName(templateMailName);

  if (templateId.hasNext())
    var file = templateId.next();

  var templateId = file.getId();
  var templateDoc = DocumentApp.openById(templateId);

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


function cmSendLijstKerkdiensten(emailTo = crGetInstelling("Mailinglist lijst kerkdiensten")) {


  var num_weeks_in_report = 12;
  var num_months_in_report = 6;
  var curDate = new Date();

  var rptWeekStartDate = crAddWeeksToDate(crGetWeekBeginDate(curDate), 1);
  var rptWeekEndDate = crGetWeekEndDate(crAddWeeksToDate(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crGetWeekNum(rptWeekStartDate);
  var rptWeekEndNum = crGetWeekNum(rptWeekEndDate);

  var msg = "";

  var emailBody = msg.replace(/\n/g, "<br >") + "<br />-------------------<br />" + cmCreateHtmlListReport(rptWeekStartDate, rptWeekEndDate);

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


function cmCreateHtmlListReport(rptWeekStartDate, rptWeekEndDate) {

  var hdr = "Dienstrooster voor week " + rptWeekStartDate + " t/m " + rptWeekEndDate;

  var rptHeader;
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider, a_kerktv] = rsSelectData(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  function cmHtmlTag(tag, str) {
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

    msg += crFormatDateDutch(a_rowDate[i], "EEEE d MMM") + ", " + a_titel[i] + "<br />" + nl;

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
            if (new RegExp(`[${r}]`).test(e))
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


function cmVerzendLectorBericht() {

  var klaar = false;

  while (!klaar) {

    const ui = SpreadsheetApp.getUi();
    const antwoord = ui.prompt('Extra mededeling:');

    var msg = antwoord.getResponseText();

    const response = ui.alert(
      msg,
      ui.ButtonSet.YES_NO,
    );

    // Process the user's response.
    if (response === ui.Button.YES) {
      klaar = true;
      Logger.log('The user clicked' + antwoord);
    }

  }

  x = 1;
}


function cmVerzendLectorRooster() {
  cmRealVerzendLectorRooster(crGetInstelling("Lector Mailinglist Sheet"));
}


function cmRealVerzendLectorRooster(emailListSheet = crGetInstelling("Lector TestMailinglist Sheet")) {

  var num_weeks_in_report = 52;

  var curDate = crSetBeginOfDay(new Date());

  // zoek de eerstvolgende zondag
  // var rptWeekStartDate = crAddWeeksToDate(crGetWeekBeginDate(curDate), 1);

  // in plaats van eerstvolgende zondag, gebruik de zondag van deze week + 1, dus op maandag van deze week
  // var rptWeekStartDate = crAddDaysToDate(crGetWeekBeginDate(curDate), 1);

  // zet rooster begin op vandaag.
  var rptWeekStartDate = crSetBeginOfDay();

  var rptWeekEndDate = crGetWeekEndDate(crAddWeeksToDate(rptWeekStartDate, num_weeks_in_report));
  var rptWeekStartNum = crGetWeekNum(rptWeekStartDate);

  // Alles voor de email is nu gereed



  /* var rptSheetName = "Lectorrooster"; var rptTitle = "Lectorrooster";

  cmMaakLectorRooster(rptWeekStartDate, rptWeekEndDate, rptSheetName, rptTitle);

  var pdf = exConvertSheetToPdf(rptSheetName);
  var xlsx = exConvertSheetToXlsx(rptSheetName);

  var xlsx_file = UrlFetchApp.fetch(xlsx, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  }).getBlob();

  xlsx_file.setName(rptSheetName + ".xlsx"); */




  var emailHtmlBody = cmGenereerLectorRoosterList(rptWeekStartDate, rptWeekEndDate);

  var emailAsBcc = true;  // send emails in a loop or one by one

  // Haal addressen op
  var emailTo_list = crGetSheetContent(emailListSheet);

  var emailConfirmationTo = "avandervliet@gmail.com";
  var emailConfirmationMsg = "Lectorrooster verzonden\n";

  var emailSubject = 'Lectorrooster vanaf week ' + rptWeekStartNum;
  var emailName = 'Lectorrooster Protestantse Gemeente Didam';

  var emailTo = emailTo_list.join(",");
  var myself = "avandervliet@gmail.com";

  // MailApp.sendEmail(myself, emailSubject, "See HTML part", { htmlBody: emailHtmlBody, bcc: emailTo, replyTo: myself, attachments: xlsx_file });

  cmVerzendEmail(emailTo_list, emailSubject, emailName, emailHtmlBody, emailConfirmationTo, emailConfirmationMsg, emailAsBcc);
}


function cmGenereerLectorRoosterList(rptWeekStartDate, rptWeekEndDate) {

  var rptHeader;
  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg] = rsSelectData(rptWeekStartDate, rptWeekEndDate);

  var prtWeekNum = "";

  var fullMsg = "";

  var rptMonth = "";

  var inList = false;

  for (var i in a_type) {

    var msg = "";
    var cur = "";
    var li_tag = "<li>";

    var newMonth = false;
    var monthName = crFormatDateDutch(a_rowDate[i], "MMMM");

    if (monthName !== rptMonth) {
      if (inList) {
        msg += "</ul>";
      }

      newMonth = true;
      rptMonth = monthName;

      msg += cmHtmlTag("h4", rptMonth);

      msg += "<ul>"; inList = true;
    }

    msg += li_tag + crFormatDateDutchNieuw(a_rowDate[i], "EEE d HH:mm") + "u&emsp;:&nbsp;";


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


function cmMaakLectorRooster(rptWeekStartDate, rptWeekEndDate, rptSheetName = "Lectorrooster", rptTitle = "Lectorrooster") {

  if (!rptSheetName || !rptTitle || !rptWeekStartDate || !rptWeekEndDate)
    return;

  var sizeNameCol = 105;
  var sizeNameWideCol = 130;
  var sizeSpecCol = 125;
  var sizeOfferCol = 180;

  var hdrRow = ["Tijd", "Voorganger", "Bijzonderheden", "Lector"];
  var hdrRowSize = [80, sizeSpecCol, sizeSpecCol, sizeNameCol, sizeNameCol];
  var rptNumCols = hdrRow.length;

  var fg_title = "black"; var bg_title = "white";

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var report_sheet = crCreateOrClearSheet(rptSheetName);

  function cmGetRangeLastRow() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 1, 1, rptNumCols);
  }

  function cmGetRangeNamesRow() {
    var l = report_sheet.getLastRow();
    if (l == 0) l += 1;
    return report_sheet.getRange(l, 5, 1, rptNumCols);
  }

  function cmSetLastRow(fgColor, bgColor, fontSize) {
    var lrow = cmGetRangeLastRow();
    lrow.setBackground(bgColor);
    lrow.setFontSize(fontSize);
    lrow.setFontColor(fgColor);
    lrow.setFontWeight('bold');
    lrow.setVerticalAlignment("top");
    lrow.setWrap(true);
    return lrow;
  }

  var rptHeader = "";

  var [a_headers, a_rowDate, a_type, a_titel, a_voorganger, a_bijz, a_koster, a_kleur,
    a_collecte, a_koffie, a_ontvangst, a_ha, a_lector, a_ambtsdragers, a_klokkenluider,
    a_kerktv, a_havorm, a_naamzondag, a_collectecategorie, a_uitgangscollecte, a_lectorOrg] = rsSelectData(rptWeekStartDate, rptWeekEndDate);

  var num_row = 1;
  var start_col = 29;
  var num_col1 = 5;
  var col2_offset = 2;
  var num_col2 = 4;

  var bgColor = BG_COL1;

  var nowDate = new Date();
  report_sheet.appendRow([rptTitle]);
  var lrow = cmSetLastRow(fg_title, bg_title, 24);
  lrow.setVerticalAlignment("middle");
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");
  report_sheet.setRowHeight(1, 60);

  report_sheet.appendRow(["Afgedrukt: " + crFormatDateDutch(nowDate, "DMT")])
  lrow = cmSetLastRow(fg_title, bg_title, 9);
  lrow.mergeAcross();
  lrow.setHorizontalAlignment("center");        // gecentreerd

  var rptMonth = "";

  var altColor = BG_COL1;

  var nl = "\n";

  for (var i in a_type) {
    var t = a_type[i];

    if (altColor == BG_COL1)
      altColor = BG_COL2;
    else
      altColor = BG_COL1;

    bgColor = altColor;

    var monthName = crFormatDateDutch(a_rowDate[i], "MMMM");
    if (monthName !== rptMonth) {


      report_sheet.appendRow([monthName]);
      rptMonth = monthName;
      lrow = cmSetLastRow(fg_title, bg_title, 18);    // Maand in 18 punt
      lrow.mergeAcross();
      lrow.setHorizontalAlignment("center");        // gecentreerd
      lrow.setVerticalAlignment("middle");        // gecentreerd

      report_sheet.setRowHeight(report_sheet.getLastRow(), 60);

      report_sheet.appendRow(hdrRow);
      lrow = cmSetLastRow(fg_title, bg_title, 10);


      lrow = cmGetRangeNamesRow(); // Center name cells
      lrow.setHorizontalAlignment("center");

    }



    switch (t) {
      case "M": bgColor = 'LemonChiffon'; break;
      case "B HA": bgColor = 'AliceBlue'; break;
      case "Z HA": bgColor = 'AliceBlue'; break;
      case "AV": bgColor = 'MistyRose'; break;
    }


    var vieringHA = "";

    if (a_ha[i] != "") {
      bgColor = BG_HA;
    }

    var cur_lector = "";

    if (a_lector[i].localeCompare(a_lectorOrg[i])) {
      cur_lector += conv.strikethrough(a_lectorOrg[i]);
      cur_lector += " - ";
    }

    cur_lector += a_lector[i];



    var rowArray = [
      crFormatDateDutch(a_rowDate[i], "EEE d MMMM") + nl
      + crFormatDateDutch(a_rowDate[i], "HH:mm")
      // + nl + 'week ' + crGetWeekNum(a_rowDate[i]).toString()           // week aanduiding
      ,
      // a_titel[i] + nl + 
      // 'Voorganger: ' + 
      a_voorganger[i]
      // + nl + crIfAddStr('Koster: ', a_koster[i]) 
      // + crIfAddStr(', Kerktv: ', a_kerktv[i])
      // + nl + 'Kleur: ' + a_kleur[i]                                // kleur aanduiding
      , a_bijz[i].replace(/,\s*/g, nl)
      , cur_lector
    ];

    var bgLitColor = "white";
    switch (a_kleur[i]) {
      case "wit": bgLitColor = "white"; break;
      case "roze": bgLitColor = "pink"; break;
      case "paars": bgLitColor = "plum"; break;
      case "groen": bgLitColor = "lightgreen"; break;
      case "rood": bgLitColor = "red"; break;

    }

    report_sheet.appendRow(rowArray);

    var lrow = cmGetRangeLastRow();
    lrow.setBackground(bgColor);
    lrow.setVerticalAlignment("middle"); // data row centered vertically
    lrow.setWrap(true);

    var datumCell = lrow.getCell(1, 1);
    datumCell.setBackground(bgLitColor);



    var n = lrow.getNumColumns();

    for (var i = 5; i <= n; i++) {
      var nameCell = lrow.getCell(1, i);
      nameCell.setHorizontalAlignment("center");

      nameCell.setBorder(true, null, true, null, true, true);


      var cellContent = nameCell.getValues().toString();
      var bgCellColor = "white";
      if (cellContent.includes("Blom")) bgCellColor = "Ivory";
      if (cellContent.includes("Blij")) bgCellColor = "Lavender";
      if (cellContent.includes("Boelee")) bgCellColor = "DarkSalmon";
      if (cellContent.includes("Steenblik")) bgCellColor = "MistyRose";
      if (cellContent.includes("Ketterink")) bgCellColor = "lightblue";
      if (cellContent.includes("Kroon")) bgCellColor = "lightblue";
      if (cellContent.includes("Vliet")) bgCellColor = "gold";
      if (cellContent.includes("Luitwieler")) bgCellColor = "cyan";
      if (cellContent.includes("Geven")) bgCellColor = "lightgreen";
      nameCell.setBackground(bgCellColor);
    }

  }
  report_sheet.setColumnWidth(1, 50);
  var cell = report_sheet.getRange("A:A");
  cell.setHorizontalAlignment("center");


  // Conditional formatting

  for (i = 0; i < hdrRowSize.length; i++) {
    var col = i + 1;
    var w = hdrRowSize[i];
    //report_sheet.setColumnWidth(col, w);
    report_sheet.setColumnWidth(i + 1, hdrRowSize[i]);
  }

  var numRows = report_sheet.getLastRow();
  var maxRows = report_sheet.getMaxRows();
  if (maxRows > numRows)
    report_sheet.deleteRows(numRows + 1, maxRows - numRows);
  var numRows = report_sheet.getLastRow();
  var numCols = report_sheet.getLastColumn();
  var maxCols = report_sheet.getMaxColumns();
  if (maxCols > numCols)
    report_sheet.deleteColumns(numCols + 1, maxCols - numCols);

  // Conditional formatting

  return report_sheet;
}
