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
        categoryOptionCombo: "HllvX50cXC0",
        attributeOptionCombo: "HllvX50cXC0",
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
          mappings: [
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
              dataElement: "fwocIchmkBs"
            },
            {
              column: "G",
              dataElement: "iB2QByaVoiB"
            },
            {
              column: "H",
              dataElement: "L36uJKin4xW"
            },
            {
              column: "I",
              dataElement: "tYEOhAimtsQ",
              mapping: function(value, row) {
                if (/(\d+)/.test(value))
                  return /(\d+)/.exec(value)[1]
              }
            },
            {
              column: "I",
              dataElement: "mPMdsgLyqev",
              mapping: function(value, row) {
                var sex = "";
                if (/F/i.test(value)) sex += 'f';
                if (/M/i.test(value)) sex += 'm';
                return sex;
              }
            },
            {
              column: "J",
              dataElement: "vbohuRxSxDE"
            },
            {
              column: "K",
              dataElement: "d7TTTQDQSEL",
              categoryOptionCombo: "sex-female"
            },
            {
              column: "L",
              dataElement: "d7TTTQDQSEL",
              categoryOptionCombo: "sex-male"
            },
            // whgere is M?
            {
              column: "O",
              dataElement: "wjJTQ33NCbj",
              mapping: function(value) {
                if (value) {
                  for (var i = 0; i < month_names.length; i++) {
                    if (month_names[i] == value || month_names_short[i] == value) {
                      var month = (i < 9 ? '0' : '') + (i + 1)
                      return params.period + "-" + month + "-01"
                    }
                  }
                }
              }
            },
            // Antib. - Az tabs 
            {
              column: "P",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "xtUty2s6rb9"
            },
            {
              column: "Q",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "rVAT5UlKOVq"
            },
            {
              column: "R",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "uE0CxADyNck",
              mapping: function(value, row) {
                if (!rowElementValue(row, "pcn-pop-trt", "xtUty2s6rb9") &&
                   !rowElementValue(row, "pcn-pop-trt", "uE0CxADyNck")) {
                  return value;
                }
              }
            },
            // Antib. - Az Oral
            {
              column: "S",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "AkUk2I8UYdo"
            },
            {
              column: "T",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "ueQESuOZbTK"
            },
            {
              column: "U",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "VDJkgG8WuMr",
              mapping: function(value, row) {
                if (!rowElementValue(row, "pcn-pop-trt", "AkUk2I8UYdo") &&
                   !rowElementValue(row, "pcn-pop-trt", "ueQESuOZbTK")) {
                  return value;
                }
              }
            },
            // Antib. - Tet Oin
            {
              column: "V",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "igXj2FYlmQ3"
            },
            {
              column: "W",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "GoajnE9epLK"
            },
            {
              column: "X",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "VnTPvQznpOf",
              mapping: function(value, row) {
                if (!rowElementValue(row, "pcn-pop-trt", "igXj2FYlmQ3") &&
                   !rowElementValue(row, "pcn-pop-trt", "GoajnE9epLK")) {
                  return value;
                }
              }
            },
            // Antib. - Az Drops 
            {
              column: "V",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "vcUu6ODYhLw"
            },
            {
              column: "W",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "hskrbPDMQ8u"
            },
            {
              column: "X",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "lmiSrZd1dDJ",
              mapping: function(value, row) {
                if (!rowElementValue(row, "pcn-pop-trt", "vcUu6ODYhLw") &&
                   !rowElementValue(row, "pcn-pop-trt", "hskrbPDMQ8u")) {
                  return value;
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
      {
        names: [/5-\d{4} Zithr/],
        startRow: 9,
        row: {
          invariants: {
            period: function(row) {
              return params.period + 2;
            },
            orgUnit: findOrg,
          },
          mappings: [
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
              column: "K",
              dataElement: "yD4patF6TMc"
            },
            {
              column: "L",
              dataElement: "XpXE3AYoW4V",
              mapping: function(value) {
                return Math.floor(value);
              }
            },
            {
              column: "M",
              dataElement: "qXfluft9WvF"
            },
            {
              column: "N",
              dataElement: "pcn-pcdate",
              mapping: function(value) {
                for (var i = 0; i < month_names_short.length; i++) {
                  if (hasText(value, month_names_short[i]), true) {
                    return i + 1;
                  }
                }
              }
            },
            {
              column: "O",
              dataElement: "HDIz3YLsw73",
              mapping: function(value) {
                if (hasText(value, "yes", true)) return "true";
                if (hasText(value, "no", true)) return "false";
              }
            },
            {
              column: "P",
              dataElement: "dEFippgWHZi"
            },
            {
              column: "Q",
              dataElement: "fY74mfHG6Xr"
            },
            {
              column: "R",
              dataElement: "QZpTVwpsbw1",
              mapping: function(value) {
                for (var i = 0; i < month_names_short.length; i++) {
                  if (hasText(value, month_names_short[i]), true) {
                    return i + 1;
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }

  // Helper Funtions:
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