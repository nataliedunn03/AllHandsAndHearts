import React from "react";
//import { ExpoConfigView } from '@expo/samples';
import Touchable from "react-native-platform-touchable";
import { StyleSheet, Text, View } from "react-native";
export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Profile"
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Touchable
          onPress={() => console.log("hello!")}
          style={{
            backgroundColor: "#eee",
            paddingVertical: 30,
            paddingHorizontal: 80
          }}
          background={Touchable.Ripple("blue")}>
          <Text>Hello there!</Text>
        </Touchable>
      </View>
    );
  }
}
