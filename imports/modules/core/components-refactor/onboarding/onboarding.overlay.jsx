import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
import {primaryMuiTheme} from '../helpers.jsx'
import {Flex, Block} from 'jsxstyle'

export function SidebarOverlay(props) {
  return (
    <Flex zIndex={1500} position='fixed' top={0} left={0} height='100vh' {...props}>
      <div className='onboarding-sidebar-overlay'>
        <Block height={15} width='100%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={60} width='60%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={20} width='35%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={20} width='70%' backgroundColor='rgba(255, 255, 255, 0.05)' />
      </div>
    </Flex>
  )
}

export default React.createClass({
  mixins: [
    StyleResizable
  ],
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: primaryMuiTheme,
    }
  },
  render() {
    const { content = () => null } = this.props;
    return (
      <Flex zIndex={1500} position='fixed' top={0} left={0} width='100vw' height='100vh'>
        <div className='onboarding-sidebar-overlay'>
          <Block height={15} width='100%' backgroundColor='rgba(255, 255, 255, 0.05)' />
          <Block height={15} marginTop={60} width='60%' backgroundColor='rgba(255, 255, 255, 0.05)' />
          <Block height={15} marginTop={20} width='35%' backgroundColor='rgba(255, 255, 255, 0.05)' />
          <Block height={15} marginTop={20} width='70%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        </div>
        <Flex flexGrow={1} backgroundColor='white' flexDirection='column'>
          <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30}>Princeton.Chat</Block>
          {content()}
        </Flex>
      </Flex>
    )
  }
})
