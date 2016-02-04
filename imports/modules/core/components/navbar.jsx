import React from 'react'

export default class NavBar extends React.Component {
  render() {
    const s = {
      height: 76,
      width: '100%', // For static containers
      alignSelf: 'stretch', // For flex containers
      boxSizing: 'border-box',
      padding: '0 16px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
    }
    return (
      <header style={{...s, ...this.props.style}}>
        {this.props.children}
      </header>
    )
  }
}
NavBar.propTypes = {
  style: React.PropTypes.object,
}
