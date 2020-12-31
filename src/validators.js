const emailRe = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const nameRe = /^[A-Z-a-z\s]{2,50}$/i;
const phoneRe = /^\+?\d{7,20}$/i;

function validate(re, str) {
  return re.test(str);
}

function validateEmail(email) {
  return validate(emailRe, email);
}

function validateName(name) {
  return validate(nameRe, name);
}

function validatePhone(phone) {
  return validate(phoneRe, phone);

}

export {
  validateEmail, validateName, validatePhone
}