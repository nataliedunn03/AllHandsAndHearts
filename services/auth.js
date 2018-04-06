import {
  SF_BASE_URL as BASE_URL,
  SF_ACCESS_TOKEN as auth_token,
  FFG_AUTH_STORAGE_KEY
} from 'react-native-dotenv';
import { AsyncStorage } from 'react-native';

export const setCookie = () =>
  AsyncStorage.setItem(FFG_AUTH_STORAGE_KEY, 'true');

export const removeCookie = () => AsyncStorage.removeItem(FFG_AUTH_STORAGE_KEY);

export const isLoggedIn = async () =>
  await AsyncStorage.getItem(FFG_AUTH_STORAGE_KEY);

export const register = async (email, passwordHash, name) => {
  const queryEndpoint = `${BASE_URL}/users`;
  try {
    //post is register
    const response = await fetch(queryEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: passwordHash,
        name: name
      })
    });
    const data = await response.json();
    if (data) {
      console.log('-User LOGIN DATA Response-\n');
      console.log(data);
      return data;
    } else {
      console.log('-User LOGIN NO DATA Response-\n');
      console.log('Check auth_token and API call.-\n');
      return undefined;
    }
  } catch (e) {
    console.log(e);
  }
};

export const login = async (email, passwordHash) => {
  //PUT is login
  const queryEndpoint = `${BASE_URL}/users`;
  console.log(email);
  const queryJsonString = JSON.stringify({
    email: email,
    password: passwordHash
  });
  console.log(queryJsonString);
  try {
    const response = await fetch(queryEndpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'Content-Type': 'application/json'
      },
      body: queryJsonString
    });
    const data = await response.json();
    console.log(data);
    if (data) {
      console.log('-User LOGIN DATA Response-\n');
      console.log(data);
      return data;
    } else {
      console.log('-User LOGIN NO DATA Response-\n');
      console.log('Check auth_token and API call.-\n');
      return undefined;
    }
  } catch (e) {
    console.log(e);
  }
};

export const logout = () => removeCookie();

export const loggedIn = () => false;
