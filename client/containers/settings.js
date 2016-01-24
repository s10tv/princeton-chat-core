import Settings from '../components/Settings/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
  const {Meteor} = context();
  onData(null, { currentUser: Meteor.user() });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(Settings);
