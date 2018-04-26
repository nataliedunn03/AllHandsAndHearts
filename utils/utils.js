import { InteractionManager } from 'react-native';
import {
  SF_BASE_URL,
  SF_ACCESS_TOKEN,
  FFG_AUTH_STORAGE_KEY
} from 'react-native-dotenv';
/**
 * Returns children from either a function or children
 * @param {React.children} children
 * @param {React.Props} props
 */
export const synthesizeChildren = (children, props) => {
  return typeof children === 'function'
    ? children(props)
    : children && children;
};

export const runAfterInteractions = () =>
  new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      resolve();
    });
  });

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const delayExec = (ms, func) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(func());
    }, ms);
  });
export class SalesforceApiWrapper {
  HEADERS = {
    Authorization: `Bearer ${SF_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  fetchWrapper = async (requestUrl, options) => {
    return fetch(requestUrl, options)
      .then(res => res.json())
      .catch(error => error);
  };

  payloadHelper = (type, payload) => {
    const options = {
      method: type,
      headers: this.HEADERS,
      body: JSON.stringify(payload)
    };
    return options;
  };

  get = async url => {
    const requestUrl = `${SF_BASE_URL}${url}`;
    const init = {
      method: 'GET',
      headers: this.HEADERS
    };
    return await this.fetchWrapper(requestUrl, init);
  };

  post = async (url, payload) => {
    const requestUrl = `${SF_BASE_URL}${url}`;
    return await this.fetchWrapper(
      requestUrl,
      this.payloadHelper('POST', payload)
    );
  };

  put = async (url, payload) => {
    const requestUrl = `${SF_BASE_URL}${url}`;
    return await this.fetchWrapper(
      requestUrl,
      this.payloadHelper('PUT', payload)
    );
  };

  doDelete = async url => {
    const requestUrl = `${SF_BASE_URL}${url}`;
    const init = {
      method: 'DELETE',
      headers: this.HEADERS
    };
    console.log('Deleting Pin: ', requestUrl);
    this.fetchWrapper(requestUrl, init);
  };
}

export default { synthesizeChildren };
