import React from 'react'
import moment from 'moment'
import truncate from 'truncate'
import pluralize from 'pluralize'
import {Flex, Block} from 'jsxstyle'
import {postShape, topicShape} from '/imports/libs/shapes.js'

const ORANGE = '#F07621'
const WHITE = 'white'
const RED = 'red'

const SimpleLogo = ({style, ...props}) =>
  <h1 style={{color: ORANGE, fontSize: 20, fontWeight: 600, margin: 0, ...style}} {...props}>Princeton.Chat</h1>

class FollowButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {mouseOver: false}
  }
  toggleFollow() {
    if (this.props.isFollowing) {
      // TODO: Is this really the best way to do it?
      if (window.confirm("Are you sure you want to unfollow? You won't be able to follow it back until you login.")) { 
        this.props.unfollowFn(this.props.itemId)
      }
    } else {
      this.props.followFn(this.props.itemId)
    }
  }
  render() {
    return (
      <a onClick={this.toggleFollow.bind(this)} 
        onMouseOver={() => this.setState({mouseOver: true})}
        onMouseOut={() => this.setState({mouseOver: false})}
        style={{
          fontWeight: 600,
          cursor: 'pointer',
          color: this.props.isFollowing ? (this.state.mouseOver ? RED : ORANGE) : 'inherit',
          ...this.props.style,
        }}>
        {this.props.isFollowing ? (this.state.mouseOver ? 'Unfollow' : 'Following') : 'Follow'}
      </a>
    )
  }
}
FollowButton.propTypes = {
  itemId: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  unfollowFn: React.PropTypes.func.isRequired,
  followFn: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
}

const ListItem = ({children, ...props}) => (
  <Block border='1px solid #8899A6' borderRadius={5} padding={8} margin='8px 0' {...props}>{children}</Block>
)

const Section = ({children, ...props}) => (
  <Block component='section' flex={1} margin='0 10px' minWidth={300} {...props}>{children}</Block>
)

const PostItem = (props) => (
  <ListItem>
    <Flex>
      <Block>
        <h4>{props.post.title}</h4>
        <span>{moment(props.post.createdAt).format("M/D h:mm a")}</span>
        <span> - </span>
        <span>{pluralize('follower', props.post.numFollowers, true)}</span>
      </Block>
      <FollowButton style={{marginLeft: 'auto'}} 
        itemId={props.post._id}
        isFollowing={props.post.isFollowing}
        followFn={props.followPost}
        unfollowFn={props.unfollowPost} />
    </Flex>
    <p>{truncate(props.post.content, 150)}</p>
  </ListItem>
)
PostItem.propTypes = {
  post: postShape.isRequired,
  followPost: React.PropTypes.func.isRequired,
  unfollowPost: React.PropTypes.func.isRequired,
}

const TopicItem = (props) => (
  <ListItem>
    <Flex>
      <Block>
        <h4># {props.topic.displayName}</h4>
        <span>{pluralize('follower', props.topic.numFollowers, true)}</span>
        <span> - </span>
        <span>{pluralize('post', props.topic.numPosts, true)}</span>
      </Block>
      <FollowButton style={{marginLeft: 'auto'}} 
        itemId={props.topic._id}
        isFollowing={props.topic.isFollowing}
        followFn={props.followTopic}
        unfollowFn={props.unfollowTopic} />
    </Flex>
    
    <p>{props.topic.description}</p>
  </ListItem>
)
TopicItem.propTypes = {
  topic: topicShape.isRequired,
  followTopic: React.PropTypes.func.isRequired,
  unfollowTopic: React.PropTypes.func.isRequired,
}

const GuestIndex = (props) => (
  <Flex className='guest-index' padding={30} flexDirection='column' alignItems='center'>
    <style type='text/css' scoped={true}>
    {`
      .guest-index h2 {
        font-size: 20px;
        font-weight: 500;
      }
      .guest-index h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    `}
    </style>
    <SimpleLogo />
    <Flex flexWrap='wrap' maxWidth={1024}>
      <Section>
        <h2>Topics I follow</h2>
        {props.topics.map(topic => 
          <TopicItem key={topic._id} topic={topic} followTopic={props.followTopic} unfollowTopic={props.unfollowTopic} />
        )}
      </Section>
      <Section>
        <h2>Posts I follow</h2>
        {props.posts.map(post => 
          <PostItem key={post._id} post={post} followPost={props.followPost} unfollowPost={props.unfollowPost} />
        )}
      </Section>
    </Flex>
  </Flex>
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
