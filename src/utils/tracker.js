/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function (window) {
  /* init */

  // get window props
  const { document, location, navigator, screen, JSON } = window;
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

  // init pvt data
  const pvt = {
    sts: -1, // active status
    stt: 0, // start time
    ttt: 0, // total time
    init() {
      if (this.sts === -1) {
        this.sts = 1;
        this.stt = Date.now();
        this.ttt = 0;
      }
    },
    pause() {
      if (this.sts === 1) {
        this.sts = 0;
        this.ttt += Date.now() - this.stt;
      }
    },
    start() {
      if (this.sts === 0) {
        this.sts = 1;
        this.stt = Date.now();
      }
    },
    end() {
      if (this.sts === 1) {
        this.ttt += Date.now() - this.stt; // if active, add new time
      }
      this.sts = -1;
      return this.ttt;
    },
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pvt.pause();
    } else {
      pvt.start();
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
    pvt.init();
    // send view data
    sendData('view', {
      path: formatPath(pathname),
      ref: formatRef(referrer),
      lang: navigator.language || '',
      scs: screen.width * dpr + 'x' + screen.height * dpr || '',
    });
  };

  /**
   * send leave data
   * @param {String} pathname
   */
  const gooseLeave = (pathname) => {
    sendData('leave', {
      path: formatPath(pathname),
      pvt: pvt.end() || -1,
    });
  };

  /**
   * send event data
   * @param {String} name
   * @param {Event|String} e
   */
  const gooseEvent = (name, e) => {
    sendData('event', {
      name: name || '',
      type: typeof e === 'string' ? e : e.type || '',
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
