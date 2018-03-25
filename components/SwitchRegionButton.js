"use strict";

import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { alertIfLocationisDisabled } from "../utils/Permissions";

export default class SwitchRegionButton extends React.Component {
  constructor(props) {
    super(props);
  }
  onButtonPress = () => {
    console.log("Open Region Form Modal");
  };
  render() {
    const { onClick } = this.props;
    return (
      <View style={[styles.switchRegionView, this.props.style]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.switchRegionButton}
          onPress={onClick || this.onButtonPress}
        >
          <MaterialIcons name="map" size={20} color={this.props.iconColor} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  switchRegionView: {
    position: "absolute",
    left: 20,
    alignItems: "flex-start"
  },
  switchRegionButton: {
    width: 44,
    height: 44,
    bottom: 30,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.tabIconDefault,
    borderRadius: 22,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    opacity: 1
  }
});
