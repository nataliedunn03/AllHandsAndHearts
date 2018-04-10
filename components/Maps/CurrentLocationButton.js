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
          style={styles.currentLocationButton}
          onPress={this.onButtonPress}
          underlayColor={`${Colors.defaultColor.PRIMARY_COLOR}4d`}
        >
          <MaterialIcons
            name={
              this.props.locationPermission ? 'my-location' : 'location-off'
            }
            size={21}
            color={this.props.iconColor}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  currentLocationView: {
    alignItems: 'center'
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.tabIconDefault,
    borderRadius: 24,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.25
  }
});
