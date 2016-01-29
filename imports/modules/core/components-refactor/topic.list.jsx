import React from 'react'
import {Flex, Block} from 'jsxstyle'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

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

export const TopicGrid = ({topics, followTopic, unfollowTopic, ...props}) => (
  <Flex overflowY='scroll' flex={1} flexWrap='wrap' justifyContent='center' {...props}>
      {topics.map((topic) =>
        <TopicListItem key={topic._id} topic={topic} followTopic={followTopic} unfollowTopic={unfollowTopic} />
      )}
  </Flex>
)

export default (props) => (
  <Flex flex={1} flexDirection='column' alignItems='center'>
    <h1>Browse all topics</h1>
    <p>
      Check the ones you want to follow
    </p>
    <TopicGrid margin='0 36px 36px 36px' {...props} />
  </Flex>
)
