import { connect } from 'react-redux';
import { getRegionData } from '../redux/actions/region';
import { getPinsByRegion, setPinByRegion } from '../redux/actions/pins';
import MapScreen from '../screens/MapScreen';

const mapDispatchToProps = dispatch => {
  return {
    getRegionData: () => {
      dispatch(getRegionData());
    },
    getPinsByRegion: regionId => {
      dispatch(getPinsByRegion(regionId));
    },
    setPinByRegion: (regionId, pinData) => {
      dispatch(setPinByRegion(regionId, pinData));
    }
  };
};
const mapStateToProps = state => {
  const { regionData, pinData, showMarkerModal } = state.region;
  return { regionData, pinData, showMarkerModal };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
