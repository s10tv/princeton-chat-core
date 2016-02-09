import React from 'react';
import CSSModules from 'react-css-modules';
import FlatButton from 'material-ui/lib/flat-button';
import MUITextField from 'material-ui/lib/text-field';
import COLORS from 'material-ui/lib/styles/colors';
import CircularProgress from 'material-ui/lib/circular-progress';
import { i18n } from '/imports/libs/mantra'

// Images
const upArrow = '/assets/Up_Arrow.png';
const icBenefit1 = '/assets/Giveback.png';
const icBenefit2 = '/assets/Housing_OfficeSpace.png';
const icBenefit3 = '/assets/Jobs_and_Recommendations.png';
const icBenefit4 = '/assets/Events.png';
const icBenefit5 = '/assets/Discussions.png';
const icBenefit6 = '/assets/Message.png';
const icQ = '/assets/ic-q.png';
const icFB = '/assets/ic-fb.png';
const icTwitter = '/assets/ic-twitter.png';
const icEmail = '/assets/ic-email.png';
const fbShare = '/assets/facebook-share.png';
const twitterShare = '/assets/twitter-share.png';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const getTextField = ({ ref, hintText, floatingLabelText, onBlur, errorText}) => {
  return <MUITextField
    ref={ref}
    hintText={hintText}
    floatingLabelText={floatingLabelText}
    onBlur={onBlur}
    errorText={errorText}
    inputStyle={{
      color: PRINCETON_WHITE,
      // color: COLORS.grey700,
    }}
    hintStyle={{
      color: COLORS.grey600,
    }}
    floatingLabelStyle={{
      color: COLORS.grey400,
      // color: PRINCETON_WHITE,
      // color: PRINCETON_ORANGE,
    }}
    underlineStyle={{
      color: COLORS.grey400,
      // borderColor: PRINCETON_ORANGE,
    }}
    underlineFocusStyle={{
      borderColor: PRINCETON_ORANGE,
    }} />
}

class Button extends React.Component {
  render() {
    return <FlatButton {...this.props}
      style={{
      backgroundColor: PRINCETON_ORANGE,
      color: PRINCETON_WHITE,
      padding: '4px 30px',
      fontSize: '18px',
      marginTop: '32px',
    }} />
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.validateEmail = this.validateEmail.bind(this);
  }

  verifyEmail(event) {
    // mixpanel.track('Click: VerifyEmail')
    const email = this.refs.emailInput.getValue();
    const firstName = this.refs.firstNameInput.getValue();
    const lastName = this.refs.lastNameInput.getValue();

    if (email && firstName && lastName &&
        email.length > 0 && firstName .length > 0 && lastName.length > 0 &&
        this.validateEmail() && this.validateFirstName() && this.validateLastName()) {

        return this.props.signup(email, firstName, lastName, '');
    }
  }

  validateEmail() {
    const email = this.refs.emailInput.getValue();
    if (!/\S+@\S+\.\S+/.test(email)) {
      this.setState({errorEmail: 'Email is required'});
      return false;
    } else {
      this.setState({errorEmail: ""});
      return true;
    }
  }

  validateFirstName() {
    const firstName = this.refs.firstNameInput.getValue();
    if (!firstName || firstName.trim().length == 0) {
      this.setState({errorFirstName: "C'mon, all tigers are given a first name!"});
      return false;
    } else {
      this.setState({errorFirstName: ""});
      return true;
    }
  }

  validateLastName() {
    const lastName = this.refs.lastNameInput.getValue();
    if (!lastName || lastName.trim().length == 0) {
      this.setState({errorLastName: "How do you get called in the army?"});
      return false;
    } else {
      this.setState({ errorLastName: ""});
      return true;
    }
  }

  render() {
    const loader = (!this.props.isOnboardingSpinnerLoading ?  (
        <div></div>
      ) : (
        <CircularProgress mode="indeterminate"
          ref="loader"
          size={0.5}
          color={PRINCETON_WHITE}
          style={{ padding: '10px 0px' }}/>
    ));

    const footerLoader = (!this.props.isOnboardingSpinnerLoading ?  (
        null
      ) : (
        <CircularProgress mode="indeterminate"
          ref="loader"
          size={0.5}
          color={PRINCETON_ORANGE}
          style={{ padding: '10px 0px' }}/>
    ));

    return (
      <div className='signup-container'>
        <a className='login-link' href='/login'>Have an account? Login here.</a>
        <div className='splash'>
          <section>
            <h1 className='h1-logo'>{i18n('title')}</h1>
            <h2 className='h2-slogan'>{i18n('tagline')}</h2>

            { getTextField({ ref:"emailInput",
              hintText: `e.g. ${i18n('placeholderEmail')}`,
              floatingLabelText:"Email",
              errorText: this.state.errorEmail,
              onBlur: this.validateEmail.bind(this)
            })}
            { getTextField({ ref:"firstNameInput",
              hintText: '',
              floatingLabelText:"First Name",
              errorText: this.state.errorFirstName,
              onBlur: this.validateFirstName.bind(this)
            })}
            { getTextField({ ref:"lastNameInput",
              hintText: '',
              floatingLabelText:"Last Name",
              errorText: this.state.errorLastName,
              onBlur: this.validateLastName.bind(this)
            })}
            <Button label="Let's do it" onClick={this.verifyEmail.bind(this)} />

            { loader }
          </section>
        </div>
      </div>
    );
  }
}

export default Home
