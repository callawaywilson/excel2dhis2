var XLSX = require('xlsx');
var argv = require('minimist')(process.argv.slice(2));
var mappingKeys = ['dataElement', 'period', 'orgUnit', 'categoryOptionCombo', 'attributeOptionCombo', 'value', 'storedBy', 'created', 'lastUpdated', 'followUp'];

// Load Excel Workbook 
var workbook = loadWorkbook(argv);

// Load parser, the logic structure that drives the data transform
var parser = require('./' + (argv['p'] || argv['parser']))({
  period: (argv['t'] || argv['period']),
  orgUnits: loadOrgs(argv)
});

var mappedValues = [];

for (var i = 0; i < parser.sheets.length; i++) {
  var parserSheet = parser.sheets[i];
  var sheet = findSheetNamed(workbook, parserSheet.names);
  mappedValues = mappedValues.concat(parseSheet(parserSheet, sheet));
}
console.log(JSON.stringify({dataValues: mappedValues}));


function parseSheet(parserSheet, sheet) {
  var data = [];
  var range = /([A-Z]+)([\d]+):([A-Z]+)([\d]+)/.exec(sheet['!ref'])
  var lastRow = parseInt(range[4], 10);
  var parserRow = parserSheet.row;
  for (var rowNum = parserSheet.startRow; rowNum <= lastRow; rowNum++) {
    var rowData = [];
    for (var i = 0; i <  parserRow.mappings.length; i++) {
      var mappingData = parseMapping(parserRow.mappings[i], 
        parserRow, sheet, rowNum, rowData);
      if (mappingData) rowData.push(mappingData);
    }
    data = data.concat(rowData.filter(function(d) {
      return d && d.dataElement && !empty(d.value);
    }));
  }
  return data;
}

function parseMapping(mapping, parserRow, sheet, rowNum, rowData) {
  var cellData = sheet[mapping.column + rowNum];
  if (cellData) {
    if (mapping.variable) {
      var data = {};
      data[mapping.variable] = cellData.v;
      return data;
    } else if (mapping.dataElement) {
      return applyRowData(mapping, parserRow, rowData, cellData);
    }
  }
}

function applyRowData(mapping, parserRow, rowData, cellData) {
  var data = {};

  // Apply defaults
  for (var key in parser.definition.defaults) {
    data[key] = valueOrRowFunction(parser.definition.defaults[key], rowData);
  }

  // Apply invariants
  for (var key in parserRow.invariants) {
    data[key] = valueOrRowFunction(parserRow.invariants[key], rowData)
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
    // console.log("Loading '" + fileName + "'")
  }
  return XLSX.readFile(fileName);
}

function loadOrgs(argv) {
  var fileName = argv['o'] || argv['orgUnits']
  if (!fileName) {
    console.log("Org Units (--orgUnits) must be supplied")
    process.exit(1)
  } else {
    // console.log("Using Organization Units in '" + fileName + "'");
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
