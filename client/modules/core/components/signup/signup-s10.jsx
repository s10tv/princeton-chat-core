import React from 'react'
import FlatButton from '../../../../../node_modules/material-ui/lib/flat-button'
import MUITextField from '../../../../../node_modules/material-ui/lib/text-field'
import COLORS from '../../../../../node_modules/material-ui/lib/styles/colors'
import CircularProgress from '../../../../../node_modules/material-ui/lib/circular-progress'
import { i18n } from '/client/config/env'

const PRINCETON_ORANGE = '#F07621'
const PRINCETON_WHITE = 'white'

const getTextField = ({ref, hintText, floatingLabelText, onBlur, errorText}) => {
  return <MUITextField
    ref={ref}
    hintText={hintText}
    floatingLabelText={floatingLabelText}
    onBlur={onBlur}
    errorText={errorText}
    inputStyle={{
      color: PRINCETON_WHITE
    }}
    hintStyle={{
      color: COLORS.grey600
    }}
    floatingLabelStyle={{
      color: COLORS.grey400
    }}
    underlineStyle={{
      color: COLORS.grey400
    }}
    underlineFocusStyle={{
      borderColor: PRINCETON_ORANGE
    }} />
}

class Button extends React.Component {
  render () {
    return <FlatButton {...this.props}
      style={{
        backgroundColor: PRINCETON_ORANGE,
        color: PRINCETON_WHITE,
        padding: '4px 30px',
        fontSize: '18px',
        marginTop: '32px'
      }} />
  }
}

export default React.createClass({
  propTypes: {
    isOnboardingSpinnerLoading: React.PropTypes.bool,
    signup: React.PropTypes.func
  },

  getInitialState () {
    return {}
  },

  verifyEmail (event) {
    const email = this.refs.emailInput.getValue()
    const firstName = this.refs.firstNameInput.getValue()
    const lastName = this.refs.lastNameInput.getValue()

    if (email && firstName && lastName &&
        email.length > 0 && firstName .length > 0 && lastName.length > 0 &&
        this.validateEmail() && this.validateFirstName() && this.validateLastName()) {
      return this.props.signup(email, firstName, lastName, '')
    }
  },

  validateEmail () {
    const email = this.refs.emailInput.getValue()
    if (!/\S+@\S+\.\S+/.test(email)) {
      this.setState({errorEmail: 'Email is required'})
      return false
    } else {
      this.setState({errorEmail: ''})
      return true
    }
  },

  validateFirstName () {
    const firstName = this.refs.firstNameInput.getValue()
    if (!firstName || firstName.trim().length === 0) {
      this.setState({errorFirstName: "C'mon, all tigers are given a first name!"})
      return false
    } else {
      this.setState({errorFirstName: ''})
      return true
    }
  },

  validateLastName () {
    const lastName = this.refs.lastNameInput.getValue()
    if (!lastName || lastName.trim().length === 0) {
      this.setState({errorLastName: 'How do you get called in the army?'})
      return false
    } else {
      this.setState({errorLastName: ''})
      return true
    }
  },

  render () {
    const loader = (!this.props.isOnboardingSpinnerLoading ? (
      <div></div>
    ) : (
      <CircularProgress mode='indeterminate'
        ref='loader'
        size={0.5}
        color={PRINCETON_WHITE}
        style={{ padding: '10px 0px' }}/>
    ))

    return (
      <div className='signup-container'>
        <a className='login-link' href='/login'>Have an account? Login here.</a>
        <div className='splash'>
          <section>
            <h1 className='h1-logo'>{i18n('title')}</h1>
            <h2 className='h2-slogan'>{i18n('tagline')}</h2>

            {getTextField({ ref: 'emailInput',
              hintText: 'e.g. tonyx@gmail.com',
              floatingLabelText: 'Email',
              errorText: this.state.errorEmail,
              onBlur: this.validateEmail
            })}
            {getTextField({ ref: 'firstNameInput',
              hintText: '',
              floatingLabelText: 'First Name',
              errorText: this.state.errorFirstName,
              onBlur: this.validateFirstName
            })}
            {getTextField({ ref: 'lastNameInput',
              hintText: '',
              floatingLabelText: 'Last Name',
              errorText: this.state.errorLastName,
              onBlur: this.validateLastName
            })}
            <Button label="Let's do it" onClick={this.verifyEmail} />

            {loader}
          </section>
        </div>
      </div>
    )
  }
})
