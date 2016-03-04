import React, {PropTypes} from 'react'
import Radium from 'radium'
import {i18n} from '/src/client/configs/env'
import GlobalSnackbar from '/src/client/modules/core/containers/global.snackbar'

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
    marginLeft: '40%',
    '@media (max-width: 768px)': {
      display: 'none',
      marginLeft: 0
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
