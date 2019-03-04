module.exports = function(params) {

  function lookupValue(element) {
    var dataValues = params.dataValues;
    if (!dataValues || dataValues.length < 1) {
      throw "Looking up " + JSON.stringify(element) + " in empty or no dataValues, dataValues must be populated";
    }
    for (var i = 0; i < dataValues.length; i++) {
      var value = dataValues[i];
      if (value['period'] == element['period'] &&
          value['orgUnit'] == element['orgUnit'] &&
          value['dataElement'] == element['dataElement'] &&
          value['categoryOptionCombo'] == element['categoryOptionCombo'] ) {
        return value['value'];
      }
    }
  }

  function districtLookupProvinceState(provincestate, districtName) {
    //Find Region
    var regionRegionName = findChildNamed(params.orgTree, provincestate, 'start');
    if (!regionRegionName) return null;

    //Find Zone
    var zone = findChildNamed(regionRegionName[0], provincestate, 'end', 
      regionRegionName[1].length);
    if (!zone) return null;

    //Find District
    return findChildNamed(zone, districtName, null);
  }

  function districtLookupState(stateName, districtName) {
    for (var i = 0; i < params.orgTree.children.length; i++) {
      var region = params.orgTree.children[i];
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
          // console.log(name, childName, name.toLowerCase().indexOf(childName, 1), offset)
          if (name.toLowerCase().indexOf(childName, 1) == offset ||
              (name.toLowerCase().indexOf(childName, 1) - 1) == offset) {
            // console.log("HIT")
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


  return {
    districtLookupProvinceState: districtLookupProvinceState,
    districtLookupState: districtLookupState,
    getRowVariables: getRowVariables,
    getRowDataElements: getRowDataElements,
  }

};