import { SalesforceApiWrapper } from '../utils/utils';
import * as AuthService from './auth';
const SalesforceApi = new SalesforceApiWrapper();
export default class Api {
  /**
   * Region related Apis
   */
  getRegionList = async () => {
    return await SalesforceApi.get('/regions');
  };
  getPinsListByRegion = async regionId => {
    const queryEndpoint = `/pins/${regionId}`;
    return await SalesforceApi.get(queryEndpoint);
  };

  setPinByRegion = async (regionId, pinData) => {
    let currentUserId = await AuthService.getValueFromStorage('Id');
    const payload = {
      createdByUserId: currentUserId,
      name: pinData.name,
      sourceName: pinData.sourceName,
      linkUrl: pinData.sourceLink,
      regionId: regionId,
      address: pinData.address,
      description: pinData.description,
      latitude: pinData.latitude,
      longitude: pinData.longitude,
      pinColor: pinData.pinColor ? pinData.pinColor : '',
      pinType: pinData.pinType ? pinData.pinType.name : 'Other',
      Id: pinData.id ? pinData.id : '',
      pinImage: pinData.photos.length > 0 ? 'true' : 'false'
    };
    return await SalesforceApi.post('/pins', payload);
  };
  setPinPhotosById = async (pinId, photos) => {
    let uriParts = photos.uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    const payload = {
      parentId: pinId,
      attachmentId: '',
      fileName: `${pinId}${uriParts[0]}`,
      contentType: `image/${fileType}`,
      base64BlobValue: photos.base64
    };
    return await SalesforceApi.post('/pinImage', payload);
  };

  getPhotos = async pinId => {
    const payload = {
      pinId: pinId
    };
    const res = await SalesforceApi.put('/pinImage', payload);
    return res;
  };

  deletePinById = async pinId => {
    const queryEndPoint = `/pins/${pinId}`;
    SalesforceApi.delete(queryEndPoint);
  };

  /**
   * Alert related Apis
   */
  getBroadcastCards = async () => {
    return await SalesforceApi.get('/broadcasts');
  };

  /**
   * Auth specific Apis
   */
  login = async (email, passwordHash) => {
    //PUT is login
    const queryEndpoint = '/users';
    const payload = {
      email: email,
      password: passwordHash
    };
    return await SalesforceApi.put(queryEndpoint, payload);
  };

  register = async (email, hash, name) => {
    const queryEndpoint = '/users';
    const payload = {
      email,
      name,
      password: hash
    };
    return await SalesforceApi.post(queryEndpoint, payload);
  };

  changePassword = async (email, oldHash, newHash) => {
    const queryEndpoint = '/changePassword';
    const payload = {
      email,
      oldHash,
      newHash
    };
    return await SalesforceApi.post(queryEndpoint, payload);
  };

  /**
   * Push notification specific api
   */
  registerPushNotificationToken = async payload => {
    const queryEndpoint = '/notification';
    return await SalesforceApi.put(queryEndpoint, payload);
  };

  /**
   * Get and generate Auth token
   */
  generateAuthToken = async () => {
    return SalesforceApi.setToken();
  };

  getSFHelper = () => SalesforceApi;
}
