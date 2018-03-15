'use strict';
import React from 'react';
import {
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Platform,
	Animated,
	Button,
	TextInput,
	Easing
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { MapView, Location, Constants, Permissions } from 'expo';
import CurrentLocationButton from '../components/CurrentLocationButton';
import { View, Image, Text } from 'react-native-animatable';
import Colors from '../constants/Colors';
import Modal from 'react-native-modalbox';
import {
	alertIfLocationisDisabled,
	getUserCurrentLocation
} from '../utils/Permissions';
import Layout from '../constants/Layout';
import StyledInput from '../components/StyledInput';

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
			markersTouch: [],
			markerModalVisible: false,
			markerModalSwipedUp: false
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

	_createNewMarker(e, marker) {
		console.log(e.nativeEvent.coordinate);
		const id = randomId();
		let markers = [
			...this.state.markers,
			{
				coordinate: e.nativeEvent.coordinate,
				key: id,
				color: Colors.defaultColor.PRIMARY_COLOR,
				description: 'This is a description',
				name: marker.name
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
	onModalCloseCallback = () => {
		this.setState({
			markerModalVisible: false
		});
	};
	_renderModalContent = () => {
		return (
			<View style={styles.modalContent}>
				<Touchable
					onPress={this.onModalCloseCallback}
					style={{
						backgroundColor: '#fff',
						paddingVertical: 30
					}}
					background={Touchable.Ripple('blue')}
				>
					<View>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
						<Text> Hey Ye! use something like this</Text>
					</View>
				</Touchable>
			</View>
		);
	};
	async _onMarkerPress(e, marker) {
		/*this.setState({
			markersTouch: [
				...this.state.markersTouch,
				{
					key: randomId()
				}
			]
		});*/
		if (e != null) {
			e.persist();
			console.log(e.nativeEvent.coordinate);
			const coord = e.nativeEvent.coordinate;
			try {
				Location.setApiKey('AIzaSyChIWVSK41LTxJuDDYJECnBsAbMkzy13Fk');
				const decodedLocation = await Location.reverseGeocodeAsync(coord);
				console.log(decodedLocation);
				this._createNewMarker(e, decodedLocation[0]);
				this.props.navigation.navigate('Marker', {
					name: decodedLocation[0].name
				});
			} catch (e) {
				console.log(e);
			}
		} else {
			//this.props.navigation.navigate('Marker', { name: marker.name });
			this.setState({
				markerModalVisible: true
			});
		}
	}
	_renderMapMarker() {
		return this.state.markers.map(marker => {
			return (
				<MapView.Marker
					key={marker.key}
					coordinate={marker.coordinate}
					pinColor={marker.color}
					onPress={() => this._onMarkerPress(null, marker)}
				/>
			);
		});
	}
	//see if map is ready
	_onMapReady = () => {
		console.log('\n\n\n map is ready bitch \n\n\n');
		this.setState({ mapReady: true });
	};
	//callback on pan map
	_onRegionChange = region => {};
	//callback when user stops moving the map
	_onRegionChangeComplete = region => {
		this._updateGPSButton(region);
	};
	modalSwiped = () => {
		console.log('Modal swiped up');
		this.setState({
			markerModalSwipedUp: true
		});
	};
	_renderModal = () => {
		return (
			<Modal
				isOpen={this.state.markerModalVisible}
				onClosed={this.onModalCloseCallback}
				style={[
					styles.markerModal,
					this.state.markerModalSwipedUp ? styles.markerModalFullScreen : ''
				]}
				easing={Easing.in}
				position="bottom"
				animationDuration={200}
			>
				{this._renderModalContent()}
			</Modal>
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
					onLongPress={e => this._onMarkerPress(e, null)}
					ref={element => (this.mapViewRef = element)}
				>
					{this._renderMapMarker()}
				</MapView>
				{this._renderGPSButton()}
				{this._renderModal()}
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
		backgroundColor: 'white',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)'
	},
	markerModal: {
		justifyContent: 'flex-end',
		margin: 0,
		height: 200,
		zIndex: 10
	},
	markerModalFullScreen: {
		flex: 1,
		height: 700
	}
});
