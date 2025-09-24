//demo/app/helpers/not.js
import { helper } from '@ember/component/helper';

export default helper(function not(params/*, hash*/) {
  return !params[0];
});
