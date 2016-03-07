import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import SidebarHeader from './sidebarHeader.jsx'
import {Link} from 'react-router'

const Sidebar = ({user, onLogout, onTapSettings, isFullAdmin, followedTopics, toggleMenu, menuOpen}) => (
  <div className='sidebar-inner'>
    <SidebarHeader
      toggleMenu={toggleMenu}
      menuOpen={menuOpen}
      user={user}
      onLogout={onLogout}
      onTapSettings={onTapSettings} />
    <RaisedButton primary linkButton label='New Post' labelPosition='after' href='/add-post' className='new-post'>
      <FontIcon className='material-icons new-post-icon' color='white'>
         add_circle
      </FontIcon>
    </RaisedButton>
    <ul className='medium'>
      {!isFullAdmin ? null : <li><Link to='/admin/invite'>Admin</Link></li>}
      <li><Link to='/inbox'>My Inbox</Link></li>
      <li><Link to='/all'>All</Link></li>
      <li><Link to='/explore'>Explore Channels</Link></li>
    </ul>
    <h3>CHANNELS</h3>
    <ul>
      <li><Link to='/ama/qimingama'># AMA</Link></li>
      {followedTopics.map((topic) =>
        <li key={topic._id}>
          <Link to={`/channels/${topic._id}`}>{`# ${topic.displayName}`}</Link>
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
