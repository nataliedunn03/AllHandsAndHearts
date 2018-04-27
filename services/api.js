import { SalesforceApiWrapper } from '../utils/utils';
const SalesforceApi = new SalesforceApiWrapper();

export default class Api {
  getPinsListByRegion = async regionId => {
    const queryEndpoint = `/pins/${regionId}`;
    return SalesforceApi.get(queryEndpoint);
  };

  deletePinById = async pinId => {
    const queryEndPoint = `/pins/${pinId}`;
    SalesforceApi.delete(queryEndPoint);
  };
}
