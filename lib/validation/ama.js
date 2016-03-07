import {required, createValidator} from '/lib/validation'

export const amaMessageValidator = createValidator({
  content: [required]
})
