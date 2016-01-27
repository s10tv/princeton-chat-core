import React from 'react'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import {Flex, Block} from 'jsxstyle'

export default (props) => (
  <Flex flex={1} flexDirection='column' alignItems='center'>
    <h1>Browse all topics</h1>
    <p>
      Check the ones you want to follow
    </p>
    <Block overflowY='scroll' flex={1} width={400}>
      <List style={{borderTop: '1px solid #eceeef'}}>
        {props.topics.map((topic) =>
          <ListItem
            key={topic._id}
            leftCheckbox={<Checkbox defaultChecked={topic.isFollowed} onCheck={topic.onFollowToggle} />}
            primaryText={`#${topic.displayName}`}
            secondaryText={`${topic.numPosts} posts - ${topic.followersCount} followers`}
            style={{borderBottom: '1px solid #eceeef'}}>
          </ListItem>
        )}
      </List>
    </Block>
  </Flex>
)
