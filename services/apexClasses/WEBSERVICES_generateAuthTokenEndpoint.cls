@RestResource(urlMapping='/generateAuthToken/*')
global class WEBSERVICE_generateAuthTokenEndpoint{
    @HttpGet
    global static void getAuthToken(){
        try{
			WEBSERVICE_generateAuthToken.execute();
        }catch(Exception ex){
            System.debug('Exception is ' + ex.getMessage());
            throw ex;
        }
    }
}@RestResource(urlMapping='/generateAuthToken/*')
 global class WEBSERVICE_generateAuthTokenEndpoint{
     @HttpGet
     global static void getAuthToken(){
         try{
 			WEBSERVICE_generateAuthToken.execute();
         }catch(Exception ex){
             System.debug('Exception is ' + ex.getMessage());
             throw ex;
         }
     }
 }