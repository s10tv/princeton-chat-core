import actions from '../actions/index.js';
import CreatePost from '../components/post.create.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const { LocalState } = context();

  const handleClose = () => {
    LocalState.set('ADD_POST_POPUP_SHOWING', false);
  }

  const isOpen = LocalState.get('ADD_POST_POPUP_SHOWING') || false;

  onData(null, { handleClose, isOpen });
};

export const depsMapper = (context, actions) => ({
  create: actions.posts.create,
  context: () => context
});


export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost);
