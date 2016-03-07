import {Message} from '/client/modules/ama/components/ama.message.jsx'
import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {AMA_REPLY_FORM_NAME} from '/client/configs/constants'
import {composeWithRedux} from '/client/lib/helpers'

export const replyFormConfig = {
  form: AMA_REPLY_FORM_NAME,
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, amaPostId, message}, onData) => {
  onData(null, {
    formKey: message._id,
    initialValues: {
      amaPostId,
      content: ''
    }
  })
}

const depsMapper = (context, actions) => ({
  reply: actions.amaMessages.reply,
  openReplyBox: actions.amaMessages.openReplyBox,
  store: context.store,
  context: context
})

function onReduxPropsChange ({store, message}) {
  return {
    isReplyBoxOpen: store.getState().ama.openReplies[message._id] === true
  }
}

export default composeAll(
  reduxForm(replyFormConfig),
  composeWithTracker(composer),
  composeWithRedux(onReduxPropsChange),
  useDeps(depsMapper)
)(Message)
