import React from 'react';
import { StyleSheet, TouchableOpacity, View, Vibration } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../../constants/Colors';
import { Feather as Icon } from '@expo/vector-icons';

export default class SwitchRegionButton extends React.Component {
  onButtonPress = () => {
    console.log('Open Region Form Modal');
  };
  render() {
    const { onClick } = this.props;
    return (
      <View style={[styles.switchRegionView, this.props.style]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.switchRegionButton}
          onPress={onClick || this.onButtonPress}
          onPressIn={() => Vibration.vibrate()}
        >
          <Animatable.View
            animation={{
              0: {
                translateY: 0.5
              },
              0.5: {
                translateY: 2
              },
              1: {
                translateY: 0.5
              }
            }}
            easing="ease-out"
            iterationCount="infinite"
          >
            <Icon name="chevrons-up" size={24} color={this.props.color} />
          </Animatable.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  switchRegionView: {
    alignItems: 'center',
    zIndex: 999999
  },
  switchRegionButton: {
    width: 44,
    height: 44,
    bottom: 30,
    backgroundColor: Colors.navHeaderBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.tabIconDefault,
    borderRadius: 22,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.25
  }
});
