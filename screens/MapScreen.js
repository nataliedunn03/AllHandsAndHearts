import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { MapView } from "expo";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Maps"
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
