//demo/app/helpers/range.js
import { helper } from '@ember/component/helper';

export default helper(function range([start, end]) {
  start = Number(start) || 1;
  end = Number(end) || 1;
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
