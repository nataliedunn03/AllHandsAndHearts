import { connect } from 'react-redux';
import { getRegionData, getUserDetailData } from '../redux/actions/region';
import {
  getPinsByRegion,
  setPinByRegion,
  deletePinById,
  getPinImageById
} from '../redux/actions/pins';
import MapScreen from '../screens/MapScreen';

const mapDispatchToProps = dispatch => {
  return {
    getRegionData: () => {
      dispatch(getRegionData());
    },
    getUserDetailData: () => {
      dispatch(getUserDetailData());
    },
    getPinsByRegion: regionId => {
      dispatch(getPinsByRegion(regionId));
    },
    setPinByRegion: (regionId, pinData) => {
      dispatch(setPinByRegion(regionId, pinData));
    },
    deletePinById: pinId => {
      dispatch(deletePinById(pinId));
    },
    getPinImageById: pinId => {
      dispatch(getPinImageById(pinId));
    }
  };
};
const mapStateToProps = state => {
  const { regionData, pinData, showMarkerModal } = state.region;
  const { currentUserId } = state.auth;
  return { regionData, pinData, showMarkerModal, currentUserId };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
