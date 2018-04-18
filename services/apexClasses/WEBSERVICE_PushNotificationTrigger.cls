/**
 * This will be triggered when a broadcast alert is inserted or deleted.
*/

trigger WEBSERVICE_PushNotificationTrigger on Broadcast_Object__c (after insert) {
    for(Broadcast_Object__c boc: Trigger.New){
        /**
         * We want to batch notifications all of users at once. Instead of sending multiple calls.
		*/
        List<String> payloadsList = new List<String>();
        /**
         * Get notificationToken of all users who turned-on notification token.
		*/
        List<User__c> users = [Select NotificationToken__c FROM User__c WHERE NotificationToken__C != null];

        for(User__c user: users){
		String data = JSON.serializePretty(new Map<String, Object>{
        	'title' => boc.Broadcast_Type__c,
        	'body' => boc.Summary__c
    	});

		String payload = JSON.serializePretty(new Map<String, Object>{
            'to' => user.NotificationToken__c,
        	'title' => boc.Broadcast_Type__c,
        	'body' => boc.Summary__c,
            'sound' => 'default',
            'badge' => 1,
           	'data' => data
    	});
        payloadsList.add(payload);
        }
        /**
         * Send push notification.
		*/
        WEBSERVICES_PushNotificationToExpo.PostNotificationToExpo(System.JSON.serializePretty(payloadsList));
    }
}