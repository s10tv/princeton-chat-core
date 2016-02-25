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
      : <p>You just <span style={{color: RED}}>unfollowed</span></p>
    }
    <p>
      <strong>{props.post.title}</strong>
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
        href='#'
        onClick={(e) => {
          e.preventDefault()
          props.isFollowing ? props.unfollowPost(props.post._id) : props.followPost(props.post._id)
        }}>
        {props.isFollowing
          ? 'Unfollow'
          : 'Follow again'}
      </a>
    </p>
  </Block>
)
GuestToggleFollow.propTypes = {
  post: React.PropTypes.object.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  followPost: React.PropTypes.func.isRequired,
  unfollowPost: React.PropTypes.func.isRequired
}

export default GuestToggleFollow
