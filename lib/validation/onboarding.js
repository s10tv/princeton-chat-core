import {createValidator, required, email} from '/lib/validation'

const inviteeValidator = createValidator({
  'email': [required, email]
})

export const inviteValidator = createValidator({
  'invitees': (invitees) => invitees.map(inviteeValidator)
})
