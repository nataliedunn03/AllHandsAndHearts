@RestResource(urlMapping='/changePassword/*')
global class WEBSERVICE_changePassword{
    @HttpPost
    global static void changePassword(String email, String oldHash, String newHash){
        RestResponse res = RestContext.response;
        List<User__c> users;
        try{
            if(String.isNotBlank(email) && String.isNotBlank(oldHash) && String.isNotBlank(newHash)){
                users = [SELECT Id, Name__c, Email__c, Password__c FROM User__c WHERE Email__c = :email AND Password__c = :oldHash LIMIT 1];
                if(!users.isEmpty()){
                    User__c user = users[0];
				if((String)user.Password__c == oldHash){
                	user.Password__c = newHash;
                	update user;
                }else{
                    WEBSERVICE_Utility.restBadRequest('{"status":"Failed to change password. Make sure to enter correct current password."}', res);
                    return;
                }
                user = [SELECT Id, Name__c, Email__c FROM User__c WHERE Email__c = :email AND Password__c = :newHash];
               	WEBSERVICE_Utility.restGoodRequest(JSON.serialize(user), res);
                return;
                }else{
                    WEBSERVICE_Utility.restBadRequest('{"status":"Failed to change password. Make sure to enter correct password/email."}', res);
                    return;
                }
            }else{
                WEBSERVICE_Utility.restBadRequest('{"status":"Email, password, & name are all required."}', res);
                return;
            }
        }catch(Exception ex){
            WEBSERVICE_Utility.restBadRequest(ex.getMessage(), res);
            System.debug('Error: '+ex.getMessage());
        }
    }
}