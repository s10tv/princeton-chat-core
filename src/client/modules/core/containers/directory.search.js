import DirectorySearch from 'client/modules/core/components/directory.search.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import { SearchCoverPhoto } from 'client/lib/unsplash.service.js'

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService} = context()

  if (Meteor.subscribe('directory.search', term).ready()) {
    const users = Collections.Users.find({ _id: { $ne: Meteor.userId() } }).map((user) => {
      return UserService.getUserView(user)
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
    navigateToTopic: actions.topics.navigateToTopic,
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(DirectorySearch)
