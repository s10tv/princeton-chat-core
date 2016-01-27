import Profile from '../components/profile.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const { LocalState } = context();

  const handleClose = () => {
    LocalState.set('PROFILE_USER', null);
  }

  const isOpen = LocalState.get('PROFILE_USER') != undefined;

  onData(null, { handleClose, isOpen, user: LocalState.get('PROFILE_USER') });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Profile);
