import { Meteor } from 'meteor/meteor'
import { Users } from '/lib/collections'
import { _ } from 'meteor/underscore'

export default function () {
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  })

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: process.env.FB_APP_ID || '1687343324838305',
    secret: process.env.FB_APP_SECRET || '8bc99973abd08ad512642ea8c84d1bdb'
  })

  if (!Meteor.settings.public) {
    Meteor.settings.public = {}
  }

  _.extend(Meteor.settings.public, {
    audience: process.env.AUDIENCE || 'princeton',
    amplitudeKey: process.env.AMPLITUDE_KEY || 'bc1101820f7bda64561e70be2594befd',
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY || 'UA-73874104-1',
    unsplashKey: process.env.UNSPLASH_KEY || '3b28c5415d07e18260e66e9d5bc3f2434c2aa64bed071d52e8c62c3da800612e'
  })
}
