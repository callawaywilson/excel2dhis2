module.exports = function(orgUnits, params) {

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
    var rootOrg = findOrgById(rootOrgId, orgUnits);
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

  function findOrgById(id, orgUnits) {
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

  return orgsToTree(params.rootOrgId, orgUnits);

}