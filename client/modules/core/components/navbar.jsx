import React from 'react'

export default class NavBar extends React.Component {
  render () {
    const s = {
      width: '100%', // For static containers
      alignSelf: 'stretch', // For flex containers
      boxSizing: 'border-box',
      padding: '0 16px',
      borderBottom: '1px solid #eee',
      flexShrink: '0',
      display: 'flex',
      alignItems: 'center'
    }
    const sInner = {
      paddingTop: 5,
      flexGrow: 1
    }
    return (
      <header style={{...s, ...this.props.style}}>
        <div style={{...sInner}}>
          {this.props.children}
        </div>
      </header>
    )
  }
}
NavBar.propTypes = {
  style: React.PropTypes.object,
  children: React.PropTypes.object
}
