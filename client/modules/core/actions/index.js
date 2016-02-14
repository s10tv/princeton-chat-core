import posts from './posts'
import topics from './topics'
import messages from './messages'
import settings from './settings'
import profile from './profile'
import postfollowers from './postfollowers'

export default {
  posts,
  messages,
  topics,
  profile,
  settings,
  postfollowers,
  global: {
    closeSnackbar: ({ LocalState }) => {
      LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', null)
    }
  }
}
