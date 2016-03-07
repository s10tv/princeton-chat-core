import {Message} from '/client/modules/ama/components/ama.message.jsx'
import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'

export const replyFormConfig = {
  form: 'ama/reply',
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, amaPostId}, onData) => {
  onData(null, {
    initialValues: {
      amaPostId
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
