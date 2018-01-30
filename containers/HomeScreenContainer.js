import { connect } from 'react-redux';

import {
	removeBroadcastCard,
	getBroadcastCards
} from '../redux/actions/broadcast';
import { getActivities } from '../redux/actions/activity';
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
		}
	};
};
const mapStateToProps = state => ({
	broadcast: state.broadcast,
	activity: state.activity
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
