import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import AdminInvite from '../components/admin.invite.jsx'

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context()
  if (Meteor.subscribe('invites').ready()) {
    const invites = Collections.Invites.find({}, {sort: {updatedAt: -1}}).fetch()
    onData(null, {
      invites
    })
  }
}

const depsMapper = (context, actions) => ({
  store: context.store,
  sendInvite: actions.adminInvite.sendInvite,
  removeInvite: actions.adminInvite.removeInvite,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AdminInvite)
