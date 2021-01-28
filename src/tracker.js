/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function () {
  /* init */

  const { GOOSE_ID: _ID, GOOSE_API: __API, GOOSE_SPA: _SPA } = window;
  if (!__API || !/^https?:\/\//i.exec(__API) || !_ID || navigator.doNotTrack === '1') {
    return;
  }
  const _API = `${__API}${/\/$/i.exec(__API) ? '' : '/'}collect`;
  const [LS_KEY, LS_SID, LS_CACHE] = ['goose_data', 'sid', 'cache'];
  const [PVT_INACTIVE, PVT_PAUSE, PVT_ACTIVE] = [0, -1, 1];

  /* utils */

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
      return null;
    }
  }

  /**
   * send data to api
   * @param {string} type
   * @param {string} path
   * @param {Object} payload
   */
  function sendData(type, path, payload) {
    // get session id
    let sid = getLS(LS_SID);
    // construct data
    const ec = encodeURIComponent;
    let url = `${_API}?t=${type}&id=${_ID}&d=${Date.now()}`;
    if (sid) {
      url += `&sid=${sid}`;
    }
    url += `&p=${ec(path)}`;
    for (let key in payload) {
      if (payload[key]) {
        url += `&${key}=${ec(payload[key])}`;
      }
    }
    // when not view type and `sendBeacon` available
    if (type !== 'view' && navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      // [IE11 FIX] xhr.responseType = 'json';
      xhr.onload = () => {
        // when got session from api
        if (xhr.response && xhr.status === 201) {
          try {
            const sid = JSON.parse(xhr.response).sid;
            sid && setLS(LS_SID, sid);
          } catch {
            return;
          }
        }
      };
      xhr.send();
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
      r: ref, // referrer
    };
    // those need to send first time or after 7 day
    const cacheTime = getLS(LS_CACHE) || -Infinity;
    const now = Date.now();
    if (now - cacheTime > 604800 * 1000) {
      data.lng = navigator.language || undefined; // language
      // screen size
      if (screen.width) {
        const width = Math.round(screen.width || 0);
        const height = Math.round(screen.height || 0);
        if (!Number.isNaN(width + height)) {
          data.scn = `${width}x${height}`;
        }
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
    // [safari fix]
    // safari doesn't fire the `visibilitychange` and `beforeunload`
    // when navigating away from a document
    window.addEventListener('pagehide', () => {
      gooseLeave(path);
    });
  }
})();
