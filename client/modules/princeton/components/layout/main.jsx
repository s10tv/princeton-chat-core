import React, {PropTypes} from 'react'
import Radium from 'radium'
import {i18n} from '/client/configs/env'
import GlobalSnackbar from '/client/modules/core/containers/global.snackbar'

class Main extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('primaryMuiTheme') }
  }
  render () {
    console.log(this.props.isMobile && style.mobile)
    return (
      <main style={[style.main, style.background(this.props.backgroundUrl),
          this.props.isMobile && style.mobile]}>
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
    flex: 6
  },
  background (url) {
    return url ? {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : null
  },
  mobile: {
    display: 'none'
  }
}

export default Radium(Main)
