import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
export default class ProfileScreen extends React.Component {
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableNativeFeedback
          onPress={() => this.props.logout()}
          style={{
            backgroundColor: '#fff',
            paddingVertical: 30,
            paddingHorizontal: 80
          }}
        >
          <Text>Log me out!</Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
}
