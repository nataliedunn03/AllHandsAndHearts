import { connect } from 'react-redux';
import { logout, changePassword } from '../redux/actions/auth';
import ProfileScreen from '../screens/ProfileScreen';

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logout());
    },
    changePassword: data => {
      dispatch(changePassword(data));
    }
  };
};
const mapStateToProps = state => {
  return { auth: state.auth ? state.auth : {} };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
