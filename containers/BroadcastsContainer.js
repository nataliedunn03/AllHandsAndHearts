import { connect } from 'react-redux';

import {
	removeBroadcastCard,
	getBroadCastCards
} from '../redux/actions/broadcast';
import Broadcasts from '../components/Home/Broadcasts';

const mapDispatchToProps = dispatch => {
	return {
		removeBroadcastCard: key => {
			dispatch(removeBroadcastCard(key));
		},
		getBroadCastCards: () => {
			dispatch(getBroadCastCards());
		}
	};
};
const mapStateToProps = state => ({
	broadcast: state.broadcast
});
export default connect(mapStateToProps, mapDispatchToProps)(Broadcasts);
