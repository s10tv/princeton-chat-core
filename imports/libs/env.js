import {_} from 'meteor/underscore'
import i18n from './i18n'

import SignupPrinceton from '/imports/modules/core/components/signup/signup-princeton.jsx'
import SignupPed from '/imports/modules/core/components/signup/signup-ped.jsx'
import SignupS10 from '/imports/modules/core/components/signup/signup-s10.jsx'

import {
  primaryMuiTheme,
  secondaryMuiTheme,
  pedPrimaryMuiTheme,
  pedSecondaryMuiTheme } from '/imports/modules/core/components/helpers.jsx'

i18n.princeton = _.extend(i18n.princeton, {
  signupComponent: SignupPrinceton,
  primaryMuiTheme,
  secondaryMuiTheme
})

i18n.s10 = _.extend(i18n.s10, {
  signupComponent: SignupS10,
  primaryMuiTheme,
  secondaryMuiTheme

})

i18n.ped = _.extend(i18n.ped, {
  signupComponent: SignupPed,
  primaryMuiTheme: pedPrimaryMuiTheme,
  secondaryMuiTheme: pedSecondaryMuiTheme
})

export default i18n
