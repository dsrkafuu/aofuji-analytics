class RIDManager {
  /**
   * @constructor
   * init id set
   */
  constructor() {
    this.set = new Set();
  }

  /**
   * @public
   * get a unique id
   * @return {string}
   */
  get() {
    let id = Math.random().toString(16).slice(2, 12);
    while (this.set.has(id)) {
      id = Math.random().toString(16).slice(2, 12);
    }
    this.set.add(id);
    return id;
  }

  /**
   * @public
   * remove a deprecated id
   * @param {string} id
   */
  remove(id) {
    this.set.delete(id);
  }
}

export { RIDManager };
