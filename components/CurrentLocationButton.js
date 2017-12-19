'use strict';

import React from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Easing
} from 'react-native';
import Colors from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { alertIfLocationisDisabled } from '../utils/Permissions';

export default class CurrentLocationButton extends React.Component {
	constructor(props) {
		super(props);
	}
	onButtonPress = () => {
		this.props.locationPermission
			? this.props.onPress()
			: alertIfLocationisDisabled();
	};
	render() {
		return (
			<View>
				<View style={[styles.currentLocationView, this.props.style]}>
					<TouchableOpacity
						activeOpacity={0.9}
						style={styles.currentLocationButton}
						onPress={this.onButtonPress}
					>
						<MaterialIcons
							name={
								this.props.locationPermission ? 'my-location' : 'location-off'
							}
							size={20}
							color={this.props.iconColor}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	currentLocationView: {
		position: 'absolute',
		left: 0,
		right: 20,
		alignItems: 'flex-end'
	},
	currentLocationButton: {
		width: 40,
		height: 40,
		bottom: 30,
		backgroundColor: Colors.navHeaderBackground,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: Colors.tabIconDefault,
		borderRadius: 10,
		shadowOffset: { width: 1, height: 2 },
		shadowRadius: 2,
		shadowOpacity: 0.25,
		opacity: 1,
		zIndex: 10
	}
});
