@RestResource(urlMapping='/pins/*')
global with sharing class WEBSERVICE_Pins{

   @HttpGet
    global static List<Pin__c> doGet() {
        List<Pin__c> pins;
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String regionId= req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        pins = [SELECT
                       Additional_Descriptors__c,
                       Coordinates__Latitude__s,
                       Coordinates__Longitude__s,Id,
                       Name,
                       PinLocationType__c,
                       RegionId__c FROM Pin__c WHERE RegionId__c =: regionId];
        return pins;
    }

   @HttpDelete
    global static void doDelete() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String regionId= req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Pin__c pin = [SELECT Id FROM Pin__c WHERE RegionId__c  = :regionId];
        delete pin;
    }

  @HttpPost
    global static String doPost(String name, String regionId, String description, String pinType, String Id) {
        Pin__c pin = new Pin__c();
        pin.Name = name;
        pin.RegionId__c = regionId;
        pin.Additional_Descriptors__c = description;
        pin.PinLocationType__c = pinType;
        //If an Id exist with the payload, we update.
        if(Id != ''){
            pin.Id = Id;
            update pin;
        } else {
            insert pin;
        }
        return pin.Id;
    }
}

@isTest
private class WEBSERVICE_Pins{
	@isTest global static String doPost(){
	
		Pin p = doPost('testID-000', 'Kevin', '30493', '270 park ave',  'Pin Description', 100, 105, 'Test-Location')
		
		System.assertEquals('Kevin', p.Name);
		System.assertEquals('testID-000', p.UserId__c);
		System.assertEquals('30493', p.RegionId__c );
		System.assertEquals('270 park ave', p.Address__c);
		System.assertEquals('Pin Description', p.Additional_Descriptors__c);
		System.assertEquals(100, p.Coordinates__Latitude__s);
		System.assertEquals(105, p.Coordinates__Longitude__s);
		System.assertEquals('Test-Location', PinLocationType__c);
		
	}
	
	@isTest global static void doDelete(){		
		RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        request.requestURI = '/services/apexClasses/pins';
        request.httpMethod = 'DELETE';
        request.addParameter('test', 'test');
        RestContext.request = request;
        RestContext.response = response;
        pins.doDelete();
        System.assertTrue(doGet().isEmpty());2r
        
	}
}
