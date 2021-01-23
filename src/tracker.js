/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

((window, navigator, location, document) => {
  /* init */

  // get window props
  const dpr = window.devicePixelRatio || 1;

  // get tracker settings
  const { GOOSE_ID, GOOSE_API: _API, GOOSE_BASE: _BASE, GOOSE_SPA: _SPA } = window;
  if (!_API || !GOOSE_ID || navigator.doNotTrack === '1') {
    return;
  }
  const GOOSE_API = `${_API}${_API.endsWith('/') ? '' : '/'}collect`;
  const GOOSE_BASE = (() => {
    if (_BASE && _BASE.startsWith('/')) {
      return removeTrail(_BASE);
    }
    return '/';
  })();
  const GOOSE_SPA = _SPA || false;

  /* functions */

  /**
   * send data to api
   * @param {string} type
   * @param {Object} payload
   * @return {Promise}
   */
  async function sendData(type, payload) {
    const blob = new Blob(
      [
        JSON.stringify({
          type,
          id: GOOSE_ID,
          date: Date.now(),
          data: payload,
        }),
      ],
      { type: 'application/json' }
    );
    return new Promise((reslove, reject) => {
      if (navigator.sendBeacon) {
        const res = navigator.sendBeacon(GOOSE_API, blob);
        !res && reject();
        reslove();
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', GOOSE_API, true);
        xhr.onload = () => reslove(xhr);
        xhr.onerror = () => reject();
        xhr.send(blob);
      }
    });
  }

  /**
   * remove trailing slash
   * @param {string} pathname
   * @return {string}
   */
  function removeTrail(pathname) {
    const exp = /^(\/.*[^/])\/?$/.exec(pathname);
    if (exp && exp[1]) {
      return exp[1];
    } else {
      return '/';
    }
  }

  /**
   * format pathname
   * @param {string} pathname
   * @return {string}
   */
  function formatPath(pathname) {
    pathname = removeTrail(pathname);
    // only remove trail if spa
    if (GOOSE_SPA) {
      return pathname;
    }
    // remove base url if not spa
    if (GOOSE_BASE === '/') {
      return pathname;
    }
    return pathname.split(GOOSE_BASE)[1] || '/';
  }

  /**
   * format referrer
   * @param {string} referrer
   * @return {string}
   */
  function formatRef(referrer) {
    // if spa same site
    if (GOOSE_SPA && referrer.startsWith('/')) {
      return removeTrail(referrer);
    }
    if (referrer.startsWith('http')) {
      // samesite
      if (referrer.includes(location.host)) {
        const url = new URL(referrer);
        return formatPath(url.pathname);
      }
      // other site
      return referrer;
    }
    return '';
  }

  /**
   * set local storage
   * @param {string} key
   */
  function setLS(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
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
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }

  /* tracker */

  // init pvt data
  const [PVT_INACTIVE, PVT_PAUSE, PVT_ACTIVE] = [0, -1, 1];
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
   * @param {string} pathname
   * @param {string} referrer
   */
  const gooseView = (pathname, referrer) => {
    // start pvt
    pvtCtrl.init();
    // those need to send every time
    const data = {
      path: formatPath(pathname),
      ref: formatRef(referrer) || undefined,
    };
    // those do not need to send every time
    let cache = Number(getLS('goose_cache'));
    if (Number.isNaN(cache)) {
      cache = -Infinity;
    }
    const now = Date.now();
    if (Math.abs(now - cache) > 3600000 * 12) {
      data.lang = navigator.language || undefined;
      if (screen.width) {
        data.scrn = screen.width * dpr + 'x' + screen.height * dpr || undefined;
      }
      setLS('goose_cache', now);
    }
    // send view data
    sendData('view', data);
  };

  /**
   * send leave data
   * @param {string} pathname
   */
  const gooseLeave = (pathname) => {
    const data = {
      path: formatPath(pathname),
    };
    const pvt = pvtCtrl.end();
    data.pvt = pvt || undefined;
    sendData('leave', data);
  };

  /**
   * send event data
   * @param {string} name
   * @param {Event|string} e
   */
  const gooseEvent = (name, e) => {
    if (name) {
      sendData('event', {
        name: name,
        type: (typeof e === 'string' ? e : e.type) || undefined,
      });
    }
  };

  /* expose tracker */

  window.gooseView = gooseView;
  window.gooseLeave = gooseLeave;
  window.gooseEvent = gooseEvent;

  if (!GOOSE_SPA) {
    // legacy mode
    const pathname = location.pathname;
    // start view
    gooseView(pathname, document.referrer);
    window.addEventListener('beforeunload', () => {
      gooseLeave(pathname);
    });
  }
})(window, window.navigator, window.location, window.document);
