import { helper } from '@ember/component/helper';

export default helper(function inc(params/*, hash*/) {
  return params[0] + 1;
});
