import React from 'react'
import Layout, { accentColor } from './layout.jsx'

export default React.createClass({
  propTypes: {
    inviteLink: React.PropTypes.string
  },

  render () {
    return (
      <Layout>
        <div style={{
          background: '#fff',
          padding: 10
        }}>
          <h3>Welcome!</h3>
          <p style={{
            fontSize: '16px'
          }}>
            Thank you for signing up for Pedagogy and Play. We can't wait to have you on board.
            Please press the link below to activate your account.
          </p>
          <a target='_blank' href={this.props.inviteLink} style={{
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

          }}>Verify Account</a>
          <div style={{
            fontSize: '12px'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#888'
            }}>Button didn't work? Copy and paste the link below into your browser's address bar.</p>
            <a target='_blank' href={this.props.inviteLink}>
              {this.props.inviteLink}
            </a>
          </div>
        </div>
      </Layout>
    )
  }
})
