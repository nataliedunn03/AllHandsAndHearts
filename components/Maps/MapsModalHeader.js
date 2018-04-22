import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { StyledText } from '../StyledText';
import Colors from '../../constants/Colors';
const MapsModalHeader = ({ style, title, onPressClose }) => {
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Icon
          name="minus"
          color={Colors.defaultColor.PRIMARY_COLOR}
          size={30}
          style={styles.bar}
        />
        <TouchableOpacity
          style={styles.closeButton}
          hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
          onPress={() => onPressClose()}
        >
          <Icon name="x" color="#ffffff" size={22} />
        </TouchableOpacity>
      </View>
      <StyledText style={styles.title}>{title}</StyledText>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  title: {
    backgroundColor: 'transparent',
    color: '#000000',
    top: -22,
    fontSize: 24,
    margin: 0,
    marginLeft: 16,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: -22,
    right: -165,
    height: 24,
    width: 24,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
    borderRadius: 12
  },
  bar: {
    top: -3
  }
});

export default MapsModalHeader;
