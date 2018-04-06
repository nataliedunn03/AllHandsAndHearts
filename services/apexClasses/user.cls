@RestResource(urlMapping='/users/*')
global class WEBSERVICES_user{
    @HttpGet
    global static User__c getUser(){
        User__c user;
        try{
            String email = RestContext.request.params.get('email');
            String password  RestContext.request.params.get('password');
            users = [SELECT Name__c FROM User__c WHERE  email__c := email AND Password__c := password];
            return user;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return user;
    }
}

