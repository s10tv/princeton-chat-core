import React from 'react'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import SidebarHeader from './sidebarHeader.jsx'
import {navigateViaRouter} from '/client/lib/helpers'

const NavLink = (props) =>
  <Link activeClassName='active' {...props} />

// <li><NavLink to='/' onlyActiveOnIndex>Home</NavLink></li>
const Sidebar = ({user, onLogout, onTapSettings, isFullAdmin, followedTopics, toggleMenu, menuOpen}) => (
  <div className='sidebar-inner'>
    <SidebarHeader
      toggleMenu={toggleMenu}
      menuOpen={menuOpen}
      user={user}
      onLogout={onLogout}
      onTapSettings={onTapSettings} />
    <RaisedButton primary label='New Post' labelPosition='after' className='new-post'
       linkButton href='/add-post' onClick={navigateViaRouter}>
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
  onTapSettings: React.PropTypes.func.isRequired,
  isFullAdmin: React.PropTypes.bool.isRequired
}
export default Sidebar
