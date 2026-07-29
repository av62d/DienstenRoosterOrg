/**
 * Module: MN_Menu.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

// Google Apps Script vereist exact de naam onOpen voor deze eenvoudige trigger.
function onOpen(e) {
  return mnOnOpen(e);
}


function mnOnOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    { name: "Events van spreadsheet naar kalender", functionName: "kaEventsToCalendar" },

    { name: 'TEST Verzend rooster naar TestMaillijst', functionName: 'tsTestSendRoster' },
    { name: 'Verzend rooster naar Maillijst', functionName: 'cmSendRoster' },

    { name: 'Zet achtergrondkleuren', functionName: 'opSetBackgroundColors' },

    { name: 'Verzend KerkTV Liturgie van template', functionName: 'cmSendTemplate' },

    { name: 'TEST Verzend KerkTV Liturgie van template', functionName: 'tsTestSendTemplate' },

    // { name: 'Mail lijst met laatste videos', functionName: 'ytSendLastVideos' },


    { name: 'TEST Verzend MJ Mededelingen', functionName: 'tsTestSendMJMededelingen' },
    { name: 'Verzend MJ Mededelingen', functionName: 'cmSendMJMededelingen' },

    // { name: 'TEST Verzend Kerk Mededelingen', functionName: 'tsTestZendMededelingen' },
    { name: 'Verzend Kerk Mededelingen', functionName: 'cmZendMededelingen' },
    { name: 'Verzend Kerk Mededelingen (volgende week)', functionName: 'cmZendMededelingenVolgendeWeek' },

    { name: 'Verzend lijst met kerkdiensten (YouTube,kerkdienstgemist.nl)', functionName: 'cmSendLijstKerkdiensten' },

    { name: 'Verwijder alle roosters', functionName: 'rsDeleteAllRoosters' },

    { name: 'Genereer half jaar rooster vanaf januari', functionName: 'rsMaakHalfJaarRooster1' },

    { name: 'Genereer half jaar rooster vanaf juli', functionName: 'rsMaakHalfJaarRooster2' },


    { name: 'Verzend jaar rooster', functionName: 'rsVerzendJaarRooster' },
    { name: 'Genereer jaar rooster Xlsx', functionName: 'exMaakJaarRoosterXlsx' },
    { name: 'Verzend jaar rooster Xlsx', functionName: 'exVerzendJaarRoosterXlsx' },


    { name: 'TEST Verzend Liemers Activiteiten', functionName: 'tsTestVerzendLiemersActiviteiten' },
    { name: 'Verzend Liemers Activiteiten', functionName: 'cmVerzendLiemersActiviteiten' },

    { name: 'TEST Verzend Lectorrooster', functionName: 'tsTestVerzendLectorRooster' },
    { name: 'Verzend Lectorrooster', functionName: 'cmVerzendLectorRooster' },

  ];

  ss.addMenu("Kalender", menuEntries);
  ss.addMenu("Beheer", [
    { name: "Controleer spreadsheet", functionName: "bhControleerSpreadsheet" },
    { name: "Initialiseer ontbrekende structuur", functionName: "bhInitialiseerSpreadsheet" },
    { name: "Migreer Instellingen naar Configuratie", functionName: "bhMigreerConfiguratie" },
    { name: "Controleer projectconfiguratie", functionName: "bhControleerProjectConfiguratie" }
  ]);
}
