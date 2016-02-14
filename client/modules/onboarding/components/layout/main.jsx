import React, {PropTypes} from 'react'
import Radium from 'radium'
import {i18n} from '/client/configs/env'

class Main extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('primaryMuiTheme') }
  }
  render () {
    return (
      <main style={[style.main, style.background(this.props.backgroundUrl)]}>
        {this.props.children}
      </main>
    )
  }
}
Main.childContextTypes = {
  muiTheme: React.PropTypes.object
}
Main.propTypes = {
  backgroundUrl: PropTypes.string,
}

const style = {
  main: {
    flex: 6,
  },
  background(url) {
    return url ? {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : null
  }
}

export default Radium(Main)
