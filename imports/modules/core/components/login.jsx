import React from 'react'
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import GlobalSnackbar from '/imports/modules/core/containers/global.snackbar.js'

import { i18n } from '/imports/libs/mantra'

export default React.createClass({
  propTypes: {
    /**
     * The function to call to attempt login with a password.
     */
    loginWithPassword: React.PropTypes.func.isRequired,

    /**
     * The function to call to attempt login with facebook.
     */
    loginWithFacebook: React.PropTypes.func.isRequired
  },

  mixins: [LinkedStateMixin],

  getInitialState () {
    return {}
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext () {
    return {
      muiTheme: i18n('primaryMuiTheme')
    }
  },

  handleSubmit (event) {
    event.preventDefault()
    this.props.loginWithPassword(this.state['email'], this.state['password'])
  },

  render () {
    return (
      <Flex
        minHeight='100vh'
        minWidth='100vw'
        justifyContent='center'
        alignItems='center'
        position='relative'
        style={i18n('backgroundStyle')}
      >
        <a className='login-link' href='/'>No account yet? Signup here.</a>
        <Flex flexDirection='column'
          backgroundColor='white'
          borderRadius={5}
          style={{
            width: '80%', height: '80%', maxWidth: 360, maxHeight: 480,
            padding: 36,
            margin: 24
          }}>
          <h1 style={Object.assign({}, {
            fontSize: 30, color: '#F07621', textAlign: 'center', fontWeight: 600
          }, i18n('loginTitle'))}>{i18n('title')}</h1>

          <RaisedButton label='Login with Facebook'
            secondary backgroundColor='#3b5998'
            onTouchTap={this.props.loginWithFacebook}
            style={{
              alignSelf: 'center'
            }} />
          <Flex alignItems='center' marginTop={32}>
            <hr style={{flex: 1}} />
            <span style={{margin: '0 16px'}}>Or</span>
            <hr style={{flex: 1}} />
          </Flex>
          <form action='/login' onSubmit={this.handleSubmit} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <TextField floatingLabelText='Email' fullWidth
              valueLink={this.linkState('email')}/>
            <TextField floatingLabelText='Password' type='password' fullWidth
              valueLink={this.linkState('password')} />
            <RaisedButton label='Login' primary style={{margin: '30px 5px'}} type='submit' />
          </form>
        </Flex>

        <GlobalSnackbar />
      </Flex>
    )
  }
})
