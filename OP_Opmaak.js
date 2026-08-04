/**
 * Module: OP_Opmaak.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

/**
 * Applies text and background colors from a source sheet
 * to matching values in a destination sheet.
 *
 * Match rule:
 * A match occurs when the SOURCE value is contained
 * inside the DESTINATION value.
 *
 * Example:
 *   Source:      "Apple"
 *   Destination: "Green Apple Juice"
 *   -> Match
 *
 * @param {Sheet} sourceSheet
 * @param {Sheet} destinationSheet
 */


function opPasKleurenToeOpWaarde(sourceSheet, destinationSheet, start_col=0,end_col=0) {

  // ----- Read source data -----

  const sourceRange = sourceSheet.getDataRange();

  const sourceValues = sourceRange.getValues();
  const sourceBackgrounds = sourceRange.getBackgrounds();
  const sourceFontColors = sourceRange.getFontColors();

  // Build list of source entries
  const sourceEntries = [];

  for (let r = 0; r < sourceValues.length; r++) {
    for (let c = 0; c < sourceValues[r].length; c++) {

      const value = sourceValues[r][c];

      if (value === "" || value === null) {
        continue;
      }

      sourceEntries.push({
        text: String(value).toLowerCase(),
        background: sourceBackgrounds[r][c],
        fontColor: sourceFontColors[r][c]
      });
    }
  }

  // ----- Read destination data -----

  const destRange = destinationSheet.getDataRange();

  const destValues = destRange.getValues();
  const destBackgrounds = destRange.getBackgrounds();
  const destFontColors = destRange.getFontColors();

  // ----- Match and apply formatting -----



  for (let r = 0; r < destValues.length; r++) {
    var last_col = destValues[r].length;
    if (end_col > 0) { last_col = end_col}
    for (let c = start_col; c < last_col; c++) {

      const destValue = destValues[r][c];

      if (destValue === "" || destValue === null) {
        continue;
      }

      const destText = String(destValue).toLowerCase();

      // Find first source value contained in destination text
      for (const entry of sourceEntries) {

        if (destText.includes(entry.text)) {

          destBackgrounds[r][c] = entry.background;
          destFontColors[r][c] = entry.fontColor;

          // Stop after first match
          break;
        }
      }
    }
  }

  // ----- Write formatting back -----

  destRange.setBackgrounds(destBackgrounds);
  destRange.setFontColors(destFontColors);
}


/**
 * Generates a row of cells with highly distinct background colors.
 *
 * Colors are distributed evenly across the hue spectrum
 * using HSL color space for maximum visual contrast.
 *
 * @param {number} count      Number of colors/cells to generate
 * @param {string} sheetName  Name of the target sheet
 *
 * Example:
 *   generateDistinctColors(20, "Colors");
 */

/**
 * Generates a vertical list of cells with highly distinct background colors.
 *
 * Colors are distributed evenly across the hue spectrum
 * for maximum visual contrast.
 *
 * @param {number} count      Number of colors/cells to generate
 * @param {string} sheetName  Name of the target sheet
 *
 * Example:
 *   generateDistinctColorsVertical(20, "Colors");
 */


function opGenereerOnderscheidendeKleurenVerticaal(count, sheetName) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found`);
  }

  if (count <= 0) {
    throw new Error("Count must be greater than zero");
  }

  // Create vertical arrays
  const values = [];
  const backgrounds = [];
  const fontColors = [];

  for (let i = 0; i < count; i++) {

    // Even hue distribution
    const hue = (i * 360 / count);

    // Strong saturation and balanced lightness
    const hexColor = opConverteerHslNaarHex(hue, 80, 50);

    values.push([hexColor]);
    backgrounds.push([hexColor]);

    // Automatic readable text color
    fontColors.push([opBepaalContrasterendeTekstkleur(hexColor, hue)]);
  }

  // Vertical range
  const range = sheet.getRange(1, 1, count, 1);

  range.setValues(values);
  range.setBackgrounds(backgrounds);
  range.setFontColors(fontColors);

  // Optional formatting
  range.setHorizontalAlignment("center");
  range.setFontWeight("bold");

  for (let r = 1; r <= count; r++) {
    sheet.setRowHeight(r, 40);
  }

  sheet.setColumnWidth(1, 140);
}


/**
 * Converts HSL to HEX color.
 *
 * @param {number} h Hue (0-360)
 * @param {number} s Saturation (0-100)
 * @param {number} l Lightness (0-100)
 * @return {string} HEX color
 */


function opConverteerHslNaarHex(hue, s, l) {

  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return opConverteerRgbNaarHex(r, g, b);
}


function opConverteerRgbNaarHex(r, g, b) {
  return "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");
}


/**
 * Returns black or white depending on background contrast.
 *
 * @param {string} hexColor
 * @return {string}
 */


function opBepaalContrasterendeTekstkleur(hexColor, hue) {

  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "#000000" : "#FFFFFF";

  // return opConverteerRgbNaarHex(255 - r, 255 - g, 255 - b); // based on rgb
  // If your hue is between 60° and 180°, your colour is green, if it's between 180° and 300°, it's blue, else it's red.

  if (hue < 60) {
    return opConverteerRgbNaarHex(0, 255, 0);
  } else if (hue < 180) {
    return opConverteerRgbNaarHex(0, 0, 255);
  } else if (hue < 300) {
    return opConverteerRgbNaarHex(255, 0, 0);
  } else return opConverteerRgbNaarHex(0, 255,0);


  // Or the opposite of the hue
  // return opConverteerHslNaarHex((360 - hue, 80, 50));
}


function opStelAchtergrondkleurenIn() {
  var srcSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Voorpagina');
  if (!srcSheet) throw new Error("Werkblad 'Voorpagina' ontbreekt.");
  var kolommen = crMaakKolomindex(srcSheet);
  var kolomHa = crZoekKolom(kolommen, "HA");
  var kolomKleur = crZoekKolom(kolommen, "Kleur");

  var startRow = 2;
  var endRow = srcSheet.getLastRow();
  var numRows = endRow - startRow + 1;

  var startCol = 1;
  var endCol = srcSheet.getLastColumn();
  var numCols = endCol - startCol + 1;

  var curRow = 1;

  for (curRow = startRow; curRow <= endRow; curRow++) {
    var rowRange = srcSheet.getRange(curRow, 1, 1, numCols);
    var rowValues = rowRange.getValues()[0];
    var rowHA = rowValues[kolomHa];
    var liturgischeKleur = String(rowValues[kolomKleur] || "").toLowerCase();
    var color = rowRange.getBackgroundColor();

    color = '#ffffff';  // white

    if (rowHA != "")
      color = "#cfe2f3";
    else if (liturgischeKleur === "wit") color = "#ffffff";
    else if (liturgischeKleur === "groen") color = "#d9ead3";
    else if (liturgischeKleur === "rood") color = "#f4cccc";
    else if (liturgischeKleur === "paars") color = "#d9d2e9";
    else if (liturgischeKleur === "roze") color = "#ead1dc";

    rowRange.setBackground(color);
  }

  // "T" == "#ff00ff"
  // [["Z HA"]] "#cfe2f3"
  // [["M"]] "#fff2cc"
  // [["Z"]] "#ffffff"
}


function opBepaalKleurtype(type, color)
{
  switch (type) {
    case "T" : color = '#ff00ff'; break;
    case "Z HA":
    case "B HA": color = "#cfe2f3";break ;
    case "M": color = "#fff2cc";break;
    case "AV": color = "#ead1dc";break;
  }
  return (color);
}
