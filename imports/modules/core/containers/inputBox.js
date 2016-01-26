import actions from '../actions/index.js';
import InputBox from '../components/inputBox.jsx';
import {useDeps} from '/imports/libs/mantra';

const depsMapper = (context, actions) => ({
  create: actions.messages.create,
  context: () => context
});

export default useDeps(depsMapper)(InputBox);
