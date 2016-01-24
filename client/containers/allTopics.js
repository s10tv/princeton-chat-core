import Settings from '../components/AllTopics/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
  const {Collections} = context();
  onData(null, { topics: Collections.Topics.find().fetch() });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(Settings);
