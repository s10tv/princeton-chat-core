import React from 'react'
import moment from 'moment'
import truncate from 'truncate'
import pluralize from 'pluralize'
import sweetalert from 'sweetalert'
import {Flex, Block} from 'jsxstyle'
import {postShape, topicShape} from '/client/lib/shapes.js'

import { i18n } from '/client/configs/env'

const RED = 'red'

const SimpleLogo = (props) => (
  <h1 style={Object.assign({}, {
    color: i18n('primaryColor'),
    fontSize: 20,
    fontWeight: 600,
    margin: 0}, props.style)} {...props}>
    {i18n('title')}
  </h1>
)

class FollowButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {mouseOver: false}
  }
  toggleFollow () {
    if (this.props.isFollowing) {
      sweetalert({
        title: `Unfollow ${this.props.itemName}?`,
        text: 'You will need login before you can follow it back!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, unfollow!',
        closeOnConfirm: true,
        html: false
      }, () => {
        this.props.unfollowFn(this.props.itemId)
      })
    } else {
      this.props.followFn(this.props.itemId)
    }
  }
  render () {
    return (
      <a onClick={this.toggleFollow.bind(this)}
        onMouseOver={() => this.setState({mouseOver: true})}
        onMouseOut={() => this.setState({mouseOver: false})}
        style={{
          fontWeight: 600,
          cursor: 'pointer',
          color: this.props.isFollowing ? (this.state.mouseOver ? RED : i18n('primaryColor')) : 'inherit',
          ...this.props.style
        }}>
        {this.props.isFollowing ? (this.state.mouseOver ? 'Unfollow' : 'Following') : 'Follow'}
      </a>
    )
  }
}
FollowButton.propTypes = {
  itemId: React.PropTypes.string.isRequired,
  itemName: React.PropTypes.string.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  unfollowFn: React.PropTypes.func.isRequired,
  followFn: React.PropTypes.func.isRequired,
  style: React.PropTypes.object
}

const ListItem = (props) => (
  <Block border='1px solid #8899A6' borderRadius={5} padding={8} margin='8px 0' {...props}>
    {props.children}
  </Block>
)

const Section = (props) => (
  <Block component='section' flex={1} margin='0 10px' minWidth={300} {...props}>
    {props.children}
  </Block>
)

const PostItem = (props) => (
  <ListItem>
    <Flex>
      <Block>
        <h4>{props.post.title}</h4>
        <span>{moment(props.post.createdAt).format('M/D h:mm a')}</span>
        <span> - </span>
        <span>{pluralize('follower', props.post.numFollowers, true)}</span>
      </Block>
      <FollowButton style={{marginLeft: 'auto'}}
        itemId={props.post._id}
        itemName={truncate(props.post.title, 50)}
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
  unfollowPost: React.PropTypes.func.isRequired
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
        itemName={`# ${props.topic.displayName}`}
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
  unfollowTopic: React.PropTypes.func.isRequired
}

const GuestIndex = (props) => (
  <Flex className='guest-index' padding={30} flexDirection='column' alignItems='center'>
    <style type='text/css' scoped>
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
        <h2>Channels Subscribed</h2>
        {props.topics.map((topic) =>
          <TopicItem key={topic._id} topic={topic}
            followTopic={props.followTopic} unfollowTopic={props.unfollowTopic} />
        )}
      </Section>
      <Section>
        <h2>Posts I follow</h2>
        {props.posts.map((post) =>
          <PostItem key={post._id} post={post}
            followPost={props.followPost} unfollowPost={props.unfollowPost} />
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
  unfollowTopic: React.PropTypes.func.isRequired
}

export default GuestIndex
