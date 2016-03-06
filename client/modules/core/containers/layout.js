import Layout from '/client/modules/core/components/layout/layout.jsx'
import {useDeps, composeAll, compose} from 'mantra-core'

const composer = ({context}, onData) => {
  const {store} = context()
  const state = store.getState().core
  onData(null, {
    showSidebar: state.sidebar
  })
  return store.subscribe(() => {
    const state = store.getState().core
    onData(null, {
      showSidebar: state.sidebar
    })
  })
}

const depsMapper = (context, actions) => ({
  toggleSidebar: actions.sidebar.toggle,
  context: () => context
})

export default composeAll(
  compose(composer),
  useDeps(depsMapper)
)(Layout)
