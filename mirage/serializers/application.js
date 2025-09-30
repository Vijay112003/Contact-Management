// demo/mirage/serializers/application.js
import { RestSerializer } from 'miragejs';
export default class ApplicationSerializer extends RestSerializer {
  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && payload.meta) {
      this._lastMeta = payload.meta;
    }
    return super.normalizeArrayResponse(store, primaryModelClass, payload, id, requestType);
  }
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && payload.meta) {
      this._lastMeta = payload.meta;
    }
    return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
  }
}