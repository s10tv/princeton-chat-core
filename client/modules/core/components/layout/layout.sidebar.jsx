import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import SidebarHeader from './sidebarHeader.jsx'

const Sidebar = ({user, onLogout, onTapSettings, isFullAdmin, followedTopics}) => (
  <div className='sidebar-inner'>
    <SidebarHeader
      user={user}
      onLogout={onLogout}
      onTapSettings={onTapSettings} />
    <RaisedButton primary linkButton label='New Post' labelPosition='after' href='/add-post' className='new-post'>
      <FontIcon className='material-icons new-post-icon' color='white'>
         add_circle
      </FontIcon>
    </RaisedButton>
    <ul className='medium'>
      {!isFullAdmin ? null : <li><a href='/admin/invite'>Admin</a></li>}
      <li><a href='/all-mine'>My Inbox</a></li>
      <li><a href='/all'>All Posts</a></li>
      <li><a href='/choose-topics'>Explore Channels</a></li>
    </ul>
    <h3>CHANNELS</h3>
    <ul>
      {followedTopics.map((topic) =>
        <li key={topic._id}>
          <a href={`/topics/${topic._id}`}>{`# ${topic.displayName}`}</a>
        </li>
      )}
    </ul>
  </div>
)
Sidebar.propTypes = {
  user: React.PropTypes.object.isRequired,
  onLogout: React.PropTypes.func.isRequired,
  followedTopics: React.PropTypes.array.isRequired,
  currentRouterPath: React.PropTypes.string.isRequired,
  onTapSettings: React.PropTypes.func.isRequired,
  isFullAdmin: React.PropTypes.bool.isRequired
}
export default Sidebar
