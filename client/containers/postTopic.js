import PostTopic from '../components/PostTopic.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
  const {FlowRouter} = context();
  onData(null, {FlowRouter});
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(PostTopic);
