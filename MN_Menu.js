/**
 * Module: MN_Menu.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

// Google Apps Script vereist exact de naam onOpen voor deze eenvoudige trigger.
function onOpen(e) {
  return mnBijOpenen(e);
}


function mnBijOpenen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    { name: "Events van spreadsheet naar kalender", functionName: "kaZetGebeurtenissenInAgenda" },

    { name: 'TEST Verzend rooster naar TestMaillijst', functionName: 'tsTestVerzendRooster' },
    { name: 'Verzend rooster naar Maillijst', functionName: 'cmVerzendRooster' },

    { name: 'Zet achtergrondkleuren', functionName: 'opStelAchtergrondkleurenIn' },

    { name: 'Verzend KerkTV Liturgie van template', functionName: 'cmVerzendTemplate' },

    { name: 'TEST Verzend KerkTV Liturgie van template', functionName: 'tsTestVerzendTemplate' },

    // { name: 'Mail lijst met laatste videos', functionName: 'ytVerzendLaatsteVideos' },


    { name: 'TEST Verzend MJ Mededelingen', functionName: 'tsTestVerzendMjMededelingen' },
    { name: 'Verzend MJ Mededelingen', functionName: 'cmVerzendMjMededelingen' },

    // { name: 'TEST Verzend Kerk Mededelingen', functionName: 'tsTestVerzendMededelingen' },
    { name: 'Verzend Kerk Mededelingen', functionName: 'cmVerzendMededelingen' },
    { name: 'Verzend Kerk Mededelingen (volgende week)', functionName: 'cmVerzendMededelingenVolgendeWeek' },

    { name: 'Verzend lijst met kerkdiensten (YouTube,kerkdienstgemist.nl)', functionName: 'cmVerzendLijstKerkdiensten' },

    { name: 'Verwijder alle roosters', functionName: 'rsVerwijderAlleRoosters' },

    { name: 'Genereer half jaar rooster vanaf januari', functionName: 'rsMaakHalfjaarrooster1' },

    { name: 'Genereer half jaar rooster vanaf juli', functionName: 'rsMaakHalfjaarrooster2' },


    { name: 'Verzend jaar rooster', functionName: 'rsVerzendJaarrooster' },
    { name: 'Genereer jaar rooster Xlsx', functionName: 'exMaakJaarroosterXlsx' },
    { name: 'Verzend jaar rooster Xlsx', functionName: 'exVerzendJaarroosterXlsx' },


    { name: 'TEST Verzend Liemers Activiteiten', functionName: 'tsTestVerzendLiemersActiviteiten' },
    { name: 'Verzend Liemers Activiteiten', functionName: 'cmVerzendLiemersActiviteiten' },

    { name: 'TEST Verzend Lectorrooster', functionName: 'tsTestVerzendLectorrooster' },
    { name: 'Verzend Lectorrooster', functionName: 'cmVerzendLectorrooster' },

  ];

  ss.addMenu("Kalender", menuEntries);
  ss.addMenu("Beheer", [
    { name: "Controleer spreadsheet", functionName: "bhControleerSpreadsheet" },
    { name: "Initialiseer ontbrekende structuur", functionName: "bhInitialiseerSpreadsheet" },
    { name: "Schoon Configuratie op", functionName: "bhSchoonConfiguratieOp" },
    { name: "Controleer projectconfiguratie", functionName: "bhControleerProjectConfiguratie" }
  ]);
}
