/* constants */

export const LS_KEY = 'vector_sid_9e7c515';
export const [INACTIVE, PAUSE, ACTIVE] = [0, -1, 1];

/* utils */

/**
 * save session id
 * @param {string} val
 */
export function setSID(val) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(val));
  } catch {
    return;
  }
}

/**
 * get session id
 * @return {string}
 */
export function getSID() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || '';
  } catch {
    return '';
  }
}

/**
 * use page view time tracker
 */
export function usePVT() {
  const PVT = {
    t: INACTIVE, // active status
    s: 0, // start time
    a: 0, // total time
    // init
    it() {
      if (this.t === INACTIVE) {
        this.t = ACTIVE;
        this.s = Date.now();
        this.a = 0;
      }
    },
    // pause
    ps() {
      if (this.t === ACTIVE) {
        this.t = PAUSE;
        this.a += Date.now() - this.s;
      }
    },
    // start
    st() {
      if (this.t === PAUSE) {
        this.t = ACTIVE;
        this.s = Date.now();
      }
    },
    //end
    ed() {
      if (this.t === ACTIVE) {
        this.a += Date.now() - this.s; // if active, add new time
      }
      this.t = INACTIVE;
      return this.a > 0 ? this.a : undefined;
    },
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      PVT.ps();
    } else {
      PVT.st();
    }
  });

  return PVT;
}
