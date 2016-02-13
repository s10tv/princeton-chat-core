import {createValidator, maxLength, required} from '/lib/validation'

export const validator = createValidator({
  netid: [required, maxLength(16)],
  domain: required
})
