import {createValidator, maxLength, required, email} from '/lib/validation'

const inviteeValidator = createValidator({
  'email': [required, email]
})

export const inviteValidator = createValidator({
  'invitees': (invitees) => invitees.map(inviteeValidator)
})

export const autoAffiliationValidator = createValidator({
  netid: [required, maxLength(16)],
  domain: required
})

export const manualAffiliationValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  birthDate: [required], // TODO(qimingfang): add birthday validation
  classYear: [required],
  degree: [required],
  email: [required, email]
})
