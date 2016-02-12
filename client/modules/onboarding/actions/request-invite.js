import { validator } from '/lib/validation/request-invite-validation'

export default {
  verifyAffiliation ({Meteor, store}) {
    const { form: { affiliation: {
      firstName, lastName, birthDate, classYear, degree, email
    }}} = store.getState()

    const info = {
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      classYear: classYear.value,
      degree: degree.value,
      email: email.value
    }

    const errors = validator(info)
    if (Object.keys(errors).length === 0) {
      Meteor.call('signup/verifyAffiliation', info, (err) => {
        if (err) {
          // TODO(tonyx): Display Error
          console.log(err)
          return
        }

        // TODO(tonyx): Display success indicator
        console.log('inserted invite')
      })
    }
  }
}
