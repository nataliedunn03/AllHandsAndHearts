import React from 'react';
import { View, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import StyledButton from '../components/StyledButton';
import { StyledButton2 } from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import { StyledText } from '../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { delayExec } from '../utils/utils';
export default class ProfileScreen extends React.PureComponent {
  state = {
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.passwordChangeStatus) {
      if (nextProps.auth.passwordChangeStatus.length > 0)
        Alert.alert(nextProps.auth.passwordChangeStatus);
    }
  }

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handlePaswordChange = async () => {
    this.styledButton2.load();
    const { newPassword, rePassword, oldPassword } = this.state;
    if (!newPassword.length > 0 || !rePassword.length > 0 || !oldPassword > 0) {
      Alert.alert('Required (*) fields cannot be blank.');
    } else if (newPassword !== rePassword) {
      Alert.alert("New password don't match.");
    } else if (oldPassword === newPassword) {
      Alert.alert('New password must be different from your current password.');
    } else {
      await this.props.changePassword({
        email: this.props.auth.user.Email__c,
        oldPassword,
        newPassword
      });
      this.setState({
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      });
    }
    delayExec(2000, this.styledButton2.reset);
  };

  render() {
    if (!this.props.auth.user) return null;
    const { Name__c, Email__c } = this.props.auth.user;
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
          {this.props.auth &&
            Name__c && (
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center'
                }}
              >
                <StyledText
                  style={{
                    color: '#5a5b59',
                    fontSize: 24,
                    marginBottom: 4
                  }}
                >{`Hi, ${Name__c}!`}</StyledText>
                <StyledText
                  style={{
                    color: '#5a5b59',
                    fontSize: 24,
                    marginBottom: 4
                  }}
                >
                  {Email__c}
                </StyledText>
              </View>
            )}
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
            placeholder="Enter current password *"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('oldPassword', value)
            }
            value={this.state.oldPassword}
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
            placeholder="Enter new password *"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('newPassword', value)
            }
            value={this.state.newPassword}
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
            placeholder="Re-enter new password *"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('rePassword', value)
            }
            value={this.state.rePassword}
          />
          <StyledButton2
            buttonRef={ref => (this.styledButton2 = ref)}
            label="Change password"
            onPress={this.handlePaswordChange}
            onSecondaryPress={() => this.styledButton2.reset()}
          />
        </View>
        <View>
          <StyledButton
            style={{
              height: 42,
              backgroundColor: Colors.defaultColor.WARNING_COLOR
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
