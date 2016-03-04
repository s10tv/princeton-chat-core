import React from 'react'
import Radium, {StyleRoot} from 'radium'

const Window = ({children}) => (
  <StyleRoot>
    <div style={style.pageWrapper}>
      {children}
    </div>
  </StyleRoot>
)

export default Radium(Window)

const style = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex'
  }
}
