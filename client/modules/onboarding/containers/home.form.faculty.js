import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {facultyVerifyValidator} from '/lib/validation/onboarding'
import {trimSpaces} from '/lib/normalization'
import {domains} from '/lib/data'
import {PageLoader} from '/client/lib/ui.jsx'
import FacultyFormComponent from '../components/home.form.faculty.jsx'

export const facultyFormConfig = {
  form: 'onboarding/faculty-verify',
  fields: ['netid', 'domain', 'affiliationType'],
  initialValues: {
    domain: 'princeton.edu'
  },
  validate: facultyVerifyValidator,
  normalize: {
    netid: trimSpaces
  }
}

const facultyComposer = ({context}, onData) => {
  onData(null, {domains})
}

const facultyDepsMapper = (context, actions) => ({
  onSubmit: actions.onboardingAutoVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(facultyFormConfig),
  composeWithTracker(facultyComposer, PageLoader),
  useDeps(facultyDepsMapper)
)(FacultyFormComponent)
