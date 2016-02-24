import {createValidator, maxLength, required, classYear} from '/lib/validation'

export const updateProfileValidator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  displayName: [maxLength(96)],
  username: [required, maxLength(254)],
  classYear: [classYear]
})
