// app/helpers/starts-with.js
import { helper } from '@ember/component/helper';

export default helper(function startsWith([str, search]) {
  if (typeof str !== 'string' || typeof search !== 'string') {
    return false;
  }
  return str.startsWith(search);
});
