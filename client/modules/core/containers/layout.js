import {useDeps, composeAll} from 'mantra-core'
import {connect} from 'react-redux'
import Layout from '/client/modules/core/components/layout/layout.jsx'

const mapStateToProps = (state) => ({
  sidebarOpen: state.core.sidebar.open,
  sidebarDocked: state.browser.greaterThan.small
})

const depsMapper = (context, actions) => ({
  toggleSidebar: actions.sidebar.toggle,
  updateSidebar: actions.sidebar.update,
  store: context.store,
  Meteor: context.Meteor
})

export default composeAll(
  connect(mapStateToProps),
  useDeps(depsMapper)
)(Layout)
