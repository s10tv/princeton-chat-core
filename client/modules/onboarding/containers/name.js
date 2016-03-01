import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {trimSpaces} from '/lib/normalization'
import {enterNamesValidator} from '/lib/validation/onboarding'
import EnterNames from '../components/name.jsx'

export const formConfig = {
  form: 'onboarding/names',
  fields: ['fullName', 'classYear'],
  validate: enterNamesValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    username: trimSpaces
  }
}

export const composer = ({context}, onData) => {
  const { UserService } = context()

  const user = UserService.currentUser()
  const isDefaultAvatar = user.avatar.isDefaultAvatar
  const currentAvatarColor = user.avatar.color
  const currentAvatarUrl = user.avatar.url
  onData(null, {
    isDefaultAvatar,
    currentAvatarColor,
    currentAvatarUrl,
    avatarInitials: user.avatarInitials
  })
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingEnterNames.submit,
  store: context.store,
  changeAvatarToDefault: actions.settings.changeAvatarToDefault,
  handleUpload: actions.settings.changeAvatarFromFilestack,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(EnterNames)
