import React from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import MUITextField from 'material-ui/lib/text-field'
import COLORS from 'material-ui/lib/styles/colors'
import CircularProgress from 'material-ui/lib/circular-progress'
import { i18n } from '/client/config/env'

// Images
const upArrow = '/images/Up_Arrow.png'
const icBenefit1 = '/images/Giveback.png'
const icBenefit2 = '/images/Housing_OfficeSpace.png'
const icBenefit3 = '/images/Jobs_and_Recommendations.png'
const icBenefit4 = '/images/Events.png'
const icBenefit5 = '/images/Discussions.png'
const icBenefit6 = '/images/Message.png'
const icQ = '/images/ic-q.png'
const icFB = '/images/ic-fb.png'
const icTwitter = '/images/ic-twitter.png'
const icEmail = '/images/ic-email.png'
const fbShare = '/images/facebook-share.png'
const twitterShare = '/images/twitter-share.png'

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
    // mixpanel.track('Click: VerifyEmail')
    const email = this.refs.emailInput.getValue()
    const firstName = this.refs.firstNameInput.getValue()
    const lastName = this.refs.lastNameInput.getValue()
    const classYear = this.refs.classYearInput.getValue()

    if (email && firstName && lastName && classYear &&
        email.length > 0 && firstName .length > 0 && lastName.length > 0 && classYear.length > 0 &&
        this.validateEmail() && this.validateFirstName() && this.validateLastName() && this.validateClassYear()) {
      return this.props.signup(email, firstName, lastName, classYear)
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

  validateClassYear () {
    const classYear = this.refs.classYearInput.getValue()
    if (!/^[0-9]{4}$/.test(classYear)) {
      this.setState({errorClassYear: 'Try entering a 4 digit year, such as 2012.'})
      return false
    } else {
      this.setState({errorClassYear: ''})
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
              hintText: 'e.g. tonyx@alumni.princeton.edu',
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
            {getTextField({ ref: 'classYearInput',
              hintText: 'e.g. 2012',
              floatingLabelText: 'Class Year',
              errorText: this.state.errorClassYear,
              onBlur: this.validateClassYear
            })}
            <Button label="Let's do it" onClick={this.verifyEmail} />

            {loader}
          </section>
          <a href='#' onClick={(e) => {
            e.preventDefault()
            console.log(window.innherHeight)
            window.scroll(0, window.innerHeight, {duration: 1500})
          }}>
            <img className='caret' src={upArrow} />
          </a>
        </div>

        <div className='content-container'>
          <div className='qa-and-purpose'>
            <div className='qa'>
              <div className='qa-inner'>
                <img className='q' src={icQ} />
                <div>
                  <p>
                    Should a San Francisco alumus get notified that a New York tiger listed an apartment for rent?
                  </p>
                  <p>
                    No, but we
                    <a
                      href='https://www.facebook.com/groups/180883032032220/permalink/802919829828534/'
                      target='_blank'
                      title='Not picking on you Laura, I promise!'>
                        do it anyways
                    </a>.
                    Now there is a better way.
                  </p>
                </div>
              </div>
            </div>

            <div className='purpose'>
              <p>
                <span className='logo-inline'>{i18n('title')}</span> is a community built for Princeton alums by
                  Princeton alums. You only get notified on
                <b>topics you follow</b>.
                  We help you reach exactly the
                <b>right people</b>
                  so we can do great things together.
              </p>
            </div>
          </div>

          <div className='benefits'>
            <section>
              <img src={icBenefit1} />
              <h2>Give back, get help</h2>
              <p>
                Share your expertise with young alums working on their <span className='hashtag'>#startups</span>, or find eager and helpful early customers.
              </p>
            </section>
            <section>
              <img src={icBenefit2} />
              <h2>Housing / Office Space</h2>
              <p>Rent your <span className='hashtag'>#NYC</span> apartment to a trusted member from the alumni community.</p>
            </section>
            <section>
              <img src={icBenefit3} />
              <h2>Jobs & Candidates</h2>
              <p>Help your company hire a star programmer from the <span className='hashtag'>#Software</span> channel.</p>
            </section>
            <section>
              <img src={icBenefit4} />
              <h2>Events</h2>
              <p>Organize spontaneous get-together for tigers in <span className='hashtag'>#BayArea</span>.</p>
            </section>
            <section>
              <img src={icBenefit5} />
              <h2>Discussions</h2>
              <p>Discuss topics you care about, from <span className='hashtag'>#Elections</span> to <span className='hashtag'>#NonProfit</span>.</p>
            </section>
            <section>
              <img src={icBenefit6} />
              <h2>Direct Message</h2>
              <p>Instantly connect with anyone in the directory via direct message.</p>
            </section>
          </div>
          <div className='bottom-cta'>
            <h2>PS: Help spread the word</h2>
            <div className='spread-word'>
              <a target='_blank' href='https://www.facebook.com/sharer/sharer.php?u=princeton.chat'><img src={fbShare} /></a>
              <a target='_blank' href='https://twitter.com/home?status=Princeton%20alums%20out%20there,%20join%20me%20on%20Princeton.Chat%20%40PrincetonChat%20%40Princeton'><img src={twitterShare} /></a>
            </div>
          </div>
          <blockquote className='quote'>
            Princeton in the Nation's Service <br /> & in the Service of All Nations.
          </blockquote>
        </div>

        <footer className='footer'>
          <h4>Get in touch</h4>
          <div>
            <a target='_blank' href='https://www.facebook.com/Princeton-Chat-987782677950236/'><img src={icFB} /></a>
            <a target='_blank' href='https://twitter.com/PrincetonChat'><img src={icTwitter} /></a>
            <a target='_blank' href='mailto:tony@princeton.chat?subject=rawrrr'><img src={icEmail} /></a>
          </div>
          <span className='footer-logo'>© {i18n('title')} 2016</span>
        </footer>
      </div>
    )
  }
})
