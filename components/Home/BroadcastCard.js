import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { Feather as Icon } from '@expo/vector-icons';

const RemoveComponent = ({ cardKey, onClosePress }) => (
  <View style={styles.remove}>
    <TouchableHighlight
      onPress={() => onClosePress(cardKey)}
      hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
      underlayColor="transparent"
    >
      <View style={{ flex: 1 }}>
        <Icon name="x-circle" size={22} color="#b2b2b2" />
      </View>
    </TouchableHighlight>
  </View>
);

const BroadcastCard = ({
  style,
  title,
  body,
  cardKey,
  onClosePress,
  onPress
}) => {
  return (
    <View style={[style]}>
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={onPress ? onPress : () => console.log('Card is clicked')}
      >
        <View style={styles.container}>
          {onClosePress ? (
            <RemoveComponent cardKey={cardKey} onClosePress={onClosePress} />
          ) : null}
          <View style={styles.mainBody}>
            <Text style={styles.subText}>
              {title ? title.toUpperCase() : title}
            </Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderRadius: 10,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 1, height: 1 }
  },
  mainBody: {
    flex: 1
  },
  body: {
    fontSize: 16,
    color: '#383539'
  },
  subText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  remove: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  }
});

export default BroadcastCard;
