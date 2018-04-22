import { MapView, LinearGradient } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  UIManager,
  LayoutAnimation,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { View } from 'react-native-animatable';
import SlidingModal from 'react-native-sliding-modal';
import { ViewPinModal } from '../components/Modal';
//import { SlidingModal } from '../components/Modal';
import { CurrentLocationButton, SwitchRegionButton } from '../components/Maps';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { getStaticRegionData } from '../services/regions';
import { getUserCurrentLocation } from '../utils/Permissions';
import { ScrollCard } from '../components/Card';
import { StyledText } from '../components/StyledText';
import GoogleStaticMap from 'react-native-google-static-map';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import FadeIn from 'react-native-fade-in-image';
import { Feather as Icon } from '@expo/vector-icons';

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
          onClick={() => {
            this.openRegionModal();
            this.props.getRegionData();
          }}
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
    console.log(this.state.markerIds);
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
    await this.props.getPinsByRegion(card.id);
    this.mapViewRef.animateToRegion(region);
    if (this.state.mapReady && this.mapViewRef) {
      setTimeout(() => {
        this._focusOnCoordinates();
      }, 550);
    }
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
        longitude: region.Coordinates__Longitude__s,
        type: region.DisasterType__c,
        customName: region.DisasterLocation__c,
        startDate: region.DisasterStart__c
      };

      return (
        <TouchableHighlight
          key={index}
          underlayColor="transparent"
          onPress={() => {
            this.onRegionCardPress(card);
          }}
          style={{
            flex: 1,
            flexDirection: 'column',
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
                  width: Layout.width - 33,
                  height: 190
                }
              ]}
            >
              <FadeIn>
                <GoogleStaticMap
                  latitude={
                    !isNaN(card.latitude)
                      ? card.latitude.toString()
                      : card.latitude
                  }
                  longitude={
                    !isNaN(card.longitude)
                      ? card.longitude.toString()
                      : card.longitude
                  }
                  zoom={14}
                  size={{
                    width: Layout.width - 33,
                    height: 210
                  }}
                  apiKey={''}
                  hasCenterMarker={false}
                />
              </FadeIn>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.1)']}
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
                  width: Layout.width - 33,
                  height: 190,
                  position: 'absolute',
                  padding: 20,
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              ]}
            >
              <View>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 70)',
                    fontSize: 15,
                    letterSpacing: -0.24,
                    fontWeight: 'bold'
                  }}
                >
                  {card.type ? card.type.toUpperCase() : card.type}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    letterSpacing: 0.34,
                    fontWeight: 'bold',
                    color: 'hsl(0, 0%, 97%)'
                  }}
                >
                  {card.name}
                </Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    letterSpacing: -0.32,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: 'rgba(0, 0, 0, 20)',
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  {`Start: ${new Date(card.startDate).toDateString()}`}
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    letterSpacing: -0.32,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: 'rgba(0, 0, 0, 20)',
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  End: May 02, 2019
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
    const coords = e.nativeEvent.coordinate;
    console.log(' navigate to EditPin');
    this.props.navigation.navigate('EditPin', {
      coords,
      regionId: this.state.currentRegionId,
      setPinByRegion: this.props.setPinByRegion
    });
  };

  _closeMarkerModal = () => {
    console.log('closedMarkerModal');
    this.setState({
      showMarkerModal: false
    });
  };

  _renderPinModalContent = () => {
    let marker = this.state.markerIds.filter(
      m => m.Id === this.state.showDetailsOfMarkerId
    );
    if (!marker || (marker && marker.length < 1)) return null;
    else if (marker) {
      console.log(marker);
      marker = marker[0];
      const currentMarkerData = {
        ...marker,
        description: marker.Additional_Descriptors__c,
        name: marker.Name,
        type: marker.PinLocationType__c,
        regionId: marker.RegionId__c
      };

      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <StyledInput
            style={styles.input}
            placeholder={
              currentMarkerData.name ? currentMarkerData.name : 'Name'
            }
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically
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
          />
          <StyledButton
            style={styles.addPinButton}
            textStyle={styles.addButtonTextStyle}
            text={currentMarkerData.id ? 'Update Pin' : 'Add Pin'}
          />
        </ScrollView>
      );
    }
  };

  _renderPinModal = () => {
    console.log('marker modal rendered');
    let { currentRegionId, showDetailsOfMarkerId, markerIds } = this.state;
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
        <SlidingModal.Header
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View>
            <Icon
              name="minus"
              color="#5d0e8b8f"
              size={32}
              style={{
                top: -3
              }}
            />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                top: -25,
                right: -165,
                height: 30,
                width: 30,
                backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
                borderRadius: 15
              }}
              hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
              onPress={() => this._onMarkerClose()}
            >
              <Icon name="x" color="#ffffff" size={22} />
            </TouchableOpacity>
          </View>
          <StyledText
            style={{
              color: '#000000',
              top: -15,
              fontSize: 24,
              marginLeft: 16,
              fontWeight: '500',
              textAlign: 'left',
              backgroundColor: 'transparent',
              alignSelf: 'flex-start'
            }}
          >
            Location Details
          </StyledText>
        </SlidingModal.Header>
        <ViewPinModal data={pinData} />
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

  _onMarkerClose() {
    console.log('closing marker description');
    this.setState({
      showMarkerModal: false
    });
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
        <SlidingModal.Header
          style={{
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row'
            }}
          >
            <View />
            <Icon
              name="minus"
              color={Colors.defaultColor.PRIMARY_COLOR}
              size={32}
              style={{
                top: -3,
                left: 14
              }}
            />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                top: 8,
                right: 8,
                height: 30,
                width: 30,
                backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
                borderRadius: 15
              }}
              hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
              onPress={this.closeRegionModal}
            >
              <Icon name="x" color="#ffffff" size={22} />
            </TouchableOpacity>
          </View>
          <StyledText
            style={{
              color: '#000000',
              fontSize: 28,
              marginBottom: 16,
              marginLeft: 16,
              fontWeight: '500',
              textAlign: 'left',
              backgroundColor: 'transparent',
              alignSelf: 'flex-start'
            }}
          >
            Disaster Sites
          </StyledText>
        </SlidingModal.Header>
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
