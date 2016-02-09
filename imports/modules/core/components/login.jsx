import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Card from 'material-ui/lib/card/card'
import TextField from 'material-ui/lib/text-field'
import Colors from 'material-ui/lib/styles/colors'
import RaisedButton from 'material-ui/lib/raised-button'
import FlatButton from 'material-ui/lib/flat-button'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import {primaryMuiTheme} from '/imports/modules/core/components/helpers.jsx'

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
    loginWithFacebook: React.PropTypes.func.isRequired,
  },
  mixins: [LinkedStateMixin],
  getInitialState() {
    return {}
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: primaryMuiTheme,
    }
  },
  handleSubmit(event) {
    event.preventDefault()
    this.props.loginWithPassword(this.state['email'], this.state['password'])
  },
  render() {
    return (
      <Flex minHeight='100vh'
        minWidth='100vw'
        justifyContent='center'
        alignItems='center'
        backgroundImage="url('/assets/background-tile.png')"
        position='relative'
        backgroundRepeat='repeat'>
        <a className='login-link' href='/'>No account yet? Signup here.</a>
        <Flex flexDirection='column'
          backgroundColor='white'
          borderRadius={5}
          style={{
            width: '80%', height: '80%', maxWidth: 360, maxHeight: 480,
            padding: 36,
            margin: 24,
          }}>
          <h1 style={{
              fontSize: 30, color: '#F07621', textAlign: 'center', fontWeight: 600,
          }}>{i18n('title')}</h1>
          <RaisedButton label='Login with Facebook'
            secondary={true} backgroundColor='#3b5998'
            onTouchTap={this.props.loginWithFacebook}
            style={{
              alignSelf: 'center',
            }} />
          <Flex alignItems='center' marginTop={32}>
            <hr style={{flex: 1}} />
            <span style={{margin: '0 16px'}}>Or</span>
            <hr style={{flex: 1}} />
          </Flex>
          <form action='/login' onSubmit={this.handleSubmit} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
            <TextField floatingLabelText='Email' fullWidth={true} valueLink={this.linkState('email') }/>
            <TextField floatingLabelText='Password' type='password' fullWidth={true} valueLink={this.linkState('password')} />
            <RaisedButton label='Login' primary={true} style={{margin: '30px 5px'}} type='submit' />
          </form>
        </Flex>
      </Flex>
    )
  }
})
