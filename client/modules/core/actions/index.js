import {createBoundAction} from '/client/lib/helpers'
import posts from './posts'
import topics from './topics'
import messages from './messages'
import settings from './settings'
import search from './search'
import profile from './profile'
import inbox from './inbox'
import postfollowers from './postfollowers'

export default {
  posts,
  messages,
  topics,
  search,
  profile,
  settings,
  postfollowers,
  inbox,
  global: {
    closeSnackbar: ({ LocalState }) => {
      LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', null)
    },
    showLoginAlert: ({sweetalert}) => {
      sweetalert({
        imageUrl: '/images/coffee.svg',
        imageSize: '100x100',
        text: "We'd give you access and treat you with hot chocolate. We'd even wrap you in a warm blanket. We have one slight problem though. You're not logged in :c",
        title: 'Please log in first'
      })
    }
  },
  sidebar: {
    toggle: createBoundAction('SIDEBAR_TOGGLE'),
    update: createBoundAction('SIDEBAR_UPDATE'),
    toggleMenu: createBoundAction('SIDEBAR_MENU_TOGGLE')
  }
}
