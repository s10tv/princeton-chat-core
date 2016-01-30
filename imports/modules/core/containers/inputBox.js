import InputBox from '/imports/modules/core/components/inputBox.jsx';
import {useDeps} from '/imports/libs/mantra';

const depsMapper = (context, actions) => ({
  create: actions.messages.create,
  context: () => context
});

export default useDeps(depsMapper)(InputBox);
