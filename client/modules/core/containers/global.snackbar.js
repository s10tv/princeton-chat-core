import GlobalSnackbar from '/client/modules/core/components/globalsnackbar.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

export const composer = ({context}, onData) => {
  const { LocalState } = context()

  const snackbarString = LocalState.get('SHOW_GLOBAL_SNACKBAR_WITH_STRING')
  const isSnackbarOpen = snackbarString !== undefined &&
    typeof snackbarString === 'string' &&
    snackbarString.length > 0

  onData(null, {
    isSnackbarOpen,
    snackbarErrorString: snackbarString || ''
  })
}

const depsMapper = (context, actions) => ({
  closeSnackbar: actions.onboarding.closeSnackbar,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(GlobalSnackbar)
