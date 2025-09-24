//demo/app/helpers/gt.js
import { helper } from '@ember/component/helper';

export default helper(function gt([a, b]/*, hash*/) {
  return a > b;
});
