import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { alertIfLocationisDisabled } from "../utils/Permissions";

export default (CurrentLocationButton = props => {
  const style = {
    top: props.bottomMargin ? props.bottomMargin : 0
  };
  onButtonPress = () => {
    props.locationPermission ? props.onPress() : alertIfLocationisDisabled();
  };
  return (
    <View>
      <View style={[styles.currentLocationView, style]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.currentLocationButton}
          onPress={onButtonPress}
        >
          <MaterialIcons
            name={props.locationPermission ? "my-location" : "location-off"}
            size={20}
            color={props.iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute"
  },
  currentLocationView: {
    position: "absolute",
    left: 0,
    right: 20,
    alignItems: "flex-end"
  },
  currentLocationButton: {
    width: 40,
    height: 40,
    bottom: 30,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.tabIconDefault,
    borderRadius: 10,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    opacity: 1,
    zIndex: 10
  }
});
