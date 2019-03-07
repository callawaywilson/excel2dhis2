module.exports = function(_params) {

  let params = Object.assign({
    period: null,
    orgUnits: null,
    orgTree: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    rootOrgName: 'Ethiopia',
    attributeOptionCombo: "default",
    attributeCategoryOptions: "default"
  }, _params);

  let ParserUtils = require('./parser-utils.js')(params);

  var orgTree = params.orgTree;

  var def = {
    params: params,

    sheets: [

      {
        names: [/Amhara/],
        startRow: 2,
        params: params,
        row: {
          invariants: {
            period: function(row) {return params.period},
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "A",
              variable: "provincestate",
              orgUnit: null
            },
            {
              column: "B",
              variable: "district",
              orgUnit: null
            },
            // WASH - OneWash
            {
              column: "C",
              dataElement: "pcn-washpartner-onewash",
              mapping: function(value, row) {
                if (value && value.toLowerCase().indexOf('y') > -1) {
                  return 1;
                }
              }
            },
            // WASH - GSF
            {
              column: "D",
              dataElement: "pcn-washpartner-gsf",
              mapping: function(value, row) {
                if (value && value.toLowerCase().indexOf('y') > -1) {
                  return 1;
                }
              }
            },
            // NTD For Row
            {
              column: "F",
              variable: "disease"
            },
            // NTD Partner
            {
              column: "H",
              dataElement: "pcn-partner-ntd",
              categoryOptionCombo: function(row) {
                var disease = getRowVariables(row)['disease'];
                if (disease && disease.toLowerCase().indexOf('oncho') > -1) {
                  return 'pc-ntd-ov';
                } else if (disease && disease.toLowerCase().indexOf('sth') > -1) {
                  return 'pc-ntd-sth';
                } else if (disease && disease.toLowerCase().indexOf('sch') > -1) {
                  return 'pc-ntd-sch';
                } else if (disease && disease.toLowerCase().indexOf('lf') > -1) {
                  return 'pc-ntd-lf';
                } else if (disease && disease.toLowerCase().indexOf('trach') > -1) {
                  return 'pc-ntd-trachoma';
                }
              },
              mapping: function(value, row) {
                if (value && value.toLowerCase().indexOf('n/a') < 0) {
                  return value;
                }
              }
            },

            // WASH Partner
            {
              column: "I",
              dataElement: "pcn-partners-wash",
              mapping: function(value, row) {
                if (value && value.toLowerCase().indexOf('n/a') < 0) {
                  return value;
                }
              }
            }
          ]
        }
      }
    ]
  };




  function getRowVariables(row) {
    var variables = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].variable) variables[row[i].variable] = row[i].value;
    }
    return variables;
  }

  function getRowDataElements(row) {
    var elements = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].dataElement) elements[row[i].dataElement] = row[i].value;
    }
    return elements;
  }


  function findOrg(row) {
    // Variables:
    //  - provincestate: RegionZone squished together name
    //  - district: Woreda 
    var variables = ParserUtils.getRowVariables(row);
    if (!variables.provincestate || !variables.district) {
      console.log("Missing district info: " + variables.provincestate + 
        "/" + variables.district);
      return null;
    }
    var org = ParserUtils.districtLookupProvinceState(variables.provincestate, variables.district);
    if (!org) {
      org = ParserUtils.districtLookupState(variables.provincestate, variables.district);
    }

    if (!org) {
      console.log("Unable to find district: " + variables.provincestate + 
        "/" + variables.district);
      return null;
    }
    return org.id;
  }

  return def;


};