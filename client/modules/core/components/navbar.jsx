import React from 'react'

export default class NavBar extends React.Component {
  render () {
    const s = {
      height: 72,
      width: '100%', // For static containers
      alignSelf: 'stretch', // For flex containers
      boxSizing: 'border-box',
      padding: '0 16px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center'
    }
    const sInner = {
      paddingTop: 5
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
