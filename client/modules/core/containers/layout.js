import {useDeps, composeAll} from 'mantra-core'
import {connect} from 'react-redux'
import Layout from '/client/modules/core/components/layout/layout.jsx'
import * as Types from '../configs/actionTypes'
import {bindContext} from '/client/lib/helpers'

const mapStateToProps = (state) => ({
  sidebarOpen: state.core.sidebar.get('open'),
  sidebarDocked: state.core.sidebar.get('docked')
})

const depsMapper = (context, actions) => ({
  toggleSidebar: bindContext(Types.sidebarToggle, context),
  onRequestChange: bindContext(Types.sidebarOnRequestChange, context),
  store: context.store,
  context: context,
  Meteor: context.Meteor
})

export default composeAll(
  connect(mapStateToProps),
  useDeps(depsMapper)
)(Layout)
