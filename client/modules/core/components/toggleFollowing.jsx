import React from 'react'
import {Block} from 'jsxstyle'
import {Style} from 'radium'

const RED = 'red'

const SimpleLogo = (props) => (
  <h1 style={Object.assign({}, {
    color: '#F07621',
    fontSize: 20,
    fontWeight: 600,
    margin: 0
  }, props.style)} {...props}>Princeton.Chat</h1>
)

const GuestToggleFollow = (props) => (
  <Block className='guest' padding={30}>
    <Style rules={{
      body: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Avenir Next", sans-serif'
      }
    }} />
    <Style scopeSelector='.guest' rules={{
      a: {
        color: '#4A90E2',
        textDecoration: 'underline'
      },
      'a:hover': {
        color: '#F07621'
      }
    }} />
    <SimpleLogo />
    {props.isFollowing
      ? <p>You are now <span style={{color: '#F07621'}}>following</span></p>
      : <p>You just <span style={{color: RED}}>unfollowed</span></p>}
    <p>
      <strong>{props.title}</strong>
    </p>
    <p>
      {props.isFollowing
        ? 'and will be notified when others reply'
        : 'and will stop receiving notifications.'}
    </p>
    <br />
    <br />
    <br />
    <p>
      Changed your mind?
      <a style={{marginLeft: 8}}
        href={props.isFollowing ? props.unfollowLink : props.followLink}>
        {props.isFollowing
          ? 'Unfollow'
          : 'Follow again'}
      </a>
    </p>
    <p>
      <a href={props.editTopicsLink}>Edit My Channels</a>
    </p>
  </Block>
)

GuestToggleFollow.propTypes = {
  title: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  followLink: React.PropTypes.func.isRequired,
  unfollowLink: React.PropTypes.func.isRequired
}

export default GuestToggleFollow
