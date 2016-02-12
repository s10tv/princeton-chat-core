import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { RaisedButton, FontIcon, Tabs, Tab } from '/client/lib/ui.jsx'
import { i18n } from '/client/config/env'

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
        <Flex flexGrow={1} flexDirection='column' alignItems='center' overflowY='scroll' style={{
          marginTop: 20, marginLeft: 20, marginRight: 20
        }}>
          <TopicGrid {...this.props} />
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
    topicsSortedByFollowers: React.PropTypes.array.isRequired,

    /**
     * Topics sorted by time
     */
    topicsSortedByTime: React.PropTypes.array.isRequired,

    navigateToTopic: React.PropTypes.func.isRequired,

    /**
     * Are the cover photos and the title clickable
     */
    topicClickable: React.PropTypes.bool.isRequired
  },

  getInitialState () {
    return {
      value: 'top'
    }
  },

  handleChange (value) {
    this.setState({
      value
    })
  },

  render () {
    return (
      <div>
        <Tabs style={{marginTop: 10}} onChange={this.handleChange} tabItemContainerStyle={{backgroundColor: 'transparent'}}>
          <Tab label='Top' value='top' style={{color: 'rgba(0, 0, 0, 0.87)'}}>
            {
              !this.state.value === 'top' ? null
              : <Flex flexDirection='column' justifyContent='center'>
                  {this.props.topicsSortedByFollowers.map((topic) =>
                    <TopicListItem
                      key={topic._id}
                      topic={topic}
                      navigateToTopic={this.props.navigateToTopic}
                      followTopic={this.props.followTopic}
                      unfollowTopic={this.props.unfollowTopic} />
                  )}

                <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
              </Flex>
            }
          </Tab>
          <Tab label='Recent' value='recent' style={{color: 'rgba(0, 0, 0, 0.87)'}}>
            {
              !this.state.value === 'recent' ? null
              : <Flex flexDirection='column' justifyContent='center'>
                  {this.props.topicsSortedByTime.map((topic) =>
                    <TopicListItem
                      key={topic._id}
                      topic={topic}
                      followTopic={this.props.followTopic}
                      unfollowTopic={this.props.unfollowTopic} />
                  )}

                <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
              </Flex>
            }
          </Tab>
          <Tab label='Create New' value='create new' style={{color: 'rgba(0, 0, 0, 0.87)'}}>
            {
              !this.state.value === 'create new' ? null
              : <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
            }
          </Tab>
        </Tabs>
      </div>
    )
  }
})

const TopicListItem = ({topic, followTopic, unfollowTopic, navigateToTopic}) => {
  const pluralizeTextForNumber = (text, number) => {
    if (number !== 1) {
      return text + 's'
    }

    return text
  }

  const getFollowerText = () => {
    return pluralizeTextForNumber('subscriber', topic.followersCount)
  }

  const getPostsText = () => {
    return pluralizeTextForNumber('post', topic.numPosts)
  }

  return (
    <Flex margin='25px 0px' flexGrow={1}>
      <Flex flex='0 0 250px' maxHeight={167} backgroundImage={`url("${topic.cover.url}")`}
        backgroundSize='cover' backgroundPosition='center' borderRadius={5} />
      <Flex flexGrow={1} flexDirection='column' marginLeft={30}>
        <Flex flexDirection='row' alignItems='center'>
          <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0,
            marginRight: 25 }}>
            <a href='#' onClick={(event) => {
              event.preventDefault()
              navigateToTopic(topic._id)
            }}>
              #{topic.displayName}
            </a>
          </h3>
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
          ? <RaisedButton
            labelPosition='after'
            icon={<FontIcon className='material-icons'>done</FontIcon>}
            secondary
            style={{marginTop: 15}}
            label='Subscribed'
            onTouchTap={() => { unfollowTopic(topic._id) }} />
          : <RaisedButton
            labelPosition='after'
            icon={<FontIcon className='material-icons'>add</FontIcon>}
            primary
            style={{marginTop: 15}}
            label='Subscribe'
            onTouchTap={() => { followTopic(topic._id) }} />
        }
      </Flex>
    </Flex>
  )
}

const NewTopicButton = ({ showAddTopicModal }) => {
  return (
    <a href='#' onClick={showAddTopicModal}>
      <Flex margin='25px 0px' flexGrow={1}>
        <Flex flex='0 0 250px' height={150} backgroundColor='#e0e0e0'
          borderRadius={5} justifyContent='center' alignItems='center'>
          <FontIcon className='material-icons' color='#757575'>photo_camera</FontIcon>
        </Flex>
        <Flex flexGrow={1} marginLeft={30} flexDirection='column' alignItems='center'>
          <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0 }}>
            Create a new channel
          </h3>
          <p style={{marginTop: 15, fontWeight: 300}}>Can't find what you are looking for? No problem.
          Channels in {i18n('title')} are curated by the community. Create your own and we'll help
          you invite other people to follow your channel.</p>
        </Flex>
      </Flex>
    </a>
  )
}
