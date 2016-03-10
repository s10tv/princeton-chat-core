import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { FlatButton, FontIcon } from '/client/lib/ui.jsx'
import { i18n } from '/client/configs/env'
import Radium from 'radium'
import _ from 'underscore'

// import style from '/client/modules/onboarding/configs/style.js'
// TODO: XXX
const style = {}

const TopicList = React.createClass({
  propTypes: {

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
    showLoginAlert: React.PropTypes.func,

    /**
     * styles to override main
     */
    rootStyle: React.PropTypes.object,

    /**
     * Bool to hide tabs, true by default
     */
    areTabsShown: React.PropTypes.bool,

    topics: React.PropTypes.object.isRequired
  },

  componentWillMount () {
    document.body.style.overflow = 'auto'
  },

  componentWillUnmount () {
    document.body.style.overflow = 'hidden'
  },

  getDefaultProps () {
    return {
      areTabsShown: true
    }
  },

  getInitialState () {
    return {
      value: 'Top',
      canShowSweetAlerts: true
    }
  },

  tabItemClicked (e) {
    this.setState({
      value: e.currentTarget.text
    })
  },

  ifLoggedInExecute (func) {
    return this.props.isLoggedIn ? func() : this.props.showLoginAlert()
  },

  render () {
    return (
      <main style={[styles.main, localStyle.mainContainer, this.props.rootStyle]}>
        <div>
          {this.props.areTabsShown
          ? <Flex style={localStyle.tabFlexContainer}>
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
          : null
          }
          <div className='no-scrollbar' style={{marginTop: 50}}>
          {this.state.value === 'Top'
          ? <Flex flexDirection='column' justifyContent='center'>
              {sortTopicsByFollowers(this.props.topics).map((topic) =>
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
            <NewTopicButton
              showAddTopicModal={() => this.ifLoggedInExecute(this.props.showAddTopicModal)} />
          </Flex> : null
          }
          {this.state.value === 'Recent'
          ? <Flex flexDirection='column' justifyContent='center'>
                {sortTopicsByTime(this.props.topicsSortedByTime).map((topic) =>
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
            <NewTopicButton
              showAddTopicModal={() => this.ifLoggedInExecute(this.props.showAddTopicModal)} />
          </Flex> : null
          }
          </div>
        </div>
      </main>
    )
  }
})

var TopicListItem = ({isLoggedIn, ifLoggedInExecute,
  topic, followTopic, unfollowTopic, navigateToTopic, isTopicClickable }) => {
  const pluralizeTextForNumber = (text, number) => {
    if (number !== 1) {
      return text + 's'
    }

    return text
  }

  const followerCount = isLoggedIn ? topic.followersCount : topic.followersCount + 10
  const postCount = isLoggedIn ? topic.numPosts : topic.numPosts + 10

  const getFollowerText = () => {
    return pluralizeTextForNumber('subscriber', followerCount)
  }

  const getPostsText = () => {
    return pluralizeTextForNumber('post', postCount)
  }

  const getParticipantText = () => {
    return pluralizeTextForNumber('participant', followerCount)
  }

  return (
    <Flex style={localStyle.topicItemContainer}>
      <div style={localStyle.topicItemContainerUpperRow}>
        {isTopicClickable
        ? <a href='#' onClick={() => ifLoggedInExecute(() => {
          navigateToTopic(topic._id)
        })} style={[localStyle.topicItemCoverPhoto,
          { backgroundImage: `url("${topic.cover.url}")` }
        ]} />
        : <div style={[localStyle.topicItemCoverPhoto,
         { backgroundImage: `url("${topic.cover.url}")` }
        ]} />
        }
        <div style={localStyle.topicItemContainerUpperRowRight}>
          <h3 style={localStyle.textTopicTitle}>
            {isTopicClickable
            ? <a href='#' onClick={() => ifLoggedInExecute(() => {
              navigateToTopic(topic._id)
            })}>
                #{topic.displayName}
            </a>
            : <span>#{topic.displayName}</span>
            }
          </h3>

          {topic.type === 'ama'
            ? (
            <div>
              <h5 style={localStyle.textTopicEmail}>
                Ask me anything
              </h5>
              {
                topic.followersCount !== undefined
                ? <div>
                  <span style={localStyle.topicItemCountInfo}>{followerCount} {getParticipantText()}</span>
                </div> : null
              }
            </div>
            )
            : (
            <div>
              <h5 style={localStyle.textTopicEmail}>
                {topic._id}@{i18n('topicMailServer')}
              </h5>
              <Flex marginTop={15} alignItems='center'>
                {
                  topic.followersCount !== undefined
                  ? <Flex marginRight={25}>
                    <span style={localStyle.topicItemCountInfo}>{followerCount} {getFollowerText()}</span>
                  </Flex> : null
                }
                {
                  topic.numPosts !== undefined
                  ? <Flex>
                    <span style={localStyle.topicItemCountInfo}>{postCount} {getPostsText()}</span>
                  </Flex> : null
                }
              </Flex>
            </div>
            )
          }
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
        </div>
      </div>
      <p style={localStyle.topicItemDescription}>{topic.description}</p>
    </Flex>
  )
}

TopicListItem = Radium(TopicListItem)

var NewTopicButton = ({ showAddTopicModal }) => {
  return (
    <a style={style.notShowOnMobile} href='#' onClick={showAddTopicModal}>
      <Flex margin='25px 0px' flexGrow={1} maxWidth={600}>
        <div style={newTopicButtonStyle.coverPhotoBg}>
          <FontIcon className='material-icons' color='#757575'>photo_camera</FontIcon>
        </div>
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

NewTopicButton = Radium(NewTopicButton)

const sortTopicsByAma = (topics) => {
  const amaTopics = _.where(topics, { type: 'ama' })
  const filteredTopics = _.filter(topics, (topic) => topic.type !== 'ama')
  return amaTopics.concat(filteredTopics)
}
const sortTopicsByTime = (topics) => sortTopicsByAma(_.sortBy(topics, (topic) => topic.createdAt).reverse())
const sortTopicsByFollowers = (topics) => sortTopicsByAma(_.sortBy(topics, (topic) => topic.followersCount).reverse())

const coverPhotoDimensions = {
  flex: '0 0 220px',
  maxHeight: 147,
  borderRadius: 5,
  '@media (max-width: 768px)': {
    flex: '0 0 288px',
    minHeight: 192,
    maxHeight: 192
  }
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

  mainContainer: {
    padding: '0px 40px',
    alignItems: 'center',
    flexGrow: '1',
    '@media (max-width: 768px)': {
      padding: 0,
      marginBottom: 20
    }
  },

  mainFlexContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center'
    // maxHeight: '100vh',
    // '@media (max-width: 768px)': {
    //   maxHeight: 'initial'
    // }
  },

  tabFlexContainer: {
    flexDirection: 'row',
    flex: '1 0 auto',
    alignSelf: 'stretch',
    marginBottom: 10,
    width: '100%',
    zIndex: 15,
    position: 'fixed',
    backgroundColor: 'white',
    maxWidth: 600,
    boxShadow: '#dedede 0px -1px 0px 0px inset'
  },

  topicItemContainer: {
    flexDirection: 'column',
    margin: '25px 0px',
    flexGrow: 1,
    maxWidth: 600
  },

  topicItemContainerUpperRow: {
    display: 'flex',
    flexGrow: 1,
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      flexFlow: 'row wrap'
    }
  },

  topicItemContainerUpperRowRight: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    marginLeft: 30,
    '@media (max-width: 768px)': {
      marginLeft: 0,
      marginTop: 20,
      width: 288
    }
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
    display: 'flex',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default Radium(TopicList)
