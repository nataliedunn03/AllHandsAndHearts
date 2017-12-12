import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, TabBarBottom } from "react-navigation";

import Colors from "../constants/Colors";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Map: {
      screen: MapScreen
    },
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "Home":
            iconName =
              Platform.OS === "ios"
                ? `ios-information-circle${focused ? "" : "-outline"}`
                : "md-information-circle";
            break;
          case "Map":
            iconName =
              Platform.OS === "ios"
                ? `ios-link${focused ? "" : "-outline"}`
                : "md-link";
            break;
          case "Profile":
            iconName =
              Platform.OS === "ios"
                ? `ios-options${focused ? "" : "-outline"}`
                : "md-options";
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    animationEnabled: true,
    swipeEnabled: false
  }
);
