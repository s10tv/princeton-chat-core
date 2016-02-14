import React from 'react'
import Layout from './layout.jsx'

export default React.createClass({
  propTypes: {
    inviteLink: React.PropTypes.string
  },

  render () {
    return (
      <Layout>
        <div>
          <h3>Welcome Tiger!</h3>
          <p>
            Thank you for signing up for Princeton.Chat. We can't wait to have you onboard.
            Please press the link below to activate your account.
          </p>
          <a target='_blank' href={this.props.inviteLink}>Verify Account</a>
          <div>
            <p>Button didn't work? Copy and paste the link below into your browser's address bar.</p>
            <a target='_blank' href={this.props.inviteLink}>
              {this.props.inviteLink}
            </a>
          </div>
        </div>
      </Layout>
    )
  }
})
