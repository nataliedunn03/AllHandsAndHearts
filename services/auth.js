import {
  SF_BASE_URL as BASE_URL,
  SF_ACCESS_TOKEN as auth_token,
  FFG_AUTH_STORAGE_KEY,
  SF_AES_256_KEY
} from 'react-native-dotenv';
import { AsyncStorage } from 'react-native';
import base64 from 'base-64';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
if (!Uint8Array.prototype.map) {
  Uint8Array.prototype.map = Array.prototype.map;
}
bcrypt.setRandomFallback(len => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(isaac.random() * 256));
});
export const generateSalt = username => {
  const bytes = [];
  for (let i = 0; i < username.length; i++) {
    bytes.push(username.charCodeAt(i));
  }
  while (bytes.length < 16) {
    bytes.push(0);
  }
  const salt = base64.encode(
    String.fromCharCode.apply(String, bytes.slice(0, 16))
  );
  return `$2a$10$${salt}`;
};

export const generatePasswordHash = (username, password) => {
  return new Promise((resolve, reject) => {
    if (username && password) {
      // this is the salt we create
      //given the same pass this will always return same salt
      const usernameSalt = generateSalt(username);
      bcrypt.hash(password, usernameSalt, (err, passwordHash) => {
        if (err) resolve(new Error(err));
        resolve(passwordHash);
      });
    } else {
      reject(new Error('username & passwords are required'));
    }
  });
};
/*
export const encryptPayload = payload => {
  const ciphertext = CryptoJS.AES.encrypt(payload, SF_AES_256_KEY);
  /*console.log(
    JSON.stringify({
      key: ciphertext.key.toString(CryptoJS.enc.Base64),
      iv: ciphertext.iv.toString(CryptoJS.enc.Base64),
      ciphertext: ciphertext.ciphertext.toString(CryptoJS.enc.Base64)
    })
  );
  const c = CryptoJS.AES.decrypt(ciphertext.toString(), SF_AES_256_KEY);
  //console.log(c.toString(CryptoJS.enc.Utf8));
  //console.log(ciphertext.toString());
  return {
    iv: ciphertext.iv.toString(CryptoJS.enc.Base64),
    ciphertext: ciphertext.ciphertexttoString(CryptoJS.enc.Base64)
  };
};*/

// value is of type object, but set as string since AsyncStorage only support strings
export const setCookie = value =>
  AsyncStorage.setItem(FFG_AUTH_STORAGE_KEY, JSON.stringify(value));

export const removeCookie = () => AsyncStorage.removeItem(FFG_AUTH_STORAGE_KEY);

export const isLoggedIn = async () => {
  let loggedIn = false;
  const savedObject = await AsyncStorage.getItem(FFG_AUTH_STORAGE_KEY);
  if (savedObject) {
    const { isLoggedIn } = JSON.parse(savedObject);
    loggedIn = isLoggedIn;
  }
  return loggedIn;
};

export const getValueFromStorage = async key => {
  let value = null;
  const savedObject = await AsyncStorage.getItem(FFG_AUTH_STORAGE_KEY);
  if (savedObject) {
    const data = JSON.parse(savedObject);
    value = data[key];
  }
  return value;
};

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
