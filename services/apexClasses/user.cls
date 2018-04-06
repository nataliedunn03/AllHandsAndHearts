@RestResource(urlMapping='/users/*')
global class WEBSERVICES_usersVolunteerLogin{
    @HttpPut
    global static User__c getUser(String email, String password){
        User__c user;
        try{
            user = [SELECT Id, Name__c, Email__c FROM User__c WHERE Email__c = :email AND Password__c = :password];
            return user;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return user;
    }

    @HttpPost
    global static User__c crateUserAccount(String email, String password, String name){
        User__c user;
        try{
            user = new User__c();
            if(String.isNotBlank(email) && String.isNotBlank(password) && String.isNotBlank(name)){
                user.Email__c = email;
                user.Password__c = password;
                user.Name__c = name;
                insert user;
            }
            return user;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return user;
    }
}