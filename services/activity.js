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
  const activities = [];
  let userName;
  let regionLocation;
  let pinDetail;

  const pinList = await Api.getPinsList();
  //console.log(pinList);
  let region;
  let user;
  for (const pin of pinList) {
    userName = 'Username';
    if (pin.UserId__c) {
      user = await Api.getUserName(pin.UserId__c);
      // console.log(user);
      userName = user.Name__c;
    }

    region = await Api.getRegionById(pin.RegionId__c);
    //console.log(region);
    regionLocation = 'Added a pin in ' + region.Name;

    pinDetail = pin.Additional_Descriptors__c;

    activities.push({
      name: userName,
      location: regionLocation,
      detail: pinDetail
    });
  }
  //console.log(activities);

  return activities;
};
