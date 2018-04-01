// Static region mappings
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

export const getStaticRegionData = regionId => {
  return staticRegionData;
};

export const getRegionList = callbackTrigger => {
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
  const auth_token =
    '00D29000000DglJ!ARUAQHZlxlDQIIooh5TAL7eFWolHXFcRmgrNQTNv_RjEWadG4OoM00dkJ92QK7fKbak6QftFJpSXEalS9UPfqnhgSG7DJM0m';

  const queryEndpoint =
    'https://cs19.salesforce.com/services/data/v20.0/query/';
  const soqlQuery =
    '?q=SELECT+Name,+Coordinates__Latitude__s,+Coordinates__Longitude__s+FROM+Region__c';

  const URL = queryEndpoint + soqlQuery;

  // TODO: Set bearer token header below.
  fetch(URL, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + auth_token
    }
  })
    .then(response => response.json())
    .then(responseJSON => {
      // If there are records.
      if (responseJSON.records) {
        console.log('-Region Query Response-\n');

        responseJSON.records.forEach(record => {
          console.log(
            'Name: [ ' +
              JSON.stringify(record.Name) +
              ' ]\n' +
              'Coordinates__Latitude__s: [ ' +
              JSON.stringify(record.Coordinates__Latitude__s) +
              ' ]\n' +
              'Coordinates__Longitude__s: [ ' +
              JSON.stringify(record.Coordinates__Longitude__s) +
              ' ]\n'
          );
        });

        console.log('Calling callbackTrigger for region Query');
        callbackTrigger(responseJSON.records);
      } else {
        console.log('-Region Query NO DATA Response-\n');
        callbackTrigger(undefined);
      }
    })
    .catch(error => {
      console.error(error);
      return '';
    });
};
