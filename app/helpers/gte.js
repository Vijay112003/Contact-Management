//demo/app/helpers/gte.js

import { helper } from '@ember/component/helper';

export default helper(function gte(params/*, hash*/) {
  return params[0] >= params[1];
});
