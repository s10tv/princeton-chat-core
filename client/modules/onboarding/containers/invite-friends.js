import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import InviteFriends from '../components/invite-friends.jsx'
import { inviteValidator } from '/lib/validation/onboarding'

export const formConfig = {
  form: 'onboarding-invite',
  fields: [
    'invitees[].firstName',
    'invitees[].lastName',
    'invitees[].email'
  ],
  initialValues: {
    invitees: [{}, {}, {}]
  },
  validate: inviteValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    invitees: (invitees) => invitees.filter((invitee) => invitee.email != null)
  }
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardInvite.invite,
  store: context.store,
  verifyAffiliation: actions.requestInvite.verifyAffiliation,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InviteFriends)
