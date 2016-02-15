import React from 'react'

const Window = ({children}) => (
  <div style={style.pageWrapper}>
    {children}
  </div>
)

const style = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
  },
}

export default Window
