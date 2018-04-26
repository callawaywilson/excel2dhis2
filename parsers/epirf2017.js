module.exports = function(_params) {

  let params = Object.assign({
    period: null,
    orgUnits: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    program: "TBJMLbC2QM1",
    programStage: "jrgpfrJKSW0",
    rootOrgName: 'Ethiopia',
    attributeCategoryOptions: "xYerKDKCefk"
  }, _params);


  var def = {
    sheets: [

      // LF Sheet
      {
        names: [/LF/],
        startRow: 17,
        params: params,
        row: {
          invariants: {

          },
          events: {
            program: params.program,
            dataValues: [
              // Type of survey
              {
                column: "A",
                dataElement: "GY0DIuqIei9"
                mapping: function(value, row) {
                  if (value == "Mapping") {
                    return "mapping";
                  } else if (value == "Sentinel site") {
                    return "sentinel_site";
                  } else if (value == "Spot check") {
                    return "spot_check";
                  } else if (value == "TAS1") {
                    return "tas1";
                  } else if (value == "Repeated TAS1") {
                    return "tas1_repeated";
                  } else if (value == "TAS2") {
                    return "tas2";
                  } else if (value == "TAS3") {
                    return "tas3";
                  } else if (value == "Clinical case estimation") {
                    return "cce";
                  }
                }
              },
            ]
          }
        }
      }

  };

  return def;

}