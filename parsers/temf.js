module.exports = function(_params) {

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
            }
          ]
        }
      }
    ]
  }

  // Helper Funtions:

  let orgUnitMapping = null;
  function orgUnitLookup(orgUnits) {
    // console.log(orgUnits);
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

  return def;
}