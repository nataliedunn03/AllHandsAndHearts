# All Hands and Hearts

FFG project for All Hands and Hearts.

### Mission Statement:

All Hands and Hearts efficiently and effectively address the immediate and long-term needs of communities impacted by natural disasters.

### Project Context

All Hands and Hearts frequently has to coordinate large groups of Volunteers in disaster zones in order to effectively deploy assistance to their project sites. Managing volunteers and facilitating communication can be very difficult. The FFG 2017 team built a Mobile Disaster Assessment application to engage volunteers, partners, and local communities. Our team is seeking to leverage an app to give All Hands and Hearts more functionality and capabilities to coordinate volunteers on the ground.

[Video Demo](https://drive.google.com/open?id=1nIM4NR-EeB56WkwfNi3frHtNcAX2AAm-)

### Installation

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

### Notes on how to change disaster type:

The disaster type options are hard coded in the App. In order for you to update them go to `EditPinScreen.js` file and add to the `pinType` object on line `53`. in this format: `{ name: 'Affected Area', isSelected: false, Id: 111, color: 'red' },`
Note: It must contain all the name, isSelected, Id, and color keys. You can change the values to your needs.

# Build process:

0.  [Make sure you have an expo account and signed in](https://expo.io/signup)
1.  Run `expo build:ios / build:android` and follow the instructions. YouTube walk-through https://www.youtube.com/watch?v=6IPr7oOugTs

    1.  Enter `kris.c@allhandsandhearts.org` and password. Note: if you have two-step authentication enabled, you will need to enter the code that you recieve on your phone. Note 2: Since CLI doesn't support recieving 2FA code via text, go to developer.apple.com -> sing in -> Click on Didn’t get a verification code? -> Text me. And use that recieved code for CLI.
    2.  Then follow the instructions on CLI. Use "Let Expo handle the process" for all the steps. So Expo does all the certifications!
    3.  When you go through all the process, expo will show a link to the build status on terminal ex: `https://expo.io/builds` -> Follow to that link from terminal to see the build status. When the build is complete (which may take a very long time), you can download the .IPA/.APK from that link and upload to App/Google store.
    4.  Once you have the IPA create a new app in App store link: https://itunesconnect.apple.com/login. Click on the + icon and fill out the necessary info as we discussed on our call. Kris has a screenshare of that or you can checkout this YouTube video with walk-through: https://www.youtube.com/watch?v=R-62gUat0Bc
    5.  When you fill out all the necessary info, before submitting for review, follow Step 6.
    6.  In order to upload your ipa you'll need to use Apple Application Loader. If you have XCode, application loader already comes with it: Xcode > Open Developer Tools > Application Loader.
        Note: You will need to have XCode and a Mac in order to access this application. Download XCode: https://developer.apple.com/xcode/downloads/
        Also, If you have 2-FA enable, you will need to create a app specific password to log into Application Loader at https://appleid.apple.com
    7.  That's it!! Submit the app for review and wait till you hear from Apple!

1.  More on: https://docs.expo.io/versions/latest/guides/app-stores.html and https://docs.expo.io/versions/latest/guides/building-standalone-apps.html
1.  Note 2: Since we're using Google Maps, make sure Google Maps API is enabled for iOS and Android. More on: https://developers.google.com/maps/documentation/javascript/get-api-key

### How to upload app

(From Macbook)

Update Version Number

0. Navigatetoapp.json
1. Update"Expo"->"version"
1. Update"Expo"->"ios"->"buildNumber"
   ![Screenshot of code for Version Bumping](https://github.com/nataliedunn03/AllHandsAndHearts/blob/master/documentation/upload_0a.png?raw=true)

Upload App

1. Find the project folder on your local machine.
1. Open Terminal, drag project folder into terminal. Press `Enter`.
1. Run `expo start`.
   ![Terminal screen recording](https://github.com/nataliedunn03/AllHandsAndHearts/blob/master/documentation/upload_0.mov)
1. Open an additional terminal session by pressing cntr + n.
1. Run `expo build:ios`.
1. Open `expo.com` url from terminal logs.
1. Download the .ipa file from the expo website.
1. Open Xcode (must be version 10.1+). Xcode -> Open Developer Tool -> Application loader
   ![Xcode & Application Loader screen shot](https://github.com/nataliedunn03/AllHandsAndHearts/blob/master/documentation/upload_1.png)
1. Upload downloaded .ipa file from step 6 to the Application Loader.
   ![Xcode & Application Loader](https://github.com/nataliedunn03/AllHandsAndHearts/blob/master/documentation/upload_2.mov)
1. Open `itunesconnect.com`. Submit new version of the app to Apple.
   <br>[Submit AppStore version - click "Download" on the next page.](https://github.com/nataliedunn03/AllHandsAndHearts/blob/develop/documentation/upload_3.mov)
   <br>[Submit TestFlight version - click "Download" on the next page.](https://github.com/nataliedunn03/AllHandsAndHearts/blob/develop/documentation/upload_4.mov)
