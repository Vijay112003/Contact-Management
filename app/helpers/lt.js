//demo/app/helpers/lt.js
import { helper } from '@ember/component/helper';

export default helper(function lt(params/*, hash*/) {
  return params[0] < params[1];
});
