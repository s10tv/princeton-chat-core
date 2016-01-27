import Login from '../components/login.jsx';
import {composeAll, useDeps} from '/imports/libs/mantra';

const depsMapper = (context, actions) => ({
  loginWithPassword: actions.login.loginWithPassword,
  context: () => context
});

export default composeAll(
  useDeps(depsMapper)
)(Login);
