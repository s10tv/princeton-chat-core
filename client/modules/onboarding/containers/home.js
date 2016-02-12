import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {createValidator, maxLength, required} from '/lib/validation'
import Home from '../components/home.jsx'

const formConfig = {
  form: 'home',
  fields: ['netid', 'domain'],
  initialValues: {
    domain: 'alumni.princeton.edu'
  },
  validate: createValidator({
    netid: [required, maxLength(16)],
    domain: required,
  })
}


export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context()
  if (Meteor.subscribe('topics').ready()) {
    const topics = Collections.Topics.find().fetch()
    onData(null, {topics})
  } else {
    onData(null, {topics: []})
  }
}

const depsMapper = (context, actions) => ({
  store: context.store,
  context: () => context,
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Home)
