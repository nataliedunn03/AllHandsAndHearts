import storage from 'redux-persist/lib/storage';
import { FFG_AUTH_STORAGE_KEY } from 'react-native-dotenv';
export default () => {
  return {
    key: FFG_AUTH_STORAGE_KEY,
    storage: storage,
    version: 0,
    whitelist: ['auth', 'broadcast', 'region']
  };
};
