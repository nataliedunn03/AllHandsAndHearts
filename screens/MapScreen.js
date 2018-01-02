'use strict';
import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Platform,
	Animated
} from 'react-native';

import { MapView, Location, Constants, Permissions } from 'expo';
import CurrentLocationButton from '../components/CurrentLocationButton';
import * as Animatable from 'react-native-animatable';
import Colors from '../constants/Colors';
import {
	alertIfLocationisDisabled,
	getUserCurrentLocation
} from '../utils/Permissions';
const { width, height } = Dimensions.get('window');
export default class MapScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locationPermission: false,
			mapReady: false,
			displayGps: false
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
					longitudeDelta: 0.0922 * (width / height),
					latitudeDelta: 0.0922
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
					longitudeDelta: 0.0922 * (width / height),
					latitudeDelta: 0.0922
				};
				if (this.state.mapReady) {
					this.mapView.animateToRegion(region);
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
			if (diffLat > 0.0001 || diffLong > 0.0001) {
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
			<Animatable.View
				animation={this._getGPSButtonAnimationType()}
				useNativeDriver
			>
				<CurrentLocationButton
					style={{ top: -40 }}
					locationPermission={this.state.locationPermission}
					onPress={this._moveToUserCurrentLocation}
					iconColor={this.state.gpsButtonColor}
				/>
			</Animatable.View>
		);
	}
	//see if map is ready
	_onMapReady = () => {
		this.setState({ mapReady: true });
	};
	//callback on pan map
	_onRegionChange = region => {
		this._updateGPSButton(region);
	};
	//callback when user stops moving the map
	_onRegionChangeComplete = region => {};

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
					toolbarEnabled={true}
					zoomEnabled={true}
					rotateEnabled={true}
					showsScale={true}
					onRegionChange={this._onRegionChange}
					onRegionChangeComplete={this._onRegionChangeComplete}
					ref={element => (this.mapView = element)}
				/>
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
