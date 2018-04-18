import { connect } from 'react-redux';

import {
  removeBroadcastCard,
  getBroadcastCards
} from '../redux/actions/broadcast';
import { getActivities } from '../redux/actions/activity';
import { registerPushNotification } from '../redux/actions/notification';
import HomeScreen from '../screens/HomeScreen';

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
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
