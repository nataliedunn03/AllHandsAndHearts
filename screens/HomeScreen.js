import React from 'react';
import { ScrollView, RefreshControl, Animated, View } from 'react-native';
import { Notifications } from 'expo';
import Broadcasts from '../components/Home/Broadcasts';
import Activities from '../components/Home/Activities';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.PureComponent {
  state = {
    scrollY: 0
  };
  componentWillMount() {
    console.log(this.props);
    this.props.getBroadcastCards();
    this.props.getActivities();
  }
  _handleRefresh = async () => {
    try {
      this.props.alertWithType('custom', 'title', 'body');
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
      this.props.alertWithType(
        'custom',
        notification.data.title,
        notification.data.body
      );
      Notifications.setBadgeNumberAsync(1);
    }
  };

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
      </View>
    );
  }
}
