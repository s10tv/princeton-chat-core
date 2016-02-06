import React from 'react'
import {Flex, Block} from 'jsxstyle'

const SimpleLogo = ({style, ...props}) =>
  <h1 style={{color: '#F07621', fontSize: 20, fontWeight: 600, margin: 0, ...style}} {...props}>Princeton.chat</h1>

const GuestIndex = (props) => (
  <Block className='guest' padding={30}>
    <SimpleLogo />
    <p>Topics I follow</p>
  </Block>
)

export default GuestIndex
