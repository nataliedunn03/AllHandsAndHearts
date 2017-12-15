import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { MapView, Location, Constants, Permissions } from "expo";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {
  alertIfLocationisDisabled,
  enableLocation,
  getCurrentLocation
} from "../utils/Permissions";
const { width, height } = Dimensions.get("window");

export default class MapScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Maps"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentWillMount() {
    this._moveToCurrentLocation();
  }
  /**
   * Get current lcoation then set the delta to
   */
  _moveToCurrentLocation = async () => {
    await enableLocation();
    let { coords } = await getCurrentLocation();
    let location = {
      ...coords,
      longitudeDelta: 0.0922 * (width / height),
      latitudeDelta: 0.0922
    };
    this.setState({
      location
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.currentLocationView}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.currentLocationButton}
              onPress={this._moveToCurrentLocation}
            >
              <MaterialIcons
                name="my-location"
                size={20}
                color={Colors.tabIconSelected}
              />
            </TouchableOpacity>
          </View>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            followsUserLocation={true}
            loadingEnabled={true}
            toolbarEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            showsScale={true}
            loadingIndicatorColor="#228B22"
            region={this.state.location}
            onRegionChangeComplete={region => console.log(region)}
            ref={map => {
              this.map = map;
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: -1
  },
  currentLocationView: {
    position: "absolute",
    top: height - 150,
    left: 0,
    right: 20,
    alignItems: "flex-end"
  },
  currentLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 60,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.tabIconDefault,
    shadowRadius: 6,
    shadowOpacity: 1,
    opacity: 1,
    zIndex: 10,
    bottom: 30
  }
});
