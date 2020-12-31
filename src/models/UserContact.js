export default class UserContact {
  properties
  /**
   * Class represent contact instance
   * @param data {{id: (Number|undefined), name: String, surname: String, phone: String, email: String}}
   */
  constructor(data) {
    this.properties = new Map();
    for (const [key, value] of Object.entries(data)) {
      this.properties.set(key, value);
    }
    return new Proxy(this, this);
  }

  get (target, prop) {
    return target.properties.get(prop) || target[prop];
  }

  set (target, prop, value) {
    target.properties.set(prop, value);
    return true;
  }

  get fullName() {
    return `${this.properties.get('name')} ${this.properties.get('surname')}`;
  }

  // just js object
  get object() {
    let obj = Object.create(null);
    for (let [k,v] of this.properties) {
      obj[k] = v;
    }
    return obj;
  }
}