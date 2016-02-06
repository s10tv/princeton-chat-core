import React from 'react'
import {Flex, Block} from 'jsxstyle'

const ORANGE = '#F07621'
const WHITE = 'white'
const RED = 'red'

const SimpleLogo = ({style, ...props}) =>
  <h1 style={{color: ORANGE, fontSize: 20, fontWeight: 600, margin: 0, ...style}} {...props}>Princeton.chat</h1>

const GuestToggleFollow = (props) => (
  <Block className='guest' padding={30}>
    <style type='text/css' scoped={true}>{`
      .guest a {
        color: #4A90E2; /* Blue */
        text-decoration: underline;
      }
      .guest a:hover {
        color: #F07621; /* Princeton Orange */
      }
    `}</style>
    <SimpleLogo />
    {props.isFollowing 
      ? <p>You are now <span style={{color: ORANGE}}>following</span></p> 
      : <p>You just <span style={{color: RED}}>unfollowed</span></p>}
    <p>
      <strong>{props.title}</strong>
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
