import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { alertIfLocationisDisabled } from '../../utils/Permissions';

export default class CurrentLocationButton extends React.Component {
  onButtonPress = () => {
    this.props.locationPermission
      ? this.props.onPress()
      : alertIfLocationisDisabled();
  };
  render() {
    return (
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
    );
  }
}

const styles = StyleSheet.create({
  currentLocationView: {
    right: 20,
    alignItems: 'flex-end'
  },
  currentLocationButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.tabIconDefault,
    borderRadius: 22,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.25,
    opacity: 1
  }
});
