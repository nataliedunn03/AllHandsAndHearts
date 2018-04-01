import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
export default class ProfileScreen extends React.Component {
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight
          onPress={() => console.log('hello!')}
          style={{
            backgroundColor: '#fff',
            paddingVertical: 30,
            paddingHorizontal: 80
          }}
        >
          <Text>Let's come back to this!</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
