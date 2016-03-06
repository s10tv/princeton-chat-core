import Layout from '/client/modules/core/components/layout/layout.jsx'
import {useDeps, composeAll} from 'mantra-core'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
  showSidebar: state.core.sidebar,
  isMobile: state.browser.lessThan.medium
})

const depsMapper = (context, actions) => ({
  toggleSidebar: actions.sidebar.toggle,
  updateSidebar: actions.sidebar.update,
  store: context.store
})

export default composeAll(
  connect(mapStateToProps),
  useDeps(depsMapper)
)(Layout)
