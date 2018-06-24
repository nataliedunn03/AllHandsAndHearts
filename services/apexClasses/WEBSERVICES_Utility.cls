global class WEBSERVICE_Utility {
    global class InputErrorException extends Exception {}

    global static void InputError(String message) {
        throw new InputErrorException(message);
    }
    global static void restBadRequest(String message, RestResponse res) {
        res.addHeader('Content-Type', 'application/json');
        res.responseBody = Blob.valueOf(message);
        res.statusCode = 400;
        return;
    }
    global static void restGoodRequest(String message, RestResponse res){
        res.addHeader('Content-Type', 'application/json');
        res.responseBody = Blob.valueOf(message);
        res.statusCode = 200;
    }
    global static Boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile('^[A-Z0-9._%+-/!#$%&\'*=?^_`{|}~]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$');
        Matcher matcher = pattern.matcher(email.toUpperCase());
        return matcher.matches();
    }

}