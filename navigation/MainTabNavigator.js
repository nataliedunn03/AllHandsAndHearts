import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, TabBarBottom } from "react-navigation";

import Colors from "../constants/Colors";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitle: "Home"
      }
    },
    Map: {
      screen: MapScreen,
      navigationOptions: {
        headerTitle: "Maps"
      }
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        headerTitle: "Notification"
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerTitle: "Profile"
      }
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
                ? `ios-home${focused ? "" : "-outline"}`
                : "md-home";
            break;
          case "Map":
            iconName =
              Platform.OS === "ios"
                ? `ios-map${focused ? "" : "-outline"}`
                : "md-map";
            break;
          case "Notification":
            iconName =
              Platform.OS === "ios"
                ? `ios-notifications${focused ? "" : "-outline"}`
                : "md-notifications";
            break;
          case "Profile":
            iconName =
              Platform.OS === "ios"
                ? `ios-contact${focused ? "" : "-outline"}`
                : "md-contact";
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
