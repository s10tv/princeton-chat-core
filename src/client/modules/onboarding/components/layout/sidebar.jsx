import React from 'react'
import {i18n} from '/src/client/configs/env'
import {color} from '/src/client/configs/theme'
import Radium from 'radium'

class Sidebar extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('secondaryMuiTheme') }
  }
  render () {
    return (
      <section style={style.sidebar}>
        <div className='no-scrollbar' style={style.scrollableDiv}>
          {this.props.children}
        </div>
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
    minHeight: '100%',
    flexDirection: 'column',
    backgroundColor: color.black,
    color: color.white,
    '@media (max-width: 768px)': {
      position: 'initial',
      width: 'initial',
      height: 'initial'
    }
  },
  scrollableDiv: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    height: '100vh'
  }
}

export default Radium(Sidebar)
