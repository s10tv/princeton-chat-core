import { Meteor } from 'meteor/meteor'
import {_} from 'meteor/underscore'
import { DocHead } from 'meteor/kadira:dochead'

import env from '/imports/env'
import {
    primaryMuiTheme,
    secondaryMuiTheme
} from '/client/configs/theme'

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
  DocHead.addMeta({ property: 'description', content: env.ogDescription })
  DocHead.addMeta({ property: 'fb:app_id', content: env.fbAppId })
  DocHead.addMeta({ property: 'og:url', content: env.ogUrl })
  DocHead.addMeta({ property: 'og:type', content: env.ogType })
  DocHead.addMeta({ property: 'og:title', content: env.ogTitle })
  DocHead.addMeta({ property: 'og:description', content: env.ogDescription })
  DocHead.addMeta({ property: 'og:image', content: env.ogImage })
  DocHead.addLink({rel: 'icon', type: 'image/png', href: env.favicon})
}
