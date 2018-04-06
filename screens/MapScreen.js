import { MapView } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ActivityIndicator
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
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';

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
    this.state = {
      locationPermission: false,
      mapReady: false,
      displayGps: false,
      markers: markers,
      visible: false,
      markersTouch: [],
      regionData: [],
      currentRegionId: '',
      regionModalVisible: false,
      showMarkerModal: false, //open model onLongPress on map
      currentMarkerData: {}
    };
  }
  componentDidMount() {
    this._getUserCurrentLocation();
  }

  _updateCurrentMarkerData = currentMarkerData => {
    this.setState({
      currentMarkerData
    });
  };

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
          style={{ top: 10 }}
          onClick={() => {
            this.openRegionModal();
            this.props.getRegionData();
          }}
          color={Colors.defaultColor.PRIMARY_COLOR}
        />
      </View>
    );
  }

  closeRegionModal = () => {
    console.log('closedRegionModal');
    this.setState({
      regionModalVisible: false
    });
  };

  openRegionModal = () => {
    this.setState({
      regionModalVisible: true
    });
  };

  onRegionCardPress = async card => {
    let region = {
      ...card,
      longitudeDelta: DELTA * (Layout.width / Layout.height),
      latitudeDelta: DELTA
    };
    await this.props.getPinsByRegion(card.id);
    this.mapViewRef.animateToRegion(region);
    this.setState({
      currentRegionId: card.id
    });
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
          underlayColor="transparent"
          key={index}
          onPress={() => {
            this.onRegionCardPress(card);
          }}
          style={{
            margin: 40,
            width:
              regionCards.length > 1 ? Layout.width - 80 : Layout.width - 34,
            height: 150
          }}
        >
          <View>
            <Text>{card.name}</Text>
            <Text>{body}</Text>
          </View>
        </TouchableHighlight>
      );
    });
  };

  _renderRegionModalContent = () => {
    const { regionData } = this.props;
    return (
      <View style={styles.modalContent}>
        {regionData && (
          <ScrollCard
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={Layout.width}
            snapToAlignment={'center'}
            contentInset={{
              top: 0,
              left: 16,
              bottom: 0,
              right: 16
            }}
          >
            {this._renderRegionCards()}
          </ScrollCard>
        )}
        {!regionData && (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.defaultColor.PRIMARY_COLOR}
          />
        )}
      </View>
    );
  };

  _createNewMarker = async e => {
    e.persist();
    const coord = e.nativeEvent.coordinate;
    this.setState({
      showMarkerModal: true,
      currentMarkerData: {
        latitude: coord.latitude,
        longitude: coord.longitude
      }
    });
  };

  _closeMarkerModal = () => {
    this.setState({
      showMarkerModal: false,
      currentMarkerData: []
    });
  };

  _renderPinModal = () => {
    console.log('current _rednerPinModal: ', this.state.currentMarkerData);
    let { currentMarkerData, currentRegionId } = this.state;
    /*
     * TODO: Major stuff left to be done for writing pin data
     * 1) Add a dropdown option for pin type
     * 2) Write the proper dispatch and limit using setStates
     * 3) Finally make the POST call to Salesforce, and update current view with the new added pin.
     *    3.1) Make different Apex endpoint for Add/Update
     */
    return (
      <SlidingModal
        show={this.state.showMarkerModal}
        closeCallback={this._closeMarkerModal}
        top={Layout.height - 400}
      >
        <StyledInput
          style={styles.input}
          placeholder={currentMarkerData.name ? currentMarkerData.name : 'Name'}
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onChangeText={value => {
            currentMarkerData.name = value;
            this._updateCurrentMarkerData(currentMarkerData);
          }}
        />
        <StyledInput
          style={styles.inputWide}
          placeholder={
            currentMarkerData.description
              ? currentMarkerData.description
              : 'Description'
          }
          enablesReturnKeyAutomatically
          multiline
          numberOfLines={3}
          onChangeText={value => {
            currentMarkerData.description = value;
            this._updateCurrentMarkerData(currentMarkerData);
          }}
        />
        <StyledButton
          style={styles.addPinButton}
          textStyle={styles.addButtonTextStyle}
          text={currentMarkerData.id ? 'Update Pin' : 'Add Pin'}
          onPress={e => {
            console.log(
              'Write pin data to SalesForce for RegionId:',
              currentRegionId
            );
          }}
        />
      </SlidingModal>
    );
  };

  // What's e used for here?
  async _onMarkerPress(e, marker) {
    console.log('Marker pressed: ', marker);
    const data = {
      id: marker.Id,
      description: marker.Additional_Descriptors__c,
      latitude: marker.Coordinates__Latitude__s,
      longitude: marker.Coordinates__Longitude__s,
      name: marker.Name,
      type: marker.PinLocationType__c,
      regionId: marker.RegionId__c
    };
    this.setState({
      showMarkerModal: true,
      currentMarkerData: data
    });
  }

  _renderMapMarker() {
    return this.props.pinData.map(marker => {
      return (
        <MapView.Marker
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
    return (
      <SlidingModal
        show={this.state.regionModalVisible}
        closeCallback={this.closeRegionModal}
        top={Layout.height - 400}
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    height: 300
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
  input: {
    height: 42,
    color: Colors.defaultColor.PRIMARY_COLOR,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS
  },
  inputWide: {
    height: 110,
    color: Colors.defaultColor.PRIMARY_COLOR,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS
  },
  addPinButton: {
    height: 42,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR
  },
  addButtonTextStyle: {
    color: Colors.defaultColor.PAPER_COLOR
  }
});
