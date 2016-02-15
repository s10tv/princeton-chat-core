import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import InviteFriends from '../components/invite.friends.jsx'
import { inviteFriendsValidator } from '/lib/validation/onboarding'

export const formConfig = {
  form: 'onboarding/invite-friends',
  fields: [
    'invitees[].firstName',
    'invitees[].lastName',
    'invitees[].email'
  ],
  initialValues: {
    invitees: [{}, {}]
  },
  validate: inviteFriendsValidator
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingInviteFriends.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InviteFriends)
