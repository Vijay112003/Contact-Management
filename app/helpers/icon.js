//demo/app/helpers/icon.js
import { helper } from '@ember/component/helper';

export default helper(function icon([name]/*, hash*/) {
  if (!name) return '';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('')
    .slice(0, 2);
  return initials;
});
