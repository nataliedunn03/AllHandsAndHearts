import { connect } from 'react-redux';

import { getRegionData } from '../redux/actions/region';
import MapScreen from '../screens/MapScreen';

const mapDispatchToProps = dispatch => {
  return {
    getRegionData: () => {
      dispatch(getRegionData());
    }
  };
};
const mapStateToProps = state => {
  const { regionData, regionModalVisible } = state.region;
  return { regionData, regionModalVisible };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
