import React from 'react'
import {Flex, Block} from 'jsxstyle'

export default OnboardingOverlay = ({ content = () => null }) => (
  <Flex zIndex={1500} position='fixed' top={0} left={0} width='100vw' height='100vh'>
    <Block width='240px' backgroundColor='#242424' padding={16}>
      <Block height={15} width='100%' backgroundColor='rgba(255, 255, 255, 0.05)' />
      <Block height={15} marginTop={60} width='60%' backgroundColor='rgba(255, 255, 255, 0.05)' />
      <Block height={15} marginTop={20} width='35%' backgroundColor='rgba(255, 255, 255, 0.05)' />
      <Block height={15} marginTop={20} width='70%' backgroundColor='rgba(255, 255, 255, 0.05)' />
    </Block>
    <Block flexGrow={1} backgroundColor='white'>
      <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30}>Princeton.Chat</Block>
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        <h1 style={{fontSize: 48, fontWeight: 'normal'}}>Welcome Tiger!</h1>
        <h2 style={{fontSize: 20, fontWeight: 'normal'}}>Princeton.Chat is a community for Princeton alums.</h2>
        {content()}
      </Flex>
    </Block>
  </Flex>
)
