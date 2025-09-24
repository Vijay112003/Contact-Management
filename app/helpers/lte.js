//demo/app/helpers/lte.js
import { helper } from '@ember/component/helper';

export default helper(function lte(params/*, hash*/) {
  return params[0] <= params[1];
});
