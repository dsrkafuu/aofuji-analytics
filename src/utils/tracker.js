/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function (window) {
  /* init */

  // get window props
  const { document, location, navigator, screen, JSON } = window;
  const dpr = window.devicePixelRatio || 1;

  // get tracker settings
  const { GOOSE_ID, GOOSE_API } = window;
  const GOOSE_SPA = window.GOOSE_SPA || false;
  const COLLECT_API = `${GOOSE_API}${/\/$/.exec(GOOSE_API) ? '' : '/'}collect`;

  // if basic data not defined or dnt
  if (!GOOSE_API || !GOOSE_ID || navigator.doNotTrack === '1') {
    return;
  }

  /* functions */

  /**
   * send data to server
   * @param {String} type
   * @param {Object} payload
   */
  async function sendData(type, payload) {
    // data body
    const data = JSON.stringify({
      t: type,
      id: GOOSE_ID,
      d: payload,
    });
    // [DEBUG]
    console.log(JSON.parse(data));
    // send with beacon api
    return navigator.sendBeacon(
      COLLECT_API,
      new Blob([data], {
        type: 'application/json',
      })
    );
  }

  /**
   * remove trailing slash
   * @param {String} pathname original pathname
   */
  function removeTrail(pathname) {
    const exp = /^(\/.*[^/])\/?$/.exec(pathname);
    if (exp && exp[1]) {
      return exp[1];
    } else {
      return '/';
    }
  }

  // init pvt data
  const pvt = {
    sts: -1, // active status
    st: 0, // start time
    tt: 0, // total time
    init() {
      if (this.sts === -1) {
        this.sts = 1;
        this.st = Date.now();
        this.tt = 0;
      }
    },
    pause() {
      if (this.sts === 1) {
        this.sts = 0;
        this.tt += Date.now() - this.st;
      }
    },
    start() {
      if (this.sts === 0) {
        this.sts = 1;
        this.st = Date.now();
      }
    },
    end() {
      if (this.sts === 1) {
        this.tt += Date.now() - this.st; // if active, add new time
      }
      this.sts = -1;
      return this.tt;
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
      p: removeTrail(pathname),
      ref: referrer,
      lang: navigator.language,
      sc: screen.width * dpr + 'x' + screen.height * dpr,
    });
  };

  /**
   * send leave data
   * @param {String} pathname
   */
  const gooseLeave = (pathname) => {
    sendData('leave', {
      p: removeTrail(pathname),
      pvt: pvt.end(),
    });
  };

  /**
   * send event data
   * @param {String} name
   * @param {Event|String} e
   */
  const gooseEvent = (name, e) => {
    if (typeof e === 'string') {
      sendData('event', {
        name,
        type: e,
      });
    } else {
      sendData('event', {
        name,
        type: e.type || 'unknown',
      });
    }
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
