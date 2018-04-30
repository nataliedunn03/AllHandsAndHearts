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

@isTest
private class WEBSERVICE_Broadcasts{
	@isTest global static Broadcast_Object__c createBroadcastList(){
	
		Broadcast b = createBroadcastList('testType-000', 'test-Summary')
		
		System.assertEquals('testType-000', b[0].Broadcast_Type__c);
		System.assertEquals('test-Summary', b[0].Summary__c);
	}
	
	@isTest global static void doDelete(){		
		RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        request.requestURI = '/services/apexClasses/broadcast';
        request.httpMethod = 'DELETE';
        request.addParameter('test', 'test');
        RestContext.request = request;
        RestContext.response = response;
        pins.doDelete();
        System.assertTrue(createBroadcastList().isEmpty());
        
	}
}
