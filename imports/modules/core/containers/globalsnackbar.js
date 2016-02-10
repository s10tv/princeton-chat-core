import GlobalSnackbar from '/imports/modules/core/components/globalsnackbar.jsx';
import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const { LocalState } = context();

  onData(null, {
    isSnackbarOpen: LocalState.get('SHOW_GLOBAL_SNACKBAR_WITH_STRING') != undefined,
    snackbarErrorString: LocalState.get('SHOW_GLOBAL_SNACKBAR_WITH_STRING') || '',
  });
};

const depsMapper = (context, actions) => ({
  closeSnackbar: actions.onboarding.closeSnackbar,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(GlobalSnackbar);
