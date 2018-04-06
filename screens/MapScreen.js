import { MapView, LinearGradient } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  UIManager,
  LayoutAnimation
} from 'react-native';
import { View } from 'react-native-animatable';

import { CurrentLocationButton, SwitchRegionButton } from '../components/Maps';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { getStaticRegionData, getRegionList } from '../services/regions';
import { getUserCurrentLocation } from '../utils/Permissions';
import getStaticMarker, { randomId } from './StaticMarkers';
import { SlidingModal, SimpleModal } from '../components/Modal';
import { ScrollCard } from '../components/Card';
import { StyledText } from '../components/StyledText';
import GoogleStaticMap from 'react-native-google-static-map';
const DELTA = 0.0922;

let markers = getStaticMarker();

/**
 * 1. Be able to view details of the Map Pin on Pin click
 * 2. Be able to edit map pin
 * 3. Be able to save those data
 */

/*
TODO:
  I feel like this file is getting a bit too cluttered.
  We should probably consider refactoring once the MVP requirements are met?
  (i.e refactor separate file for GPS button, map region button, and their respective calls)
  - Ye
 */

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    this.state = {
      locationPermission: false,
      mapReady: false,
      displayGps: false,
      markers: markers,
      visible: false,
      markersTouch: [],
      regionData: [],
      regionModalVisible: false,
      showMarkerModal: false, //open model onLongPress on map
      markerCoord: {},
      regionModalIsFull: false,
      markerIds: [] //keep track of marker Identifiers to focus
    };
  }
  componentDidMount() {
    this._getUserCurrentLocation();
  }

  componentWillReceiveProps(nextProps) {
    const markerIds = nextProps.pinData.map(marker => {
      return {
        latitude: marker.Coordinates__Latitude__s,
        longitude: marker.Coordinates__Longitude__s
      };
    });
    this.setState({
      markerIds
    });
  }

  /**
   * Get current lcoation then set the delta to viewport
   */
  _getUserCurrentLocation = async () => {
    try {
      let { coords } = await getUserCurrentLocation();
      if (coords) {
        let region = {
          ...coords,
          longitudeDelta: DELTA * (Layout.width / Layout.height),
          latitudeDelta: DELTA
        };
        this.setState({
          initialRegion: region,
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
  //move the map to user current location on button click
  _moveToUserCurrentLocation = async () => {
    try {
      let { coords } = await getUserCurrentLocation();
      if (coords) {
        let region = {
          ...coords,
          longitudeDelta: DELTA * (Layout.width / Layout.height),
          latitudeDelta: DELTA
        };
        this.mapViewRef.animateToRegion(region);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //see if user moved the map and show button to come back to current location
  _updateGPSButton = region => {
    const { initialRegion, locationPermission } = this.state;
    //little hacky way to change the GPS button color
    //based on location change
    if (initialRegion && locationPermission) {
      let diffLat = Math.abs(
        initialRegion.latitude.toFixed(4) - region.latitude.toFixed(4)
      );
      let diffLong = Math.abs(
        initialRegion.longitude.toFixed(4) - region.longitude.toFixed(4)
      );
      if (diffLat > 0.001 || diffLong > 0.001) {
        this.setState({
          gpsButtonColor: Colors.tabIconDefault,
          displayGps: true
        });
      } else {
        this.setState({
          gpsButtonColor: Colors.tabIconSelected,
          displayGps: false
        });
      }
      console.log(this.state.displayGps);
    }
  };
  //see what kind of animation we should perform based on map movement
  _getGPSButtonAnimationType = () => {
    if (!this.state.locationPermission) return 'fadeIn';
    return this.state.displayGps ? 'fadeIn' : 'fadeOut';
  };

  //render the gps button if map is moved
  _renderGPSButton() {
    return (
      <View animation={this._getGPSButtonAnimationType()} useNativeDriver>
        <CurrentLocationButton
          style={{ top: -20 }}
          locationPermission={this.state.locationPermission}
          onPress={this._moveToUserCurrentLocation}
          iconColor={this.state.gpsButtonColor}
        />
      </View>
    );
  }

  //render the switch region button if map is moved
  _renderSwitchRegionButton() {
    return (
      <View>
        <SwitchRegionButton
          style={{ top: -10 }}
          onClick={() => {
            this.openRegionModal();
            this.props.getRegionData();
            //console.log(this.props);
            //this.props.navigation.navigate('Marker');
          }}
          color={Colors.defaultColor.PRIMARY_COLOR}
        />
      </View>
    );
  }

  closeRegionModal = () => {
    console.log('closedRegionModal');
    this.setState({
      regionModalVisible: false,
      regionModalIsFull: false
    });
  };

  openRegionModal = () => {
    this.setState({
      regionModalVisible: true
    });
  };

  _focusOnCoordinates = () => {
    if (this.mapViewRef && this.state.markerIds.length > 0) {
      // this.mapViewRef.fitToSuppliedMarkers(this.state.markerIds, true);
      //this.mapViewRef.fitToElements(true); // this will fill all the markers, not ideal when we will have all the region on the map.
      this.mapViewRef.fitToCoordinates(this.state.markerIds, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true
      });
    }
  };

  onRegionCardPress = async card => {
    let region = {
      ...card,
      longitudeDelta: DELTA * (Layout.width / Layout.height),
      latitudeDelta: DELTA
    };
    await this.props.getPinsByRegion(card.id);
    this.mapViewRef.animateToRegion(region);
    if (this.state.mapReady && this.mapViewRef) {
      setTimeout(() => {
        this._focusOnCoordinates();
      }, 500);
    }
  };

  _renderRegionCards = () => {
    const { regionData } = this.props;
    // If there are no regionData from Salesforce, use the static region data.
    const regionCards =
      regionData !== undefined ? regionData : getStaticRegionData();
    // const regionCards = getStaticRegionData();

    return regionCards.map((region, index) => {
      const card = {
        id: region.Id,
        name: region.Name,
        latitude: region.Coordinates__Latitude__s,
        longitude: region.Coordinates__Longitude__s
      };

      const body = '(' + card.latitude + ', ' + card.longitude + ')';
      return (
        <TouchableHighlight
          key={index}
          underlayColor="transparent"
          onPress={() => {
            this.onRegionCardPress(card);
          }}
          style={{
            flex: 1,
            height: 190,
            overflow: 'hidden',
            margin: 8,
            marginTop: 0,
            padding: 0,
            borderRadius: 8
          }}
        >
          <View>
            <View
              style={[
                {
                  width: this.state.regionModalIsFull
                    ? Layout.width - 20
                    : Layout.width - 34,
                  height: 190
                }
              ]}
            >
              <GoogleStaticMap
                latitude={'37.785834'}
                longitude={'-122.406417'}
                zoom={14}
                size={{
                  width: this.state.regionModalIsFull
                    ? Layout.width - 20
                    : Layout.width - 34,
                  height: 210
                }}
                apiKey={''}
                hasCenterMarker={false}
              />
              <LinearGradient
                colors={['#000000ff', 'rgba(0, 0, 0, 0.2)']}
                style={{
                  position: 'absolute',
                  opacity: 0.8,
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 190
                }}
              />
            </View>
            <View
              style={[
                {
                  top: 0,
                  left: 0,
                  width: this.state.regionModalIsFull
                    ? Layout.width - 20
                    : Layout.width - 34,
                  height: 190,
                  position: 'absolute',
                  padding: 20,
                  flex: 1,
                  flexDirection: 'row'
                }
              ]}
            >
              <View style={{ alignSelf: 'flex-start' }}>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 70)',
                    fontSize: 15,
                    letterSpacing: -0.24,
                    fontWeight: '700'
                  }}
                >
                  HURRICANE
                </Text>,
                <Text
                  style={{
                    fontSize: 28,
                    letterSpacing: 0.34,
                    fontWeight: '700',
                    color: 'hsl(0, 0%, 97%)'
                  }}
                >
                  Bagmati, Nepal
                </Text>
              </View>
              <View style={{ alignSelf: 'flex-end', left: -40 }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    letterSpacing: -0.32,
                    lineHeight: 21,
                    fontWeight: '700',
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: 'rgba(0, 0, 0, 20)',
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  End: May 02, 2018
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    letterSpacing: -0.32,
                    lineHeight: 21,
                    fontWeight: '700',
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: 'rgba(0, 0, 0, 20)',
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  Start: May 02, 2018
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    });
  };

  _renderRegionModalContent = () => {
    const { regionData } = this.props;
    return (
      <View style={styles.modalContent}>
        <StyledText
          style={{
            color: '#000000',
            fontSize: 28,
            marginTop: 10,
            marginBottom: 16,
            marginLeft: 16,
            fontWeight: '500',
            textAlign: 'left',
            backgroundColor: 'transparent'
          }}
        >
          Disaster Sites
        </StyledText>
        {!regionData && (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.defaultColor.PRIMARY_COLOR}
          />
        )}
        {regionData && (
          <ScrollCard
            horizontal={this.state.regionModalIsFull ? false : true}
            vertical={this.state.regionModalIsFull ? true : false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={Layout.width}
            snapToAlignment={'center'}
            cardStyle={{
              overflow: 'hidden'
            }}
          >
            {this._renderRegionCards()}
          </ScrollCard>
        )}
      </View>
    );
  };

  _createNewMarker = async e => {
    e.persist();
    const coord = e.nativeEvent.coordinate;
    this.setState({
      showMarkerModal: true,
      markerCoord: coord
    });
  };

  _closeMarkerModal = () => {
    this.setState({
      showMarkerModal: false
    });
  };

  _renderPinModal = () => {
    return (
      <SlidingModal
        show={this.state.showMarkerModal}
        closeCallback={this._closeMarkerModal}
      />
    );
  };

  async _onMarkerPress(e, marker) {
    console.log('on marker pressed');
  }
  _renderMapMarker() {
    return this.props.pinData.map(marker => {
      return (
        <MapView.Marker
          identifier={marker.Id}
          key={marker.Id}
          coordinate={{
            latitude: marker.Coordinates__Latitude__s,
            longitude: marker.Coordinates__Longitude__s
          }}
          pinColor={'#FF0000'}
          onPress={() => this._onMarkerPress(null, marker)}
        />
      );
    });
  }
  //see if map is ready
  _onMapReady = () => {
    this.setState({ mapReady: true });
  };
  //callback on pan map
  _onRegionChange = region => {};
  //callback when user stops moving the map
  _onRegionChangeComplete = region => {
    this._updateGPSButton(region);
  };
  showMarkerModal = () => {
    this.setState({
      showMarkerModal: true
    });
  };

  _renderRegionModal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return (
      <SlidingModal
        show={this.state.regionModalVisible}
        closeCallback={this.closeRegionModal}
        top={Layout.height - 350}
        fullScreenCallback={() =>
          this.setState({
            regionModalIsFull: true
          })
        }
      >
        {this._renderRegionModalContent()}
      </SlidingModal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={[styles.map]}
          onMapReady={this._onMapReady}
          initialRegion={this.state.initialRegion}
          showsUserLocation={true}
          showsPointsOfInterest={true}
          showsCompass={true}
          loadingEnabled={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          rotateEnabled={true}
          showsScale={true}
          showsMyLocationButton={false}
          showsIndoorLevelPicker={true}
          onRegionChange={this._onRegionChange}
          onRegionChangeComplete={this._onRegionChangeComplete}
          onLongPress={e => this._createNewMarker(e)}
          ref={element => (this.mapViewRef = element)}
        >
          {this._renderMapMarker()}
        </MapView>
        {this._renderSwitchRegionButton()}
        {this._renderGPSButton()}
        {this._renderRegionModal()}
        {this._renderPinModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: -1
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  markerModal: {
    justifyContent: 'flex-end',
    margin: 0,
    zIndex: 10
  },
  markerModalFullScreen: {
    flex: 1,
    height: 700
  },
  commonStyleRegionModalContent: {
    borderColor: '#EDEDED',
    borderRadius: 3,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: 'hsla(0, 0%, 0%, 0.2)',
    shadowOffset: { width: 1, height: 1 }
  }
});
