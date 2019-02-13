import ApiWrapper from '../services/api';
const Api = new ApiWrapper();

const activities = [
  {
    name: 'Maddie',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Nazim',
    location: 'Added a pin in Texas Area',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Ed',
    location: 'Added a pin in New York Area',
    detail:
      'Trees on the road. Transportation stopped. Volunteers required for NYC area to move trees.'
  },
  {
    name: 'Sam',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Adrian',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Ye',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Some one else',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  },
  {
    name: 'Testing scrolling',
    location: 'Added a pin in Puerto Rico',
    detail: 'School collapsed. Evacuation and transportation needed.'
  }
];

export const getActivities = async userId => {
  var activities = [];
  var user = 'Username'; // TODO need a way to get user name from info recevied from getPinsListByRegion. Might need to add a new apex class to get user info
  var regionLocation;
  var pinDetail;

  var regionList = await Api.getRegionList();
  //console.log(regionList);
  for (const region of regionList) {
    //console.log('Region ID is: ' + region.Id);
    //console.log('Region name is: ' + region.Name);
    regionLocation = 'Added a pin in ' + region.Name;
    var pinList = await Api.getPinsListByRegion(region.Id);
    //console.log(pinList);
    for (const pin of pinList) {
      pinDetail = pin.Additional_Descriptors__c;
      //console.log('Pin detail is: ' + pinDetail);
      activities.push({
        name: user,
        location: regionLocation,
        detail: pinDetail
      });
    }
  }

  console.log(activities);

  return activities;
};
