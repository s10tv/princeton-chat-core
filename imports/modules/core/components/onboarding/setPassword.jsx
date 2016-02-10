import React from 'react'
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import styles from '/imports/modules/core/components/styles.jsx'

export default React.createClass({

  propTypes: {
    addPassword: React.PropTypes.func.isRequired,
    shouldShowPasswordFields: React.PropTypes.bool.isRequired,
    clickFacebook: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      passwordText: ''
    }
  },

  handleChange (event) {
    this.setState({passwordText: event.target.value})
  },

  setPassword () {
    const password = this.refs.passwordField.getValue()
    this.props.addPassword(password)
  },

  render () {
    const { shouldShowPasswordFields, clickFacebook } = this.props

    return (
      <div className='choose-password-section'>
        <div className='password-chooser'>
          <TextField
            ref='passwordField'
            type='password'
            floatingLabelText='Choose Password'
            onChange={this.handleChange}
            disabled={!shouldShowPasswordFields}
            onEnterKeyDown={this.setPassword} />
        </div>

        {this.state.passwordText.length === 0 ? null : (
          <div className='password-chooser'>
            <FlatButton
              label='Set Password'
              style={shouldShowPasswordFields ? styles.primaryButton : styles.disabledButton}
              disabled={!shouldShowPasswordFields}
              onClick={this.setPassword} />
          </div>
        )}

        {this.state.passwordText.length > 0 ? null : (
          <div className='password-chooser' style={{padding: '0px 8px'}}>
            OR
          </div>
        )}

        {this.state.passwordText.length > 0 ? null : (
          <div className='password-chooser'>
            <FlatButton
              label='Link Facebook'
              style={shouldShowPasswordFields ? styles.facebookButton : styles.disabledButton}
              rippleColor='white'
              disabled={!shouldShowPasswordFields}
              onClick={clickFacebook} />
          </div>
        )}
      </div>
    )
  }
})
