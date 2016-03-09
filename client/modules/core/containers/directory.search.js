import DirectorySearch from '/client/modules/core/components/directory.search.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import { SearchCoverPhoto } from '/client/lib/unsplash.service.js'

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService} = context()
  const {Users, Topics} = Collections

  if (Meteor.subscribe('topics').ready() && Meteor.subscribe('directory.search', term).ready()) {
    const users = Users.find({}).map((user) => {
      const userView = UserService.getUserView(user)
      return Object.assign({}, userView, {
        followingTopics: userView.followingTopics.map((topicId) => {
          return Topics.findOne(topicId)
        }).filter((topic) => !!topic)
      })
    })

    const menuHeader = {
      displayName: `Search: ${term}`,
      cover: SearchCoverPhoto,
      followers: []
    }

    onData(null, {
      users,
      currentSearchValue: term,
      topic: menuHeader, // TODO: decouple menu from topic
      isEmpty: users.length === 0
    })
  }
}

const depsMapper = (context, actions) => {
  return {
    showUserProfile: actions.profile.showUserProfile,
    navigateToTopic: actions.topics.navigateToChannel,
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(DirectorySearch)
