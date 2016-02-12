import {createValidator, maxLength, required, email} from '/lib/validation'

export const validator = createValidator({
  firstName: [required, maxLength(16)],
  lastName: [required, maxLength(16)],
  birthDate: [required], // TODO(qimingfang): add birthday validation
  classYear: [required],
  degree: [required],
  email: [required, email]
})
