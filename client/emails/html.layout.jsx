import React from 'react'

export default React.createClass({
  render () {
    return (
      <body style={{
        width: '100% !important',
        height: '100%',
        margin: 0,
        lineHeight: '1.4',
        color: '#74787E',
        backgroundColor: '#192024'
      }}>
        {this.props.children}
      </body>
    )
  }
})
