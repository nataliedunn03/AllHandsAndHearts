@RestResource(urlMapping='/getAuthToken/*')
global class WEBSERVICE_getAuthToken{
    @HttpGet
    global static webservice_token__c getAuthToken(){
        /*
         * userId is actually not fake. It is just passed, so we can use POST and pass something for it to work from
         * the App. But userId is not being used.
		*/
        List<webservice_token__c> tokens;
        webservice_token__c token;
        try{
               	tokens = [SELECT ID, token__c, LastModifiedDate FROM webservice_token__c LIMIT 1];
            if(!tokens.isEmpty()){
                token = tokens[0];
            }else{
                WEBSERVICE_generateAuthToken.execute();
            }
        }catch(Exception ex){
            System.debug('Exception is ' + ex.getMessage());
            throw ex;
        }
        return token;
    }
    global class InputErrorException extends Exception {}
    global static void InputError(String message) {
        throw new InputErrorException(message);
    }
}