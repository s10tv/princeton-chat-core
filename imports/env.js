const PRINCETON_ORANGE = '#F07621'

/**
 *  Consolidated a lot of the constants into this one file so that it's easier to manage
 *  merge conflicts between various deployments.
 */
export default {
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

  // mail server info on right bar for topics and for add followers
  topicMailServer: 'channels.princeton.chat',

  // when new users sign up
  defaultAvatar: '/images/princeton.svg',

  backgroundStyle: {
    backgroundImage: "url('/images/background-tile.png')",
    backgroundRepeat: 'repeat'
  },
  homePageBackgroundUrl: '/images/bg-blair-arch-people.jpg',
  pageNotFoundError: 'We used to have a page here, but the hungry tiger ate it.',
  pageNotFoundBackground: 'https://images.unsplash.com/photo-1430876988766-1be68caef0e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=188a0a423d918ef320144a56866c7ced'
}
