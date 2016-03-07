import {Message} from '/client/modules/ama/components/ama.message.jsx'
import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {AMA_REPLY_FORM_NAME} from '/client/configs/constants'

export const replyFormConfig = {
  form: AMA_REPLY_FORM_NAME,
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, amaPostId}, onData) => {
  onData(null, {
    initialValues: {
      amaPostId,
      content: ''
    }
  })
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.amaMessages.reply,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(replyFormConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Message)
