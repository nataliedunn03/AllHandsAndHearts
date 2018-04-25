import React, { PureComponent } from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import { Constants } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';
import Colors from '../constants/Colors';
const { Provider, Consumer } = React.createContext({});
export const AlertConsumer = Consumer;

export class AlertProvider extends PureComponent {
  alertWithType = (...args) => {
    this.dropdown.alertWithType(...args);
  };
  cancelAlert = () => this.dropdown.close();
  renderIcon = props =>
    props.type === 'custom' && (
      <Icon
        style={props.imageStyle}
        color={Colors.defaultColor.PAPER_COLOR}
        size={22}
        name="bell"
      />
    );
  render() {
    return (
      <Provider
        value={{
          alertWithType: this.alertWithType,
          cancelAlert: this.cancelAlert,
          renderIcon: this.renderIcon
        }}
      >
        {this.props.children}
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          inactiveStatusBarStyle="light-content"
          defaultContainer={{
            flexDirection: 'row',
            margin: Constants.statusBarHeight,
            marginLeft: 10,
            marginRight: 10,
            overflow: 'hidden',
            padding: 20,
            borderColor: '#8E8E93',
            borderRadius: 10,
            shadowOpacity: 1,
            shadowRadius: 20,
            shadowColor: 'hsla(0, 0%, 0%, 0.5)',
            shadowOffset: { width: 10, height: 2 },
            minHeight: 100
          }}
          imageSrc={require('../assets/images/bell.png')}
          containerStyle={{
            backgroundColor: '#8322c2'
          }}
          imageStyle={{
            padding: 8,
            width: 24,
            height: 24,
            alignSelf: 'center'
          }}
          cancelBtnImageStyle={{
            width: 22,
            height: 22,
            alignSelf: 'center',
            marginRight: 5
          }}
          showCancel={true}
        />
      </Provider>
    );
  }
}
