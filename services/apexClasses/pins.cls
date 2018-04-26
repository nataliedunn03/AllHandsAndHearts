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
                       UserId__c,
                       PinLocationType__c,
                       RegionId__c,
                       Address__c FROM Pin__c WHERE RegionId__c =: regionId];
        return pins;
    }

    @HttpDelete
    global static void doDelete() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String pinId= req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Pin__c pin = [SELECT Id FROM Pin__c WHERE Id  = :pinId];
        delete pin;
    }

    @HttpPost
    global static Pin__c doPost(
        String createdByUserId,
        String name,
        String regionId,
        String address,
        String description,
        String pinType,
        Decimal latitude,
        Decimal longitude,
        String Id) {

        Pin__c pin = new Pin__c();
        pin.UserId__c = createdByUserId;
        pin.Name = name;
        pin.RegionId__c = regionId;
        pin.Address__c = address;
        pin.Additional_Descriptors__c = description;
        pin.Coordinates__Latitude__s = latitude;
        pin.Coordinates__Longitude__s = longitude;
        pin.PinLocationType__c = pinType;
        //If an Id exist with the payload, we update.
        if(Id != ''){
            pin.Id = Id;
            update pin;
        } else {
            insert pin;
        }
        return pin;
    }
}