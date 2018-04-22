import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Colors from '../constants/Colors';

const { Provider, Consumer } = React.createContext({});

export const AlertConsumer = Consumer;

export class AlertProvider extends PureComponent {
  alertWithType = (...args) => {
    this.dropdown.alertWithType(...args);
  };
  cancelAlert = () => this.dropdown.close();
  render() {
    return (
      <Provider
        value={{
          alertWithType: this.alertWithType,
          cancelAlert: this.cancelAlert
        }}
      >
        {this.props.children}
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          inactiveStatusBarStyle="light-content"
          containerStyle={{
            backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
            minHeight: 100
          }}
          cancelBtnImageStyle={{
            width: 22,
            height: 22,
            alignSelf: 'center',
            margin: 10
          }}
          showCancel={true}
        />
      </Provider>
    );
  }
}
