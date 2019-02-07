@RestResource(urlMapping='/userDetails/*')
global class WEBSERVICE_getUserDetails{
    @HttpGet
    global static List<User> getUserDetails(){
        List<User> userDetails;
        try{
            userDetails = [SELECT Name, Email, LastLoginDate from User];
            return userDetails;
        }catch(Exception ex){
            System.debug('Error: '+ex.getMessage());
        }
        return userDetails;
    }
}