import React from 'react'
import {i18n} from '/client/configs/env'
import {color} from '/client/configs/theme'
import Radium from 'radium'

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

Sidebar.propTypes = {
  children: React.PropTypes.node
}

const style = {
  sidebar: {
    flex: 4,
    minWidth: 320,
    display: 'flex',
    position: 'fixed',
    width: '40%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: color.black,
    color: color.white,
    '@media (max-width: 768px)': {
      position: 'initial',
      width: 'initial',
      height: 'initial'
    }
  }
}

export default Radium(Sidebar)
