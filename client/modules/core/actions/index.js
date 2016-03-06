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
    },
    showSidebar: ({LocalState}) => {
      LocalState.set('SHOW_SIDE_BAR', true)
    },
    hideSidebar: ({LocalState}) => {
      LocalState.set('SHOW_SIDE_BAR', false)
    },
    toggleSidebar: ({LocalState}) => {
      LocalState.set('SHOW_SIDE_BAR', !LocalState.get('SHOW_SIDE_BAR'))
      // store.dispatch({
      //   action: 'TOGGLE_SIDEBAR'
      // })
    }
  }
}
