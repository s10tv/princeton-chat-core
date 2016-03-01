import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {studentVerifyValidator} from '/lib/validation/onboarding'
import {trimSpaces} from '/lib/normalization'
import {domains} from '/lib/data'
import {PageLoader} from '/client/lib/ui.jsx'
import StudentFormComponent from '../components/home.form.student.jsx'

export const studentFormConfig = {
  form: 'onboarding/student-verify',
  fields: ['netid', 'domain', 'classYear', 'affiliationType'],
  initialValues: {
    affiliationType: 'student'
  },
  validate: studentVerifyValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    netid: trimSpaces
  }
}

const studentComposer = ({context}, onData) => {
  onData(null, {domains})
}

const studentDepsMapper = (context, actions) => ({
  onSubmit: actions.onboardingAutoVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(studentFormConfig, (state) => {
    return {
      initialValues: {
        domain: state.onboarding.homeSelector === 'alum' ? 'alumni.princeton.edu' : 'princeton.edu'
      }
    }
  }),
  composeWithTracker(studentComposer, PageLoader),
  useDeps(studentDepsMapper)
)(StudentFormComponent)
