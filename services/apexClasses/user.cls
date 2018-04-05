@RestResource(urlMapping='/login/*')
global class WEBSERVICES_user{
    @HttpGet
    global static List<User__c> getUsers(){
        List<User__c> users;
        try{
            users = [SELECT email__c, Name__c,Password__c FROM User__c];
            return users;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return users;
    }
}

