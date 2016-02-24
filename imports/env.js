const PED_BLUE = '#5477AD'
const DARK_GRAY = '#grey800'

/**
 *  Consolidated a lot of the constants into this one file so that it's easier to manage
 *  merge conflicts between various deployments.
 */
export default {
  primaryColor: PED_BLUE,
  title: 'Pedagogy & Play',
  tagline: 'Young Professional Leadership Network',
  community: 'Pedagogy & Play',
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
  },
  pageNotFoundError: 'We used to have a page here, but Rachmaninoff used the back side to write some sheet music.',
  pageNotFoundBackground: 'https://images.unsplash.com/photo-1447876576829-25dd6c4b3d21'
}
