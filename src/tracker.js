/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function (window) {
  /* init */

  // get window props
  const dpr = window.devicePixelRatio || 1;

  // get tracker settings
  const { GOOSE_ID, GOOSE_API: _API, GOOSE_BASE: _BASE, GOOSE_SPA: _SPA } = window;
  if (!_API || !GOOSE_ID || navigator.doNotTrack === '1') {
    return;
  }
  const GOOSE_API = `${_API}${/\/$/.exec(_API) ? '' : '/'}collect`;
  const GOOSE_BASE = (() => {
    if (typeof _BASE !== 'string') {
      return '/';
    }
    const url = new URL(_BASE);
    return removeTrail(url.pathname);
  })();
  const GOOSE_SPA = _SPA || false;

  /* functions */

  /**
   * send data to server
   * @param {String} type data type
   * @param {Object} payload data object
   */
  async function sendData(type, payload) {
    // data body
    const data = JSON.stringify({
      type,
      id: GOOSE_ID,
      date: Date.now(),
      data: payload,
    });
    // send with beacon api
    return navigator.sendBeacon(
      GOOSE_API,
      new Blob([data], {
        type: 'application/json',
      })
    );
  }

  /**
   * remove trailing slash
   * @param {String} pathname
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
   * @param {String} pathname
   */
  function formatPath(pathname) {
    pathname = removeTrail(pathname);
    // only remote trail if spa
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
   * @param {String} referrer
   */
  function formatRef(referrer) {
    // if samesite
    if (referrer.includes(location.host)) {
      const url = new URL(referrer);
      return formatPath(url.pathname);
    }
    // if other site
    if (referrer.startsWith('http')) {
      return referrer;
    }
    // if spa same site
    if (referrer.startsWith('/')) {
      return removeTrail(referrer);
    }
    return '';
  }

  /**
   * set local storage
   * @param {String} key
   * @param {any} value
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
   * @param {String} key
   */
  function getLS(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

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

  /* tracker */

  /**
   * send view data
   * @param {String} pathname
   * @param {String} referrer
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
    const cache = getLS('goose_cache');
    const now = Date.now();
    if (Math.abs(now - cache) > 3600000 * 12) {
      data.lang = navigator.language || undefined;
      data.scrn = screen.width * dpr + 'x' + screen.height * dpr || undefined;
      setLS('goose_cache', now);
    }
    // send view data
    sendData('view', data);
  };

  /**
   * send leave data
   * @param {String} pathname
   */
  const gooseLeave = (pathname) => {
    const data = {
      path: formatPath(pathname),
    };
    const pvt = pvtCtrl.end();
    if (pvt) {
      data.pvt = pvt;
    }
    sendData('leave', data);
  };

  /**
   * send event data
   * @param {String} name
   * @param {Event|String} e
   */
  const gooseEvent = (name, e) => {
    name &&
      sendData('event', {
        name: name,
        type: (typeof e === 'string' ? e : e.type) || undefined,
      });
  };

  /* expose tracker */

  window.gooseView = gooseView;
  window.gooseLeave = gooseLeave;
  window.gooseEvent = gooseEvent;

  /* tracker */

  if (!GOOSE_SPA) {
    // legacy mode
    const pathname = location.pathname;
    // start view
    gooseView(pathname, document.referrer);
    window.addEventListener('beforeunload', () => {
      gooseLeave(pathname);
    });
  }
})(window);
