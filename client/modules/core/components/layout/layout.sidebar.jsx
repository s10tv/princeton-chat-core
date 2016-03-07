import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import SidebarHeader from './sidebarHeader.jsx'
import {Link} from 'react-router'

const NavLink = (props) =>
  <Link activeClassName='active' {...props} />

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
      {!isFullAdmin ? null : <li><NavLink to='/admin/invite'>Admin</NavLink></li>}
      <li><NavLink to='/inbox'>My Inbox</NavLink></li>
      <li><NavLink to='/all'>All</NavLink></li>
      <li><NavLink to='/explore'>Explore Channels</NavLink></li>
    </ul>
    <h3>CHANNELS</h3>
    <ul>
      <li><NavLink to='/ama/qimingama'># AMA</NavLink></li>
      {followedTopics.map((topic) =>
        <li key={topic._id}>
          <NavLink to={`/channels/${topic._id}`}>{`# ${topic.displayName}`}</NavLink>
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
