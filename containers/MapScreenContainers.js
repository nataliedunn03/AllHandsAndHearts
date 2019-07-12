import { connect } from 'react-redux';
import { getRegionData } from '../redux/actions/region';
import {
  getPinsByRegion,
  setPinByRegion,
  deletePinById,
  getPinImageById
} from '../redux/actions/pins';
import { getPinLocationTypes } from '../redux/actions/pins';
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
    },
    getPinLocationTypes: () => {
      dispatch(getPinLocationTypes());
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);
