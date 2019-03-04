module.exports = function(_params) {

  let month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let params = Object.assign({
    period: null,
    orgUnits: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    rootOrgName: 'Ethiopia'
  }, _params);

  var def = {
    params: params,
    definition: {
      defaults: {
        categoryOptionCombo: "default",
        attributeOptionCombo: "default",
      }
    },
    sheets: [

      // TEMF
      {
        names: [/4-\d{4} TEMF/],
        startRow: 7,
        row: {
          invariants: {
            period: function(row) {
              return params.period;
            },
            orgUnit: findOrg,
          },
          dataValues: [
            {
              column: "A",
              variable: "zone",
              orgUnit: null
            },
            {
              column: "B",
              variable: "region",
              orgUnit: null
            },
            {
              column: "C",
              variable: "woreda",
              orgUnit: null
            },
            {
              column: "D",
              variable: "geoconnectID",
              orgUnit: null
            },
            {
              column: "F",
              dataElement: "trch-survey-year-prevalence"
            },
            {
              column: "G",
              dataElement: "trch-tf-pct",
              mapping: function(value, row) {
                return Math.floor(value)
              }
            },
            {
              column: "H",
              dataElement: "trch-tt-pct",
              mapping: function(value, row) {
                return Math.floor(value)
              }
            },
            {
              column: "I",
              dataElement: "trch-tt-age",
              mapping: function(value, row) {
                if (/(\d+)/.test(value))
                  return parseInt(/(\d+)/.exec(value)[1], 10)
              }
            },
            {
              column: "I",
              dataElement: "trch-tt-sex",
              mapping: function(value, row) {
                var sex = "";
                if (/Female/i.test(value)) sex += 'f';
                if (/Male/.test(value)) sex += 'm';
                return sex;
              }
            },
            {
              column: "J",
              dataElement: "trch-tt-survey-source"
            },

            // Persons operated for TT, annual data, so put in December
            {
              column: "K",
              variable: "trch-persons-operated-male",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "L",
              variable: "trch-persons-operated-female",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "M",
              variable: "trch-persons-operated-all",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "K",
              dataElement: "trch-persons-operated",
              categoryOptionCombo: "sex-male",
              period: function(value, row) {
                return params.period + "12";
              },
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['trch-persons-operated-male'];
                var female = variables['trch-persons-operated-female'];
                var all = variables['trch-persons-operated-all'];
                if (all > 0) {
                  return 0;
                } else {
                  return male;
                }
              }
            },
            {
              column: "L",
              dataElement: "trch-persons-operated",
              categoryOptionCombo: "sex-female",
              period: function(value, row) {
                return params.period + "12";
              },
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['trch-persons-operated-male'];
                var female = variables['trch-persons-operated-female'];
                var all = variables['trch-persons-operated-all'];
                if (all > 0) {
                  return 0;
                } else {
                  return female;
                }
              }
            },
            {
              column: "M",
              dataElement: "trch-persons-operated",
              categoryOptionCombo: "sex-unknown",
              period: function(value, row) {
                return params.period + "12";
              },
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['trch-persons-operated-male'];
                var female = variables['trch-persons-operated-female'];
                var all = variables['trch-persons-operated-all'];
                if (male <= 0 && female <= 0) {
                  return all;
                } else {
                  return 0;
                }
              }
            },



            // Month of MDA
            {
              column: "O",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "O",
              variable: "mdamonth",
              mapping: function(value) {
                if (value) {
                  for (var i = 0; i < month_names.length; i++) {
                    if (month_names[i] == value || month_names_short[i] == value) {
                      return i + 1;
                    }
                  }
                }
              }
            },

            // Persons targeted for trachoma treatment
            {
              column: "N",
              dataElement: "pcn-pop-trgt-tr",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row) {
                return Math.floor(value);
              }
            },

            // Antib. - Az tabs 
            {
              column: "P",
              variable: "pcn-pop-trt-tr-ztabs-female",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "Q",
              variable: "pcn-pop-trt-tr-ztabs-male",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "Q",
              variable: "pcn-pop-trt-tr-ztabs-all",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "P",
              dataElement: "pcn-pop-trt-tr-ztabs",
              categoryOptionCombo: "age-unknown-sex-female",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-ztabs-female'];
                var all = variables['pcn-pop-trt-tr-ztabs-all'];
                if (female > 0) {
                  return female;
                }
              }
            },
            {
              column: "Q",
              dataElement: "pcn-pop-trt-tr-ztabs",
              categoryOptionCombo: "age-unknown-sex-male",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['pcn-pop-trt-tr-ztabs-male'];
                var all = variables['pcn-pop-trt-tr-ztabs-all'];
                if (male > 0) {
                  return male;
                }
              }
            },
            {
              column: "R",
              dataElement: "pcn-pop-trt-tr-ztabs",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-ztabs-female'];
                var male = variables['pcn-pop-trt-tr-ztabs-male'];
                var all = variables['pcn-pop-trt-tr-ztabs-all'];
                if (male <= 0 && female <= 0) {
                  return all;
                } else {
                  return 0;
                }
              }
            },

            // Antib. - Az Oral 
            {
              column: "S",
              variable: "pcn-pop-trt-tr-zsyrup-female",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "T",
              variable: "pcn-pop-trt-tr-zsyrup-male",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "U",
              variable: "pcn-pop-trt-tr-zsyrup-all",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "S",
              dataElement: "pcn-pop-trt-tr-zsyrup",
              categoryOptionCombo: "age-unknown-sex-female",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-zsyrup-female'];
                var all = variables['pcn-pop-trt-tr-zsyrup-all'];
                if (female > 0) {
                  return female;
                }
              }
            },
            {
              column: "T",
              dataElement: "pcn-pop-trt-tr-zsyrup",
              categoryOptionCombo: "age-unknown-sex-male",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['pcn-pop-trt-tr-zsyrup-male'];
                var all = variables['pcn-pop-trt-tr-zsyrup-all'];
                if (male > 0) {
                  return male;
                }
              }
            },
            {
              column: "U",
              dataElement: "pcn-pop-trt-tr-zsyrup",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-zsyrup-female'];
                var male = variables['pcn-pop-trt-tr-zsyrup-male'];
                var all = variables['pcn-pop-trt-tr-zsyrup-all'];
                if (male <= 0 && female <= 0) {
                  return all;
                } else {
                  return 0;
                }
              }
            },

            // Antib. - Az Oral 
            {
              column: "V",
              variable: "pcn-pop-trt-tr-teo-female",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "W",
              variable: "pcn-pop-trt-tr-teo-male",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "X",
              variable: "pcn-pop-trt-tr-teo-all",
              mapping: function(value, row) {
                parseInt(value, 10);
              }
            },
            {
              column: "V",
              dataElement: "pcn-pop-trt-tr-teo",
              categoryOptionCombo: "age-unknown-sex-female",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-teo-female'];
                var all = variables['pcn-pop-trt-tr-teo-all'];
                if (female > 0) {
                  return female;
                }
              }
            },
            {
              column: "W",
              dataElement: "pcn-pop-trt-tr-teo",
              categoryOptionCombo: "age-unknown-sex-male",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var male = variables['pcn-pop-trt-tr-teo-male'];
                var all = variables['pcn-pop-trt-tr-teo-all'];
                if (male > 0) {
                  return male;
                }
              }
            },
            {
              column: "X",
              dataElement: "pcn-pop-trt-tr-teo",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row) {
                var variables = getRowVariables(row);
                var female = variables['pcn-pop-trt-tr-teo-female'];
                var male = variables['pcn-pop-trt-tr-teo-male'];
                var all = variables['pcn-pop-trt-tr-teo-all'];
                if (male <= 0 && female <= 0) {
                  return all;
                } else {
                  return 0;
                }
              }
            },

            // Facial Cleanliness
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-mda-time",
              mapping: function(value) {
                return hasText(value, "At time of MDA", true) ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-school",
              mapping: function(value) {
                return hasText(value, "School Based", true) ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-media",
              mapping: function(value) {
                return hasText(value, "Radio Message and/or other mass media", true) ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-chw",
              mapping: function(value) {
                return hasText(value, "Village health worker or equivalent", true) ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-primaryhc",
              mapping: function(value) {
                return hasText(value, "Primary healthcare", true) ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-other",
              mapping: function(value) {
                return hasText(value, "Other") ? "true" : null;
              }
            },
            {
              column: "AD",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-none",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : null;
              }
            },
            // Environmental Improvement
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-latrinenttf",
              mapping: function(value) {
                return hasText(value, "Latrine construction by NTTF Member", true) ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-waterpointnttf",
              mapping: function(value) {
                return hasText(value, "Water point construction by NTTF member", true) ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-latrineother",
              mapping: function(value) {
                return hasText(value, "Latrine construction by other stakeholders", true) ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-waterpointother",
              mapping: function(value) {
                return hasText(value, "Water point construction by other stakeholders", true) ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-commsani",
              mapping: function(value) {
                return hasText(value, "Community led total sanitation", true) ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-other",
              mapping: function(value) {
                return hasText(value, "Other") ? "true" : null;
              }
            },
            {
              column: "AE",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-none",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : null;
              }
            },
            {
              column: "AF",
              dataElement: "comments"
            }
          ]
        }
      },

      // Zithromax Application
      // {
      //   names: [/5-\d{4} Zithr/],
      //   startRow: 9,
      //   row: {
      //     invariants: {
      //       period: function(row) {
      //         return params.period + 2;
      //       },
      //       orgUnit: findOrg,
      //     },
      //     mappings: [
      //       {
      //         column: "A",
      //         variable: "zone",
      //         orgUnit: null
      //       },
      //       {
      //         column: "B",
      //         variable: "region",
      //         orgUnit: null
      //       },
      //       {
      //         column: "C",
      //         variable: "woreda",
      //         orgUnit: null
      //       },
      //       {
      //         column: "D",
      //         variable: "geoconnectID",
      //         orgUnit: null
      //       },
      //       {
      //         column: "K",
      //         dataElement: "yD4patF6TMc"
      //       },
      //       {
      //         column: "L",
      //         dataElement: "XpXE3AYoW4V",
      //         mapping: function(value) {
      //           return Math.floor(value);
      //         }
      //       },
      //       {
      //         column: "M",
      //         dataElement: "qXfluft9WvF"
      //       },
      //       {
      //         column: "N",
      //         dataElement: "pcn-pcdate",
      //         mapping: function(value) {
      //           for (var i = 0; i < month_names_short.length; i++) {
      //             if (hasText(value, month_names_short[i]), true) {
      //               return i + 1;
      //             }
      //           }
      //         }
      //       },
      //       {
      //         column: "O",
      //         dataElement: "HDIz3YLsw73",
      //         mapping: function(value) {
      //           if (hasText(value, "yes", true)) return "true";
      //           if (hasText(value, "no", true)) return "false";
      //         }
      //       },
      //       {
      //         column: "P",
      //         dataElement: "dEFippgWHZi"
      //       },
      //       {
      //         column: "Q",
      //         dataElement: "fY74mfHG6Xr"
      //       },
      //       {
      //         column: "R",
      //         dataElement: "QZpTVwpsbw1",
      //         mapping: function(value) {
      //           for (var i = 0; i < month_names_short.length; i++) {
      //             if (hasText(value, month_names_short[i]), true) {
      //               return i + 1;
      //             }
      //           }
      //         }
      //       }
      //     ]
      //   }
      // }
    ]
  }

  // Helper Funtions:

  function monthPeriod(row, data) {
    var variables = getRowVariables(row);
    var year = variables['year'];
    var mdamonth = variables['mdamonth'];
    if (mdamonth < 10) {mdamonth = "0" + mdamonth}
    if (mdamonth)
      return "" + year + mdamonth;
    else
      return "" + year + "12";
  }

  function findOrg(row) {
    var variables = getRowVariables(row);
    var org = null;
    if (variables.geoconnectID) {
      org = geconnectLookup(params.orgUnits)[variables.geoconnectID];
    }
    if (!org && variables.zone && variables.region && variables.woreda) {
      var orgNames = [params.rootOrgName, variables.zone, 
        variables.region, variables.woreda];
      org = districtLookup(params.orgUnits, orgNames);
      if (org) return org.id;
    }
    if (!org) {
      console.log("Unable to find Organization:")
      console.log(variables);
    }
    return org;
  }
  function getRowVariables(row) {
    var variables = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].variable) variables[row[i].variable] = row[i].value;
    }
    return variables;
  }

  // Geoconnect Mapping
  // {geoconnectID: orgUnit.id}
  var geoconnectMapping = null;
  function geconnectLookup(orgUnits) {
    if (!geoconnectMapping) {
      // Populate org mapping (Geoconnect ID to orgUnit)
      geoconnectMapping = {};
      for (var i = 0; i < orgUnits.length; i++) {
        var orgUnit = orgUnits[i];
        var av = getOrgAttribute(orgUnit, params['geoconnectAttributeID']);
        if (av) geoconnectMapping[av['value']] = orgUnit['id'];
      }
    }
    return geoconnectMapping;  
  }

  // Look up a district by a path of its names,
  // including alternate spellings (from attribute)
  function districtLookup(orgUnits, orgNames) {
    var path = '';
    var org = null;
    // console.log(orgNames);
    for (var i = 0; i < orgNames.length; i++) {
      var name = orgNames[i].trim().toLowerCase();
      org = findOrgNamedAtPath(orgUnits, name, path);
      if (org) {
        path = org.path;
      } else {
        return null;
      }
    }
    return org;
  }
  function findOrgNamedAtPath(orgUnits, name, path) {
    // console.log(name, path);
    for (var i = 0; i < orgUnits.length; i++) {
      var orgUnit = orgUnits[i];
      if (orgNames(orgUnit).indexOf(name) > -1) {
        // console.log(path + orgUnit.id);
        // console.log(orgUnit.path);
        if (path + '/' + orgUnit.id ==  orgUnit.path) {
          // console.log(orgUnit)
          return orgUnit;
        } 
      }
    }
  }
  function orgNames(orgUnit) {
    var names = [orgUnit.name.trim().toLowerCase()];
    var av = getOrgAttribute(orgUnit, params['spellingsAttributeID']);
    if (av && av.value) {
      var otherSpellings = av.value.split(',');
      if (otherSpellings && otherSpellings.length) {
        for (var i = 0; i < otherSpellings.length; i++) {
          if (otherSpellings[i].trim) {
            names.push(otherSpellings[i].trim().toLowerCase());
          }
        }
      }
    }
    return names;
  }


  function getOrgAttribute(orgUnit, attributeId) {
    if (orgUnit.attributeValues) {
      for (var a = 0; a < orgUnit.attributeValues.length; a++) {
        var av = orgUnit.attributeValues[a]
        if (av['attribute']['id'] == attributeId) {
          return av;
        }
      }
    }
  }

  function rowElementValue(row, dataElement, categoryOptionCombo, period, orgUnit) {
    for (var i = 0; i < row.length; i++) {
      if (dataElement == row.dataElement &&
          (categoryOptionCombo == null || categoryOptionCombo == row.categoryOptionCombo) &&
          (period == null || period == row.period) &&
          (orgUnit == null || orgUnit == row.orgUnit)) {
        return row.value;
      }
    }
  }

  function hasText(value, text, ignoreCase) {
    if (value && text && value.indexOf) {
      if (ignoreCase) {
        return value.toLowerCase().indexOf(text.toLowerCase()) > -1;
      } else {
        return value.indexOf(text) > -1;
      }
    } else {
      return false
    }
  }

  return def;
}