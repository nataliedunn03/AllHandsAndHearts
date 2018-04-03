@RestResource(urlMapping='/getRegionLists/*')
global class getRegionLists{
    @HttpGet
    global static List<Region__c> getRegionLists(){
        List<Region__c> regions;
        try{
            regions = [SELECT Coordinates__Latitude__s,Coordinates__Longitude__s,Name,Radius_for_Disaster_Site__c FROM Region__c];
            return regions;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return regions;
    }
}
