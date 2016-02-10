import React from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import MUITextField from 'material-ui/lib/text-field'
import COLORS from 'material-ui/lib/styles/colors'
import CircularProgress from 'material-ui/lib/circular-progress'
import { i18n } from '/imports/libs/mantra'

const BLUE = '#5477AD'
const WHITE = 'white'

const getTextField = ({ref, hintText, floatingLabelText, onBlur, errorText}) => {
  return <MUITextField
    ref={ref}
    hintText={hintText}
    floatingLabelText={floatingLabelText}
    onBlur={onBlur}
    errorText={errorText}
    inputStyle={{
      color: WHITE
    }}
    errorStyle={{
      color: '#16193B'
    }}
    hintStyle={{
      color: COLORS.grey300
    }}
    floatingLabelStyle={{
      color: COLORS.grey300
    }}
    underlineStyle={{
      color: COLORS.grey400
    }}
    underlineFocusStyle={{
      borderColor: WHITE
    }} />
}

class Button extends React.Component {
  render () {
    return <FlatButton {...this.props}
      style={{
        backgroundColor: WHITE,
        color: BLUE,
        padding: '4px 30px',
        fontSize: '18px',
        marginTop: '32px'
      }} />
  }
}

export default React.createClass({
  propTypes: {
    signup: React.PropTypes.func,
    isOnboardingSpinnerLoading: React.PropTypes.func
  },

  verifyEmail (event) {
    // mixpanel.track('Click: VerifyEmail')
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
      this.setState({errorFirstName: "C'mon, all musicians are given a first name!"})
      return false
    } else {
      this.setState({errorFirstName: ''})
      return true
    }
  },

  validateLastName () {
    const lastName = this.refs.lastNameInput.getValue()
    if (!lastName || lastName.trim().length === 0) {
      this.setState({errorLastName: 'What do your students call you?'})
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
        color={WHITE}
        style={{ padding: '10px 0px' }}/>
    ))

    return (
      <div className='signup-container'>
        <a className='login-link' href='/login'>Have an account? Login here.</a>
        <div className='splash' style={{ background: BLUE }}>
          <section>
            <h1 className='h1-logo' style={{color: WHITE, fontFamily: "'Quicksand', sans-serif"}}>
              {i18n('title')}
            </h1>
            <h2 className='h2-slogan' style={{color: WHITE, fontFamily: "'Quicksand', sans-serif", paddingTop: 15}}>
              {i18n('tagline')}
            </h2>

            {getTextField({ ref: 'emailInput',
              hintText: 'e.g. email@gmail.com',
              floatingLabelText: 'Email',
              errorText: this.state.errorEmail,
              onBlur: this.validateEmail.bind(this)
            })}
            {getTextField({ ref: 'firstNameInput',
              hintText: '',
              floatingLabelText: 'First Name',
              errorText: this.state.errorFirstName,
              onBlur: this.validateFirstName.bind(this)
            })}
            {getTextField({ ref: 'lastNameInput',
              hintText: '',
              floatingLabelText: 'Last Name',
              errorText: this.state.errorLastName,
              onBlur: this.validateLastName.bind(this)
            })}
            <Button label='Welcome' onClick={this.verifyEmail.bind(this)} />

            {loader}
          </section>
        </div>
      </div>
    )
  }
})
