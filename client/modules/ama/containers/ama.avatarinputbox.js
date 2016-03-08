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

const composer = ({context, formType, message, amaPostId}, onData) => {
  const baseProps = {
    initialValues: {
      amaPostId,
      content: ''
    },
    form: formType
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
  context: context
})

export default composeAll(
  reduxForm(inputBoxFormConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AvatarInputBox)
