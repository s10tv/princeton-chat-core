import React from 'react'
import Layout, { accentColor } from './layout.jsx'

export default React.createClass({
  propTypes: {
    senderName: React.PropTypes.string,
    firstName: React.PropTypes.string,
    inviteUrl: React.PropTypes.string
  },

  render () {
    const { senderName, firstName, inviteUrl } = this.props;

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
            You were just invited to Princeton.Chat{senderName ? ` by ${senderName}` : ''}!
          </p>
          <a target='_blank' href={inviteUrl} style={{
            backgroundColor: accentColor,
            color: 'white',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px auto 20px auto',
            width: '200px',
            display: 'block',
            textAlign: 'center',
            fontWeight: 600

          }}>Welcome</a>
          <div style={{
            fontSize: '12px'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#888'
            }}>Button didn't work? Copy and paste the link below into your browser's address bar.</p>
            <a target='_blank' href={inviteUrl}>
              {inviteUrl}
            </a>
          </div>
        </div>
      </Layout>
    )
  }
})
