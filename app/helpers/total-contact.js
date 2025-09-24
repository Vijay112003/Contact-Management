import { helper } from '@ember/component/helper';

export default helper(function totalContact(params/*params, hash*/) {
  const count=params[0];
  return count.total;
});