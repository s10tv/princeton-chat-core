import React from 'react'
import Layout, {accentColor} from './layout.jsx'

export default React.createClass({
  propTypes: {
    recoveryLink: React.PropTypes.string
  },

  render () {
    return (
      <Layout>
        <div style={{
          background: '#fff',
          padding: 10
        }}>
          <h3>Our tiger forgot the password?</h3>
          <p style={{
            fontSize: 16
          }}>
            Don't worry, press the link below to recover your password. Tss, don't tell it to anyone,
            that's a secret shared only between the two of us. 🙃
          </p>
          <a target='_blank' href={this.props.recoveryLink} style={{
            backgroundColor: accentColor,
            color: 'white',
            textDecoration: 'none',
            padding: 10,
            borderRadius: 5,
            margin: '10px auto 20px auto',
            width: '200px',
            display: 'block',
            textAlign: 'center',
            fontWeight: 600
          }}>Recover Password</a>
          <div style={{
            fontSize: 12
          }}>
            <p style={{
              fontSize: 12,
              color: '#888'
            }}>Button didn't work? Copy and paste the link below into your browser's address bar.</p>
            <a target='_blank' href={this.props.recoveryLink}>
              {this.props.recoveryLink}
            </a>
          </div>
        </div>
      </Layout>
    )
  }
})
