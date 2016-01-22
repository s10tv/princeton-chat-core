import Menu from '../navigations/index.jsx';
import React from 'react';

const Layout = ({content = () => null }) => (
  <div id="container">
    <Menu />
    <div id="content-container">
      {content()}
    </div>
  </div>
);

export default Layout;
