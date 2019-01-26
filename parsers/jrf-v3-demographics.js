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
              dataElement: "pcn-pop",
              categoryOptionCombo: "age-presac",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population - SAC
            {
              column: "F",
              dataElement: "pcn-pop",
              categoryOptionCombo: "age-sac",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population - Adults
            {
              column: "G",
              dataElement: "pcn-pop",
              categoryOptionCombo: "age-adult",
              mapping: function(value, row) {
                return Math.round(Number.parseFloat(value));
              }
            },
            // No prevalence for LF or Oncho
            // Prevalence - LF
            // {
            //   column: "H",
            //   dataElement: "pcn-prevalence",
            //   categoryOptionCombo: "pc-ntd-lf",
            //   mapping: function(value, row) {

            //   }
            // },
            // // Prevalence - Oncho
            // {
            //   column: "I",
            //   dataElement: "pcn-prevalence",
            //   categoryOptionCombo: "pc-ntd-ov",
            //   mapping: function(value, row) {

            //   }
            // },
            // Prevalence - STH
            {
              column: "J",
              dataElement: "pcn-prevalence-level",
              categoryOptionCombo: "pc-ntd-sth",
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
              dataElement: "pcn-prevalence-level",
              categoryOptionCombo: "pc-ntd-sch",
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
            // Population Requiring Treatment - LF
            {
              column: "L",
              dataElement: "pcn-pop-require-pc",
              categoryOptionCombo: 'pc-ntd-lf',
              mapping: function(value, row) {
                if (value === 'Unknown') {
                  return 0;
                }
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population Requiring Treatment - Oncho
            {
              column: "M",
              dataElement: "pcn-pop-require-pc",
              categoryOptionCombo: 'pc-ntd-ov',
              mapping: function(value, row) {
                if (value === 'Unknown') {
                  return 0;
                }
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population Requiring Treatment - STH
            {
              column: "N",
              dataElement: "pcn-pop-require-pc",
              categoryOptionCombo: 'pc-ntd-sth',
              mapping: function(value, row) {
                if (value === 'Unknown') {
                  return 0;
                }
                return Math.round(Number.parseFloat(value));
              }
            },
            // Population Requiring Treatment - SCH
            {
              column: "O",
              dataElement: "pcn-pop-require-pc",
              categoryOptionCombo: 'pc-ntd-sch',
              mapping: function(value, row) {
                if (value === 'Unknown') {
                  return 0;
                }
                return Math.round(Number.parseFloat(value));
              }
            },


            // Endemicity - LF
            {
              column: "H",
              dataElement: "pcn-endemicity",
              categoryOptionCombo: "pc-ntd-lf",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non-endemic'
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
              dataElement: "pcn-endemicity",
              categoryOptionCombo: "pc-ntd-ov",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non-endemic'
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
              dataElement: "pcn-endemicity",
              categoryOptionCombo: "pc-ntd-sth",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non-endemic'
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
              dataElement: "pcn-endemicity",
              categoryOptionCombo: "pc-ntd-sch",
              mapping: function(value, row) {
                if (value === '0' || value == 0) {
                  return 'non-endemic'
                } else if (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 3) {
                  return 'endemic'
                } else if (value === '4' || value == 4) {
                  return 'unknown';
                } else if (value === '5' || value == 5) {
                  return 'endemic'
                }
              }
            },

            // Number of treatment rounds planned for year
            // LF
            {
              column: "P",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-lf",
              mapping: function(value, row) {
                return parseInt(value, 10);
              }
            },
            // Oncho
            {
              column: "Q",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-ov",
              mapping: function(value, row) {
                return parseInt(value, 10);
              }
            },
            // STH
            {
              column: "Q",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sth",
              mapping: function(value, row) {
                return parseInt(value, 10);
              }
            },
            // SCH
            {
              column: "Q",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sch",
              mapping: function(value, row) {
                return parseInt(value, 10);
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


