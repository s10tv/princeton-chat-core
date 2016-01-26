import React from 'react'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import {Flex, Block} from 'jsxstyle'

const topics = [
  {
    postsCount: 102,
    title: 'Finance',
    followersCount: 232,
  },
  {
    postsCount: 102,
    title: 'NYC',
    followersCount: 232,
  },
  {
    postsCount: 102,
    title: 'Accounting',
    followersCount: 232,
  },
  {
    postsCount: 102,
    title: 'Fundraising',
    followersCount: 232,
  },
  {
    postsCount: 102,
    title: 'Economics',
    followersCount: 232,
  },
  {
    postsCount: 102,
    title: 'General',
    followersCount: 232,
  },
]

export default (props) => (
  <Flex flex={1} flexDirection='column' alignItems='center'>
    <h1>Browse all topics</h1>
    <p>
      Check the ones you want to follow
    </p>
    <Block overflowY='scroll' flex={1} width={400}>
      <List style={{borderTop: '1px solid #eceeef'}}>
        {topics.map((topic) => 
          <ListItem 
            key={topic.title}
            leftCheckbox={<Checkbox />}
            primaryText={`#${topic.title}`}
            secondaryText={`${topic.postsCount} posts - ${topic.followersCount} followers`}
            style={{borderBottom: '1px solid #eceeef'}}>
          </ListItem>
        )}
      </List>
    </Block>
  </Flex>
)
