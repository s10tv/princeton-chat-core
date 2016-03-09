import {AvatarInputBox} from '/client/modules/ama/components/ama.avatarinputbox.jsx'
import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {AMA_REPLY_FORM_NAME, AMA_ASK_QUESTION_FORM_NAME} from '../configs/formNames'

export const inputBoxFormConfig = {
  form: AMA_REPLY_FORM_NAME,
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, formType, message, amaPostId, speaker, onSpeakerType}, onData) => {
  const {MentionParser, store} = context

  const mentions = message && message.content
    ? MentionParser.parseMentions(message.content)
    : []
  const mentionedContent = mentions.length > 0 ? `${mentions.join(' ')} ` : ''

  const initialValue = message && message.owner && message.owner.firstName
    ? `@${message.owner.firstName.toLowerCase()} ${mentionedContent}`
    : ''

  const baseProps = {
    initialValues: {
      amaPostId,
      content: initialValue
    },
    form: formType,
    store: Object.assign({}, store, {
      dispatch: (action) => {
        switch (action.type) {
          case 'redux-form/CHANGE':
          case 'redux-form/RESET':
            store.dispatch(onSpeakerType({amaPostId, speaker}))
            break
        }
        store.dispatch(action)
      }
    })
  }
  switch (formType) {
    case AMA_REPLY_FORM_NAME:
      onData(null, {
        ...baseProps,
        formKey: message._id
      })
      break
    case AMA_ASK_QUESTION_FORM_NAME:
      onData(null, {
        ...baseProps
      })
      break
  }
}

const depsMapper = (context, actions) => ({
  store: context.store,
  onSpeakerType: actions.amaMessages.onSpeakerType,
  context: context
})

export default composeAll(
  reduxForm(inputBoxFormConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AvatarInputBox)
