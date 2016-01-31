import CreatePost from '/imports/modules/core/components/modal.post.create.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const { Collections, LocalState } = context();

  const isOpen = LocalState.get('ADD_POST_POPUP_SHOWING') || false;
  const allTopics = Collections.Topics.find().map(topic => {
    return { value: topic._id , label: topic.displayName };
  });

  onData(null, { isOpen, allTopics });
};

export const depsMapper = (context, actions) => ({
  create: actions.posts.create,
  handleClose: actions.posts.closeAddPostPopup,
  showTopicFollowers: actions.topics.showTopicFollowers,
  updateTopicFollowers: actions.topics.updateTopicFollowers,
  context: () => context
});


export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost);
