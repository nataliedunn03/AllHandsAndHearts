import { connect } from 'react-redux';
import { logout } from '../redux/actions/auth';
import ProfileScreen from '../screens/ProfileScreen';

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logout());
    }
  };
};
const mapStateToProps = state => ({
  profile: ''
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
