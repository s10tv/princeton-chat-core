import {_} from 'meteor/underscore'
import { DocHead } from 'meteor/kadira:dochead'

import env from '/src/imports/env'
import {
    primaryMuiTheme,
    secondaryMuiTheme
} from '/src/client/configs/theme'

let Env = _.clone(env)
_.extend(Env, {
  primaryMuiTheme,
  secondaryMuiTheme
})

export const i18n = (tag) => {
  return Env[tag]
}

export const localize = () => {
  const env = Env

  DocHead.setTitle(env.title)
  DocHead.addLink({rel: 'icon', type: 'image/png', href: env.favicon})
}
