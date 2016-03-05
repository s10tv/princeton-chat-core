import AmaDetails from '/client/modules/ama/components/ama.details.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

const composer = ({context}, onData) => {
  const {Meteor, UserService} = context()
  const user = UserService.currentUser()

  if (Meteor.subscribe('ama').ready()) {
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
