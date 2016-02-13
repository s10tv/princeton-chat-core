import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { FlatButton, FontIcon } from '/client/lib/ui.jsx'
import { i18n } from '/client/config/env'

export default React.createClass({
  propTypes: {
    /**
     * Boolean to show/hide siderbar
     */
    sidebarOpen: React.PropTypes.bool,

    /**
     * Boolean to make title/cover clickable
     */
    isTopicClickable: React.PropTypes.bool,

    /**
     * Shows new topic modal
     */
    showAddTopicModal: React.PropTypes.func.isRequired,

    /**
     * Arrays of sorted topics
     */
    topicsSortedByFollowers: React.PropTypes.array.isRequired,
    topicsSortedByTime: React.PropTypes.array.isRequired,

    /**
     * Func to navigate to topic
     */
    navigateToTopic: React.PropTypes.func.isRequired,

    /**
     * Funcs to follow/unfollow topic
     */
    followTopic: React.PropTypes.func.isRequired,
    unfollowTopic: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      value: 'Top'
    }
  },

  tabItemClicked (e) {
    console.log(e.currentTarget.text)
    this.setState({
      value: e.currentTarget.text
    })
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0,
        padding: '0px 40px', alignItems: 'center'})}>
        <Flex flexGrow={1} flexDirection='column' alignItems='center' style={{
          maxWidth: 600,
          maxHeight: '100vh'
        }}>
          <Flex flex='1 0 auto' alignSelf='stretch'
            marginBottom={10} boxShadow='#dedede 0px -1px 0px 0px inset'>
            <a onClick={this.tabItemClicked} href='#'>
              <h3 style={Object.assign({},
                  localStyle.tabItem,
                  this.state.value !== 'Top' && localStyle.tabItemDeselected,
                  this.state.value === 'Top' && localStyle.tabItemSelected)
              }>Top</h3>
            </a>
            <a value='recent' href='#' onClick={this.tabItemClicked}>
              <h3 style={Object.assign({},
                  localStyle.tabItem,
                  this.state.value !== 'Recent' && localStyle.tabItemDeselected,
                  this.state.value === 'Recent' && localStyle.tabItemSelected)
              }>Recent</h3>
            </a>
            <a href='#' onClick={this.props.showAddTopicModal}>
              <h3 style={Object.assign({}, localStyle.tabItem, localStyle.tabItemDeselected)
              }>Create New</h3>
            </a>
          </Flex>
          <div className='no-scrollbar' style={{overflowY: 'scroll'}}>
            {this.state.value === 'Top'
              ? <Flex flexDirection='column' justifyContent='center'>
                    {this.props.topicsSortedByFollowers.map((topic) =>
                      <TopicListItem
                        key={topic._id}
                        topic={topic}
                        isTopicClickable={this.props.isTopicClickable}
                        navigateToTopic={this.props.navigateToTopic}
                        followTopic={this.props.followTopic}
                        unfollowTopic={this.props.unfollowTopic} />
                    )}

                <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
              </Flex> : null
            }
            {this.state.value === 'Recent'
              ? <Flex flexDirection='column' justifyContent='center'>
                    {this.props.topicsSortedByTime.map((topic) =>
                      <TopicListItem
                        key={topic._id}
                        topic={topic}
                        isTopicClickable={this.props.isTopicClickable}
                        navigateToTopic={this.props.navigateToTopic}
                        followTopic={this.props.followTopic}
                        unfollowTopic={this.props.unfollowTopic} />
                    )}

                <NewTopicButton showAddTopicModal={() => this.props.showAddTopicModal()} />
              </Flex> : null
            }
          </div>
        </Flex>
      </main>
    )
  }
})

const TopicListItem = ({topic, followTopic, unfollowTopic, navigateToTopic, isTopicClickable}) => {
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
    <Flex flexDirection='column' margin='25px 0px' flexGrow={1}>
      <Flex flexGrow={1}>
        {isTopicClickable
          ? <a href='#' onClick={(event) => {
            event.preventDefault()
            navigateToTopic(topic._id)
          }} style={{
            flex: '0 0 220px',
            maxHeight: 167,
            backgroundImage: `url("${topic.cover.url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 5
          }} />
        : <Flex flex='0 0 220px' maxHeight={147} backgroundImage={`url("${topic.cover.url}")`}
          backgroundSize='cover' backgroundPosition='center' borderRadius={5} />
        }
        <Flex flexGrow={1} flexDirection='column' marginLeft={30}>
          <h3 style={{ fontWeight: 400, marginTop: 0, marginBottom: 0 }}>
            {isTopicClickable
              ? <a href='#' onClick={(event) => {
                event.preventDefault()
                navigateToTopic(topic._id)
              }}>
                  #{topic.displayName}
              </a>
              : <span>#{topic.displayName}</span>
            }
          </h3>
          <h5 style={{fontWeight: 300, marginTop: 5, marginBottom: 0}}>
            {isTopicClickable
              ? <a href={`mailto:${topic._id}@${i18n('topicMailServer')}`}>
                  {topic._id}@{i18n('topicMailServer')}
              </a>
              : <span>{topic._id}@{i18n('topicMailServer')}</span>
            }
          </h5>
          <Flex marginTop={15} alignItems='center'>
            {
              topic.followersCount !== undefined
              ? <Flex marginRight={25}>
                <span style={{fontWeight: 300, color: '#c3c3c3'}}>{topic.followersCount} {getFollowerText()}</span>
              </Flex> : null
            }
            {
              topic.numPosts !== undefined
              ? <Flex flexDirection='column' alignItems='center'>
                <span style={{fontWeight: 300, color: '#c3c3c3'}}>{topic.numPosts} {getPostsText()}</span>
              </Flex> : null
            }
          </Flex>
          {
            topic.isFollowed
            ? <FlatButton
              labelPosition='after'
              icon={<FontIcon className='material-icons'>done</FontIcon>}
              backgroundColor={i18n('primaryMuiTheme').rawTheme.palette.primary1Color}
              hoverColor={i18n('primaryMuiTheme').rawTheme.palette.lightenedPrimary1Color}
              style={{marginTop: 15,
                color: 'white',
                textTransform: 'inherit'
              }}
              label='Subscribed'
              onTouchTap={() => { unfollowTopic(topic._id) }} />
            : <FlatButton
              labelPosition='after'
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              backgroundColor={i18n('primaryMuiTheme').rawTheme.palette.accent1Color}
              hoverColor={i18n('primaryMuiTheme').rawTheme.palette.lightenedAccent1Color}
              style={{marginTop: 15,
                color: 'white',
                textTransform: 'inherit'
              }}
              label='Subscribe'
              onTouchTap={() => { followTopic(topic._id) }} />
          }
        </Flex>
      </Flex>
      <p style={{marginTop: 20, fontWeight: 300, marginBottom: 0}}>{topic.description}</p>
    </Flex>
  )
}

const NewTopicButton = ({ showAddTopicModal }) => {
  return (
    <a href='#' onClick={showAddTopicModal}>
      <Flex margin='25px 0px' flexGrow={1}>
        <Flex flex='0 0 220px' maxHeight={147} backgroundColor='#e0e0e0'
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

const localStyle = {
  tabItem: {
    margin: 0,
    padding: '10px 20px',
    fontWeight: 600
  },

  tabItemSelected: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    color: 'rgba(0, 0, 0, 0.87)'
  },

  tabItemDeselected: {
    borderBottom: '',
    color: '#dedede'
  }
}
