import InputBox from '/client/modules/core/components/inputBox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'

export const formConfig = {
  form: 'inputbox',
  fields: ['content']
}

const composer = ({context, postId, follow, unfollow}, onData) => {
  const {Meteor, Collections, UserService} = context()
  const post = Collections.Posts.findOne(postId)

  const followers = post.followers
    .map((follower) => UserService.getUserView(Collections.Users.findOne(follower.userId)))
    .filter((user) => user !== undefined) // TODO: investigate correct use of equal sign

  onData(null, {
    user: UserService.currentUser(),
    post,
    followers,
    isFollowing: post.followers.some((f) => f.userId === Meteor.userId()),
    follow: () => follow(postId),
    unfollow: () => unfollow(postId)
  })
}

const depsMapper = (context, actions) => {
  return {
    create: actions.messages.create,
    follow: actions.posts.follow,
    unfollow: actions.posts.unfollow,
    showPostFollowers: actions.posts.showPostFollowers,
    showSnackbarError: actions.posts.showSnackbarError,
    fetchMentions: actions.search.fetchMentions,
    parseAndFetchMentions: actions.search.parseAndFetchMentions,
    clearMentions: actions.search.clearMentions,
    replaceWithMention: actions.search.replaceWithMention,
    store: context.store,
    context: () => context
  }
}

export default composeAll(
  reduxForm(formConfig, (state) => ({
    mentions: state.core.mentions
  })),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InputBox)
