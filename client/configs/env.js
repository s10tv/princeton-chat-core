import { Meteor } from 'meteor/meteor'
import {_} from 'meteor/underscore'
import { DocHead } from 'meteor/kadira:dochead'

import {
    primaryMuiTheme,
    secondaryMuiTheme,
    pedPrimaryMuiTheme,
    pedSecondaryMuiTheme } from '/client/configs/theme'

const PRINCETON_ORANGE = '#F07621'
const PED_BLUE = '#5477AD'
const DARK_GRAY = '#grey800'

let Env = {
  princeton: {
    primaryColor: PRINCETON_ORANGE,

    // home page title, left nav bar title
    title: 'Princeton.Chat',

    // home page tagline
    tagline: 'Better TigerNet',

    // signup done screen
    community: 'Princeton',

    // onboarding greeting
    onboardingGreeting: 'Welcome Tiger!',
    onboardingDesc: 'Princeton.Chat is a community for Princeton alums.',

    // meta
    favicon: 'images/favicon.png',
    fbAppId: '942109702548809',
    ogUrl: 'https://princeton.chat',
    ogType: 'website',
    ogTitle: 'Princeton.Chat',
    ogDescription: 'Better Tigernet.',
    ogImage: 'https://s10tv.blob.core.windows.net/s10tv-prod/princetonchat.jpg',

    // mail server info on right bar for topics and for add followers
    topicMailServer: 'topics.princeton.chat',

    // when new users sign up
    defaultAvatar: '/images/princeton.svg',

    backgroundStyle: {
      backgroundImage: "url('/images/background-tile.png')",
      backgroundRepeat: 'repeat'
    }
  },

  s10: {
    primaryColor: PRINCETON_ORANGE,
    title: 'S10.Chat',
    tagline: 'Better Private Communities',
    homePageQA: 'Should a San Francisco resident get notified that a New Yoker listed an apartment for rent?',
    community: 'S10',
    favicon: 'images/taylr.png',
    fbAppId: '1150904264922616',
    ogUrl: 'https://s10.chat',
    ogType: 'website',
    ogTitle: 'S10.Chat',
    ogDescription: 'Better communities.',
    ogImage: 'https://s10tv.blob.core.windows.net/s10tv-prod/princetonchat.jpg',
    onboardingGreeting: 'Welcome to S10.Chat!',
    onboardingDesc: 'S10.Chat is a community for everyone interested in following along the development of Taylr.Chat',
    topicMailServer: 'topics.s10.chat',
    defaultAvatar: '/images/avatar-placeholder.png',
    backgroundStyle: {
      backgroundImage: "url('/images/background-tile.png')",
      backgroundRepeat: 'repeat'
    }
  },

  ped: {
    primaryColor: PED_BLUE,
    title: 'Pedagogy & Play',
    tagline: 'Young Professional Leadership Network',
    community: 'Pedagogy & Play',
    favicon: 'images/pedplay.png',
    fbAppId: '1150904264922616',
    ogUrl: 'https://pedplay.com',
    ogType: 'website',
    ogTitle: 'PedPlay',
    ogDescription: 'Meet new colleagues in the area, share pedagogy successes (and frustrations), sight-read duets, or perform any repertoire you are working on!',
    ogImage: 'https://s10tv.blob.core.windows.net/s10tv-prod/princetonchat.jpg',
    onboardingGreeting: 'Welcome to Pedagogy and Play!',
    onboardingDesc: 'Meet new colleagues in the area, share pedagogy successes (and frustrations), sight-read duets, or perform any repertoire you are working on!',
    topicMailServer: 'topics.pedplay.com',
    defaultAvatar: '/images/avatar-placeholder.png',
    backgroundStyle: {
      background: PED_BLUE
    },
    loginTitle: {
      fontFamily: "'Quicksand', sans-serif",
      color: DARK_GRAY
    }
  }
}

Env.princeton = _.extend(Env.princeton, {
  primaryMuiTheme,
  secondaryMuiTheme
})

Env.s10 = _.extend(Env.s10, {
  primaryMuiTheme,
  secondaryMuiTheme
})

Env.ped = _.extend(Env.ped, {
  primaryMuiTheme: pedPrimaryMuiTheme,
  secondaryMuiTheme: pedSecondaryMuiTheme
})

export const i18n = (tag) => {
  const audience = Meteor.settings.public.audience || 'princeton'
  return Env[audience][tag]
}

export const localize = () => {
  const audience = Meteor.settings.public.audience || 'princeton'
  const env = Env[audience]

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
