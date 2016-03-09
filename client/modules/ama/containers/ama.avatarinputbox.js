import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm, actionTypes} from 'redux-form'
import {AMA_REPLY_FORM_NAME, AMA_ASK_QUESTION_FORM_NAME} from '../configs/formNames'
import {amaMessageValidator} from '/lib/validation/ama'
import {AvatarInputBox} from '/client/modules/ama/components/ama.avatarinputbox.jsx'

export const inputBoxFormConfig = {
  form: AMA_REPLY_FORM_NAME,
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, formType, message, amaPostId, speaker, onSpeakerType}, onData) => {
  const {MentionParser, store} = context

  let mentions = []
  if (message && message.owner && message.owner.firstName) {
    mentions = message && message.content
      ? MentionParser.parseMentions(message.content).concat(`@${message.owner.firstName.toLowerCase()}`)
      : [`@${message.owner.firstName.toLowerCase()}`]

    mentions = mentions.filter((mention, pos) => {
      return mentions.indexOf(mention) === pos
    })
  }

  const mentionedContent = mentions.length > 0 ? `${mentions.join(' ')} ` : ''
  const initialValue = message && message.owner && message.owner.firstName
    ? `${mentionedContent}`
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
          case actionTypes.CHANGE:
          case actionTypes.RESET:
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
