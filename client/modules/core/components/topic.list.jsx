import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { RaisedButton, FontIcon } from '/client/lib/ui.jsx'

export default React.createClass({
  propTypes: {
    /**
     * Boolean to show/hide siderbar
     */
    sidebarOpen: React.PropTypes.bool.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Flex flexGrow={1} flexDirection='column' alignItems='center' overflowY='scroll'>
          <TopicGrid margin='20px 0px' {...this.props} />
        </Flex>
      </main>
    )
  }
})

export const TopicGrid = React.createClass({
  propTypes: {
    /**
     * The list of topics you can subscribe to.
     */
    topics: React.PropTypes.array.isRequired,

    /**
     * The function that is called when I want to follow a topic.
     */
    followTopic: React.PropTypes.func.isRequired,

    /**
     * The function that is called when I want to unfollow a topic.
     */
    unfollowTopic: React.PropTypes.func.isRequired,

    /**
     * Shows new topic modal
     */
    showAddTopicModal: React.PropTypes.func.isRequired,

    /**
     * Topics sorted by followers
     */
    topicsSortedByFollowers: React.PropTypes.object.isRequired,

    /**
     * Topics sorted by time
     */
    topicsSortedByTime: React.PropTypes.object.isRequired
  },

  render () {
    return (
      <div>
        <Flex flexDirection='column' justifyContent='center'>
          {this.props.topicsSortedByFollowers.map((topic) =>
            <TopicListItem
              key={topic._id}
              topic={topic}
              followTopic={this.props.followTopic}
              unfollowTopic={this.props.unfollowTopic} />
          )}

          <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
        </Flex>
      </div>
    )
  }
})

const TopicListItem = ({topic, followTopic, unfollowTopic}) => {
  const pluralizeTextForNumber = (text, number) => {
    if (number !== 1) {
      return text + 's'
    }

    return text
  }

  const getFollowerText = () => {
    return pluralizeTextForNumber('follower', topic.followersCount)
  }

  const getPostsText = () => {
    return pluralizeTextForNumber('post', topic.numPosts)
  }

  return (
    <Flex flexDirection='column' margin={25}>
      <Flex>
        <Flex width={250} maxHeight={167} backgroundImage={`url("${topic.cover.url}")`}
          backgroundSize='cover' backgroundPosition='center' borderRadius={5} />
        <Flex width={500} flexDirection='column' marginLeft={30}>
          <Flex flexDirection='row' alignItems='center'>
            <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0,
              marginRight: 25 }}>#{topic.displayName}</h3>
            {
              topic.followersCount !== undefined
              ? <Flex flexDirection='column' marginRight={25} alignItems='center'>
                <span style={{fontWeight: 300}}>{topic.followersCount}</span>
                <span style={{fontWeight: 300, color: '#c3c3c3'}}>{getFollowerText()}</span>
              </Flex> : null
            }
            {
              topic.numPosts !== undefined
              ? <Flex flexDirection='column' alignItems='center'>
                <span style={{fontWeight: 300}}>{topic.numPosts}</span>
                <span style={{fontWeight: 300, color: '#c3c3c3'}}>{getPostsText()}</span>
              </Flex> : null
            }
          </Flex>
          <p style={{marginTop: 15, fontWeight: 300, marginBottom: 0}}>{topic.description}</p>
          {
            topic.isFollowed
            ? <RaisedButton secondary style={{marginTop: 15}}
              label='Following' onTouchTap={() => { unfollowTopic(topic._id) }} />
            : <RaisedButton primary style={{marginTop: 15}}
              label='Follow' onTouchTap={() => { followTopic(topic._id) }} />
          }
        </Flex>
      </Flex>
    </Flex>
  )
}

const NewTopicButton = ({ showAddTopicModal }) => {
  return (
    <a href='#' onClick={showAddTopicModal}>
      <Flex margin={25}>
        <Flex width={250} height={150} backgroundColor='#e0e0e0'
          borderRadius={5} justifyContent='center' alignItems='center'>
          <FontIcon className='material-icons' color='#757575'>photo_camera</FontIcon>
        </Flex>
        <Flex width={500} marginLeft={30} flexDirection='column' alignItems='center'>
          <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0 }}>
            Create a new topic
          </h3>
          <p style={{marginTop: 15, fontWeight: 300}}>Can't find what you are looking for? No problem.
          Topics in Princeton.Chat are curated by the community. Create your own and we'll help
          you invite other people to follow your topic.</p>
        </Flex>
      </Flex>
    </a>
  )
}
