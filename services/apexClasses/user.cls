@RestResource(urlMapping='/login/*')
global class WEBSERVICES_user{
    @HttpGet
    global static List<User__c> getUsers(){
        List<User__c> regions;
        try{
            broadcast = [SELECT Username__c,Password__c FROM User__c];
            return user;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return user;
    }
}

