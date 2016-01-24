import React from 'react';
import Sidebar from './layout.sidebar.jsx'
import Main from './layout.main.jsx'

export default ({content = () => null }) => (
  <div id='layout'>
    <Sidebar />
    <Main />
  </div>
)
