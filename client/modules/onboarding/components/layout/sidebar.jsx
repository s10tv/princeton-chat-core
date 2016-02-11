import React from 'react'
import {i18n} from '/client/config/env'
import {color, spacing} from '/client/config/theme'

class Sidebar extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('secondaryMuiTheme') }
  }
  render () {
    return (
      <section style={style.sidebar}>
        {this.props.children}
      </section>
    )
  }
}
Sidebar.childContextTypes = {
  muiTheme: React.PropTypes.object
}

const style = {
  sidebar: {
    flex: 4,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: color.black,
    color: color.white,
  },
}

export default Sidebar
