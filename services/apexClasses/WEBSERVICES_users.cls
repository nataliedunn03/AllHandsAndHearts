@RestResource(urlMapping='/users/*')
global class WEBSERVICES_users{

    @HttpPut
    global static User__c getUser(String email, String password){
        User__c user;
        try{
        if(String.isNotBlank(email) && String.isNotBlank(password)){
        user = [SELECT Id, Name__c, Email__c FROM User__c WHERE Email__c = :email AND Password__c = :password];
        }
            return user;
        }catch(Exception ex){
            throw ex;
        }
    }

    @HttpPost
    global static void crateUserAccount(String email, String password, String name){
        RestResponse res = RestContext.response;

        User__c user;
        try{
            user = new User__c();
            if(String.isNotBlank(email) && String.isNotBlank(password) && String.isNotBlank(name)){
                if(WEBSERVICE_Utility.isValidEmail(email)){
                    user.Email__c = email;
                	user.Password__c = password;
                	user.Name__c = name;
                	insert user;
                }else{
                    WEBSERVICE_Utility.restBadRequest('Email address is not valid', res);
                    return;
                }
                WEBSERVICE_Utility.restGoodRequest(JSON.serialize(user), res);
            }else{
                WEBSERVICE_Utility.restBadRequest('Email, password, & name are all required.', res);
                return;
            }
        }catch(Exception ex){
            WEBSERVICE_Utility.restBadRequest(ex.getMessage(), res);
            System.debug('Error: '+ex.getMessage());
            return;
        }
    }
}


/**
@HttpPut
    global static User__c getUser(String payload, String iv){
        String jsonEmailPasswordObject;
        if(String.isBlank(payload) || String.isBlank(iv)){
            WEBSERVICE_PushNotification.InputError('Both payload and IV are required.');
        }

		webservice_encryption_key_ffg__c cache = [SELECT encryption_key__c FROM webservice_encryption_key_ffg__c];

        //decode the base54 key that we saved in cache using 'AES256'
        Blob cryptoKey = EncodingUtil.base64Decode(cache.encryption_key__c);
        //Blob initialVector = EncodingUtil.base64Decode(iv);
        //Blob blobPayload = EncodingUtil.base64Decode(payload);
        if(cryptoKey.size() <= 0){
            WEBSERVICE_PushNotification.InputError('Failed to load crypto keys');
        }

        //decrypt the payload containing {email, password} Note: password is hashed.
        //Crypto.decrypt('AES256', cryptoKey, IV, payloadBlob);
        //Blob decryptedPayload = Crypto.decrypt('AES256', cryptoKey, initialVector, blobPayload);
        //decrypted string object
        //jsonEmailPasswordObject = decryptedPayload.toString();

        User__c user;
        //User__c decryptedUser = (User__c)System.JSON.deserialize(jsonEmailPasswordObject, User__c.class);

        try{
        	//user = [SELECT Id, Name__c, Email__c FROM User__c WHERE Email__c = :decryptedUser.Email__c AND Password__c = :decryptedUser.Password__c];
            return user;
        }catch(Exception ex){
            //throw ex;
            WEBSERVICE_PushNotification.InputError(cache.encryption_key__c);
            //System.debug('Error: '+ex.getMessage());
        }
        WEBSERVICE_PushNotification.InputError(cache.encryption_key__c);
        return user;
    }
*/