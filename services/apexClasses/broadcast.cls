@RestResource(urlMapping='/broadcasts/*')
global class WEBSERVICE_Broadcasts{
    @HttpGet
    global static List<Broadcast_Object__c> getBroadcastList(){
        List<Broadcast_Object__c> regions;
        try{
            broadcast = [SELECT Broadcast_Type__c,Summary__c FROM Broadcast_Object__c];
            return broadcast;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return broadcast;
    }
}

