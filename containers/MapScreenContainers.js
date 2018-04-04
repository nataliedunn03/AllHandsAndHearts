import { connect } from 'react-redux';
import { getRegionData } from '../redux/actions/region';
import { getPinsByRegion } from '../redux/actions/pins';
import MapScreen from '../screens/MapScreen';

const mapDispatchToProps = dispatch => {
  return {
    getRegionData: () => {
      dispatch(getRegionData());
    },
    getPinsByRegion: regionId => {
      dispatch(getPinsByRegion(regionId));
    }
  };
};
const mapStateToProps = state => {
  const { regionData, pinData } = state.region;
  return { regionData, pinData };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
