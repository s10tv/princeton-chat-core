import Layout from '../components-refactor/layout.jsx';
import {useDeps} from '/imports/libs/mantra.js';

export const depsMapper = (context, actions) => ({
  create: actions.posts.create,
  context: () => context
});

export default useDeps(depsMapper)(CreatePost);
