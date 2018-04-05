const broadCastCardsData = [
  {
   import * as AuthService from './auth';
const BASE_URL = 'https://cs19.salesforce.com/services/apexrest';
const auth_token =
  '00D29000000DglJ!ARUAQJa5AbK9qUgh_3pOTqw8jf_22IR9sPnkIwL3xvNWuP5XchBhfACsWtlRCegO9rFyGu9VAPqPdbo06xhnzvhXFkICni5u';
// const auth_token = AuthService.getAuthToken()

 
const broadCastCardsData = [
  {
    title: 'HELP',
    body: "We're looking for volunteers in Texas."
  },
  {
    title: 'NEWS',
    body:
      'Happy Hearts Fund merges with All Hands Volunteers to become All Hands and Hearts!'
  },
  {
    title: 'Update',
    body: 'Mid-cycle demos are underway.'
  },
  {
    title: 'Update 2',
    body: 'Mid-cycle demos are underway.'
  },
  {
    title: 'Update 3',
    body: 'Mid-cycle demos are underway.'
  }
];

export const getBroacastObjs = async () => {

	const queryEndpoint = `${BASE_URL + '/broadcasts'}`;

	console.log('Fetching broadcast data from Salesforce');
	console.log(queryEndpoint);
	
	try {
    const response = await fetch(queryEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data) {
      console.log('-Broadcast Query DATA Response-\n');
      console.log(data);
      return data;
    } else {
      console.log('-Broadcast Query NO DATA Response-\n');
      console.log('Check auth_token and API call.-\n');
      return undefined;
    }
  } catch (e) {
    console.log(e);
  }
  
};

export const getBroadcastCards = uerId => {
  return broadCastCardsData;
};
title: 'HELP',
    body: "We're looking for volunteers in Texas."
  },
  {
    title: 'NEWS',
    body:
      'Happy Hearts Fund merges with All Hands Volunteers to become All Hands and Hearts!'
  },
  {
    title: 'Update',
    body: 'Mid-cycle demos are underway.'
  },
  {
    title: 'Update 2',
    body: 'Mid-cycle demos are underway.'
  },
  {
    title: 'Update 3',
    body: 'Mid-cycle demos are underway.'
  }
];

export const getBroadcastCards = uerId => {
  return broadCastCardsData;
};
