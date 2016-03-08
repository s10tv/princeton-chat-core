import {AvatarInputBox} from '/client/modules/ama/components/ama.avatarinputbox.jsx'
import {amaMessageValidator} from '/lib/validation/ama'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {AMA_REPLY_FORM_NAME, AMA_ASK_QUESTION_FORM_NAME} from '/client/configs/constants'

export const inputBoxFormConfig = {
  form: AMA_REPLY_FORM_NAME,
  fields: ['content', 'amaPostId'],
  validate: amaMessageValidator
}

const composer = ({context, formType, message, amaPostId, speaker, onSpeakerType}, onData) => {
  const {store} = context
  const baseProps = {
    initialValues: {
      amaPostId,
      content: ''
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
