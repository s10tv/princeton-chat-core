import React from 'react'
import {i18n} from '/client/configs/env'

class Main extends React.Component {
  getChildContext () {
    return { muiTheme: i18n('primaryMuiTheme') }
  }
  render () {
    return (
      <main style={style.main}>
        {this.props.children}
      </main>
    )
  }
}
Main.childContextTypes = {
  muiTheme: React.PropTypes.object
}

const style = {
  main: {
    flex: 6,
    // backgroundImage: 'url(/images/bg-blair-arch-people.jpg)',
    // backgroundSize: 'cover',
  }
}

export default Main
