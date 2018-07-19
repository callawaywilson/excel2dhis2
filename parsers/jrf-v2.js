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

  var orgTree = params.orgTree;
  var geoconnectLookup = orgsToGeoconnectLookup(params.orgUnits);

  var def = {
    params: params,
    definition: {
      defaults: {
        categoryOptionCombo: "HllvX50cXC0",
        attributeOptionCombo: "HllvX50cXC0",
      }
    },
    sheets: [

      // MDA1
      {
        names: [/MDA1/],
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
            {
              column: "E",
              dataElement: "pcn-pcdate",
              categoryOptionCombo: "pcnd-int-ivmalb",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-ivmalb-age-sac-sex-unknown",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-ivmalb-age-adult-sex-unknown",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-ivmalb-age-sac-sex-unknown",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-ivmalb-age-adult-sex-unknown",
              mapping: function(value) {return Math.round(value)}
            }
          ]
        }
      },

      // MDA2
      {
        names: [/MDA2/],
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
            {
              column: "E",
              dataElement: "pcn-pcdate",
              categoryOptionCombo: "pcnd-int-pzq", 
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "F",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-decalb-age-presac-sex-unknown",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-decalb-age-sac-sex-unknown",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-decalb-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "J",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "age-presac",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "age-sac",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-decalb-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            }

          ]
        }
      },

      // MDA3
      {
        names: [/MDA3/],
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
            {
              column: "E",
              dataElement: "pcn-pcdate",
              categoryOptionCombo: "pcnd-int-ivm",  
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "F",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-ivm-age-sac-sex-unknown-sac",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-ivm-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated - #1
            {
              column: "I",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-ivm-age-sac-sex-unknown",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "J",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-ivm-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated - #2
            {
              column: "L",
              dataElement: "yn8ZrOTU6cV",
              categoryOptionCombo: "pcnd-int-ivm-r2-age-sac-sex-unknown",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "M",
              dataElement: "yn8ZrOTU6cV",
              categoryOptionCombo: "pcnd-int-ivm-r2-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            }
          ]
        }
      },

      // T1
      {
        names: [/T1/],
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
            // removed for june
            // {
            //   column: "E",
            //   dataElement: "cx7mIjgV6m1", // medicine used
            //   mapping: function(value, row) {
            //     if ((value || "").match(/mbd/i)) {
            //       return 'mbd';
            //     } else if ((value || "").match(/alb/i)) {
            //       return 'alb'
            //     }
            //   }
            // },
            {
              column: "F",
              dataElement: "pcn-pcdate",
              categoryOptionCombo: "pcnd-int-pzqmvd",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "G",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-alb-age-presac-sex-unknown",  // PRESAC-ALB
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-alb-age-sac-sex-unknown",  // SAC-ALB
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "I",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-pzq-age-sac-sex-unknown",  // SAC-PZQ
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "F",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "age-presac",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "age-sac",  // SAC ALB
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "age-adult",  // Adult
              mapping: function(value) {return Math.round(value)}
            }
          ]
        }
      },


      // T2
      {
        names: [/T2/],
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
            {
              column: "E",
              dataElement: "pcn-pcdate",
              categoryOptionCombo: "pcnd-int-pzq",  
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "F",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-pzq-age-presac-sex-unknown",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-pzq-age-sac-sex-unknown",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "pcn-pop-trgt",
              categoryOptionCombo: "pcnd-int-pzq-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "J",
              dataElement: "pcnd-int-pzq-age-presac-sex-unknown",
              categoryOptionCombo: "age-presac",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "pcnd-int-pzq-age-sac-sex-unknown",
              categoryOptionCombo: "age-sac",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "pcn-pop-trt",
              categoryOptionCombo: "pcnd-int-pzq-age-adult-sex-unknown",  // Adult
              mapping: function(value) {return Math.round(value)}
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
    var variables = getRowVariables(row);
    if (!variables.provincestate || !variables.district) {
      console.log("Missing district info: " + variables.provincestate + 
        "/" + variables.district);
      return null;
    }
    var org = districtLookupProvinceState(variables.provincestate, variables.district);
    if (!org) {
      org = districtLookupState(variables.provincestate, variables.district);
    }

    if (!org) {
      console.log("Unable to find district: " + variables.provincestate + 
        "/" + variables.district);
      return null;
    }
    return org.id;
  }


  function districtLookupProvinceState(provincestate, districtName) {
    //Find Region
    var regionRegionName = findChildNamed(orgTree, provincestate, 'start');
    if (!regionRegionName) return null;

    //Find Zone
    var zone = findChildNamed(regionRegionName[0], provincestate, 'end', 
      regionRegionName[1].length);
    if (!zone) return null;

    //Find District
    return findChildNamed(zone, districtName, null);
  }

  function districtLookupState(stateName, districtName) {
    for (var i = 0; i < orgTree.children.length; i++) {
      var region = orgTree.children[i];
      var zone = findChildNamed(region, stateName);
      if (zone) {
        return findChildNamed(zone, districtName);
      }
    }
  }

  function findChildNamed(node, name, namelocation, offset) {
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];
      for (var n = 0; n < child.spellings.length; n++) {
        var childName = child.spellings[n].toLowerCase();
        if (namelocation === 'start') {
          if (name.toLowerCase().indexOf(childName) == 0) {
            return [child, childName];
          }
        } else if (namelocation === 'end') {
          if (name.toLowerCase().indexOf(childName, 1) == offset) {
            return child;
          }
        } else {
          if (name.toLowerCase() === childName) {
            return child;
          }
        }
      }
    }
  }


  function getRowVariables(row) {
    var variables = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].variable) variables[row[i].variable] = row[i].value;
    }
    return variables;
  }


  // Org to flat geoconnect mapping
  // {"geoconnectId": {
  //   id: "ORG00000000",
  //   name: "Name",
  //   spellings: ["Name", "Name1", "Name2"],
  //   geoconnectId: "AAAAAAA"
  // },...}
  function orgsToGeoconnectLookup(orgUnits) {
    var lookup = {};
    for (var i = 0; i < orgUnits.length; i++) {
      var orgUnit = orgUnits[i];
      var geoAttr = getOrgAttribute(orgUnit, params['geoconnectAttributeID']);
      if (geoAttr && geoAttr.value) {
        lookup[geoAttr.value] = {
          id: orgUnit.id,
          name: orgUnit.name,
          //spellings: orgNames(orgUnit),
          path: orgUnit.path
        }
      }
    }
    return lookup;
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

  return def;
}