//demo/app/helpers/add.js
import { helper } from '@ember/component/helper';

export default helper(function add([a, b]/*, hash*/) {
  return a + b;
});
