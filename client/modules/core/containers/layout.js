import Layout from '/client/modules/core/components/layout/layout.jsx'
import {useDeps, composeAll} from 'mantra-core'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
  showSidebar: state.core.sidebar
})

const mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => {
    dispatch({type: 'SIDEBAR_TOGGLE'})
  },
  updateSidebar: (open) => {
    dispatch({type: 'SIDEBAR_UPDATE', open})
  }
})

const depsMapper = (context, actions) => ({
  context: () => context,
  store: context.store
})

export default composeAll(
  connect(mapStateToProps, mapDispatchToProps),
  useDeps(depsMapper)
)(Layout)
