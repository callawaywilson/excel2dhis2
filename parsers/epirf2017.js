module.exports = function(_params) {

  let moment = require('moment');

  let params = Object.assign({
    orgUnits: null,
    orgTree: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    lfProgram: "pcn-lfsurvey-event",
    // lfProgram: "pcn-lfsurvey-event",
    // lfProgramStage: "jrgpfrJKSW0",
    onchoProgram: "pcn-ovsurvey-event",
    // onchoProgram: "pcn-ovsurvey-event",
    // onchoProgramStage: "f1QqINpgrcR",
    sthProgram: "pcn-sthsurvey-event",
    schProgram: "pcn-schsurvey-event",
    rootOrgName: 'Ethiopia',
    attributeOptionCombo: "default",
    attributeCategoryOptions: "default"
  }, _params);

  var def = {
    params: params,

    sheets: [

      // LF Sheet
      {
        names: [/LF/],
        startRow: 17,
        params: params,
        row: {
          event: {
            // event: function(row) {
            //   var district = getRowVariables(row)['district'];
            //   if (!district) district = "0"
            //   var date = getRowVariables(row)['surveydate'];
            //   if (!date) {
            //     date = moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
            //   }
            //   return params.lfProgram + "-" + district.id + "-" + date;
            // },
            program: params.lfProgram,
            programStage: params.lfProgramStage,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['surveydate'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Type of survey
            {
              column: "A",
              dataElement: "lf-survey-type",
              mapping: function(value, row) {
                if (value == "Mapping") {
                  return "mapping";
                } else if (value == "Sentinel site") {
                  return "sentinel";
                } else if (value == "Spot check") {
                  return "spotcheck";
                } else if (value == "TAS1") {
                  return "tas1";
                } else if (value == "Repeated TAS1") {
                  return "tas1-repeated";
                } else if (value == "TAS2") {
                  return "tas2";
                } else if (value == "TAS3") {
                  return "tas3";
                } else if (value == "Clinical case estimation") {
                  return "cce";
                }
              }
            },
            // Name of survey site
            {
              column: "B",
              dataElement: "pcn-site-name",
            },
            // Name of administrative (implementation) unit
            {
              column: "C",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Date of Survey
            {
              column: "E",
              variable: "surveydate",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid())
                  d = moment(value + ' ' + params.period, 'MMMM YYYY' );
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "F",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "G",
              variable: "longitude"
            },
            // Date of the first PC round
            {
              column: "H",
              dataElement: "pcn-first-round-date",
              mapping: function(value, row) {
                if (value) {
                  return moment(value).format('YYYY-MM-DD');
                }
              }
            },
            // Number of rounds of PC delivered prior to survey
            {
              column: "I",
              dataElement: "pcn-num-rounds-pre-survey",
              mapping: function(value, row) {
                if (value) {
                  return parseInt(value, 10);
                }
              }
            },
            // Diagnostic Test
            {
              column: "J",
              dataElement: "lf-diagnostic-test",
              mapping: function(value, row) {
                if (value === "Blood film/counting chamber (mf)") {
                  return "blood-cc-mf";
                } else if (value === "FTS (Ag)") {
                  return "fts-ag";
                } else if (value === "ICT (Ag)") {
                  return "ict-ag";
                } else if (value === "Brugia Rapid (Ab)") {
                  return "brugia-rapid";
                } else if (value === "FTS/ICT + Brugia Rapid") {
                  return "ftsict-brugia";
                } else if (value === "Other") {
                  return "other";
                }
              }
            },
            // Age - Minimum
            {
              column: "K",
              dataElement: "pcn-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[1]) return parseInt(match[1],10)
              }
            },
            // Age - Maximum
            {
              column: "K",
              dataElement: "pcn-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[2]) return parseInt(match[2],10)
              }
            },
            // Survey Site Type
            {
              column: "L",
              dataElement: "lf-site-type",
              mapping: function(value, row) {
                if (value === "School") {
                  return "school";
                } else if (value === "Community") {
                  return "community";
                }
              }
            },
            // Survey Methodology 
            {
              column: "M",
              dataElement: "lf-survey-method",
              mapping: function(value, row) {
                if (value === "Cluster") {
                  return "cluster";
                } else if (value === "Systematic") {
                  return "systematic";
                } else if (value === "Census") {
                  return "census";
                } else if (value === "Convenience") {
                  return "convenience";
                }
              }
            },
            // Target sample size
            {
              column: "N",
              dataElement: "pcn-target-sample-size",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of people examined
            {
              column: "O",
              dataElement: "pcn-num-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of people positive
            {
              column: "P",
              dataElement: "pcn-num-positive",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of invalid tests
            {
              column: "R",
              dataElement: "pcn-num-invalid-tests",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // LF Decision
            {
              column: "S",
              dataElement: "lf-decision",
              mapping: function(value, row) {
                if (value === "Start PC") {
                  return "start-pc";
                } else if (value === "Continue PC") {
                  return "continue-pc";
                } else if (value === "Stop PC") {
                  return "stop-pc";
                } else if (value === "Restart PC") {
                  return "restart-pc";
                } else if (value === "Continue surveillance") {
                  return "continue-surveillance";
                }
              }
            },
            // LF - Number of Patients (Lymphoedema)
            {
              column: "T",
              dataElement: "lf-lym-num-patients",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // LF - Method of Patient Estimation (Lymphoedema)
            {
              column: "U",
              dataElement: "lf-lym-patients-est-method",
              mapping: function(value, row) {
                return value;
              }
            },
            // LF - Date of Patient Estimation (Lymphoedema) 
            {
              column: "V",
              dataElement: "lf-lym-patients-est-date",
              mapping: function(value, row) {
                if (value) {
                  var matches = value.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                  if (matches && matches.length > 0) {
                    return moment(matches[0],'MM-DD-YYYY').format('YYYY-MM-DD');
                  }
                }
              }
            },
            // LF - Number of Health Facilities (Lymphoedema) 
            {
              column: "W",
              dataElement: "lf-lym-service-facilities",
              mapping: function(value, row) {
                return value;
              }
            },
            // LF - Number of Patients (Hydrocele)
            {
              column: "X",
              dataElement: "lf-hc-num-patients",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // LF - Method of Patient Estimation (Lymphoedema)
            {
              column: "Y",
              dataElement: "lf-hc-patients-est-method",
              mapping: function(value, row) {
                return value;
              }
            },
            // LF - Date of Patient Estimation (Lymphoedema) 
            {
              column: "Z",
              dataElement: "lf-hc-patients-est-date",
              mapping: function(value, row) {
                if (value) {
                  var matches = value.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
                  if (matches && matches.length > 0) {
                    return moment(matches[0],'MM-DD-YYYY').format('YYYY-MM-DD');
                  }
                }
              }
            },
            // LF - Number of Health Facilities (Lymphoedema) 
            {
              column: "AA",
              dataElement: "lf-hc-service-facilities",
              mapping: function(value, row) {
                return value;
              }
            },
            // Comments
            { 
              column: "AB",
              variable: "comments"
            }
          ]
        }
      },

      // Oncho Sheet
      {
        names: [/ONCHO/],
        startRow: 8,
        params: params,
        row: {
          event: {
            // event: function(row) {
            //   var district = getRowVariables(row)['district'];
            //   if (!district) district = "0"
            //   var date = getRowVariables(row)['dateOfSurvey'];
            //   if (!date) {
            //     date = moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
            //   }
            //   return params.onchoProgram + "-" + district.id + "-" + date;
            // },
            program: params.onchoProgram,
            programStage: params.onchoProgramStage,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['dateOfSurvey'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Type of survey
            {
              column: "A",
              dataElement: "ov-survey-type",
              mapping: function(value, row) {
                if (value === "Mapping") {
                  return "mapping";
                } else if (value === "Phase 1A") {
                  return "phase1a";
                } else if (value === "Phase 1B") {
                  return "phase1b";
                } else if (value === "PTS") {
                  return "pts";
                }
              }
            },
            // Admin Level 1
            {
              column: "B",
              variable: "regionName",
              mapping: function(value, row) {
                return value
              }
            },
            // Admin Level 2
            {
              column: "C",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Community Surveyed 
            {
              column: "D",
              dataElement: "pcn-community",
            },
            // Date of survey
            {
              column: "E",
              variable: "dateOfSurvey",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid()) 
                  d = moment(value + ' ' + params.period, 'MMMM YYYY' );
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "F",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "G",
              variable: "longitude"
            },
            // Date of First PC Round
            {
              column: "H",
              dataElement: "pcn-first-round-date",
              mapping: function(value, row) {
                if (value) {
                  return moment(value, 'YYYY').format('YYYY-MM-DD');
                }
              }
            },
            // Treatment Strategy
            {
              column: "I",
              dataElement: "ov-treatment-strategy",
              mapping: function(value, row) {
                if (value === "Annual") {
                  return "annual";
                } else if (value === "Semi-annual") {
                  return "semiannual";
                }
              }
            },
            // Pre-control prevalence
            {
              column: "J",
              dataElement: "ov-pre-control-prevalence",
              mapping: function(value, row) {
                return value;
              }
            },
            // Rounds delivered p. to survey
            {
              column: "K",
              dataElement: "pcn-num-rounds-pre-survey",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },

            // MF Skin Snip
            // Diagnostic Method
            {
              column: "L",
              dataElement: "ov-mf-skin-diag-method",
              mapping: function(value, row) {
                if (value === "Microscopy") {
                  return "microscopy";
                } else if (value === "PCR") {
                  return "pcr";
                }
              }
            },
            // Number People Examined
            {
              column: "M",
              dataElement: "ov-mf-skin-num-people-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Min Age
            {
              column: "N",
              dataElement: "ov-mf-skin-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[1]) return parseInt(match[1],10)
              }
            },
            // Max Age
            {
              column: "N",
              dataElement: "ov-mf-skin-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[2]) return parseInt(match[2],10)
              }
            },
            // Number People Positive
            {
              column: "O",
              dataElement: "ov-mf-skin-num-people-pos",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // CMFL
            {
              column: "Q",
              dataElement: "ov-mf-skin-community-load"
            },

            // Serology
            // Diagnostic Method
            {
              column: "R",
              dataElement: "ov-serology-diag",
              mapping: function(value, row) {
                if (value === "RDT") {
                  return "rdt";
                } else if (value === "ELISA") {
                  return "elisa";
                }
              }
            },
            // Sampling Method
            {
              column: "S",
              dataElement: "ov-serology-sampling-method",
              mapping: function(value, row) {
                if (value === "Cluster") {
                  return "cluster";
                } else if (value === "Systematic") {
                  return "systematic";
                } else if (value === "Convenience") {
                  return "convenient";
                }
              }
            },
            // Number People Examined
            {
              column: "T",
              dataElement: "ov-serology-num-people-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Min Age
            {
              column: "U",
              dataElement: "ov-serology-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match[1]) return parseInt(match[1],10)
              }
            },
            // Max Age
            {
              column: "U",
              dataElement: "ov-serology-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match[2]) return parseInt(match[2],10)
              }
            },
            // Number People Positive
            {
              column: "V",
              dataElement: "ov-serology-num-people-pos",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },

            // PCR in black flies
            // # Flies Examined
            {
              column: "X",
              dataElement: "ov-pcr-num-flies-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Species of vector
            {
              column: "Y",
              dataElement: "ov-pcr-species-vector"
            },
            // % Poolscreen positive
            {
              column: "Z",
              dataElement: "ov-pct-poolscreen-pos",
              mapping: function(value, row) {
                if (value) return parseFloat(value);
              }
            },

            // Crabs
            // # Crabs Examined
            {
              column: "AA",
              dataElement: "ov-crab-num-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Species of vector
            {
              column: "AB",
              dataElement: "ov-crab-species-vector"
            },
            // % MF positive
            {
              column: "AC",
              dataElement: "ov-crab-pct-mf-pos",
              mapping: function(value, row) {
                if (value) return parseFloat(value);
              }
            },
            // Programmatic decision
            { 
              column: "AD",
              dataElement: "ov-programmatic-decision",
              mapping: function(value, row) {
                if (value === "Continue MDA") {
                  return "continue-mda";
                } else if (value === "Change MDA Strategy") {
                  return "change-mda-strategy";
                } else if (value === "Stop MDA") {
                  return "stop-mda";
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

  function getDistrict(districtName) {
    for (var r = 0; r < params.orgTree.children.length; r++) {
      var region = params.orgTree.children[r];
      for (var z = 0; z < region.children.length; z++) {
        var zone = region.children[z];
        for (var w = 0; w < zone.children.length; w++) {
          var woreda = zone.children[w];
          for (var s = 0; s < woreda.spellings.length; s++) {
            if (woreda.spellings[s].toLowerCase().trim() === districtName.toLowerCase().trim()) {
              return woreda;
            }
          }
        }
      }
    }
    console.log("Unable to find district named '" + districtName + "'");
  }

  return def;

}