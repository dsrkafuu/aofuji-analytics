/*! vector-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function () {
  /* init */

  const { VEC_ID: _ID, VEC_API: __API, VEC_SPA: _SPA } = window;
  if (!__API || !/^https?:\/\//i.exec(__API) || !_ID || navigator.doNotTrack === '1') {
    return;
  }
  const _API = `${__API}${/\/$/i.exec(__API) ? '' : '/'}collect`;
  const [LS_KEY, LS_SID, LS_CACHE] = ['vector_data', 'sid', 'cache'];
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
    const encode = encodeURIComponent;
    let url = `${_API}?t=${type}&id=${_ID}&d=${Date.now()}`;
    if (sid) {
      url += `&sid=${sid}`;
    }
    url += `&p=${encode(path)}`;
    for (let key in payload) {
      if (payload[key]) {
        url += `&${key}=${encode(payload[key])}`;
      }
    }
    // whether need to care response or wait
    const needResponse = type === 'view';
    const needWait = type === 'leave';
    // when not view type and `sendBeacon` available
    if (!needResponse && navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else if (window.fetch) {
      const req = fetch(url, { method: 'GET', keepalive: needWait });
      if (needResponse) {
        req.then((res) => {
          if (res.status === 201) {
            res.json().then((data) => {
              const { sid } = data;
              sid && setLS(LS_SID, sid);
            });
          }
        });
      }
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, !needWait);
      // [ie fix] xhr.responseType = 'json';
      if (needResponse) {
        xhr.onload = () => {
          if (xhr.status === 201) {
            const { sid } = JSON.parse(xhr.response);
            sid && setLS(LS_SID, sid);
          }
        };
      }
      xhr.send(null);
    }
  }

  /* tracker */

  // init pvt data

  const pvtCtrl = {
    t: PVT_INACTIVE, // active status
    s: 0, // start time
    a: 0, // total time
    // init
    it() {
      if (this.t === PVT_INACTIVE) {
        this.t = PVT_ACTIVE;
        this.s = Date.now();
        this.a = 0;
      }
    },
    // pause
    ps() {
      if (this.t === PVT_ACTIVE) {
        this.t = PVT_PAUSE;
        this.a += Date.now() - this.s;
      }
    },
    // start
    st() {
      if (this.t === PVT_PAUSE) {
        this.t = PVT_ACTIVE;
        this.s = Date.now();
      }
    },
    //end
    ed() {
      if (this.t === PVT_ACTIVE) {
        this.a += Date.now() - this.s; // if active, add new time
      }
      this.t = PVT_INACTIVE;
      return this.a > 0 ? this.a : undefined;
    },
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pvtCtrl.ps();
    } else {
      pvtCtrl.st();
    }
  });

  /**
   * send view data
   * @param {string} path
   * @param {string} ref
   */
  const vecView = (path, ref) => {
    // start pvt
    pvtCtrl.it();
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
        // [ie fix] Number.isNaN()
        data.scn = `${width}x${height}`;
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
  const vecLeave = (path) => {
    const data = {};
    const pvt = pvtCtrl.ed();
    data.pvt = pvt || undefined;
    sendData('leave', path, data);
  };

  /**
   * send event data
   * @param {string} name
   * @param {Event|string} e
   */
  const vecEvent = (path, name, e) => {
    if (name) {
      sendData('event', path, {
        en: name, // event name
        et: (typeof e === 'string' ? e : e.type) || undefined, // event type
      });
    }
  };

  /* expose tracker */

  window.vecView = vecView;
  window.vecLeave = vecLeave;
  window.vecEvent = vecEvent;

  if (!_SPA) {
    // legacy mode
    const path = location.pathname;
    // start view
    vecView(path, document.referrer);
    // [safari fix]
    // safari doesn't fire the `visibilitychange` and `beforeunload`
    // when navigating away from a document
    window.addEventListener('pagehide', () => {
      vecLeave(path);
    });
  }
})();
