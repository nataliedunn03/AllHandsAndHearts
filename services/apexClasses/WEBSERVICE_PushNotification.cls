@RestResource(urlMapping='/notification/*')
global class WEBSERVICE_PushNotification{
    @HttpPut
    global static User__c saveNotificationToken(String userId, String notificationToken, String deviceId, String deviceName){
        /*
		Saving notification to user object.
		This notificationToken will be used to send push notification.
		Idea: 1. we register notificationToken (this gets generated per app basis)
		2. We save the token and if there's a new broadcast we POST this to our Push notification provider (either GCM/APN)
		*/
        User__c user;
        try{
            if(String.isNotBlank(userId) && String.isNotBlank(notificationToken)){
				user = [SELECT Id, Name__c FROM User__c WHERE Id=:userId limit 1];
            	user.NotificationToken__c = notificationToken;
            	if(String.isNotBlank(deviceId)){
                	user.deviceId__c = deviceId;
            	}
            	if(String.isNotBlank(deviceName)){
              		user.deviceName__c = deviceName;
            	}
                database.update(user);
            }else{
				InputError('userId && notificationToken are required.');
            }
        }catch(Exception ex){
            System.debug('Exception is ' + ex.getMessage());
            throw ex;
        }
        return user;
    }

    global class InputErrorException extends Exception {}
    global static void InputError(String message) {
        throw new InputErrorException(message);
    }
}