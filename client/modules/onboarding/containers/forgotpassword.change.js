import {useDeps, composeAll} from 'mantra-core'
import ForgotPasswordChange from '../components/forgotpassword.change.jsx'
import {reduxForm} from 'redux-form'
import {forgotPasswordChangeValidator} from '/lib/validation/onboarding'

const formConfig = {
  form: 'forgot-password-change',
  fields: ['newPassword', 'matchNewPassword', 'token'],
  validate: forgotPasswordChangeValidator
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    token: ownProps.params.token
  }
})

const depsMapper = (context, actions) => ({
  onSubmit: actions.forgotPassword.reset,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig, mapStateToProps),
  useDeps(depsMapper)
)(ForgotPasswordChange)
