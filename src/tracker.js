/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function () {
  /* init */

  const { GOOSE_ID: _ID, GOOSE_API: __API, GOOSE_BASE: __BASE, GOOSE_SPA: _SPA } = window;
  if (!__API || !__API.startsWith('http') || !_ID || navigator.doNotTrack === '1') {
    return;
  }
  const _API = `${__API}${__API.endsWith('/') ? '' : '/'}collect`;
  const _BASE = __BASE && __BASE.startsWith('/') ? formatPath(__BASE) : '/';
  const [LS_KEY, LS_SID, LS_CACHE] = ['goose_data', 'sid', 'cache'];
  const [PVT_INACTIVE, PVT_PAUSE, PVT_ACTIVE] = [0, -1, 1];

  /* functions */

  /**
   * send data to api
   * @param {string} type
   * @param {string} path
   * @param {Object} payload
   */
  function sendData(type, path, payload) {
    // get session id
    let sid = getLS(LS_SID);
    if (!sid || sid.length !== 24) {
      sid = undefined;
      // if sid not exist and not sending `view` data
      if (type !== 'view') {
        return;
      }
    }
    // construct data
    const blob = new Blob(
      [
        JSON.stringify({
          t: type, // type
          id: _ID, // id
          sid, // session id
          d: Date.now(), // date
          p: removeBase(path), // pathname
          ...payload,
        }),
      ],
      { type: 'application/json' }
    );
    // when sid exist and `sendBeacon` available
    if (sid && navigator.sendBeacon) {
      const res = navigator.sendBeacon(_API, blob);
      if (!res) {
        logError('beacon request failed');
      }
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', _API);
      xhr.responseType = 'json';
      xhr.onload = () => {
        // when got session from api
        if (xhr.response.sid && xhr.status === 201) {
          setLS(LS_SID, xhr.response.sid);
        }
      };
      xhr.onerror = () => logError('xhr request failed');
      xhr.send(blob);
    }
  }

  /**
   * format pathname
   * @param {string} path
   * @return {string}
   */
  function formatPath(path) {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    // remove search params
    let exp = path.split('?');
    if (exp.length >= 2) {
      path = exp[0];
    }
    // remove trailing slash
    exp = /^(\/.*[^/])\/?$/.exec(path);
    if (exp && exp[1]) {
      path = exp[1];
    } else {
      path = '/';
    }
    return path;
  }
  /**
   * format referrer
   * @param {string} ref
   * @return {string}
   */
  function formatRef(ref) {
    // if passing pathname
    if (ref.startsWith('/')) {
      // [OLD] return removeBase(ref);
      return '';
    }
    // if passing full url
    else if (/:\/\//i.exec(ref)) {
      const url = new URL(ref);
      // samesite
      if (url.hostname === location.hostname) {
        // [OLD] return removeBase(ref);
        return '';
      }
      // other site
      return url.hostname;
    }
    return '';
  }
  /**
   * remove base url, include `formatPath`
   * @param {string} path
   */
  function removeBase(path) {
    path = formatPath(path);
    if (_BASE !== '/') {
      path = path.split(_BASE)[1] || '/';
    }
    return path;
  }

  /**
   * log an error
   * @param {...any} args
   */
  function logError(...args) {
    console.error('[goose analytics]', ...args);
  }
  /**
   * set local storage
   * @param {string} key
   */
  function setLS(key, value) {
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY)) || {};
      data[key] = value;
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      logError('failed to set local stoarge');
      return;
    }
  }
  /**
   * get local storage
   * @param {string} key
   * @return {any}
   */
  function getLS(key) {
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY)) || {};
      return data[key];
    } catch {
      logError('failed to get local stoarge');
      return null;
    }
  }

  /* tracker */

  // init pvt data

  const pvtCtrl = {
    stat: PVT_INACTIVE, // active status
    strt: 0, // start time
    tott: 0, // total time
    init() {
      if (this.stat === PVT_INACTIVE) {
        this.stat = PVT_ACTIVE;
        this.strt = Date.now();
        this.tott = 0;
      }
    },
    pause() {
      if (this.stat === PVT_ACTIVE) {
        this.stat = PVT_PAUSE;
        this.tott += Date.now() - this.strt;
      }
    },
    start() {
      if (this.stat === PVT_PAUSE) {
        this.stat = PVT_ACTIVE;
        this.strt = Date.now();
      }
    },
    end() {
      if (this.stat === PVT_ACTIVE) {
        this.tott += Date.now() - this.strt; // if active, add new time
      }
      this.stat = PVT_INACTIVE;
      return this.tott > 0 ? this.tott : undefined;
    },
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pvtCtrl.pause();
    } else {
      pvtCtrl.start();
    }
  });

  /**
   * send view data
   * @param {string} path
   * @param {string} ref
   */
  const gooseView = (path, ref) => {
    // start pvt
    pvtCtrl.init();
    // those need to send every time
    const data = {
      r: formatRef(ref) || undefined, // referrer
    };
    // those need to send first time or after 1 day
    const cacheTime = getLS(LS_CACHE) || -Infinity;
    const now = Date.now();
    if (now - cacheTime > 86400 * 1000) {
      data.lng = navigator.language || undefined; // language
      // screen size
      const dpr = devicePixelRatio || 1;
      if (screen.width) {
        data.scn = screen.width * dpr + 'x' + screen.height * dpr || undefined;
      }
      setLS(LS_CACHE, now);
    }
    // send view data
    sendData('view', path, data);
  };

  /**
   * send leave data
   * @param {string} path
   */
  const gooseLeave = (path) => {
    const data = {};
    const pvt = pvtCtrl.end();
    data.pvt = pvt || undefined;
    sendData('leave', path, data);
  };

  /**
   * send event data
   * @param {string} name
   * @param {Event|string} e
   */
  const gooseEvent = (path, name, e) => {
    if (name) {
      sendData('event', path, {
        en: name, // event name
        et: (typeof e === 'string' ? e : e.type) || undefined, // event type
      });
    }
  };

  /* expose tracker */

  window.gooseView = gooseView;
  window.gooseLeave = gooseLeave;
  window.gooseEvent = gooseEvent;

  if (!_SPA) {
    // legacy mode
    const path = location.pathname;
    // start view
    gooseView(path, document.referrer);
    window.addEventListener('beforeunload', () => {
      gooseLeave(path);
    });
  }
})();
