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
    toggleMenu: ({store}) => {
      store.dispatch({type: 'SIDEBAR_MENU_TOGGLE'})
    },
    toggle: ({store}) => {
      store.dispatch({type: 'SIDEBAR_TOGGLE'})
    },
    update: ({store}, open) => {
      store.dispatch({type: 'SIDEBAR_UPDATE', open})
    }
  }
}
