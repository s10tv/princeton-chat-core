import {createValidator, maxLength, required, email, classYear, isNumericString,
  degree, dateFormat} from '/lib/validation'

export const autoVerifyValidator = createValidator({
  netid: [required, maxLength(16)],
  domain: required
})

export const manualVerifyValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  birthDate: [required, dateFormat],
  classYear: [required, isNumericString, classYear],
  degree: [required, degree],
  email: [required, email]
})

export const loginValidator = createValidator({
  email: [required, email],
  password: [required]
})

export const signupValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  email: [required, email],
  password: [required, minLength(6), maxLength(50)]
})

const inviteeValidator = createValidator({
  'email': [required, email]
})

export const inviteFriendsValidator = createValidator({
  'invitees': (invitees) => invitees.map(inviteeValidator)
})
