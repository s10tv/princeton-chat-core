import { validator } from '/lib/validation/home-validation'

export default {
  verifyAlumni ({Meteor, store}) {
    const { form: { home: {
      netid, domain
    }}} = store.getState()

    const info = {
      netid: netid.value,
      domain: domain.value
    }

    const errors = validator(info)
    if (Object.keys(errors).length === 0) {
      Meteor.call('signup/alumni', info, (err) => {
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
