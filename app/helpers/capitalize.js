import { helper } from '@ember/component/helper';

export default helper(function capitalize(params/*, hash*/) {
  return params[0] ? params[0].toString().toUpperCase() : '';
});
