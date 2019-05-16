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
  getRegionById = async regionId => {
    const queryEndPoint = `/getRegion/${regionId}`;
    return await SalesforceApi.get(queryEndPoint);
  };

  setPinByRegion = async (regionId, pinData, currentUserId) => {
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
   * Activity related Apis
   */
  getActivities = async () => {
    return await SalesforceApi.get('/activities');
  };

  /**
   * Pin related Apis
   */
  getPinsList = async () => {
    return await SalesforceApi.get('/getPins');
  };

  /**
   * User related Apis
   */
  getUserName = async userId => {
    const queryEndPoint = `/getUserName/${userId}`;
    return await SalesforceApi.get(queryEndPoint);
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
  login = async (email, passwordHash, securityQuestion) => {
    //PUT is login
    const queryEndpoint = '/users';
    const payload = {
      email: email,
      password: passwordHash,
      securityQuestion: securityQuestion
    };
    return await SalesforceApi.put(queryEndpoint, payload);
  };

  register = async (email, hash, name, securityQuestion) => {
    const queryEndpoint = '/users';
    const payload = {
      email,
      name,
      password: hash,
      securityQuestion
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
