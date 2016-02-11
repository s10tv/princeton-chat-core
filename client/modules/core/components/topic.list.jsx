import React from 'react'
import {Flex} from 'jsxstyle'
import FlatButton from '../../../../node_modules/material-ui/lib/flat-button'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'
import styles from '/client/modules/core/components/styles.jsx'
import { RaisedButton } from '/client/lib/ui'

export default React.createClass({
  propTypes: {
    /**
     * Boolean to show/hide siderbar
     */
    sidebarOpen: React.PropTypes.bool.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0,
        overflowY: 'scroll' })}>
        <Flex flex={1} flexDirection='column' alignItems='center'>
          <TopicGrid margin={36} {...this.props} />
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
    showAddTopicModal: React.PropTypes.func.isRequired
  },

  render () {
    return (
      <div>
        <Flex flexWrap='wrap' maxWidth={1000} justifyContent='center' {...this.props}>
          {this.props.topics.map((topic) =>
            <TopicListItem
              key={topic._id}
              topic={topic}
              followTopic={this.props.followTopic}
              unfollowTopic={this.props.unfollowTopic} />
          )}

          <FlatButton label='New Topic'
            icon={<FontIcon className='material-icons'>add</FontIcon>}
            onTouchTap={() => { this.props.showAddTopicModal() }} />
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
    <Flex width={400} flexDirection='column' margin={10}>
      <Flex>
        <Flex width={200} backgroundImage={`url("${topic.cover.url}")`}
          backgroundSize='cover' backgroundPosition='center' borderRadius={5} />
        <Flex flexDirection='column' marginLeft={30}>
          <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0 }}>#{topic.displayName}</h3>
          <Flex flexDirection='row' marginTop={15}>
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
          {
            topic.isFollowed
            ? <RaisedButton secondary style={{marginTop: 15, width: 150}}
              label='Following' onTouchTap={() => { unfollowTopic(topic._id) }} />
            : <RaisedButton primary style={{marginTop: 15, width: 150}}
              label='Follow' onTouchTap={() => { followTopic(topic._id) }} />
          }
        </Flex>
      </Flex>
      <p style={{marginTop: 15, fontWeight: 300}}>{topic.description}</p>
    </Flex>
  )
}
