import React from 'react'
import {Flex, Block} from 'jsxstyle'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import Menu from '/imports/modules/core/components/menu.jsx'
import styles from '/imports/modules/core/components/styles.jsx'

export default React.createClass({
  render() {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Menu {...this.props}
            title={'Follow some topics'}
            hideAddNewUsersButton={true}
            hideFollowerSection={true}
            hideAddNewUsersButton={true}
            hideFollowActionSection={true} />

        <Flex flex={1} flexDirection='column' alignItems='center'>
          <h1>Browse all topics</h1>
          <p>
            Check the ones you want to follow
          </p>
          <TopicGrid margin='0 36px 36px 36px' {...this.props} />
        </Flex>
      </main>
    )
  }
});

export const TopicGrid = React.createClass({
  propTypes: {
    /**
     * Proptypes will also be passed to Flex layout.
     */
    ...Flex.propTypes,

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
  },

  render() {
    return (
      <Flex flexWrap='wrap' justifyContent='center' {...this.props}>
        { this.props.topics.map((topic) =>
          <TopicListItem
            key={topic._id}
            topic={topic}
            followTopic={this.props.followTopic}
            unfollowTopic={this.props.unfollowTopic} />
        )}
      </Flex>
    )
  }
})

const TopicListItem = ({topic, followTopic, unfollowTopic}) => (
  <Flex width={300} height={80} backgroundColor='#F2F6F9' padding='16px 4px 16px 16px' margin={8} alignItems='center'>
    <Block flex={1}>
      <Block fontWeight={600}>#{topic.displayName}</Block>
      <Block color='#8899A6' fontSize={14}>{topic.numPosts} posts - {topic.followersCount} followers</Block>
    </Block>

    {
      topic.isFollowed
      ? <FlatButton primary={true}
          label='Following' onTouchTap={() => { unfollowTopic(topic._id) }} />
      : <FlatButton label='Follow' labelPosition='after'
          icon={<FontIcon className='material-icons'>add</FontIcon>}
          onTouchTap={() => { followTopic(topic._id) }} />
    }
  </Flex>
)
