import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import AdminInvite from '../components/admin.invite.jsx'
import {isAdmin} from '/src/lib/admin'

export const composer = ({context}, onData) => {
  const {Meteor, FlowRouter, Collections, UserService} = context()
  if (Meteor.subscribe('invites').ready() && Meteor.subscribe('userData').ready()) {
    if (!isAdmin(UserService.currentUser())) {
      return FlowRouter.go('all-mine')
    }

    const invites = Collections.Invites.find({}, {sort: {status: 1}}).fetch()
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
