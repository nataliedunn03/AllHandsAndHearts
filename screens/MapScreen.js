import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { MapView, Location, Constants, Permissions } from "expo";
import CurrentLocationButton from "../components/CurrentLocationButton";
import Colors from "../constants/Colors";
import {
  alertIfLocationisDisabled,
  getUserCurrentLocation
} from "../utils/Permissions";
const { width, height } = Dimensions.get("window");

export default class MapScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Maps"
  };
  constructor(props) {
    super(props);
    this.state = { locationPermission: false };
  }
  async componentWillMount() {
    this._moveToCurrentLocation();
  }
  /**
   * Get current lcoation then set the delta to viewport
   */
  _moveToCurrentLocation = async () => {
    try {
      let { coords } = await getUserCurrentLocation();
      if (coords) {
        let location = {
          ...coords,
          longitudeDelta: 0.0922 * (width / height),
          latitudeDelta: 0.0922
        };
        this.setState({
          location,
          gpsButtonColor: Colors.tabIconSelected,
          locationPermission: true
        });
      } else {
        this.setState({ locationPermission: false });
      }
    } catch (e) {
      console.log(e);
    }
  };
  onRegionChange = region => {
    this.setState({ location: region, gpsButtonColor: Colors.tabIconDefault });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <CurrentLocationButton
            locationPermission={this.state.locationPermission}
            onPress={this._moveToCurrentLocation}
            bottomMargin={height - 150}
            iconColor={this.state.gpsButtonColor}
          />
          <MapView
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            loadingEnabled={true}
            toolbarEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            showsScale={true}
            loadingIndicatorColor="#228B22"
            region={this.state.location}
            onRegionChange={this.onRegionChange}
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
  }
});
