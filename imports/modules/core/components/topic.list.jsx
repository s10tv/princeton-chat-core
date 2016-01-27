import React from 'react'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import {Flex, Block} from 'jsxstyle'

export const TopicListItem = ({topic, followTopic, unfollowTopic}) => (
  <ListItem
    leftCheckbox={<Checkbox defaultChecked={topic.isFollowed} onCheck={(e, checked) => {
      if (checked) {
        followTopic(topic._id)
      } else {
        unfollowTopic(topic._id)
      }
    }} />}
    primaryText={`#${topic.displayName}`}
    secondaryText={`${topic.numPosts} posts - ${topic.followersCount} followers`}
    style={{borderBottom: '1px solid #eceeef'}}>
  </ListItem>
)

export default (props) => (
  <Flex flex={1} flexDirection='column' alignItems='center'>
    <h1>Browse all topics</h1>
    <p>
      Check the ones you want to follow
    </p>
    <Block overflowY='scroll' flex={1} width={400}>
      <List style={{borderTop: '1px solid #eceeef'}}>
        {props.topics.map((topic) =>
          <TopicListItem key={topic._id} topic={topic} {...props} />
        )}
      </List>
    </Block>
  </Flex>
)
