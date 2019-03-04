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

  let MDADateFormat = 'DD-M-YY';

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
            // Population Requiring Treatment - LF
            {
              column: "L",
              dataElement: "pcn-pop-require-pc-lf",
              categoryOptionCombo: 'default',
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
              dataElement: "pcn-pop-require-pc-ov",
              categoryOptionCombo: 'default',
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
              dataElement: "pcn-pop-require-pc-sth",
              categoryOptionCombo: 'default',
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
              dataElement: "pcn-pop-require-pc-sch",
              categoryOptionCombo: 'default',
              mapping: function(value, row) {
                if (value === 'Unknown') {
                  return 0;
                }
                return Math.round(Number.parseFloat(value));
              }
            },

            // Number of treatment rounds planned for year
            // LF
            {
              column: "P",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-lf",
              mapping: function(value, row) {
                return mapTreatmentRounds(value);
              }
            },
            {
              column: "P",
              applyGlobalVariables: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                var rounds = mapTreatmentRounds(value);
                if (!globalVariables.orgTreatmentRoundsLf) {
                  globalVariables.orgTreatmentRoundsLf = {};
                }
                globalVariables.orgTreatmentRoundsLf[orgUnit] = rounds;
              }
            },
            // Oncho
            {
              column: "Q",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-ov",
              mapping: function(value) {
                return mapTreatmentRounds(value);
              }
            },
            {
              column: "Q",
              applyGlobalVariables: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                var rounds = mapTreatmentRounds(value);
                if (!globalVariables.orgTreatmentRoundsOncho) {
                  globalVariables.orgTreatmentRoundsOncho = {};
                }
                globalVariables.orgTreatmentRoundsOncho[orgUnit] = rounds;
              }
            },
            // STH
            {
              column: "R",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sth",
              mapping: function(value) {
                return mapTreatmentRounds(value);
              }
            },
            {
              column: "R",
              applyGlobalVariables: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                var rounds = mapTreatmentRounds(value);
                if (!globalVariables.orgTreatmentRoundsSth) {
                  globalVariables.orgTreatmentRoundsSth = {};
                }
                globalVariables.orgTreatmentRoundsSth[orgUnit] = rounds;
              }
            },
            // SCH
            {
              column: "S",
              dataElement: "pcn-rounds-planned",
              categoryOptionCombo: "pc-ntd-sch",
              mapping: function(value, row) {
                return mapTreatmentRounds(value);
              }
            },
            {
              column: "S",
              applyGlobalVariables: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                var rounds = mapTreatmentRounds(value);
                if (!globalVariables.orgTreatmentRoundsSch) {
                  globalVariables.orgTreatmentRoundsSch = {};
                }
                globalVariables.orgTreatmentRoundsSch[orgUnit] = rounds;
              }
            },
          ]
        }
      },


      // MDA1 - pcn-pop-trgt-intervention, pcn-pop-trt-intervention
      // pcnd-int-ivmalb
      {
        names: [/MDA1/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "E",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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

            // LF Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-lf",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-lf",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-lf",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-lf",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },

            // Oncho Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-ov",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-ov",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-ov",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-ov",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },

            // STH Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
          ]
        }
      },

      // MDA2
      {
        names: [/MDA2/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "E",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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

            // LF Targeted / Treatments
            {
              column: "F",
              dataElement: "pcn-pop-trgt-lf",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt-lf",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-lf",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "J",
              dataElement: "pcn-pop-trt-lf",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-lf",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-lf",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },

            // STH Targeted / Treatments
            {
              column: "F",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "J",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },

          ]
        }
      },

      // // MDA3
      {
        names: [/MDA3/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "E",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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


            // Oncho Targeted / Treatments
            {
              column: "F",
              dataElement: "pcn-pop-trgt-ov",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt-ov",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            // MDA3 Tab only has 1 date, so use totals for date set:
            {
              column: "O",
              dataElement: "pcn-pop-trt-ov",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "P",
              dataElement: "pcn-pop-trt-ov",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            }
          ]
        }
      },

      // // T1 - pcnd-int-pzqalb || pcnd-int-pzqmbd
      {
        names: [/T1/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'medicine',
              mapping: function(value) {
                if (value && value.toLowerCase().indexOf('alb') >= 0) {
                  return 'pzqalb'
                } else {
                  return 'pzqmbd'
                }
              }
            },
            {
              column: "F",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "F",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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
            {
              column: "H",
              variable: 'sac-albmbd'
            },
            {
              column: "I",
              variable: 'sac-pzq'
            },

            // STH Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "I",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "J",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "M",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "N",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },

            // SCH Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "I",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "J",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "M",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "N",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            
          ]
        }
      },


      // // T2
      {
        names: [/T2/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "E",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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
            // SCH Targeted / Treatments
            {
              column: "F",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-sch",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "J",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sch",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
          ]
        }
      },

      // // T3_R1, T3_R2 - pcn-int-alb || pcn-int-mbd
      {
        names: [/T3_R1/, /T3_R2/],
        startRow: 9,
        row: {
          invariants: {
            orgUnit: findOrg
          },
          dataValues: [
            {
              column: "E",
              variable: 'medicine',
              mapping: function(value) {
                if (value && value.toLowerCase().indexOf('alb') >= 0) {
                  return 'alb'
                } else {
                  return 'mbd'
                }
              }
            },
            {
              column: "F",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "F",
              variable: 'implementationdate',
              mapping: function(value) {return value;}
            },
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

            // STH Targeted / Treatments
            {
              column: "G",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "I",
              dataElement: "pcn-pop-trgt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-presac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-sac-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
            {
              column: "M",
              dataElement: "pcn-pop-trt-sth",
              categoryOptionCombo: "age-adult-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row, globalVariables) {
                var orgUnit = findOrg(row);
                return Math.round(value);
              }
            },
          ]
        }
      },

      // // DISTRICT - pcn-pop-trgt, pcn-pop-trt
      // //    pc-ntd-lf-age-adult-sex-unknown
      // {
      //   names: [/DISTRICT/],
      //   startRow: 9,
      //   row: {
      //     invariants: {
      //       period: '' + params.period + 'Q4',
      //       orgUnit: findOrg
      //     },
      //     dataValues: [
      //       {
      //         column: "B",
      //         variable: "provincestate",
      //         orgUnit: null
      //       },
      //       {
      //         column: "C",
      //         variable: "district",
      //         orgUnit: null
      //       },

      //       // LF Targeted, Treated
      //       {
      //         column: "D",
      //         dataElement: 'pcn-pop-trgt',
      //         categoryOptionCombo: 'pc-ntd-lf-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },
      //       {
      //         column: "G",
      //         dataElement: 'pcn-pop-trt',
      //         categoryOptionCombo: 'pc-ntd-lf-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },

      //       // Oncho Targeted, Treated
      //       {
      //         column: "J",
      //         dataElement: 'pcn-pop-trgt',
      //         categoryOptionCombo: 'pc-ntd-ov-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },
      //       {
      //         column: "M",
      //         dataElement: 'pcn-pop-trt',
      //         categoryOptionCombo: 'pc-ntd-ov-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },

      //       // STH Targeted, Treated
      //       {
      //         column: "P",
      //         dataElement: 'pcn-pop-trgt',
      //         categoryOptionCombo: 'pc-ntd-sth-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },
      //       {
      //         column: "S",
      //         dataElement: 'pcn-pop-trt',
      //         categoryOptionCombo: 'pc-ntd-sth-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },


      //       // SCH Targeted, Treated
      //       {
      //         column: "V",
      //         dataElement: 'pcn-pop-trgt',
      //         categoryOptionCombo: 'pc-ntd-sch-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       },
      //       {
      //         column: "Y",
      //         dataElement: 'pcn-pop-trt',
      //         categoryOptionCombo: 'pc-ntd-sch-age-unknown-sex-unknown',
      //         mapping: function(value, row) {
      //           return Math.round(value);
      //         }
      //       }
          
      //     ]
      //   }
      // }
    ]
  }

  function mapTreatmentRounds(val) {
    if (!val) return;
    if (Number.isInteger(val)) return val;
    if (val.indexOf('None') > -1) {
      return 0;
    } else if (val.indexOf('1x') > -1) {
      return 1;
    } else if (val.indexOf('2x') > -1) {
      return 2;
    } else {
      return parseInt(val, 10);
    }
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

  function monthPeriod(row, data) {
    // console.log('monthPeriod', row, data);
    var variables = getRowVariables(row);
    var dateString = variables['implementationdate'];
    if (Number.isInteger(dateString)) {
      dateString = moment('1899-12-30', 'YYYY-MM-DD').add(dateString, 'days').format('YYYY-MMMM-DD');
    }
    var year = variables['year'];
    if (!dateString || !dateString.toLowerCase) {
      return null;
    } else {
      var d = dateString.toLowerCase();
      if (d.indexOf('jan') >= 0) {
        return year + "01";
      } else if (d.indexOf('feb') >= 0) {
        return year + "02";
      } else if (d.indexOf('mar') >= 0) {
        return year + "03";
      } else if (d.indexOf('apr') >= 0) {
        return year + "04";
      } else if (d.indexOf('may') >= 0) {
        return year + "05";
      } else if (d.indexOf('jun') >= 0) {
        return year + "06";
      } else if (d.indexOf('jul') >= 0) {
        return year + "07";
      } else if (d.indexOf('aug') >= 0) {
        return year + "08";
      } else if (d.indexOf('sep') >= 0) {
        return year + "09";
      } else if (d.indexOf('oct') >= 0) {
        return year + "10";
      } else if (d.indexOf('nov') >= 0) {
        return year + "11";
      } else if (d.indexOf('dec') >= 0) {
        return year + "12";
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