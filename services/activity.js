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
  const activities = await Api.getActivities();
  if (activities[0].errorCode) {
    console.log(activities);
    var errorCard = [
      {
        name: 'Unable to load activities.',
        detail: 'Please reload application to try again.'
      }
    ];
    return errorCard;
  } else {
    return activities;
  }
};

export const setVote = async (pinId, vote, userId) => {
  const newUserVotedList = await Api.setVote(pinId, vote, userId);
  //console.log(newUserVotedList);
  return newUserVotedList;
};

export const getVotedPins = async userId => {
  const votedPins = await Api.getVotedPins(userId);
  //console.log(votedPins);
  return votedPins;
};
