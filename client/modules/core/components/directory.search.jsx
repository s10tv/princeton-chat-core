import React from 'react'
import {Flex} from 'jsxstyle'
import List from '../../../../node_modules/material-ui/lib/lists/list'
import Menu from '/client/modules/core/components/menu.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import ListItem from '../../../../node_modules/material-ui/lib/lists/list-item'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'
import { UserAvatar } from '/client/lib/helpers.jsx'
import color from '/client/configs/color'

const s = {
  searchResult: {
    lineHeight: '24px'
  },
  subTitle: {
    color: color.gray,
    fontSize: 14,
    marginRight: 5
  }
}

const DirectorySearchScreen = React.createClass({
  propTypes: {

    /**
     * True if there are no posts in this list
     */
    isEmpty: React.PropTypes.bool,

    /**
     * A function to show the user profile associated with the post.
     */
    showUserProfile: React.PropTypes.func.isRequired,

    /**
     * Initial serach box value
     */
    currentSearchValue: React.PropTypes.string,

    /**
     * The function navigates the user to the topic list screen.
     */
    navigateToTopic: React.PropTypes.func.isRequired
  },

  render () {
    return (
      <main style={styles.main}>
        <Flex flexDirection='column' flexGrow={1}>
          <Menu
            currentSearchValue={this.props.currentSearchValue}
            hidePostButton={this.props.isEmpty}
            initialIsSearchingPeople
            style={{
              marginBottom: 20
            }}
            {...this.props} />
          <Flex>
            {this.props.isEmpty
              ? <EmptyScreen {...this.props} />
              : <DirectorySerachResults {...this.props} />}
          </Flex>
        </Flex>
      </main>
    )
  }
})

const EmptyScreen = ({ currentSearchValue }) => (
  <Flex marginTop={50} flexGrow={1} flexDirection='column' justifyContent='center' alignItems='center'>
    <FontIcon style={{fontSize: 50}} className='material-icons'>search</FontIcon>
    <h2 style={{fontWeight: 500}}>Sorry, we couldn't find any users matching '{currentSearchValue}'</h2>
  </Flex>
)

const DirectorySerachResults = (props) => (
  <section className='post-list' style={{flexGrow: 1, overflowX: 'hidden'}}>
    <List style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 10}}>
      {props.users.map((user) =>
        <DirectorySerachItem key={user._id} user={user} {...props} />
      )}
    </List>
  </section>
)

const DirectorySerachItem = (props) => (
  <ListItem
    disabled
    style={{
      borderBottom: '1px solid #e0e0e0',
      padding: 10
    }}>
    <Flex>
      <UserAvatar size={30} avatarInitials={props.user.avatarInitials}
        avatar={props.user.avatar} />

      <Flex flexDirection='column' flexGrow={1} style={{marginLeft: 10}}>
        <Flex flexGrow={1} justifyContent='space-between'>
          <span style={s.searchResult}>
            <a href='#' onClick={(event) => {
              event.preventDefault()
              props.showUserProfile(props.user)
            }}>
              {props.user.displayName}
            </a>
          </span>

          {!props.user.displayEmail ? null
            : <span style={s.searchResult}>
              <a href={`mailto:${props.user.displayEmail}`} style={{
                color: color.gray
              }}>
                {props.user.displayEmail}
              </a>
            </span>
          }
        </Flex>

        {!props.user.followingTopics ? null
          : <span style={s.searchResult}>
            {props.user.followingTopics.map((topic) =>
              <a href='#' style={s.subTitle} onClick={(event) => {
                event.preventDefault()
                props.navigateToTopic(topic)
              }}>#{topic._id}</a>
            )}
          </span>}
      </Flex>
    </Flex>
  </ListItem>
)

export default DirectorySearchScreen
