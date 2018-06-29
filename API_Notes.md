# Salesforce API Notes

Below are the CURL commands I've used to interface with each of the endpoints/services.
Details are listed for each requests as well. Please let me know if you have any question.

### Initial auth_token request call:

`curl -v https://test.salesforce.com/services/oauth2/token -d grant_type=password -d client_id=3MVG9Vik22TUgUphE4Ci7YrLJUWXWmDsMRbP_vZUSuotxwrxduN9uO46e6wPDw_vLHPdcQP2e3Hu6axkpM0fB -d client_secret=150414908105213374 -d username=edwardchen93@gmail.com -d password=jpmchase3`

`client_id` -> Retrieved from the app (unique to 1 per app) info page. To retrieve it:

1.  Log into our saleforce account at `test.salesforce.com`. (Use Ed's account info)
2.  Top right click the gear icon and click "Setup"
3.  On the "Quick Find" field on top left, type in "App Manager"
4.  Click into App Manager and find the app you are working on. (FFG_Test_YE is what we're currently using for dev)
5.  Click into the app or click "View" from the dropdown menu on the right column.
6.  `client_id` is the "Consumer Key" that is listed under the API section.
7.  Note the settings listed here as well. (i.e OAuth enabled, valid, refresh time, etc...)

`client_secret` -> This is unique key for each account. To retrieve it:

1.  It is found on the same page as the above. Click "Consumer Secret" on the API section from above.
2.  This is unique to one per account I believe. To reset it in case of security issue:
3.  Login to salesforce above.
4.  Click the "Account" icon on top right, next to the gear icon.
5.  Click Settings
6.  On the left side dropdown under "My Personal Information", click Reset Security Token
7.  This sends the token alert via email to account's email that you used to log in (in this case Ed will have to send us the new token).

#### Sample Response:

`{"access_token":"00D29000000DglJ!ARUAQGblj8Czla05p9jCL_6iFA7HnEMvBIyiFyGAmRdOF8oRpUbkzsFp4ofiVlDaA56YYAusTb3w7bJa5.ejVIFlU130Zj3K", "instance_url":"https://cs19.salesforce.com", "id":"https://test.salesforce.com/id/00D29000000DglJEAS/00529000001NiBnAAK", "token_type":"Bearer", "issued_at":"1522524374969" "signature":"neitd24LGQYZWSl5pdf6uO1l704bYGI52RcL8zmZGtA="}`

We will need to extract the token from `access_token` field from above response.

## Token Renew

Since we don't want to manually renew token. Currently there are multi-stage automated token renew we implemented that is described as below.

In-order for the App to retrieve data from Salesforce, App needs to first obtain a access*token similar to described at the begining of this file. We expose a public Salesforce API under: https://jdev-aahtoken.cs19.force.com/services/apexrest/getAuthToken and https://jdev-aahtoken.cs19.force.com/services/apexrest/generateAuthToken/ that returns a accessToken. Obtained accessToken is \_required* in-order for subsequent requests to https://cs19.salesforce.com/services/apexrest. The implementation of this service are in following ApexClasses:

1.  WEBSERVICE_generateAuthToken (Note: Username + Pass are here. Incase you change your Salesforce password/it expires, you'll need to update it here to generate token.)
2.  WEBSERVICE_generateAuthTokenEndpoint
3.  WEBSERVICE_getAuthToken

## Registering for Push Notification

We currently implemented registering for push notification as the following flow:

1.  When a user successfully logs in:
    </br>**a.** App will ask for notification permission. Once the user gives the permission:
    </br>**b.** We call `/notification` with `userID, notificationToken, deviceId and deviceName`
    </br>**c.** And register save the notificationToken using the `WEBSERVICE_PushNotification` ApexClass in Slaesforce.
2.  When there is a broadcast object added to object, we trigger an action on Salesforce using the `WEBSERVICE_PushNotificationTrigger` ApexTriggers which generates necessary payload and calls `WEBSERVICES_PushNotificationToExpo` future ApexClass.
3.  `WEBSERVICES_PushNotificationToExpo` class takes the payload and publishes to Expo. Expo sends publishes the notification to either GCM/APN depending on if the device is Android/iOS.

#### Note: Anytime you call an external URL (i.e expo publish notification url) inside ApexClass, you will need to allow that URL in Salesforce's. Search in Setup -> [Remote Settings](https://cs19.lightning.force.com/lightning/setup/SecurityRemoteProxy/home)

## Calls for DATA (SOQL, service description, etc...)

They all revolve around the `/service/data/...` endpoints:

`curl https://cs19.salesforce.com/services/data/v20.0/sobjects -H 'Authorization: Bearer 00D29000000DglJ!ARUAQGblj8Czla05p9jCL_6iFA7HnEMvBIyiFyGAmRdOF8oRpUbkzsFp4ofiVlDaA56YYAusTb3w7bJa5.ejVIFlU130Zj3K'`

`cs19.salesforce.com` -> Seems this is our instance. You can check this on the URL onces you log into `test.salesforce.com`.

`/sobjects/` -> Short for salesforce objects. These are essentially the equivalent of "tables" in traditional SQL type database. The above call will list all available sobjects that is linked to our account.

#### Header to be sent with each call.

`'Authorization: Bearer 00D29000000DglJ!ARUAQGblj8Czla05p9jCL_6iFA7HnEMvBIyiFyGAmRdOF8oRpUbkzsFp4ofiVlDaA56YYAusTb3w7bJa5.ejVIFlU130Zj3K'`

This is the header that is required for every data call it makes. It follows the pattern `Authorization: Bearer <INSERT_ACCESS_TOKEN_HERE_FROM_ABOVE_AUTH_CALL`>

#### Sample Response:

Response of all the objects too big to list here. You can see them all through the salesforce web portal by logging into our account with the above steps and on the "Quick Find" menu under Setup page, search for "Objects and Fields" and use the "Object Manager" to view all our objects.

## SQOL SELECT query

`curl https://cs19.salesforce.com/services/data/v20.0/query/?q=SELECT+Name,+Coordinates__Latitude__s,+Coordinates__Longitude__s+FROM+Region__c -H 'Authorization: Bearer 00D29000000DglJ!ARUAQGblj8Czla05p9jCL_6iFA7HnEMvBIyiFyGAmRdOF8oRpUbkzsFp4ofiVlDaA56YYAusTb3w7bJa5.ejVIFlU130Zj3K'`

Similar to a SQL query, the endpoint for this is `/query/?q=<INSERT_QUERY_HERE>`

In the above example, note that the query is structured in the pattern `SELECT+<Field1>,+<Field2>,+<Field...n>,+FROM+<Object_name>`. The objects tagged with `__c` usually denotes custom objects that we created (i.e not a default salesforce object). \*Note, the header bearer token is set here as part of the call`

#### Sample Response:

```
{
  "totalSize": 5,
  "done": true,
  "records": [
    {
      "attributes": {
        "type": "Region__c",
        "url": "/services/data/v20.0/sobjects/Region__c/a0p29000002o94sAAA"
      },
      "Name": "San Francisco",
      "Coordinates__Latitude__s": 37.785834,
      "Coordinates__Longitude__s": -122.406417
    },
    {
      "attributes": {
        "type": "Region__c",
        "url": "/services/data/v20.0/sobjects/Region__c/a0p29000002o94tAAA"
      },
      "Name": "New York City",
      "Coordinates__Latitude__s": 40.7127753,
      "Coordinates__Longitude__s": -74.0059728
    },
    {
      "attributes": {
        "type": "Region__c",
        "url": "/services/data/v20.0/sobjects/Region__c/a0p29000002o94uAAA"
      },
      "Name": "London",
      "Coordinates__Latitude__s": 51.5073509,
      "Coordinates__Longitude__s": -0.127758
    },
    {
      "attributes": {
        "type": "Region__c",
        "url": "/services/data/v20.0/sobjects/Region__c/a0p29000002o94vAAA"
      },
      "Name": "Singapore",
      "Coordinates__Latitude__s": 1.3589475,
      "Coordinates__Longitude__s": 103.8675579
    },
    {
      "attributes": {
        "type": "Region__c",
        "url": "/services/data/v20.0/sobjects/Region__c/a0p29000002o94wAAA"
      },
      "Name": "Seoul",
      "Coordinates__Latitude__s": 37.557418,
      "Coordinates__Longitude__s": 126.9923888
    }
  ]
}
```

Currently I've inserted 5 sample objects into our Region object. Each of these will be read from salesforce data endpoint and populated in our app. _For inserting data, see below_

## SOQL INSERT query

Insertion needs a bit more discussion. Not sure if we should allow all users to insert or just admins? Either way, there are a few ways to go about inserting data:

### 1. Using SQOL query to insert (HARD/Code-ish way of doing it):

`curl https://cs19.salesforce.com/services/data/v20.0/sobjects/Region__c/ -H 'Authorization: Bearer 00D29000000DglJ!ARUAQGblj8Czla05p9jCL_6iFA7HnEMvBIyiFyGAmRdOF8oRpUbkzsFp4ofiVlDaA56YYAusTb3w7bJa5.ejVIFlU130Zj3K' -H 'Content-Type: application/json' -d '@newregion.json'`

The endpoing for this is `.../sobjects/<OBJECT_NAME>/`. The data needs to be provided as a json object - `-d '@newregion.json'`. In the above case, I had a file named `newregion.json` on the same directory that I ran the CURL request. The contents of that files are as follow:

```json
{
  "Name": "Test Region 1234",
  "Radius_for_Disaster_Site__c": "1234",
  "Number_of_Pins__c": "10",
  "Coordinates__Latitude__s": "12.34567",
  "Coordinates__Longitude__s": "-23.11223"
}
```

Note, this is just a single insertion of the region "Test Region 1234". These were all the initial required fields that were needed to insert a record (`Name, Radius_for_Disaster_Site__c, Number_of_Pins__c, Coordinates__Latitude__s, Coordinates__Longitude__s`). I have since reduced the required fields to just (`Name, Coordinates__Latitude__s, Coordinates__Longitude__s`), I'm not sure if we should make the radius and # of pins as a requirement just yet? Will need to start looking into pin saving before making this call.

### 2. Second and easier way is to use the Salesforce Data Loader app (LESS HARD/Using a SF built app).

More info here: https://developer.salesforce.com/page/Data_Loader

It's essentially a desktop app that acts as an interface to INSERT/UPDATE/DELETE records from Sobjects. They use CSV formatted files to determine the data to insert/delete and lets you export the data from Sobjects into CSV files.

To download it, you will need to log into our account, and search around for "Data Loader". Don't remember where but it is realllly easy to find. You can install it on Windows/OSX and log in with the same account that you use to log into the web portal. _Will need to auth with security token that is sent as a text to Ed, since his info is linked to the account_

### 3. Using workbench web interface provided by Salesforce (EASY / Most convinent way)

Simply go to https://workbench.developerforce.com/login.php?startUrl=%2Fquery.php
<br/>And log into the sandbox environment with your SF login.
<br/>Once logged in, you should be able to access the objects using the `Object` dropdown and selecting the various `Fields`. This should be shown on the default page after logging in.
<br/>Also on this page are other useful tools such as `queries` and `REST explorer` to test out various queries and explore the custom REST endpoints that you have created using `ApexClasses`.

## Apex Classes

Apex classes are user defined Java servelet like classes that you can write custom queries in, and output to a specific endpoint that you define. You can access the `ApexClass` list that we have created by following the below steps:

1.  Log into `test.salesforce.com`.
2.  Click `Setup` on the cogwheel dropdown. Same step from the above docs.
3.  Look for `Apex` on the quick find search bar on the top left.
4.  Click on `Apex Classes` listed under `Custom Code`.
5.  On the apex class list, click W to list all the apex classes that start with `W`. We named all our apex classes with prefix `WEBSERVICE_` so that we can easily find it.

Below is a sample Apex class that we created for retrieving `Regions` data:

```
@RestResource(urlMapping='/regions/*')
global class WEBSERVICE_Regions{
    @HttpGet
    global static List<Region__c> getRegionLists(){
        List<Region__c> regions;
        try{
            regions = [SELECT Coordinates__Latitude__s,Coordinates__Longitude__s,DisasterLocation__c,DisasterEnd__c,DisasterStart__c,DisasterType__c,Id,Name FROM Region__c];
            return regions;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return regions;
    }
```

As seen above, this retrieves from Salesforce objects the `Regions` data using the SOQL query `SELECT .... FROM Region__c`, and lists for a request on our custom REST urlMapping `/regions/*`
