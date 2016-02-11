import Home from '../components/home.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context()
  if (Meteor.subscribe('topics').ready()) {
    const topics = Collections.Topics.find().fetch()
    onData(null, {topics})
  } else {
    onData(null, {topics: []})
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Home)
