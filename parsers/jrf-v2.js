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
              dataElement: "DoE8a6k9C4R",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            {
              column: "G",
              dataElement: "Fewjj1kZFy6",
              categoryOptionCombo: "AVegvKfvlnS",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "Fewjj1kZFy6",
              categoryOptionCombo: "yW288iFizUY",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "BEb0GZkSRPJ",
              categoryOptionCombo: "AVegvKfvlnS",
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "BEb0GZkSRPJ",
              categoryOptionCombo: "yW288iFizUY",
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
              dataElement: "Dq51uK1OS8i",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "F",
              dataElement: "knszUMU2VJz",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "knszUMU2VJz",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "knszUMU2VJz",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "J",
              dataElement: "McBm4Bsq7Qu",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "McBm4Bsq7Qu",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "McBm4Bsq7Qu",
              categoryOptionCombo: "yW288iFizUY",  // Adult
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
              dataElement: "ktCOzVn5CKC",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "G",
              dataElement: "AtIZ8IS3pyd",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "AtIZ8IS3pyd",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated - #1
            {
              column: "I",
              dataElement: "BFUaToyQOwN",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "J",
              dataElement: "BFUaToyQOwN",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated - #2
            {
              column: "L",
              dataElement: "yn8ZrOTU6cV",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "M",
              dataElement: "yn8ZrOTU6cV",
              categoryOptionCombo: "yW288iFizUY",  // Adult
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
            {
              column: "E",
              dataElement: "cx7mIjgV6m1",
              mapping: function(value, row) {
                if ((value || "").match(/mbd/i)) {
                  return 'mbd';
                } else if ((value || "").match(/alb/i)) {
                  return 'alb'
                }
              }
            },
            {
              column: "F",
              dataElement: "Myt2Cf5A5ik",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "H",
              dataElement: "dsEgJ1Dxrg3",
              categoryOptionCombo: "O4UwQ6XVJmU",  // SAC-ALB
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "I",
              dataElement: "dsEgJ1Dxrg3",
              categoryOptionCombo: "RSDW04F7B7O",  // SAC-PZQ
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "F",
              dataElement: "Xk4IHafTNfW",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "Xk4IHafTNfW",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "Xk4IHafTNfW",
              categoryOptionCombo: "yW288iFizUY",  // Adult
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
              dataElement: "Dq51uK1OS8i",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            // Population Targeted
            {
              column: "F",
              dataElement: "nXCbgQjGEf7",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "G",
              dataElement: "nXCbgQjGEf7",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "nXCbgQjGEf7",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "J",
              dataElement: "xmJ0f5OzOVe",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "K",
              dataElement: "xmJ0f5OzOVe",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "xmJ0f5OzOVe",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            }
          ]
        }
      },


      // T3_R1
      {
        names: [/T3_R1/],
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
              column: "F",
              dataElement: "I0HzUP1djpJ",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            {
              column: "E",
              dataElement: "uaCLJBX6YC5",
              mapping: function(value, row) {
                if ((value || "").match(/mbd/i)) {
                  return 'mbd';
                } else if ((value || "").match(/alb/i)) {
                  return 'alb'
                }
              }
            },
            // Population Targeted
            {
              column: "G",
              dataElement: "QNO43BaqL3B",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "QNO43BaqL3B",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "I",
              dataElement: "QNO43BaqL3B",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "K",
              dataElement: "SlpX7bo7ZDU",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "SlpX7bo7ZDU",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "M",
              dataElement: "SlpX7bo7ZDU",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            }
          ]
        }
      },


      // T3_R2
      {
        names: [/T3_R2/],
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
              column: "F",
              dataElement: "k8dqjv7btGO",
              mapping: function(value, row) {
                return moment(new Date(1899, 12, value - 1)).format('YYYY-MM-DD');
              }
            },
            {
              column: "E",
              dataElement: "l576SEiEppI",
              mapping: function(value, row) {
                if ((value || "").match(/mbd/i)) {
                  return 'mbd';
                } else if ((value || "").match(/alb/i)) {
                  return 'alb'
                }
              }
            },
            // Population Targeted
            {
              column: "G",
              dataElement: "iKHUsxY44Du",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "H",
              dataElement: "iKHUsxY44Du",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "I",
              dataElement: "iKHUsxY44Du",
              categoryOptionCombo: "yW288iFizUY",  // Adult
              mapping: function(value) {return Math.round(value)}
            },
            // Population Treated
            {
              column: "K",
              dataElement: "dNlHjGevP1d",
              categoryOptionCombo: "clHYCgF9jys",  // PreSAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "L",
              dataElement: "dNlHjGevP1d",
              categoryOptionCombo: "AVegvKfvlnS",  // SAC
              mapping: function(value) {return Math.round(value)}
            },
            {
              column: "M",
              dataElement: "dNlHjGevP1d",
              categoryOptionCombo: "yW288iFizUY",  // Adult
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
          spellings: orgNames(orgUnit),
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