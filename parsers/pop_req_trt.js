module.exports = function(_params) {

  let moment = require('moment');

  let month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let params = Object.assign({
    period: null,
    orgUnits: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    rootOrgId: 'Ethiopia'
  }, _params);

  let ParserUtils = require('./parser-utils.js')(params);

  let MDADateFormat = 'MMMM DD, YYYY';

  var orgTree = params.orgTree;

  var def = {
    params: params,
    definition: {
      defaults: {
        categoryOptionCombo: "default",
        attributeOptionCombo: "default",
      }
    },
    sheets: [
      // Country Info
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
            {
              column: "F",
              variable: "pcn-pop-sac",
              orgUnit: null,
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
            {
              column: "K",
              variable: "sch-prevalence",
              orgUnit: null,
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
            {
              column: "N",
              dataElement: "sac-req-pc-by-ntd",
              categoryOptionCombo: 'pc-ntd-sth',
              mapping: function(value, row) {
                var sacPop = getRowVariables(row)['pcn-pop-sac']
                if (value === 'Unknown') {
                  return 0;
                } else {
                  var popReqPc = Math.round(Number.parseFloat(value));
                  if (popReqPc > 0) {
                    return sacPop;
                  } else {
                    return 0;
                  }
                }
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
            {
              column: "O",
              dataElement: "sac-req-pc-by-ntd",
              categoryOptionCombo: 'pc-ntd-sch',
              mapping: function(value, row) {
                var sacPop = getRowVariables(row)['pcn-pop-sac']
                var schPrev = getRowVariables(row)['sch-prevalence']
                if (value === 'Unknown') {
                  return 0;
                } else {
                  var popReqPc = Math.round(Number.parseFloat(value));
                  if (popReqPc > 0) {
                    if (schPrev == 'low') {
                      return Math.round(sacPop * 0.33);
                    } else if (schPrev == 'moderate') {
                      return Math.round(sacPop * 0.5);
                    } else if (schPrev == 'high') {
                      return sacPop;
                    } else {
                      return 0;
                    }
                  } else {
                    return 0;
                  }
                }
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
              column: "R",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sth",
              mapping: function(value, row) {
                return parseInt(value, 10);
              }
            },
            // SCH
            {
              column: "S",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sch",
              mapping: function(value, row) {
                return parseInt(value, 10);
              }
            },


            // PC Required
            // LF
            {
              column: "L",
              dataElement: "pc-ntd-pc-required",
              categoryOptionCombo: "pc-ntd-lf",
              mapping: function(value, row) {
                if (value && value != 'unknown' && value > 0) {
                  return 1;
                } else {
                  return 0;
                }
              }
            },
            // Oncho
            {
              column: "M",
              dataElement: "pc-ntd-pc-required",
              categoryOptionCombo: "pc-ntd-ov",
              mapping: function(value, row) {
                if (value && value != 'unknown' && value > 0) {
                  return 1;
                } else {
                  return 0;
                }
              }
            },
            // STH
            {
              column: "N",
              dataElement: "pc-ntd-pc-required",
              categoryOptionCombo: "pc-ntd-sth",
              mapping: function(value, row) {
                if (value && value != 'unknown' && value > 0) {
                  return 1;
                } else {
                  return 0;
                }
              }
            },
            // SCH
            {
              column: "O",
              dataElement: "pc-ntd-pc-required",
              categoryOptionCombo: "pc-ntd-sch",
              mapping: function(value, row) {
                if (value && value != 'unknown' && value > 0) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }
          ]
        }
      }
    ]
  }
  

  function quarterPeriod(row, data) {
    // console.log('quarterPeriod', row, data);
    var variables = getRowVariables(row);
    var dateString = variables['implementationdate'];
    var year = variables['year'];
    if (!dateString || !dateString.toLowerCase) {
      return null;
    } else {
      var d = dateString.toLowerCase()
      if (d.indexOf('jan') >= 0 || d.indexOf('feb') >= 0 || 
          d.indexOf('mar') >= 0) {
        return year + 'Q1';
      } else if (d.indexOf('apr') >= 0 || d.indexOf('may') >= 0 || 
          d.indexOf('jun') >= 0) {
        return year + 'Q2';
      } else if (d.indexOf('jul') >= 0 || d.indexOf('aug') >= 0 || 
          d.indexOf('sep') >= 0) {
        return year + 'Q3';
      } else if (d.indexOf('oct') >= 0 || d.indexOf('nov') >= 0 || 
          d.indexOf('dec') >= 0) {
        return year + 'Q4';
      } else {
        return ''
      }
    }
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


  function getRowVariables(row) {
    var variables = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].variable) variables[row[i].variable] = row[i].value;
    }
    return variables;
  }


  return def;
}