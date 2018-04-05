tResource(urlMapping='/getBroadcastList/*')
global class getBroadcastList{
    @HttpGet
    global static List<Broadcast__c> getBroadcastList(){
        List<Broadcast__c> regions;
        try{
            broadcast = [SELECT Broadcast_Type__c,Summary__c FROM Broadcast_Object__c];
            return broadcast;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return broadcast;
    }
}

