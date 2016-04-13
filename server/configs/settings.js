import {stripTrailingSlash} from './context'

export default function ({ ServiceConfiguration, Meteor }) {
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  })

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: process.env.FB_APP_ID || '',
    secret: process.env.FB_APP_SECRET || ''
  })

  Object.assign(Meteor.settings.public, {
    // Temporarily disable redux logger for now because redux chrome dev tools
    // has more than we need. Enable if need be
    enableBrowserSync: process.env.BROWSER_SYNC || false,
    enableReduxLogger: false,
    rootUrl: stripTrailingSlash(process.env.ROOT_URL),
    audience: process.env.AUDIENCE || '',
    environment: process.env.ENV || 'dev',
    amplitudeKey: process.env.AMPLITUDE_KEY || '',
    filestackKey: process.env.FILESTACK_KEY || '',
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY || 'UA-XXXXXXXX-X',
    mailgunPublicKey: process.env.MAILGUN_PUBLIC_API_KEY || '',
    unsplashKey: process.env.UNSPLASH_KEY || ''
  })
}
