@RestResource(urlMapping='/getPinsListByRegion/*')
global class getPinsListByRegion{
    @HttpGet
    global static List<Pin__c> getPinsListByRegion(){
        List<Pin__c> pins;
        try{
            String regionId = RestContext.request.params.get('regionId');
            pins = [SELECT Additional_Descriptors__c,Coordinates__Latitude__s,Coordinates__Longitude__s,Id,Name,PinLocationType__c,RegionId__c FROM Pin__c WHERE RegionId__c =: regionId];
            return pins;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return pins;
    }
}