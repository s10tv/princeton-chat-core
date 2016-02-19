import React, {PropTypes} from 'react'
import Radium from 'radium'
import {i18n} from '/client/configs/env'
import GlobalSnackbar from '/client/modules/core/containers/global.snackbar'

class Main extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('primaryMuiTheme') }
  }
  render () {
    return (
      <main style={[style.main, style.background(this.props.backgroundUrl)]}>
        {this.props.children}
        <GlobalSnackbar />
      </main>
    )
  }
}
Main.childContextTypes = {
  muiTheme: React.PropTypes.object
}
Main.propTypes = {
  backgroundUrl: PropTypes.string,
  isMobile: React.PropTypes.bool,
  children: React.PropTypes.node
}

const style = {
  main: {
    flex: 6,
    display: 'flex',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  background (url) {
    return url ? {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : null
  }
}

export default Radium(Main)
