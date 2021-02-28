/*! vector-analytics | DSRKafuU (https://dsrkafuu.su) | Copyright Apache-2.0 License */

import { setSID, getSID, usePVT } from './utils';

/**
 * use vector analytics
 * @param {string} ID
 * @param {string} API
 * @param {boolean} SPA
 */
export default function useVector(ID, API, SPA = true) {
  /**
   * send data to api
   * @param {string} type
   * @param {string} path
   * @param {Object} payload
   */
  const sendData = (type, path, payload) => {
    // whether need to await response
    const needRes = type === 'view' && !getSID();
    const needWait = type === 'leave';
    // construct data
    const encode = encodeURIComponent;
    let url = `${API}?t=${type}&id=${ID}&d=${Date.now()}`;
    // get session id
    let sid = getSID();
    sid && (url += `&sid=${sid}`);
    url += `&p=${encode(path)}`;
    for (let key in payload) {
      if (payload[key]) {
        url += `&${key}=${encode(payload[key])}`;
      }
    }
    // when no response need and `sendBeacon` available
    if (navigator.sendBeacon && !needRes) {
      navigator.sendBeacon(url);
    }
    // need response or fallbacks
    else if (window.fetch) {
      const req = fetch(url, { method: 'GET', keepalive: needWait });
      req.then((res) => {
        if (needRes && res.status === 201) {
          res.json().then((data) => {
            const { sid } = data;
            sid && setSID(sid);
          });
        }
      });
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, !needWait);
      // [ie fix] xhr.responseType = 'json' not supported
      xhr.onload = () => {
        if (needRes && xhr.status === 201) {
          const { sid } = JSON.parse(xhr.response);
          sid && setSID(sid);
        }
      };
      xhr.send(null);
    }
  };

  /* tracker */

  // init pvt data
  const PVT = usePVT();

  /**
   * send view data
   * @param {string} path
   * @param {string} ref
   */
  const vecView = (path, ref) => {
    // start pvt
    PVT.it();
    // data
    const data = {
      r: ref, // referrer
      lng: navigator.language || undefined, // language
    };
    // send view data
    sendData('view', path, data);
  };

  /**
   * send leave data
   * @param {string} path
   */
  const vecLeave = (path) => {
    const data = {
      pvt: PVT.ed() || undefined,
    };
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

  // legacy mode
  if (!SPA) {
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

  return {
    vecView,
    vecLeave,
    vecEvent,
  };
}
