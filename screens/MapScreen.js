import { MapView } from 'expo';
import React from 'react';
import { StyleSheet, UIManager, LayoutAnimation } from 'react-native';
import { View } from 'react-native-animatable';
import SlidingModal from 'react-native-sliding-modal';
//import { SlidingModal } from '../components/Modal';
import {
  CurrentLocationButton,
  SwitchRegionButton,
  MapsModalHeader,
  ViewRegionModal,
  ViewPinModal
} from '../components/Maps';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { getUserCurrentLocation } from '../utils/Permissions';
import { runAfterInteractions } from '../utils/utils';

const DELTA = 0.0922;

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

export default class MapScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    this.state = {
      locationPermission: false,
      mapReady: false,
      displayGps: false,
      visible: false,
      markersTouch: [],
      regionData: [],
      currentRegionId: '',
      regionModalVisible: false,
      showMarkerModal: false, //open model onLongPress on map
      markerCoord: {},
      regionModalIsFull: false,
      markerIds: [], //keep track of marker Identifiers to focus
      showDetailsOfMarkerId: null
    };
  }
  componentDidMount() {
    this._getUserCurrentLocation();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps['pinData']) {
      const markerIds = nextProps.pinData.map(marker => {
        return {
          latitude: marker.Coordinates__Latitude__s,
          longitude: marker.Coordinates__Longitude__s,
          ...marker
        };
      });
      this.setState({
        markerIds
      });
    }
  }

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

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
  _handleRegionButtonAction = async () => {
    this.openRegionModal();
    await runAfterInteractions();
    this.props.getRegionData();
  };

  /**
   * Render GPS button and
   * Render SwitchRegion button
   */
  _renderBottomActionButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 20
        }}
      >
        <View />
        <SwitchRegionButton
          style={{ left: 20 }}
          onClick={this._handleRegionButtonAction}
          color={Colors.defaultColor.PRIMARY_COLOR}
        />

        <View animation={this._getGPSButtonAnimationType()} useNativeDriver>
          <CurrentLocationButton
            locationPermission={this.state.locationPermission}
            onPress={this._moveToUserCurrentLocation}
            iconColor={this.state.gpsButtonColor}
          />
        </View>
      </View>
    );
  };

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
      /*const markers = this.state.markerIds.map(marker => {
        return marker.Id;
      });
      this.mapViewRef.fitToSuppliedMarkers(markers, true);
      //this.mapViewRef.fitToElements(true); // this will fill all the markers, not ideal when we will have all the region on the map.
      */
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
    this.state.regionModalIsFull && this.regionModalRef.openModalHalfway();
    //this.scrollCardRef && this.scrollCardRef.scrollTo({ x: -9 });
    this.mapViewRef.animateToRegion(region);
    await runAfterInteractions();
    await this.props.getPinsByRegion(card.id);
    if (this.state.mapReady && this.mapViewRef) {
      setTimeout(() => {
        this._focusOnCoordinates();
      }, 550);
    }
    this.setState({
      currentRegionId: card.id
    });
  };

  _createNewMarker = async e => {
    e.persist();
    const coords = e.nativeEvent.coordinate;
    console.log(' navigate to EditPin');
    this.props.navigation.navigate('EditPin', {
      coords,
      regionId: this.state.currentRegionId,
      markerIds: this.state.markerIds,
      setPinByRegion: this.props.setPinByRegion
    });
  };

  _editCurrentMarker = async pinData => {
    console.log(' editing to EditPin:', pinData);
    this._closeMarkerModal();
    this.props.navigation.navigate('EditPin', {
      hasPinData: true,
      setPinByRegion: this.props.setPinByRegion,
      coords: {
        longitude: pinData.longitude,
        latitude: pinData.latitude
      },
      regionId: this.state.currentRegionId,
      ...pinData
    });
  };

  _closeMarkerModal = () => {
    console.log('closedMarkerModal');
    this.setState({
      showMarkerModal: false
    });
  };

  _onPinDelete = pinId => {
    const { markerIds } = this.state;
    this.props.deletePinById(pinId, markerIds);
    this._closeMarkerModal();
  };

  _renderPinModal = () => {
    let { currentRegionId, showDetailsOfMarkerId, markerIds } = this.state;
    const { currentUserId } = this.props;
    /*
     * TODO: Major stuff left to be done for writing pin data
     * 1) Add a dropdown option for pin type
     * 2) Write the proper dispatch and limit using setStates
     * 3) Finally make the POST call to Salesforce, and update current view with the new added pin.
     *    3.1) Make different Apex endpoint for Add/Update
     */
    const pinData = markerIds.filter(
      marker => marker.Id === showDetailsOfMarkerId
    )[0];
    return (
      <SlidingModal
        show={this.state.showMarkerModal}
        closeCallback={this._closeMarkerModal}
        top={Layout.height - 450}
      >
        <SlidingModal.Header style={styles.slidingHeader}>
          <MapsModalHeader
            title="Location Details"
            onPressClose={this._onMarkerClose}
            style={{
              fontSize: 24
            }}
          />
        </SlidingModal.Header>
        <ViewPinModal
          data={pinData}
          currentUserId={currentUserId}
          onDelete={this._onPinDelete}
          onEdit={() => {
            this._editCurrentMarker(pinData);
          }}
        />
      </SlidingModal>
    );
  };

  _onMarkerPress(markerId) {
    console.log('opening marker modal');
    console.log(markerId);
    this.setState({
      showMarkerModal: true,
      showDetailsOfMarkerId: markerId
    });
  }

  _onMarkerClose = () => {
    console.log('closing marker description');
    this.setState({
      showMarkerModal: false
    });
  };

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
          onPress={() => this._onMarkerPress(marker.Id)}
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
  handleRegionModalFullScreen = () => {
    this.setState({
      regionModalIsFull: true
    });
  };

  handleRegionModalHalfScreen = () => {
    this.setState({
      regionModalIsFull: false
    });
  };
  /*handleRegionModalStateChange = key => {
    this.setState(prevState => {
      return {
        [key]: !prevState[key]
      };
    });
  };*/
  _renderRegionModal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return (
      <SlidingModal
        show={this.state.regionModalVisible}
        closeCallback={this.closeRegionModal}
        top={Layout.height - 350}
        fullScreenCallback={this.handleRegionModalFullScreen}
        halfScreenCallback={this.handleRegionModalHalfScreen}
        ref={element => (this.regionModalRef = element)}
      >
        <SlidingModal.Header style={styles.slidingHeader}>
          <MapsModalHeader
            title="Disaster Sites"
            onPressClose={this.closeRegionModal}
          />
        </SlidingModal.Header>
        <ViewRegionModal
          regionData={this.props.regionData ? this.props.regionData : []}
          onRegionCardPress={this.onRegionCardPress}
          regionModalIsFull={this.state.regionModalIsFull}
        />
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
        {this._renderBottomActionButtons()}
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
  slidingHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
