import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import AdminInvite from '../components/admin.invite.jsx'
import {isAdmin} from '/lib/admin'

export const composer = ({context}, onData) => {
  const {Meteor, Collections, UserService, history} = context()
  if (Meteor.subscribe('invites').ready() && Meteor.subscribe('userData').ready()) {
    // TODO: XXX FIX ME
    if (!isAdmin(UserService.currentUser())) {
      history.push('/inbox')
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