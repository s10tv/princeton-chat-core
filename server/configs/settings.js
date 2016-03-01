import {stripTrailingSlash} from './context'

export default function ({ ServiceConfiguration, Meteor }) {
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  })

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: process.env.FB_APP_ID || '1687343324838305',
    secret: process.env.FB_APP_SECRET || '8bc99973abd08ad512642ea8c84d1bdb'
  })

  Object.assign(Meteor.settings.public, {
    // Temporarily disable redux logger for now because redux chrome dev tools
    // has more than we need. Enable if need be
    enableReduxLogger: false,
    rootUrl: stripTrailingSlash(process.env.ROOT_URL),
    audience: process.env.AUDIENCE || 'princeton',
    environment: process.env.ENV || 'dev',
    amplitudeKey: process.env.AMPLITUDE_KEY || 'bc1101820f7bda64561e70be2594befd',
    filestackKey: process.env.FILESTACK_KEY || 'AdtrkZqvsS8qdeVHCcYlbz',
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY || 'UA-73874104-1',
    mailgunPublicKey: process.env.MAILGUN_PUBLIC_API_KEY || 'pubkey-4876fe247939932752b0e3d3838234aa',
    unsplashKey: process.env.UNSPLASH_KEY || '3b28c5415d07e18260e66e9d5bc3f2434c2aa64bed071d52e8c62c3da800612e'
  })
}
