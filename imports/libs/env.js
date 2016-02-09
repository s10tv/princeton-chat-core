import i18n from './i18n'

import SignupPrinceton from '/imports/modules/core/components/signup/signup-princeton.jsx'
import SignupPed from '/imports/modules/core/components/signup/signup-ped.jsx'
import SignupS10 from '/imports/modules/core/components/signup/signup-s10.jsx'

_.extend(i18n.princeton, {
  signupComponent: SignupPrinceton,
})

_.extend(i18n.s10, {
  signupComponent: SignupS10,

})

_.extend(i18n.ped, {
  signupComponent: SignupPed,

})

export default i18n
