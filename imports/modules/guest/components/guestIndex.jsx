import React from 'react'
import {Flex, Block} from 'jsxstyle'

const ORANGE = '#F07621'
const WHITE = 'white'
const RED = 'red'

const SimpleLogo = ({style, ...props}) =>
  <h1 style={{color: ORANGE, fontSize: 20, fontWeight: 600, margin: 0, ...style}} {...props}>Princeton.chat</h1>
  
const postShape = React.PropTypes.shape({
  _id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
})

const topicShape = React.PropTypes.shape({
  _id: React.PropTypes.string.isRequired,
  displayName: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
})

const FollowButton = props => (
  <Block {...props}>[Follow]</Block>
)

const PostItem = (props) => (
  <Block>
    <Flex>
      <h4>{props.post.title}</h4>
      <FollowButton marginLeft='auto' />
    </Flex>
  </Block>
)
PostItem.propTypes = {
  post: postShape.isRequired,
  followPost: React.PropTypes.func.isRequired,
  unfollowPost: React.PropTypes.func.isRequired,
}

const TopicItem = (props) => (
  <Block>
    <Flex>
      <h4>{props.topic.displayName}</h4>
      <FollowButton marginLeft='auto' />
    </Flex>
    <p>{props.topic.description}</p>
  </Block>
)
TopicItem.propTypes = {
  topic: topicShape.isRequired,
  followTopic: React.PropTypes.func.isRequired,
  unfollowTopic: React.PropTypes.func.isRequired,
}

const GuestIndex = (props) => (
  <Block padding={30}>
    <SimpleLogo />
    <h2>Topics I follow</h2>
    {props.topics.map(topic => 
      <TopicItem key={topic._id} topic={topic} followTopic={props.followTopic} unfollowTopic={props.unfollowTopic} />
    )}
    <h2>Posts I follow</h2>
    {props.posts.map(post => 
      <PostItem key={post._id} post={post} followPost={props.followPost} unfollowPost={props.unfollowPost} />
    )}
  </Block>
)
GuestIndex.propTypes = {
  posts: React.PropTypes.array.isRequired,
  topics: React.PropTypes.array.isRequired,
  followPost: React.PropTypes.func.isRequired,
  unfollowPost: React.PropTypes.func.isRequired,
  followTopic: React.PropTypes.func.isRequired,
  unfollowTopic: React.PropTypes.func.isRequired,
}

export default GuestIndex
