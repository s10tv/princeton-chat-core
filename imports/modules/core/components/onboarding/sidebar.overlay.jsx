import React from 'react'
import {Flex, Block} from 'jsxstyle'
import { i18n } from '/imports/libs/mantra'

const theme = i18n('secondaryMuiTheme');
const canvasColor = theme.baseTheme.palette.canvasColor;

export default function SidebarOverlay(props) {
  return (
    <Flex zIndex={1500} position='fixed' top={0} left={0} height='100vh' {...props}>
      <div className='onboarding-sidebar-overlay' style={Object.assign({}, {
          backgroundColor: canvasColor
        })}>
        <Block height={15} width='100%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={60} width='60%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={20} width='35%' backgroundColor='rgba(255, 255, 255, 0.05)' />
        <Block height={15} marginTop={20} width='70%' backgroundColor='rgba(255, 255, 255, 0.05)' />
      </div>
    </Flex>
  )
}
