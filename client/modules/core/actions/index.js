import {bindContext} from '/client/lib/helpers'
import * as Types from '../configs/actionTypes'
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
    navigateTo ({history}, path) {
      history.push(path)
    }
  },
  sidebar: {
    toggle: bindContext(Types.sidebarToggle),
    open: bindContext(Types.sidebarOpen),
    close: bindContext(Types.sidebarClose),
    onRequestChange: bindContext(Types.sidebarOnRequestChange),
    toggleMenu: bindContext(Types.sidebarToggleMenu)
  }
}
