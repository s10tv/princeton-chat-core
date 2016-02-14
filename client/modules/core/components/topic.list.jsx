import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { FlatButton, FontIcon } from '/client/lib/ui.jsx'
import { i18n } from '/client/configs/env'

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
    unfollowTopic: React.PropTypes.func.isRequired,

    /**
     * If false, all interactable buttons will show an alert to log in
     */
    isLoggedIn: React.PropTypes.bool.isRequired,

    /**
     * Func to show alert to login
     */
    showSweetAlertToLogin: React.PropTypes.func
  },

  getInitialState () {
    return {
      value: 'Top'
    }
  },

  tabItemClicked (e) {
    this.setState({
      value: e.currentTarget.text
    })
  },

  ifLoggedInExecute (func) {
    return this.props.isLoggedIn ? func() : this.props.showSweetAlertToLogin()
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0,
        padding: '0px 40px', alignItems: 'center'})}>
        <Flex style={localStyle.mainFlexContainer}>
          <Flex style={localStyle.tabFlexContainer}>
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
            <a href='#' onClick={() => this.ifLoggedInExecute(this.props.showAddTopicModal)}>
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
                        isLoggedIn={this.props.isLoggedIn}
                        ifLoggedInExecute={this.ifLoggedInExecute}
                        topic={topic}
                        isTopicClickable={this.props.isTopicClickable}
                        navigateToTopic={this.props.navigateToTopic}
                        followTopic={this.props.followTopic}
                        unfollowTopic={this.props.unfollowTopic} />
                    )}

                <NewTopicButton showAddTopicModal={() => this.ifLoggedInExecute(this.props.showAddTopicModal)} />
              </Flex> : null
            }
            {this.state.value === 'Recent'
              ? <Flex flexDirection='column' justifyContent='center'>
                    {this.props.topicsSortedByTime.map((topic) =>
                      <TopicListItem
                        ifLoggedInExecute={this.ifLoggedInExecute}
                        isLoggedIn={this.props.isLoggedIn}
                        key={topic._id}
                        topic={topic}
                        isTopicClickable={this.props.isTopicClickable}
                        navigateToTopic={this.props.navigateToTopic}
                        followTopic={this.props.followTopic}
                        unfollowTopic={this.props.unfollowTopic} />
                    )}

                <NewTopicButton showAddTopicModal={() => this.ifLoggedInExecute(this.props.showAddTopicModal)} />
              </Flex> : null
            }
          </div>
        </Flex>
      </main>
    )
  }
})

const TopicListItem = ({isLoggedIn, ifLoggedInExecute,
  topic, followTopic, unfollowTopic, navigateToTopic, isTopicClickable}) => {
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
    <Flex style={localStyle.topicItemContainer}>
      <Flex flexGrow={1}>
        <a href='#' onClick={() => ifLoggedInExecute(() => {
          navigateToTopic(topic._id)
        })} style={Object.assign({},
          localStyle.topicItemCoverPhoto,
          { backgroundImage: `url("${topic.cover.url}")` }
        )} />
        <Flex flexGrow={1} flexDirection='column' marginLeft={30}>
          <h3 style={localStyle.textTopicTitle}>
            <a href='#' onClick={() => ifLoggedInExecute(() => {
              navigateToTopic(topic._id)
            })}>
              #{topic.displayName}
            </a>
          </h3>
          <h5 style={localStyle.textTopicEmail}>
            {topic._id}@{i18n('topicMailServer')}
          </h5>
          <Flex marginTop={15} alignItems='center'>
            {
              topic.followersCount !== undefined
              ? <Flex marginRight={25}>
                <span style={localStyle.topicItemCountInfo}>{topic.followersCount} {getFollowerText()}</span>
              </Flex> : null
            }
            {
              topic.numPosts !== undefined
              ? <Flex>
                <span style={localStyle.topicItemCountInfo}>{topic.numPosts} {getPostsText()}</span>
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
              style={localStyle.btnSubscribe}
              label='Subscribed'
              onTouchTap={() => ifLoggedInExecute(() => unfollowTopic(topic._id))} />
            : <FlatButton
              labelPosition='after'
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              backgroundColor={i18n('primaryMuiTheme').rawTheme.palette.accent1Color}
              hoverColor={i18n('primaryMuiTheme').rawTheme.palette.lightenedAccent1Color}
              style={localStyle.btnSubscribe}
              label='Subscribe'
              onTouchTap={() => ifLoggedInExecute(() => followTopic(topic._id))} />
          }
        </Flex>
      </Flex>
      <p style={localStyle.topicItemDescription}>{topic.description}</p>
    </Flex>
  )
}

const NewTopicButton = ({ showAddTopicModal }) => {
  return (
    <a href='#' onClick={showAddTopicModal}>
      <Flex margin='25px 0px' flexGrow={1}>
        <Flex style={newTopicButtonStyle.coverPhotoBg}>
          <FontIcon className='material-icons' color='#757575'>photo_camera</FontIcon>
        </Flex>
        <Flex flexGrow={1} marginLeft={30} flexDirection='column' alignItems='center'>
          <h3 style={localStyle.textTopicTitle}>
            Create a new channel
          </h3>
          <p style={localStyle.topicItemDescription}>Can't find what you are looking for? No problem.
          Channels in {i18n('title')} are curated by the community. Create your own and we'll help
          you invite other people to follow your channel.</p>
        </Flex>
      </Flex>
    </a>
  )
}

const coverPhotoDimensions = {
  flex: '0 0 220px',
  maxHeight: 147,
  borderRadius: 5
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
  },

  textTopicEmail: {
    fontWeight: 300,
    marginTop: 5,
    marginBottom: 0
  },

  textTopicTitle: {
    fontWeight: 400,
    marginTop: 0,
    marginBottom: 0
  },

  btnSubscribe: {
    marginTop: 15,
    color: 'white',
    textTransform: 'inherit'
  },

  mainFlexContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 600,
    maxHeight: '100vh'
  },

  tabFlexContainer: {
    flex: '1 0 auto',
    alignSelf: 'stretch',
    marginBottom: 10,
    boxShadow: '#dedede 0px -1px 0px 0px inset'
  },

  topicItemContainer: {
    flexDirection: 'column',
    margin: '25px 0px',
    flexGrow: 1
  },

  topicItemCoverPhoto: {
    ...coverPhotoDimensions,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },

  topicItemCountInfo: {
    fontWeight: 300,
    color: '#c3c3c3'
  },

  topicItemDescription: {
    marginTop: 20,
    fontWeight: 300,
    marginBottom: 0
  }
}

const newTopicButtonStyle = {
  coverPhotoBg: {
    ...coverPhotoDimensions,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  }
}
