var argv = require('minimist')(process.argv.slice(2));

var input = require(argv['m'] || argv['metadata']);
var attribute = argv['a'] || argv['attribute'];

var newDataElements = [];

for (var i = 0; i < input.dataElements.length; i++) {
  var element = input.dataElements[i];
  var ntdCodeAttribute = null;
  for (var j = 0; j < element.attributeValues.length; j++) {
    if (element.attributeValues[j].attribute.id == attribute) {
      ntdCodeAttribute = element.attributeValues[j].value;
    }
  }
  if (ntdCodeAttribute) {
    element.code = ntdCodeAttribute
    newDataElements.push({
      code: element.code,
      id: element.id,
      name: element.name,
      shortName: element.shortName,
      aggregationType: element.aggregationType,
      domainType: element.domainType,
      valueType: element.valueType,
      categoryCombo: element.categoryCombo
    });
  }
}
 console.log(JSON.stringify({dataElements: newDataElements}));