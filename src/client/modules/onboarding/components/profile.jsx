import React from 'react'
import Radium from 'radium'
import {Flex} from 'jsxstyle'
import {CoverAvatar} from '/src/client/modules/core/components/helpers.jsx'

const Profile = (props) => {
  const { avatarUrl, displayName, firstName } = props
  return (
    <Flex
      backgroundImage='url(/images/bg-blair-arch-people.jpg)'
      backgroundSize='cover'
      backgroundPosition='center'
      flexGrow={1}
      alignItems='center'
      justifyContent='center'>
      <Flex
        backgroundColor='rgba(0,0,0,0.5)'
        borderRadius={5}
        width='50%'
        flexDirection='column'
        alignItems='center'
        padding='36px'>
        <CoverAvatar size={150} src={avatarUrl} />
        <h1 style={{fontWeight: 300, marginTop: 20, color: 'white'}}>{displayName}</h1>
        <p style={{marginTop: 20, color: 'white'}}>
          Login to see more info about {firstName}...
        </p>
      </Flex>
    </Flex>
  )
}

export default Radium(Profile)
