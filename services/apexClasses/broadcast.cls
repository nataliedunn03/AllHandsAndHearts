@RestResource(urlMapping='/broadcasts/*')
global class WEBSERVICE_Broadcasts{
    @HttpGet
    global static List<Broadcast_Object__c> getBroadcastList(){
        List<Broadcast_Object__c> broadcast;
        try{
            broadcast = [SELECT Broadcast_Type__c,Summary__c FROM Broadcast_Object__c];
            return broadcast;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return broadcast;
    }

    @HttpPost
    global static Broadcast_Object__c createBroadcastList(String type, String summary){
        Broadcast_Object__c broadcast;
        try{
            broadcast = new Broadcast_Object__c();
            broadcast.Broadcast_Type__c = type;
            broadcast.Summary__c = summary;
            insert broadcast;
            return broadcast;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return broadcast;
    }

    @HttpDelete
    global static void doDelete() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String broadcastId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Broadcast_Object__c broadcast = [SELECT Id FROM Broadcast_Object__c WHERE Id  = :broadcastId];
        delete broadcast;
    }
}