/**
 * format number
 * @param {number} number
 * @param {number} decimal
 * @return {string}
 */
export function fmtNumber(number, decimal = 2) {
  if (typeof number !== 'number') {
    number = Number(number);
  }

  let sign = '';
  if (number < 0) {
    sign = '-';
  }

  number = Math.abs(number);

  switch (true) {
    case number < 1e3:
      number = number.toFixed(0);
      break;
    case number < 1e6:
      number = `${(number / 1e3).toFixed(decimal)}k`;
      break;
    case number < 1e9:
      number = `${(number / 1e6).toFixed(decimal)}m`;
      break;
    default:
      number = number.toFixed(decimal);
  }

  return `${sign}${number}`;
}

/**
 * format time
 * @param {number} time ms
 * @return {string}
 */
export function fmtTime(time) {
  if (typeof time !== 'number') {
    time = Number(time);
  }
  if (time <= 0) {
    return '0s';
  }

  // get s/m/h
  let str = '';
  time = time / 1000;
  // s
  const second = Math.round(time) % 60;
  second > 0 && (str = `${second}s`);
  // m
  const minute = Math.round(time / 60) % 60;
  minute > 0 && (str = `${minute}m${str}`);
  // h
  const hour = Math.round(time / 3600);
  hour > 0 && (str = `${hour}h${str}`);

  // add missing s/m
  if (!str.includes('s') && (str.includes('m') || str.includes('h'))) {
    str += '0s';
  }
  if (!str.includes('m') && str.includes('h')) {
    str = `${/([0-9]*)h/i.exec(str)[1]}h0m${/h([0-9]*)s/i.exec(str)[1]}s`;
  }

  return str;
}

export function fmtCode(id = '') {
  const origin = window.location.origin;
  let base = process.env.VUE_APP_BASE_URL || '/';
  if (!base.startsWith('/')) {
    base = '/' + base;
  }
  if (base.endsWith('/') && base !== '/') {
    base += '/';
  }

  return `<script
  async
  data-vaid="${id}"
  data-vaapi="${origin + base}api"
  src="https://cdn.jsdelivr.net/npm/aofuji-tracker@0.1/lib/aofuji.min.js"
></script>`;
}
