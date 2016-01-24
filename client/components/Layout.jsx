import Menu from './Menu.jsx';
import React from 'react';
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'

const Layout = ({content = () => null }) => (
  <div id="container">
    <Menu />
    <div id="content-container">
      {content()}
    </div>
  </div>
);

export default Layout;

const SplitView = ({collapsed}) => (
  <div style={{
      display: 'flex', marginLeft: 250
    }}>
    <div style={{
        backgroundColor: 'red',
        flexGrow: 1,
        display: 'none'
    }}>
      <h1>Master</h1>
    </div>
    <div style={{backgroundColor: 'green', flexGrow: 1}}>
      <h1>Detail</h1>
    </div>
  </div>
)

export const NewLayout = () => (
  <div>
    
    <LeftNav open={true} >
      <MenuItem>First Item</MenuItem>
      <MenuItem>Second Item</MenuItem>
    </LeftNav>
    <SplitView />
    
  </div>
)

// <article style={{marginLeft: 250, paddingLeft: 16}}>
//   <h1>Hello World thereasdfa s fasjf lsa;jf sal;f djas</h1>
// </article>
