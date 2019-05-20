import ApiWrapper from '../services/api';
const Api = new ApiWrapper();

global.pinLocationTypeNames = [];
global.pinLocationTypes = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export const getPinLocationTypes = async userId => {
  const types = await Api.getPinLocationTypes();
  global.pinLocationTypes = types;

  for (type in types) {
    for (key in types[type]) {
      if ((key = 'Name')) {
        if (!global.pinLocationTypeNames.includes[types[type][key]]) {
          global.pinLocationTypeNames.push(types[type][key]);
        }
      }
      //console.log(key + ":" + types[type][key]);
    }
  }
  //filter out duplicate types
  global.pinLocationTypeNames = global.pinLocationTypeNames.filter(onlyUnique);

  //filter out duplicate values in global.pinLocationTypes. Only keep items in which key Name is unique
  for (item in global.pinLocationTypes) {
    if (
      !global.pinLocationTypeNames.includes(
        global.pinLocationTypes[item]['Name']
      )
    ) {
      global.pinLocationTypes.splice(item);
    }
  }
  return uniqueTypes;
};
