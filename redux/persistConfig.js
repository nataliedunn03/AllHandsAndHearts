import storage from 'redux-persist/lib/storage';
export default () => {
  return {
    key: 'FFG_AUTH_STORAGE_KEY',
    storage: storage,
    version: 0,
    whitelist: ['auth', 'broadcast', 'region']
  };
};
