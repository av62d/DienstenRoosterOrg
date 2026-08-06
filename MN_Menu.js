/**
 * Module: MN_Menu.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

// Google Apps Script vereist exact de naam onOpen voor deze eenvoudige trigger.
function onOpen(e) {
  return mnBijOpenen(e);
}

// Google Apps Script vereist exact de naam onEdit voor deze eenvoudige trigger.
function onEdit(e) {
  return bhBijWijzigingVoorpagina(e);
}


function mnBijOpenen() {
  var ui = SpreadsheetApp.getUi();
  var hoofdmenu = ui.createMenu("Dienstenrooster");

  hoofdmenu.addSubMenu(ui.createMenu("Roosters")
    .addItem("Maak halfjaarrooster januari–juni", "rsMaakHalfjaarrooster1")
    .addItem("Maak halfjaarrooster juli–december", "rsMaakHalfjaarrooster2")
    .addItem("Maak jaarrooster als XLSX", "exMaakJaarroosterXlsx")
    .addSeparator()
    .addItem("Verwijder gegenereerde roosters", "rsVerwijderAlleRoosters"));

  hoofdmenu.addSubMenu(ui.createMenu("Verzenden")
    .addItem("Rooster", "cmVerzendRooster")
    .addItem("Jaarrooster", "rsVerzendJaarrooster")
    .addItem("Jaarrooster als XLSX", "exVerzendJaarroosterXlsx")
    .addSeparator()
    .addItem("KerkTV-liturgie", "cmVerzendTemplate")
    .addItem("Kerkmededelingen", "cmVerzendMededelingen")
    .addItem("Kerkmededelingen volgende week", "cmVerzendMededelingenVolgendeWeek")
    .addItem("MJ-mededelingen", "cmVerzendMjMededelingen")
    .addItem("Liemersactiviteiten", "cmVerzendLiemersActiviteiten")
    .addItem("Lectorrooster", "cmVerzendLectorrooster")
    .addItem("Lijst met kerkdiensten", "cmVerzendLijstKerkdiensten"));

  hoofdmenu.addSubMenu(ui.createMenu("Agenda en opmaak")
    .addItem("Zet diensten in Google Agenda", "kaZetGebeurtenissenInAgenda")
    .addItem("Werk achtergrondkleuren bij", "opStelAchtergrondkleurenIn"));

  hoofdmenu.addSubMenu(ui.createMenu("Beheer")
    .addItem("Controleer spreadsheet", "bhControleerSpreadsheet")
    .addItem("Initialiseer ontbrekende structuur", "bhInitialiseerSpreadsheet")
    .addItem("Migreer Voorpagina (eenmalig)", "bhMigreerVoorpagina")
    .addItem("Herstel bronnen van draaitabellen", "bhHerstelDraaitabelbronnen")
    .addItem("Herbereken Voorpagina-kolommen", "bhHerberekenVoorpagina")
    .addItem("Herstel keuzes Voorpagina", "bhStelVoorpaginaValidatiesIn")
    .addSeparator()
    .addItem("Schoon Configuratie op", "bhSchoonConfiguratieOp")
    .addItem("Controleer projectconfiguratie", "bhControleerProjectConfiguratie"));

  hoofdmenu.addSubMenu(ui.createMenu("Testen")
    .addItem("Verzend rooster", "tsTestVerzendRooster")
    .addItem("Verzend KerkTV-liturgie", "tsTestVerzendTemplate")
    .addItem("Verzend kerkmededelingen", "tsTestVerzendMededelingen")
    .addItem("Verzend MJ-mededelingen", "tsTestVerzendMjMededelingen")
    .addItem("Verzend Liemersactiviteiten", "tsTestVerzendLiemersActiviteiten")
    .addItem("Verzend lectorrooster", "tsTestVerzendLectorrooster"));

  hoofdmenu.addToUi();
}
