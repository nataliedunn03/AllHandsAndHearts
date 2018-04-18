/**
This is a wrapper to build object to send to Expo. Properties will includes:

to: this is notification token in User__c

title: Is the title that shows up on notification

body: Is the body that shows on notification

data: Is the extra data title + body / or anything 4096Bytes max, so if you tap on the notification your app will be able to read from this

priority: Delivery priority of the message. 'default', 'normal', and 'high' are the only valid values

badge: Number count to show in iOS badge icon.

*/

global class WEBSERVICES_PushNotificationToExpo {
 /**
  * Push notification provider
  * Note: you must allow this URL in Setup -> Remote settings. Or else SF will bloack this outbound call.
 */
 public static String expoNotificationEndPoint = 'https://exp.host/--/api/v2/push/send';
 @future (callout=true)
 public static void PostNotificationToExpo(String payload) {
    HttpRequest req = new HttpRequest();
    req.setHeader('Content-Type','application/json');
    req.setHeader('accept', 'application/json');
    req.setHeader('accept-encoding', 'gzip, deflate') ;
    req.setMethod('POST');
    req.setEndpoint(expoNotificationEndPoint);
    req.setBody(payload);
    Http http = new Http();
     try{
         HTTPResponse res = http.send(req);
         if(res == null){
         	WEBSERVICE_PushNotification.InputError('Error sending out push notification');
         	WEBSERVICE_PushNotification.InputError(payload);
         	WEBSERVICE_PushNotification.InputError(res.toString());
     	}
         System.debug(res.getBody());
     }catch(Exception ex){
        WEBSERVICE_PushNotification.InputError(ex.getMessage());
     }
  }
}