module.exports = function(_params) {

  let params = Object.assign({
    period: null,
    orgUnits: null,
    orgTree: null
  }, _params);

  let ParserUtils = require('./parser-utils.js')(params);

  var def = {
    params: params,
    sheets: [
      {
        names: [/COUNTRY_INFO/],
        startRow: 9,
        row: {
          invariants: {
            period: function(row) {return params.period},
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "B",
              variable: "provincestate",
              orgUnit: null
            },
            {
              column: "C",
              variable: "district",
              orgUnit: null
            },
            // Population - PreSAC
            {
              column: "E",
              dataElement: "HMJ3Hth1ry7",
              categoryOptionCombo: "clHYCgF9jys",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population - SAC
            {
              column: "F",
              dataElement: "HMJ3Hth1ry7",
              categoryOptionCombo: "AVegvKfvlnS",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population - Adults
            {
              column: "G",
              dataElement: "HMJ3Hth1ry7",
              categoryOptionCombo: "yW288iFizUY",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // No prevalence for LF or Oncho
            // Prevalence - LF
            // {
            //   column: "H",
            //   dataElement: "Nva0k6G5RsF",
            //   categoryOptionCombo: "RIEjTfuzC1z",
            //   mapping: function(value, row) {

            //   }
            // },
            // // Prevalence - Oncho
            // {
            //   column: "I",
            //   dataElement: "Nva0k6G5RsF",
            //   categoryOptionCombo: "SjE9LhAEw1i",
            //   mapping: function(value, row) {

            //   }
            // },
            // Prevalence - STH
            {
              column: "J",
              dataElement: "Nva0k6G5RsF",
              categoryOptionCombo: "MgZwyzoI9Ka",
              mapping: function(value, row) {
                if (value === '1' || value == 1) {
                  return 'low'
                } else if (value === '2' || value == 2) {
                  return 'moderate'
                } else if (value === '3' || value == 3) {
                  return 'high'
                } else if (value === '5' || value == 5) {
                  return 'unknown'
                }
              }
            },
            // Prevalence - SCH
            {
              column: "K",
              dataElement: "Nva0k6G5RsF",
              categoryOptionCombo: "eFifYMTcO2T",
              mapping: function(value, row) {
                if (value === '1' || value == 1) {
                  return 'low'
                } else if (value === '2' || value == 2) {
                  return 'moderate'
                } else if (value === '3' || value == 3) {
                  return 'high'
                } else if (value === '5' || value == 5) {
                  return 'unknown'
                }
              }
            },
            // Endemicity - LF
            {
              column: "H",
              dataElement: "BwX5xyuCQQU",
              categoryOptionCombo: "RIEjTfuzC1z",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non_endemic'
                } else if (value === '1' || value == 1) {
                  return 'endemic'
                } else if (value === '4' || value == 4) {
                  return 'unknown'
                } else if (value === '999' || value == 999) {
                  return 'endemic'
                }
              }
            },
            // Endemicity - Oncho
            {
              column: "I",
              dataElement: "BwX5xyuCQQU",
              categoryOptionCombo: "SjE9LhAEw1i",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non_endemic'
                } else if (value === '1' || value == 1) {
                  return 'endemic'
                } else if (value === '4' || value == 4) {
                  return 'unknown'
                } else if (value === '999' || value == 999) {
                  return 'endemic'
                }
              }
            },
            // Endemicity - STH
            {
              column: "J",
              dataElement: "BwX5xyuCQQU",
              categoryOptionCombo: "MgZwyzoI9Ka",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non_endemic'
                } else if (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 3) {
                  return 'endemic'
                } else if (value === '4' || value == 4) {
                  return 'unknown';
                } else if (value === '5' || value == 5) {
                  return 'endemic'
                }
              }
            },
            // Endemicity - SCH
            {
              column: "K",
              dataElement: "BwX5xyuCQQU",
              categoryOptionCombo: "eFifYMTcO2T",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non_endemic'
                } else if (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 3) {
                  return 'endemic'
                } else if (value === '4' || value == 4) {
                  return 'unknown';
                } else if (value === '5' || value == 5) {
                  return 'endemic'
                }
              }
            }
          ]
        }
      }
    ]
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
}


