import { connect } from 'react-redux';

import {
	removeBroadcastCard,
	getBroadcastCards
} from '../redux/actions/broadcast';
import HomeScreen from '../screens/HomeScreen';

const mapDispatchToProps = dispatch => {
	return {
		removeBroadcastCard: key => {
			dispatch(removeBroadcastCard(key));
		},
		getBroadcastCards: () => {
			dispatch(getBroadcastCards());
		}
	};
};
const mapStateToProps = state => ({
	ui: state.ui,
	broadcast: state.broadcast
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
