import {createValidator, maxLength, required, email, classYear,
  minLength, degree, dateFormat} from '/lib/validation'

export const studentVerifyValidator = createValidator({
  netid: [required, maxLength(100)],
  classYear: [required, classYear],
  domain: required
})

export const facultyVerifyValidator = createValidator({
  netid: [required, maxLength(100)],
  domain: required
})

export const manualVerifyValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  birthDate: [required, dateFormat],
  classYear: [required, classYear],
  degree: [required, degree],
  email: [required, email]
})

export const enterNamesValidator = createValidator({
  fullName: [required]
})

export const pedManualVerifyValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  email: [required, email]
})

export const loginValidator = createValidator({
  email: [required, email],
  password: [required]
})

export const forgotPasswordEmailValidator = createValidator({
  email: [required, email]
})

export const forgotPasswordChangeValidator = createValidator({
  newPassword: [required, minLength(6), maxLength(50)],
  matchNewPassword: [required, minLength(6), maxLength(50)]
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
