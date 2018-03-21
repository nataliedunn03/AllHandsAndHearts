# HappyHandsHearts

FFG project for HappyHandsHearts client

Pre-Req:

1.  create-reactnative-app
2.  expo exp
3.  expo xde - optional

Post:

1.  close and go to root folder
2.  run npm install / yarn
3.  exp start / use XDE to navigate to project folder -> select device
    #dir overview

### Let's follow this style when we create a story

`/screens` All of the main/container screen should go here i.e MapScreen

`/components` All of reusable components should go here i.e a styled button/view
`/components/componentName/componentName.styles.js` Have style in a separate file for each components

`/assets` All of static assets such as images should go here

`/constants/Colors` All of Theme style
`/constans/apiuri` All of API URL should reside here
`/constants/actionTypes` All of redux types should persis here

`/utils` All of utility such as Permission, PushNotification, or lodash wrappers should go here
`/utils/Auth` All of auth state management should go here (Maybe should remove when we start using redux-persist)

`/actions` Redux actions should go here
`/reducers` Reducers should go here
`/sagas` Redux-Sagas should go here
`/containers` Redux containers that wraps screen and components should go here. i.e mapStateToProps, mapDispatchToProps
