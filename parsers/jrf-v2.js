module.exports = function(_params) {

  let month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let params = Object.assign({
    period: null,
    orgUnits: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    rootOrgId: 'Ethiopia'
  }, _params);

  var orgTree = orgsToTree('iuGjpnxnFbI', params.orgUnits);
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

    ]
  }


  // function findOrg(row) {
  //   // Variables:
  //   //  - provincestate: RegionZone squished together name
  //   //  - district: Woreda 

  // }

  function districtLookup(provincestate, districtName) {
    //Find Region
    var region = null;
    var regionName = null;
    region: for (var i = 0; i < orgTree.children.length; i++) {
      var child = orgTree.children[i];
      for (var n = 0; n < child.spellings.length; n++) {
        var name = child.spellings[n].toLowerCase();
        if (provincestate.toLowerCase().indexOf(name) == 0) {
          region = child;
          regionName = name;
          break region;
        }
      }
    }
    if (!region) return null;

    //Find Zone
    var zone = null;
    zone: for (var i = 0; i < region.children.length; i++) {
      var child = region.children[i];
      for (var n = 0; n < child.spellings.length; n++) {
        var name = child.spellings[n].toLowerCase();
        if (provincestate.toLowerCase().indexOf(name) == regionName.length) {
          zone = child;
          break zone;
        }
      }
    }
    if (!zone) return null;

    //Find District
    for (var i = 0; i < zone.children.length; i++) {
      var child = zone.children[i];
      for (var n = 0; n < child.spellings.length; n++) {
        var name = child.spellings[n].toLowerCase();
        if (name == districtName.toLowerCase()) {
          return child;
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
  // Org to tree mapping
  // Structure:
  // {
  //   id: "ORG00000000",
  //   name: "Name",
  //   spellings: ["Name", "Name1", "Name2"],
  //   geoconnectId: "AAAAAAA",
  //   path: "/ORG00000000/ORG00000001",
  //   children: [{}]
  // }
  function orgsToTree(rootOrgId, orgUnits) {
    var rootOrg = findOrg(rootOrgId, orgUnits);
    return nodeFromOrgUnit(rootOrg, orgUnits);
  }
  function nodeFromOrgUnit(orgUnit, orgUnits) {
    var node = {
      id: orgUnit.id,
      name: orgUnit.name,
      spellings: orgNames(orgUnit),
      path: orgUnit.path,
      children: []
    };
    var geoAttr = getOrgAttribute(orgUnit, params['geoconnectAttributeID']);
    if (geoAttr) node.geoconnectId = geoAttr.value
    var childrenUnits = orgChildren(orgUnit, orgUnits);
    for (var i = 0; i < childrenUnits.length; i++) {
      node.children.push(nodeFromOrgUnit(childrenUnits[i], orgUnits));
    }
    return node;
  }

  function findOrg(id, orgUnits) {
    for (var i = 0; i < orgUnits.length; i++) {
      if (orgUnits[i].id == id) return orgUnits[i];
    }
  }
  function orgChildren(orgUnit, orgUnits) {
    var children = [];
    for (var i = 0; i < orgUnits.length; i++) {
      if (orgUnits[i].parent && orgUnits[i].parent.id == orgUnit.id) {
        children.push(orgUnits[i])
      }
    }
    return children;
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

  return def;
}