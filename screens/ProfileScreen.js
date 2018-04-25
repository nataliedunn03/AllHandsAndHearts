import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { Feather as Icon } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import { StyledText } from '../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class ProfileScreen extends React.PureComponent {
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <KeyboardAwareScrollView
        style={{
          backgroundColor: Colors.defaultColor.PAGE_BACKGROUND,
          flex: 1
        }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'space-around'
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            backgroundColor: Colors.defaultColor.PAPER_COLOR,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon
            name="user"
            size={60}
            color={Colors.defaultColor.PRIMARY_COLOR}
          />
        </View>
        <View>
          <StyledText
            style={{
              color: '#5a5b59',
              margin: 20,
              marginTop: 10,
              marginBottom: 0
            }}
          >
            CHANGE PASSWORD
          </StyledText>
          <StyledInput
            secureTextEntry
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Enter current password"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value => this._handleOnChangeText('password', value)}
            onSubmitEditing={this.handleLogin}
          />
          <StyledInput
            secureTextEntry
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Enter new password"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value => this._handleOnChangeText('password', value)}
            onSubmitEditing={this.handleLogin}
          />
          <StyledInput
            secureTextEntry
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Re-enter new password"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value => this._handleOnChangeText('password', value)}
            onSubmitEditing={this.handleLogin}
          />
        </View>
        <View>
          <StyledButton
            style={{
              height: 42,
              backgroundColor: Colors.defaultColor.PRIMARY_COLOR
            }}
            textStyle={{ color: Colors.defaultColor.PAPER_COLOR }}
            text="Log out"
            onPress={() => this.props.logout()}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
