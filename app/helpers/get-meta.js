//demo/app/helpers/get-meta.js
import { helper } from '@ember/component/helper';

export default helper(function getMeta(params/*, hash*/) {
  return params[0].meta;
});
