import {Message} from '/client/modules/ama/components/ama.message.jsx'
// import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps} from 'mantra-core'
// import {reduxForm} from 'redux-form'

export const replyFormConfig = {
  form: 'ama/reply',
  fields: ['content']
  // validate: amaMessageValidator
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.amaMessages.reply,
  context
})

export default composeAll(
  // reduxForm(replyFormConfig),
  useDeps(depsMapper)
)(Message)
