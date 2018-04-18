import React from 'react';
import { ScrollView, RefreshControl, Animated, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { Notifications } from 'expo';
import Broadcasts from '../components/Home/Broadcasts';
import Activities from '../components/Home/Activities';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
  state = {
    scrollY: 0
  };
  componentWillMount() {
    this.props.getBroadcastCards();
    this.props.getActivities();
  }
  _handleRefresh = async () => {
    try {
      await this.props.getBroadcastCards();
    } catch (e) {
      console.log(e);
    }
  };

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  _registerForPushNotifications() {
    this.props.registerPushNotification();
    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    //let's do something with this data
    this.setState({
      notification
    });
    if (notification.data) {
      this.itemAction(notification.data);
    }
  };
  itemAction(item) {
    this.dropdown.alertWithType('custom', item.title, item.body);
  }
  closeAction() {
    this.dropdown.close();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: Colors.defaultColor.PAGE_BACKGROUND
          }}
          ref={ref => {
            this.homeScreenComponentRef = ref;
          }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this._handleRefresh}
            />
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
          alwaysBounceVertical
        >
          {this.props.broadcast && (
            <Broadcasts
              broadcast={this.props.broadcast}
              removeBroadcastCard={this.props.removeBroadcastCard}
            />
          )}
          {this.props.activity && <Activities activity={this.props.activity} />}
        </ScrollView>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          containerStyle={{
            backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
            minHeight: 100
          }}
          showCancel={true}
        />
      </View>
    );
  }
}
