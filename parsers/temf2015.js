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
        startRow: 8,
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
              variable: "ITI Admin ID",
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
                  return /(\d+)/.exec(value)[1]
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

            // January - June Operations (apply to June)
            {
              column: "K",
              dataElement: "trch-persons-operated",
              categoryOptionCombo: "sex-unknown",
              period: function(value, row) {
                return params.period + "06";
              }
            },
            // July - December Operations (apply to December)
            {
              column: "L",
              dataElement: "trch-persons-operated",
              categoryOptionCombo: "sex-unknown",
              period: function(value, row) {
                return params.period + "12";
              }
            },

            // Month of MDA
            {
              column: "N",
              variable: 'year',
              mapping: function() {return params.period;}
            },
            {
              column: "N",
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
              column: "M",
              dataElement: "pcn-pop-trgt-tr",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: monthPeriod,
              mapping: function(value, row) {
                return Math.floor(value);
              }
            },


            // Antib. - Az tabs 
            {
              column: "O",
              dataElement: "pcn-pop-trt-tr-ztabs",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "06";
              }
            },
            {
              column: "P",
              dataElement: "pcn-pop-trt-tr-ztabs",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "12";
              }
            },

            // Antib. - Az Oral
            {
              column: "Q",
              dataElement: "pcn-pop-trt-tr-zsyrup",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "06";
              }
            },
            {
              column: "R",
              dataElement: "pcn-pop-trt-tr-zsyrup",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "12";
              }
            },

            // Antib. - Tet Oin
            {
              column: "S",
              dataElement: "pcn-pop-trt-tr-teo",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "06";
              }
            },
            {
              column: "T",
              dataElement: "pcn-pop-trt-tr-teo",
              categoryOptionCombo: "age-unknown-sex-unknown",
              period: function(value, row) {
                return params.period + "12";
              }
            },

            // Antib. - Az Drops - Not used in ETH
            // {
            //   column: "U",
            //   variable: "azDropsJanJune"
            // },
            // {
            //   column: "V",
            //   dataElement: "pcn-pop-trt",
            //   categoryOptionCombo: "lmiSrZd1dDJ",
            //   mapping: function(value, row) {
            //     var janJune = getRowVariables(row)['azDropsJanJune'];
            //     return (janJune || 0) + (value || 0);
            //   }
            // },

            // Facial Cleanliness
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-mda-time",
              mapping: function(value) {
                return hasText(value, "At time of MDA", true) ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-school",
              mapping: function(value) {
                return hasText(value, "School Based", true) ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-media",
              mapping: function(value) {
                return hasText(value, "Radio Message and/or other mass media", true) ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-chw",
              mapping: function(value) {
                return hasText(value, "Village health worker or equivalent", true) ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-primaryhc",
              mapping: function(value) {
                return hasText(value, "Primary healthcare", true) ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-other",
              mapping: function(value) {
                return hasText(value, "Other") ? "true" : null;
              }
            },
            {
              column: "Z",
              dataElement: "tra-outreach-fc",
              categoryOptionCombo: "tra-outreach-fc-none",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : null;
              }
            },
            // Environmental Improvement
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-latrinenttf",
              mapping: function(value) {
                return hasText(value, "Latrine construction by NTTF Member", true) ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-waterpointnttf",
              mapping: function(value) {
                return hasText(value, "Water point construction by NTTF member", true) ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-latrineother",
              mapping: function(value) {
                return hasText(value, "Latrine construction by other stakeholders", true) ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-waterpointother",
              mapping: function(value) {
                return hasText(value, "Water point construction by other stakeholders", true) ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-commsani",
              mapping: function(value) {
                return hasText(value, "Community led total sanitation", true) ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-other",
              mapping: function(value) {
                return hasText(value, "Other") ? "true" : null;
              }
            },
            {
              column: "AB",
              dataElement: "tra-outreach-ei",
              categoryOptionCombo: "tra-outreach-ei-none",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : null;
              }
            },
            {
              column: "AC",
              dataElement: "comments"
            }
          ]
        }
      },
      
    ]
  }

  function monthPeriod(row, data) {
    var variables = getRowVariables(row);
    var year = variables['year'];
    var mdamonth = variables['mdamonth'];
    if (mdamonth < 10) {mdamonth = "0" + mdamonth}
    return "" + year + mdamonth;
  }

  // Helper Funtions:
  function findOrg(row) {
    var variables = getRowVariables(row);
    var org = null;
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