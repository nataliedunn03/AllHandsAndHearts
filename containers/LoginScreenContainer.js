import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loginRequest, registerRequest } from '../redux/actions/auth';
import LoginScreen from '../screens/LoginScreen';

const mapDispatchToProps = dispatch => {
  return {
    login: user => {
      dispatch(loginRequest(user));
    },
    register: user => {
      dispatch(registerRequest(user));
    }
  };
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
