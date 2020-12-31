export default class UserContact {

  id

  /**
   * Class represent contact instance
   * @param data {{id: (Number|undefined), name: String, surname: String, phone: String, email: String}}
   */
  constructor(data) {
    this.data = data
    this.id = this.data.id;
  }

  set id(id) {
    if (isNaN(id) || id < 1) {
      throw new Error('Illegal id for contact');
    }
    this.id = id;
  }

  get id() {
    return this.id;
  }

  get name() {
    return this.data.name;
  }

  get surname() {
    return this.data.surname;
  }

  get phone() {
    return this.data.phone;
  }

  get email() {
    return this.data.email;
  }

  get fullName() {
    return `${this.data.name} ${this.data.surname}`;
  }

  // just js object
  get object() {
    console.log('town');
    return {
      ...this.data,
      id: this.id
    }
  }
}