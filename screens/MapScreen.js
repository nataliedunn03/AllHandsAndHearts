'use strict';
import React from 'react';
import {
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Platform,
	Animated,
	Button,
	TextInput
} from 'react-native';

import { MapView, Location, Constants, Permissions } from 'expo';
import CurrentLocationButton from '../components/CurrentLocationButton';
import { View, Image, Text } from 'react-native-animatable';
import Colors from '../constants/Colors';
import {
	alertIfLocationisDisabled,
	getUserCurrentLocation
} from '../utils/Permissions';
import Layout from '../constants/Layout';
import StyledInput from '../components/StyledInput';
import SlidingUpPanel from 'rn-sliding-up-panel';

import Marker from '../components/Marker';

const DELTA = 0.0922;

import getStaticMarker, { randomId } from './StaticMarkers';
let markers = getStaticMarker();

const { width, height } = Dimensions.get('window');

/**
 * 1. Be able to view details of the Map Pin on Pin click
 * 2. Be able to edit map pin
 * 3. Be able to save those data
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
			markersTouch: []
		};
	}
	componentDidMount() {
		this._getUserCurrentLocation();
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
			console.log(coords);
			if (coords) {
				let region = {
					...coords,
					longitudeDelta: DELTA * (Layout.width / Layout.height),
					latitudeDelta: DELTA
				};
				if (this.state.mapReady) {
					this.mapViewRef.animateToRegion(region);
				}
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

	_createNewMarker(e) {
		console.log(e.nativeEvent.coordinate);
		const id = randomId();
		let markers = [
			...this.state.markers,
			{
				coordinate: e.nativeEvent.coordinate,
				key: id,
				color: Colors.defaultColor.PRIMARY_COLOR,
				description: 'This is a description'
			}
		];
		this.setState({
			markers
		});
	}

	//render the gps button if map is moved
	_renderGPSButton() {
		return (
			<View animation={this._getGPSButtonAnimationType()} useNativeDriver>
				<CurrentLocationButton
					style={{ top: -40 }}
					locationPermission={this.state.locationPermission}
					onPress={this._moveToUserCurrentLocation}
					iconColor={this.state.gpsButtonColor}
				/>
			</View>
		);
	}
	_onMarkerPress(marker) {
		/*this.setState({
			markersTouch: [
				...this.state.markersTouch,
				{
					key: randomId()
				}
			]
		});*/
		this.props.navigation.navigate('Marker', { name: marker.name });
	}
	_renderMapMarker() {
		return this.state.markers.map(marker => {
			return (
				<MapView.Marker
					key={marker.key}
					coordinate={marker.coordinate}
					pinColor={marker.color}
					onPress={() => this._onMarkerPress(marker)}
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

	render() {
		return (
			<View style={styles.container}>
				<MapView
					style={styles.map}
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
					onRegionChange={this._onRegionChange}
					onRegionChangeComplete={this._onRegionChangeComplete}
					onLongPress={e => this._createNewMarker(e)}
					ref={element => (this.mapViewRef = element)}
				>
					{this._renderMapMarker()}
				</MapView>
				{this._renderGPSButton()}
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
	}
});
