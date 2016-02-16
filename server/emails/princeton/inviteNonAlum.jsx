import React from 'react'
import Layout, { accentColor } from './layout.jsx'

export default React.createClass({
  propTypes: {
    senderName: React.PropTypes.string,
    firstName: React.PropTypes.string,
    rootURL: React.PropTypes.string
  },

  render () {
    const { senderName, firstName, rootURL } = this.props;

    return (
      <Layout>
        <div style={{
          background: '#fff',
          padding: 10
        }}>
          <h3>{firstName ? `Hey ${firstName},` : 'Hello!'}</h3>
          <p style={{
            fontSize: '16px'
          }}>
            You were just invited to Princeton.Chat {senderName ? `by ${senderName}` : ''}!
            Come check it out at <a href={rootURL}>{rootURL}</a>
          </p>
        </div>
      </Layout>
    )
  }
})
