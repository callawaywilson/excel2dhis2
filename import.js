var XLSX = require('xlsx');
var fs = require('fs');
var fsPath = require('fs-path');
var argv = require('minimist')(process.argv.slice(2));
var mappingKeys = ['dataElement', 'period', 'orgUnit', 'categoryOptionCombo', 'attributeOptionCombo', 'value', 'storedBy', 'created', 'lastUpdated', 'followUp','variable'];
var eventReqiredKeys = ['program','eventDate','orgUnit'];

// Parse output file name
var outputFilename = (argv['o'] || argv['output'])
if (!outputFilename) {
  console.log("Output filename is required");
  process.exit(1);
} else {
  console.log("Writing to file '" + outputFilename + "'");
}

// Load Excel Workbook 
var workbook = loadWorkbook(argv);

// Load org units
var orgUnits = loadOrgs(argv);
var orgTree = require('./orgunittree.js')(orgUnits, {
  geoconnectAttributeID: 'rct9QrdQEnz',
  spellingsAttributeID: 'U4FWYMGCWju',
  rootOrgId: 'iuGjpnxnFbI'
});

// Load parser, the logic structure that drives the data transform
var parser = require('./' + (argv['p'] || argv['parser']))({
  period: (argv['t'] || argv['period']),
  orgUnits: orgUnits,
  orgTree: orgTree,
  defaultCategoryOptionCombo: 'default',
  defaultAttributeOptionCombo: 'default'
});

// Run the parser sheets on the appropriate workbook sheets
var mappedValues = {};
for (var i = 0; i < parser.sheets.length; i++) {
  var parserSheet = parser.sheets[i];
  var sheet = findSheetNamed(workbook, parserSheet.names);
  var sheetData = parseSheet(parserSheet, sheet);
  if (sheetData.events) {
    if (!mappedValues.events) mappedValues.events = [];
    mappedValues.events = mappedValues.events.concat(sheetData.events);
  } else if (sheetData.dataValues) {
    if (!mappedValues.dataValues) mappedValues.dataValues = [];
    mappedValues.dataValues = mappedValues.dataValues.concat(sheetData.dataValues);
  }
  // mappedValues = mappedValues.concat();
}

// Write to output file
fsPath.writeFile(outputFilename, JSON.stringify(mappedValues),
  function(err) {
    if (err) console.log(err);
  });



function parseSheet(parserSheet, sheet) {
  var data = [];
  var range = /([A-Z]+)([\d]+):([A-Z]+)([\d]+)/.exec(sheet['!ref']);
  if (!range) {
    console.log("Missing sheet information for: " + parserSheet.names);
    return data;
  }
  var lastRow = parseInt(range[4], 10);
  var parserRow = parserSheet.row;

  // Program Event Mapping
  if (parserRow.event) {
    for (var rowNum = parserSheet.startRow; rowNum <= lastRow; rowNum++) {
      var rowData = parseRowDataValues(parserRow, sheet, rowNum);
      var event = parseRowEvent(parserRow.event, rowData);
      event.dataValues = rowData.filter(function(d) {
        return d && d.dataElement && !empty(d.value);
      });
      // Check for required event fields:
      var missingKey = false;
      for (var k = 0; k < eventReqiredKeys.length; k++) {
        if (!event[eventReqiredKeys[k]]) {
          missingKey = eventReqiredKeys[k];
        }
      }
      if (!missingKey && event.dataValues.length > 0) {
        data = data.concat(event);
      }
    }
    return {"events": data}
  } else if (parserRow.dataValues) {
    for (var rowNum = parserSheet.startRow; rowNum <= lastRow; rowNum++) {
      var rowData = parseRowDataValues(parserRow, sheet, rowNum);
      data = data.concat(rowData.filter(function(d) {
        return d && d.dataElement && !empty(d.value);
      }));
    }
    return {"dataValues": data}
  } else {
    console.log("Unknown row config");
    return []
  }
}

function parseRowDataValues(parserRow, sheet, rowNum) {
  var rowData = [];
  for (var i = 0; i <  parserRow.dataValues.length; i++) {
    var mappingData = parseMapping(parserRow.dataValues[i], 
      parserRow, sheet, rowNum, rowData);
    if (mappingData) rowData.push(mappingData);
  }
  return rowData;
}

function parseRowEvent(parserEvent, rowData) {
  var event = {};
  for (var key in parserEvent) {
    event[key] = valueOrRowFunction(parserEvent[key], rowData)
  }
  return event;
}

function parseMapping(mapping, parserRow, sheet, rowNum, rowData) {
  var cellData = sheet[mapping.column + rowNum];
  if (cellData) {
    return applyRowData(mapping, parserRow, rowData, cellData);
  }
}

function applyRowData(mapping, parserRow, rowData, cellData) {
  var data = {};

  if (!mapping.variable) {
    // Apply defaults
    if (parser.definition && parser.definition.defaults) {
      for (var key in parser.definition.defaults) {
        data[key] = valueOrRowFunction(parser.definition.defaults[key], rowData);
      }
    }

    // Apply invariants
    if (parserRow.invariants) { 
      for (var key in parserRow.invariants) {
        data[key] = valueOrRowFunction(parserRow.invariants[key], rowData)
      }
    }
  }

  // Apply keys in mapping
  for (var i = 0; i < mappingKeys.length; i++) {
    var key = mappingKeys[i];
    if (mapping[key]) {
      data[key] = valueOrRowFunction(mapping[key], rowData)
    }
  }

  // Apply value
  if (mapping.mapping) {
    data.value = mapping.mapping(cellData.v, rowData);
  } else {
    data.value = cellData.v;
  }

  return data;
}

function valueOrRowFunction(val, rowData) {
  if (typeof val === "function") {
    return val(rowData);
  } else {
    return val;
  }
}


function findSheetNamed(workbook, sheetNamesPatterns) {
  for (var i = 0; i < sheetNamesPatterns.length; i++) {
    var patternOrName = sheetNamesPatterns[i];
    for (var s = 0; s < workbook.SheetNames.length; s++) {
      var sheetName = workbook.SheetNames[s]
      if ((patternOrName instanceof RegExp && patternOrName.test(sheetName)) ||
          patternOrName == sheetName) {
        return workbook.Sheets[sheetName];
      }
    }
  }
}

function loadWorkbook(argv) {
  var fileName = argv._[0]
  if (!fileName) {
    console.log("File to process must be supplied")
    process.exit(1)
  } else {
    console.log("Loading '" + fileName + "'")
  }
  return XLSX.readFile(fileName);
}

function loadOrgs(argv) {
  var fileName = argv['u'] || argv['orgUnits']
  if (!fileName) {
    console.log("Org Units (--orgUnits) must be supplied")
    process.exit(1)
  } else {
    console.log("Using Organization Units in '" + fileName + "'");
  }
  return require("./" + fileName).organisationUnits;
}

function empty(data) {
  if (typeof(data) == 'number' || typeof(data) == 'boolean') { 
    return false; 
  }
  if( typeof(data) == 'undefined' || data === null) {
    return true; 
  }
  if (typeof(data.length) != 'undefined') {
    return data.length == 0;
  }
  var count = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      count ++;
    }
  }
  return count == 0;
}
