@RestResource(urlMapping='/regions/*')
global class WEBSERVICE_Regions{
    @HttpGet
    global static List<Region__c> getRegionLists(){
        List<Region__c> regions;
        try{
            regions = [SELECT Coordinates__Latitude__s,Coordinates__Longitude__s,DisasterLocation__c,DisasterEnd__c,DisasterStart__c,DisasterType__c,IsArchived__c,Id,Name FROM Region__c];
            return regions;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return regions;
    }
}