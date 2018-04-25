import { connect } from 'react-redux';
import React from 'react';
import {
  removeBroadcastCard,
  getBroadcastCards
} from '../redux/actions/broadcast';
import { getActivities } from '../redux/actions/activity';
import { registerPushNotification } from '../redux/actions/notification';
import HomeScreen from '../screens/HomeScreen';
import { AlertConsumer } from '../containers/AlertContainer';
const mapDispatchToProps = dispatch => {
  return {
    removeBroadcastCard: key => {
      dispatch(removeBroadcastCard(key));
    },
    getBroadcastCards: () => {
      dispatch(getBroadcastCards());
    },
    getActivities: () => {
      dispatch(getActivities());
    },
    registerPushNotification: () => {
      dispatch(registerPushNotification());
    }
  };
};
const mapStateToProps = state => ({
  auth: state.auth,
  broadcast: state.broadcast,
  activity: state.activity
});
const Home = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
export default props => {
  return (
    <AlertConsumer>{value => <Home {...value} {...props} />}</AlertConsumer>
  );
};
