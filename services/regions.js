// Static region mappings
/*
 You should no longer be able to see these cards.
 If you see these pop up in the modal, something is wrong with the saga/reducers.
 */
import * as AuthService from './auth';
const staticRegionData = [
  {
    Name: 'NO DATA FROM SALESFORCE1',
    Coordinates__Latitude__s: 37.785834,
    Coordinates__Longitude__s: -122.406417
  },
  {
    Name: 'CHECK CONNECTION',
    Coordinates__Latitude__s: 40.7127753,
    Coordinates__Longitude__s: -74.0059728
  }
];

export const getStaticRegionData = () => {
  return staticRegionData;
};

export const getRegionList = async () => {
  /*
   Original CURL command:

   curl https://cs19.salesforce.com/services/data/v20.0/query/?q=SELECT+Name,+Coordinates__Latitude__s,+Coordinates__Longitude__s+FROM+Region__c -H 'Authorization: Bearer 00D29000000DglJ!ARUAQNq4VA5wGgB3RONuLHpUqPV7MmcSBwOmLGWj3WZvYk3M4LdiYScaNF8gFQcqa71CXAYW5x3Slu6nzuB.wW1PGiAFwd0C'

   Note*

   cs19.salesforce.com  - Seems like this is our instance.
   Region__c            - name of the Region table.

   The Coordinates field auto generates the below two column for lat/long
   Coordinates__Latitude__s
   Coordinates__Longitude__s

   SOQL Query below to be formed into the CURL request:
   SELECT+Name,+Coordinates__Latitude__s,+Coordinates__Longitude__s+FROM+Region__c

   */

  // Statically setting for now. Use auth.js -> getAuthToken() once we have the calls solidified.
  // High chance that this token below will have probably expired. curl for another token if that's the case.
  // See: auth.js for auth token request.
  //const auth_token = AuthService.getAuthToken(); //'00D29000000DglJ!ARUAQGRPOShJOzMOgBXiNO8aqP0QbnqvzhwtNvOngNqF2GZxvFXiWqoeBJ2_8Pb5DwSGrQDqf2Zyy5u4olt3wDZD.8XqCmnm';
  const auth_token =
    '00D29000000DglJ!ARUAQMw03a_8EcVwXaCzOoMM1IibbD.GeKqX1SJwmrZkemxGDIAg2TRvy4wVD28.iEbJv9Ah033staGgZspGlDZNIyFoLgfG';

  const BASE_URL = 'https://cs19.salesforce.com/services/apexrest';
  const queryEndpoint = `${BASE_URL + '/getRegionLists'}`;

  console.log('Fetching region data from Salesforce');
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
      console.log('-Region Query DATA Response-\n');
      console.log(data);
      return data;
    } else {
      console.log('-Region Query NO DATA Response-\n');
      console.log('Check auth_token and API call.-\n');
      return undefined;
    }
  } catch (e) {
    console.log(e);
  }
};