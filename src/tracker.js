/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

(function (window) {
  /* init */

  // get window props
  const { document, location, navigator, screen, JSON, performance } = window;
  const dpr = window.devicePixelRatio || 1;

  // get tracker settings
  const { GOOSE_ID, GOOSE_API } = window;

  /* functions */

  /**
   * send data to server
   * @param {String} type
   * @param {Object} payload
   */
  function sendData(type, payload) {
    // if basic data not defined
    if (!GOOSE_API || !GOOSE_ID) {
      return;
    }
    // if dnt
    if (navigator.doNotTrack === '1') {
      return;
    }
    // collect api url
    const collect = `${GOOSE_API}${/\/$/.exec(GOOSE_API) ? '' : '/'}collect`;
    // data body
    const data = JSON.stringify({
      t: type,
      id: GOOSE_ID,
      p: location.pathname,
      d: payload,
    });
    // [DEBUG]
    console.log(JSON.parse(data));
    // send with beacon api
    return navigator.sendBeacon(
      collect,
      new Blob([data], {
        type: 'application/json',
      })
    );
  }

  /* tracker */

  /**
   * send view data
   */
  const gooseView = () => {
    sendData('view', {
      ref: document.referrer,
      lang: navigator.language,
      sc: screen.width * dpr + 'x' + screen.height * dpr,
    });
  };
  /**
   * send leave data
   * @param {Number} pvt page view time
   */
  const gooseLeave = (pvt) => {
    sendData('leave', {
      pvt,
    });
  };
  /**
   * send performance data
   */
  const goosePerf = () => {
    let perf = performance.getEntriesByType('navigation');
    if (perf && perf[0]) {
      perf = perf[0];
    }
    if (perf) {
      // prevent load event time not calculated
      setTimeout(() => {
        const res = perf.responseStart - perf.startTime;
        const dcl = perf.domContentLoadedEventStart - perf.startTime;
        const load = perf.loadEventStart - perf.startTime;
        sendData('perf', {
          res,
          dcl,
          load,
        });
      }, 0);
    }
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

  /* start tracking */
  // start view
  gooseView();
  if (document.readyState === 'complete') {
    goosePerf();
  } else {
    document.addEventListener('readystatechange', (e) => {
      if (e.target.readyState === 'complete') {
        goosePerf();
      }
    });
  }
  // page view time calculation
  let pvt = 0;
  let st = Date.now();
  document.addEventListener('visibilitychange', () => {
    const now = Date.now();
    if (document.visibilityState === 'hidden') {
      pvt += now - st;
    }
    st = now;
  });
  window.addEventListener('beforeunload', () => {
    pvt += Date.now() - st;
    gooseLeave(pvt);
  });

  /* spa listener */
  /* [TODO] */
})(window);
