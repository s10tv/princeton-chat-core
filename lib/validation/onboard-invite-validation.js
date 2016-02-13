import {createValidator} from '/lib/validation'

// TODO: validate email
export const validator = createValidator({})

export const filterInvitees = (invitees) => {
  return invitees.filter((invite) => {
    return invite.firstName && invite.lastName && invite.email
  })
}
