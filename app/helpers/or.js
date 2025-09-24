import { helper } from '@ember/component/helper';

export default helper(function or(params/*, hash*/) {
  return params.some(param => !!param);
});
