(function(window) {
  /* init */

  // get window props
  const { document, location, navigator, screen, JSON, fetch } = window;
  const dpr = window.devicePixelRatio || 1;
  const timing = window.performance.getEntriesByType('navigation');

  // get tracker settings
  const { GOOSE_ID, GOOSE_API } = window;

  /* functions */

  /**
   * send data to server
   * @param {String} type
   * @param {Object} payload
   */
  function sendData(type, payload) {
    if (!GOOSE_API || !GOOSE_ID) {
      return;
    }
    const collect = `${GOOSE_API}${/\/$/.exec(GOOSE_API) ? '' : '/'}collect`;

    const body = JSON.stringify({
      t: type,
      id: GOOSE_ID,
      p: payload,
    });

    return fetch(collect, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      referrer: 'no-referrer',
      credentials: 'include',
    });
  }

  /* tracker */

  const gooseView = () => {
    sendData('view', {
      lang: navigator.language,
      path: location.pathname,
      ref: document.referrer,
      sc: screen.width * dpr + 'x' + screen.height * dpr,
    });
  };
  const goosePerf = () => {
    setTimeout(() => {
      const navPerf = timing[0];
      console.log(1);
      if (navPerf) {
        const res = navPerf.responseStart - navPerf.startTime;
        const dcl = navPerf.domContentLoadedEventStart - navPerf.startTime;
        const load = navPerf.loadEventStart - navPerf.startTime;
        sendData('perf', {
          res,
          dcl,
          load,
        });
      }
    }, 0);
  };
  const gooseEvent = (name, type) => {
    sendData('event', {
      name,
      type,
    });
  };

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

  /* spa listener */

  /* expose tracker */
  window.gooseView = gooseView;
  window.gooseEvent = gooseEvent;
})(window);
