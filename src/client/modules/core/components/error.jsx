import React from 'react'
import { color } from '/src/client/configs/theme'
import { Flex } from 'jsxstyle'
import { i18n } from '/src/client/configs/env'

export default React.createClass({
  render () {
    return (
      <Flex backgroundColor={color.black} color='white' height='100vh'
        background={`linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),
          url(${i18n('pageNotFoundBackground')})`}
        backgroundSize='cover'
        justifyContent='center' alignItems='center'>
        <span style={{position: 'absolute', left: 10, top: 10, fontSize: 20}}>{i18n('title')}</span>
        <Flex flexDirection='column' alignItems='center'>
          <h1 style={{fontWeight: 400, fontSize: '2.5em'}}> Page Not Found </h1>
          <h3 style={{marginTop: 30, fontSize: '1.5em', fontWeight: 300}}>{i18n('pageNotFoundError')}</h3>
        </Flex>
      </Flex>
    )
  }
})
