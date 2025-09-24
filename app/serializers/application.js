// demo/app/serializers/application.js
import RestSerializer from '@ember-data/serializer/rest';
export default class ApplicationSerializer extends RestSerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && payload.meta) {
      this._lastMeta = payload.meta;
    }
    return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
  }
  getMeta() {
    return this._lastMeta;
  }
}
