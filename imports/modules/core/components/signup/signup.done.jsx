import React from 'react'
import {i18n} from '/imports/libs/mantra'

const envelopeIcon = '/images/ic-envelope.png'

export default React.createClass({
  propTypes: {
    fromApprovedDomain: React.PropTypes.bool,
    emailAddress: React.PropTypes.string
  },

  render () {
    return (
      <div className='signedup-container'>
        <div className='itemContainer'>
          <div className='upperItemContainer'>
            <div><img alt='Envelope Icon' src={envelopeIcon}/></div>
            {this.props.fromApprovedDomain
               ? (<h1>You are signed up!</h1>)
               : <h1>All set for now</h1>
            }
            {this.props.fromApprovedDomain ? <h3>Now go check your email</h3> : null}
          </div>
          <div className='lowerItemContainer'>
            <p className='email'>{this.props.emailAddress}</p>
            {
              this.props.fromApprovedDomain
              ? <p>(The email contains a magic link to get you set up.)</p>
              : <p>We will send you an email in a bit to get you set up
                after we verify your association with {i18n('community')}.</p>
            }

          </div>
        </div>
      </div>
    )
  }
})
