# HappyHandsHearts

FFG project for HappyHandsHearts client

Pre-Req:

1.  create-react-native-app
2.  expo exp
3.  expo xde - optional

Post:

1.  close and go to root folder
2.  run npm install / yarn
3.  exp start / use XDE to navigate to project folder -> select device
    #dir overview

[Quick start guide for setting up react app on Expo](https://docs.expo.io/versions/latest/)

### Let's follow this style when we create a story

`/screens` All of the main/container screen should go here i.e MapScreen

`/components` All of reusable components should go here i.e a styled button/view
`/components/componentName/componentName.styles.js` Have style in a separate file for each components

`/assets` All of static assets such as images should go here

`/constants/Colors` All of Theme style
<br/>`/constans/apiuri` All of API URL should reside here
<br/>`/constants/actionTypes` All of redux types should persis here

`/utils` All of utility such as Permission, PushNotification, or lodash wrappers should go here
<br/>`/utils/Auth` All of auth state management should go here (Maybe should remove when we start using redux-persist)

`/actions` Redux actions should go here
<br/>`/reducers` Reducers should go here
<br/>`/sagas` Redux-Sagas should go here
<br/>`/containers` Redux containers that wraps screen and components should go here. i.e mapStateToProps, mapDispatchToProps

`/services` All service code that communicates with the backend (Salesforce API) should go here
<br/>`/services/apexClasses` All Apex class code from Salesforce should be created here in parallel for reference.

### Notes On Salesforce API

GOTO: [Note on salesforce API calls.](API_Notes.md)
