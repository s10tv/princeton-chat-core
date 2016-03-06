import Layout from '/client/modules/core/components/layout/layout.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

const composer = ({context}, onData) => {
  const {LocalState} = context()
  onData(null, {
    clickedToShowSidebar: LocalState.get('SHOW_SIDE_BAR') || false
  })
}

const depsMapper = (context, actions) => ({
  showSidebar: actions.global.showSidebar,
  toggleSidebar: actions.global.toggleSidebar,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Layout)
