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


class FollowButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {mouseOver: false}
  }
  toggleFollow() {
    if (this.props.isFollowing) {
      this.props.unfollowFn(this.props.itemId)
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
          fontWeight: 'bold',
          cursor: 'pointer',
          color: (this.props.isFollowing && this.state.mouseOver) ? 'red' : 'inherit',
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
      <h4>{props.post.title}</h4>
      <FollowButton style={{marginLeft: 'auto'}} 
        itemId={props.post._id}
        isFollowing={props.post.isFollowing}
        followFn={props.followPost}
        unfollowFn={props.unfollowPost} />
    </Flex>
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
      <h4># {props.topic.displayName}</h4>
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
