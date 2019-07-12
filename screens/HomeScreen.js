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
    this.props.getBroadcastCards();
    this.props.getActivities();
    this.props.getPinLocationTypes();
    this.props.getVotedActivities();
  }
  _handleRefresh = async () => {
    try {
      await this.props.getBroadcastCards();
      await this.props.getActivities();
      await this.props.getPinLocationTypes();
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
    //this.props.registerPushNotification();
    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = async notification => {
    if (notification && notification.data.body) {
      this.setState({
        notification
      });
      this.props.alertWithType(
        'custom',
        notification.data.title,
        notification.data.body
      );
      //refresh alerts
      this.props.getBroadcastCards();
      //const badgeNumber = await Notifications.getBadgeNumberAsync();
      //Notifications.setBadgeNumberAsync(badgeNumber + 1);
    }
  };

  _handleVote = async (pinId, vote) => {
    this.props.setActivityVote(pinId, vote);
    //this.props.getActivities();
  };

  render() {
    //console.log(this.props);
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
          alwaysBounceVertical
        >
          {this.props.broadcast && (
            <Broadcasts
              broadcast={this.props.broadcast}
              removeBroadcastCard={this.props.removeBroadcastCard}
            />
          )}
          {this.props.activity && (
            <Activities
              activity={this.props.activity}
              voting={this._handleVote}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
