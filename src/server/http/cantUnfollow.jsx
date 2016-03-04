import React from 'react'
import { Flex } from 'jsxstyle'

export default React.createClass({
  render () {
    return (
      <Flex fontFamily='Lato' backgroundColor='black' color='white' height='100vh'
        background={`linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),
          url(https://images.unsplash.com/photo-1430876988766-1be68caef0e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=188a0a423d918ef320144a56866c7ced)`}
        backgroundSize='cover'
        justifyContent='center' alignItems='center'>
        <span style={{position: 'absolute', left: 10, top: 10, fontSize: 20}}>Princeton.Chat</span>
        <Flex flexDirection='column' alignItems='center'>
          <h1 style={{fontWeight: 400, fontSize: '2.5em'}}> Sorry, can't unfollow the post. </h1>
          <h3 style={{marginTop: 30, fontSize: '1.5em', fontWeight: 300}}>
            We are working to resolve this issue.
          </h3>
        </Flex>
      </Flex>
    )
  }
})
