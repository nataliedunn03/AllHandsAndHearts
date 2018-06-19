# HappyHandsHearts

FFG project for HappyHandsHearts client

Pre-Req:

1.  [NodeJS and NPM](https://nodejs.org/en/)
2.  [React Native](https://facebook.github.io/react-native/)
3.  [create-react-native-app](https://github.com/react-community/create-react-native-app)
4.  [expo _exp_](https://docs.expo.io/versions/latest/workflow/exp-cli)
5.  [expo _xde_ -- exp equivalent in a GUI (optional)](https://expo.io/tools#xde)

Post-req:

1.  Download this folder and `cd` or go to this folder
2.  run `npm install` or run `yarn` if you use yarn
3.  when installation completes run `exp start` or use XDE to navigate to project folder -> select device
    #dir overview

### Folder Structure

`/screens` All of the main screens including LoginScreen, MapScreen, HomeScreen.

`/components` All of reusable components should go here i.e a styled button/view
`/components/componentName/componentName.styles.js` Have style in a separate file for each components

`/assets` All of static assets such as images should go here

`/constants/Colors` All of Theme style
<br/>`/constans/apiuri` All of API URL should reside here
<br/>`/constants/actionTypes` All of redux types should persis here

`/utils` All of utility such as Permission, PushNotification and Fetch wrappers
<br/>`/actions` Redux actions should go here
<br/>`/reducers` Reducers should go here
<br/>`/sagas` Redux-Sagas should go here
<br/>`/containers` Redux containers that wraps screen and components should go here. i.e mapStateToProps, mapDispatchToProps

`/services` All service code that communicates with the backend (Salesforce API) should go here
<br/>`/services/apexClasses` All Apex class code from Salesforce should be created here in parallel for reference.

### High Level Application Architecture

GOTO: [Architecture](HAD.png)

### Notes On Salesforce API

GOTO: [Note on salesforce API calls.](API_Notes.md)
