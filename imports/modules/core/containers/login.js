import Login from '../components/login.jsx';
import {useDeps} from '/imports/libs/mantra';

const depsMapper = (context, actions) => ({
  loginWithPassword: actions.login.loginWithPassword,
  context: () => context
});

export default useDeps(depsMapper)(Login);
