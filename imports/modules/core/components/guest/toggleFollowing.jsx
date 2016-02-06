import React from 'react'
import {Flex, Block} from 'jsxstyle'

const SimpleLogo = ({style, ...props}) =>
  <h1 style={{color: '#F07621', fontSize: 20, fontWeight: 600, margin: 0, ...style}} {...props}>Princeton.chat</h1>

const GuestToggleFollow = (props) => (
  <Block className='guest' padding={30}>
    <SimpleLogo />
    <p>{props.isFollowing ? 'You are now following' : 'You just unfollowed'}</p>
    <p>
      <strong>{props.title}</strong>
      {props.isFollowing ? '[Following]' : '[Follow]'}
    </p>
    <p>
      { props.isFollowing
        ? 'and will be notified when others reply'
        : 'and will stop receiving notifications.' }
    </p>
    <br />
    <br />
    <br />
    <p>
      Changed your mind?
      <a style={{marginLeft: 8}} 
        href={props.isFollowing ? props.unfollowLink : props.followLink}>
        { props.isFollowing
          ? 'Unfollow'
          : 'Follow again' }
      </a>
    </p>
    <p>
      <a href='/guest'>Edit topics I follow</a>
    </p>
  </Block>
)
GuestToggleFollow.propTypes = {
  title: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  followLink: React.PropTypes.string.isRequired,
  unfollowLink: React.PropTypes.string.isRequired,
}

export default GuestToggleFollow
