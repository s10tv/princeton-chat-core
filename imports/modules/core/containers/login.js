import actions from '../actions/index.js';
import Login from '../components/login.jsx';
import {useDeps} from '/imports/libs/mantra';

const depsMapper = (context) => ({
  loginWithPassword: actions.login.loginWithPassword,
  context: () => context
});

export default useDeps(depsMapper)(Login);
