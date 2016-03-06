import Layout from '/client/modules/core/components/layout/layout.jsx'
import {useDeps, composeAll} from 'mantra-core'
import {composeWithRedux} from '/client/lib/helpers'

const composer = ({context}) => {
  const {store} = context()
  const state = store.getState().core
  return {
    showSidebar: state.sidebar
  }
}

const depsMapper = (context, actions) => ({
  toggleSidebar: actions.sidebar.toggle,
  context: () => context
})

export default composeAll(
  composeWithRedux(composer),
  useDeps(depsMapper)
)(Layout)
