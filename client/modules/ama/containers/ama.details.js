import AmaDetails from '/client/modules/ama/components/ama.details.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

const composer = ({context, amaPostId}, onData) => {
  const {Meteor, UserService, Collections} = context()
  const {AmaPosts, AmaMessages, AmaActivities} = Collections
  const user = UserService.currentUser()

  if (Meteor.subscribe('ama', amaPostId).ready()) {
    console.log('posts', AmaPosts.find().fetch())
    console.log('messages', AmaMessages.find().fetch())
    console.log('activities', AmaActivities.find().fetch())

    onData(null, {user})
  }
}

const depsMapper = (context, actions) => {
  return {
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AmaDetails)
