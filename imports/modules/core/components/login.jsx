import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Card from 'material-ui/lib/card/card'
import TextField from 'material-ui/lib/text-field'
import Colors from 'material-ui/lib/styles/colors'
import RaisedButton from 'material-ui/lib/raised-button'
import {primaryMuiTheme} from './helpers.jsx'
import LinkedStateMixin from 'react-addons-linked-state-mixin'

export default React.createClass({
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
    this.props.loginWithPassword(this.state.username, this.state.password);
    // this.setState({
    //   username: '',
    //   password: '',
    // })
  },
  render() {
    return (
      <Flex minHeight='100vh' minWidth='100vw' justifyContent='center' alignItems='center' backgroundColor={Colors.grey900}>
        <Card style={{
            width: '80%', height: '80%', maxWidth: 360, maxHeight: 480,
            padding: 36,
            margin: 24,
          }}>
          <h1 style={{fontSize: 30, color: '#F07621', textAlign: 'center'}}>Princeton.Chat</h1>
          <form action='/login' onSubmit={this.handleSubmit}>
            <TextField floatingLabelText='Username' fullWidth={true} valueLink={this.linkState('username') }/>
            <TextField floatingLabelText='Password' type='password' fullWidth={true} valueLink={this.linkState('password')} />
            <RaisedButton label='Login' primary={true} style={{marginTop: 30}} type='submit' />
          </form>
        </Card>
      </Flex>
    )
  }
})
