/**
generates OAuthToken to be used in the App
*/

global class WEBSERVICE_generateAuthToken {
 @future (callout=true)
 public static void execute() {
     String auth_token = '';
     String client_id ='3MVG9Vik22TUgUphE4Ci7YrLJUWXWmDsMRbP_vZUSuotxwrxduN9uO46e6wPDw_vLHPdcQP2e3Hu6axkpM0fB';
     String client_secret = '150414908105213374';
     String username = 'edwardchen93@gmail.com';
     String password = 'jpmchase3';
     String URL = 'https://test.salesforce.com/services/oauth2/token?grant_type=password&client_id=' + client_id +'&client_secret=' +client_secret +'&username=' +username +'&password=' +password;

    HttpRequest req = new HttpRequest();
    req.setHeader('Content-Type','application/json');
    req.setHeader('accept', '*/*');
    //req.setHeader('accept-encoding', 'gzip, deflate') ;
    req.setMethod('POST');
    req.setEndpoint(URL);
    Http http = new Http();
     try{
         HTTPResponse res = http.send(req);
         if(res == null){
         	WEBSERVICE_PushNotification.InputError('Error generating auth token');
         	WEBSERVICE_PushNotification.InputError(res.toString());
     	}
         List<webservice_token__c> tokens  = [SELECT ID, token__c FROM webservice_token__c LIMIT 1];
         System.debug(tokens);
         webservice_token__c token = [SELECT ID, token__c FROM webservice_token__c LIMIT 1];
         //System.debug(auth_token);
         Map<String,Object> results = (Map<String,Object>)JSON.deserializeUntyped(res.getBody());
         auth_token = results.get('access_token').toString();

         if(!tokens.isEmpty() && String.isNotBlank(auth_token)){
            token.token__c = auth_token;
         	database.update(token);
         }
         else{
             token.token__c = auth_token;
         	 database.insert(token);
         }
     }catch(Exception ex){
        WEBSERVICE_PushNotification.InputError(ex.getMessage());
     }
  }
}