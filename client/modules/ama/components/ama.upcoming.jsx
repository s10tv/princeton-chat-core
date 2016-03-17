import React from 'react'
import {Flex} from 'jsxstyle'
// import {FlatButton} from '/client/lib/ui.jsx'

const Sidebar = ({user}) => (
  <Flex style={s.sidebar}>
    <Flex flexDirection='column'>
      <h3>princeton.chat</h3>
      <h4>{user}</h4>
    </Flex>
  </Flex>
)

const Content = () => (
  <Flex style={s.content}>
    <h2>#AMA Ask Me Anything</h2>
  </Flex>
)

export default React.createClass({
  render: function () {
    return (
      <div style={s.main}>
        <Flex flexDirection='row'>
          <Sidebar user={this.props.user}/>
          <Content />
        </Flex>
      </div>
    )
  }
})

const s = {
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      height: 'initial',
      minHeight: '100vh'
    },
    backgroundColor: '#F7F7F7'
  },
  sidebar: {
    width: '15%',
    paddingLeft: '20px',
    paddingTop: '15px',
    flexDirection: 'column',
    borderRightColor: '#333333',
    borderRightStyle: 'solid',
    borderRightWidth: 1
  },
  content: {
    paddingLeft: '20px',
    paddingTop: '15px'
  }
}
