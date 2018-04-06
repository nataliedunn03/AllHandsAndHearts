@RestResource(urlMapping='/users/*')
global class WEBSERVICES_userVolunteer{
    @HttpGet
    global static User__c getUser(){
        User__c user;
        try{
            String email = RestContext.request.params.get('email');
            String password = RestContext.request.params.get('password');
            user = [SELECT Id, Name__c, Email_c FROM User__c WHERE Email__c = email AND Password__c = password];
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
                user.Email_c = email;
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

