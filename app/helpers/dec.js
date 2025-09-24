import { helper } from '@ember/component/helper';

export default helper(function dec(params/*, hash*/) {
  return params[0] - 1;
});
