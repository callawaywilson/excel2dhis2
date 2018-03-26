module.exports = function(_params) {

  let month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let params = Object.assign({
    period: null,
    orgUnits: null,
    geoconnectAttributeID: 'rct9QrdQEnz'
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
            orgUnit: function(row) {
              for (var i = 0; i < row.length; i++) {
                if (row[i].geoconnectID) {
                  return orgUnitLookup(params.orgUnits)[row[i].geoconnectID];
                }
              }
            },
          },
          mappings: [
            {
              column: "D",
              variable: "geoconnectID"
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
              categoryOptionCombo: "XxPgNmIyWEx"
            },
            {
              column: "L",
              dataElement: "d7TTTQDQSEL",
              categoryOptionCombo: "H8q1t9ex8OR"
            },
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
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "xtUty2s6rb9"
            },
            {
              column: "Q",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "rVAT5UlKOVq"
            },
            {
              column: "R",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "uE0CxADyNck",
              mapping: function(value, row) {
                if (!rowElementValue(row, "NrsJDmb5ymd", "xtUty2s6rb9") &&
                   !rowElementValue(row, "NrsJDmb5ymd", "uE0CxADyNck")) {
                  return value;
                }
              }
            },
            // Antib. - Az Oral
            {
              column: "S",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "AkUk2I8UYdo"
            },
            {
              column: "T",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "ueQESuOZbTK"
            },
            {
              column: "U",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "VDJkgG8WuMr",
              mapping: function(value, row) {
                if (!rowElementValue(row, "NrsJDmb5ymd", "AkUk2I8UYdo") &&
                   !rowElementValue(row, "NrsJDmb5ymd", "ueQESuOZbTK")) {
                  return value;
                }
              }
            },
            // Antib. - Tet Oin
            {
              column: "V",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "igXj2FYlmQ3"
            },
            {
              column: "W",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "GoajnE9epLK"
            },
            {
              column: "X",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "VnTPvQznpOf",
              mapping: function(value, row) {
                if (!rowElementValue(row, "NrsJDmb5ymd", "igXj2FYlmQ3") &&
                   !rowElementValue(row, "NrsJDmb5ymd", "GoajnE9epLK")) {
                  return value;
                }
              }
            },
            // Antib. - Az Drops 
            {
              column: "V",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "vcUu6ODYhLw"
            },
            {
              column: "W",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "hskrbPDMQ8u"
            },
            {
              column: "X",
              dataElement: "NrsJDmb5ymd",
              categoryOptionCombo: "lmiSrZd1dDJ",
              mapping: function(value, row) {
                if (!rowElementValue(row, "NrsJDmb5ymd", "vcUu6ODYhLw") &&
                   !rowElementValue(row, "NrsJDmb5ymd", "hskrbPDMQ8u")) {
                  return value;
                }
              }
            },
            // Facial Cleanliness
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "WUjsOlQ1ta4",
              mapping: function(value) {
                return hasText(value, "At time of MDA", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "JVgAvwuqe6H",
              mapping: function(value) {
                return hasText(value, "School Based", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "gzyIHIx7qQd",
              mapping: function(value) {
                return hasText(value, "Radio Message and/or other mass media", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "cAbNbOtOV5Y",
              mapping: function(value) {
                return hasText(value, "Village health worker or equivalent", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "yGcTqXGXmQs",
              mapping: function(value) {
                return hasText(value, "Primary healthcare", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "qClFirrlViZ",
              mapping: function(value) {
                return hasText(value, "Other", true) ? "true" : "false";
              }
            },
            {
              column: "AD",
              dataElement: "o33d514b4LM",
              categoryOptionCombo: "dSbmqcOKis2",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : "false";
              }
            },
            // Environmental Improvement
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "bcqX62Vavtz",
              mapping: function(value) {
                return hasText(value, "Latrine construction by NTTF Member", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "Kb8PX7E8r2j",
              mapping: function(value) {
                return hasText(value, "Water point construction by NTTF member", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "Q26YQD2JeWO",
              mapping: function(value) {
                return hasText(value, "Latrine construction by other stakeholders", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "Ue60RFoLwWi",
              mapping: function(value) {
                return hasText(value, "Water point construction by other stakeholders", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "wVxHAvy7psp",
              mapping: function(value) {
                return hasText(value, "Community led total sanitation", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "fS91yAIC7qR",
              mapping: function(value) {
                return hasText(value, "Other", true) ? "true" : "false";
              }
            },
            {
              column: "AE",
              dataElement: "gqnbsVPxSoV",
              categoryOptionCombo: "JMe37GzRyb3",
              mapping: function(value) {
                return hasText(value, "None", true) ? "true" : "false";
              }
            },
            {
              column: "AF",
              dataElement: "zknpxa5S7P0"
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
              return params.period;
            },
            orgUnit: function(row) {
              for (var i = 0; i < row.length; i++) {
                if (row[i].geoconnectID) {
                  return orgUnitLookup(params.orgUnits)[row[i].geoconnectID];
                }
              }
            },
          },
          mappings: [
            {
              column: "D",
              variable: "geoconnectID"
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
              dataElement: "FtgUASI0s26",
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

  var orgUnitMapping = null;
  function orgUnitLookup(orgUnits) {
    if (!orgUnitMapping) {
      // Populate org mapping (Geoconnect ID to orgUnit)
      orgUnitMapping = {};
      for (var i = 0; i < orgUnits.length; i++) {
        var orgUnit = orgUnits[i];
        if (orgUnit.attributeValues) {
          for (var a = 0; a < orgUnit.attributeValues.length; a++) {
            var av = orgUnit.attributeValues[a]
            if (av['attribute']['id'] == params['geoconnectAttributeID']) {
              orgUnitMapping[av['value']] = orgUnit['id'];
            }
          }
        }
      }
    }
    return orgUnitMapping;  
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