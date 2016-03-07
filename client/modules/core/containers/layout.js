import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {connect} from 'react-redux'
import Layout from '/client/modules/core/components/layout/layout.jsx'

const mapStateToProps = (state) => ({
  sidebarOpen: state.core.sidebar.open,
  sidebarDocked: state.browser.greaterThan.small
})

export const composer = ({Meteor}, onData) => {
  if (Meteor.subscribe('userData').ready()) {
    onData(null, {})
  }
}

const depsMapper = (context, actions) => ({
  toggleSidebar: actions.sidebar.toggle,
  updateSidebar: actions.sidebar.update,
  store: context.store,
  Meteor: context.Meteor
})

export default composeAll(
  connect(mapStateToProps),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Layout)
