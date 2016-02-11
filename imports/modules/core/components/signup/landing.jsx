/*eslint-disable no-trailing-spaces */
import React from 'react'
import {onboarding as style} from '/client/theme'

export default class Landing extends React.Component {
  render () {
    return (
      <div style={style.pageWrapper}>
        <div style={style.sidebar}>
          <header style={style.sidebarHeader}>
            <span style={style.logo}>Princeton.Chat</span>
            <a style={style.login} href='/login'>Log in</a>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Welcome Tiger</h1>
            <p>Princeton.Chat is a private community that connects Princetonians based on shared interests and common needs.</p>
            <form style={style.verifyForm}>
              <p style={style.verifyLabel}>Verify your Princeton affiliation to enter.</p>
              <div style={style.inputGroup}>
                <input type='text' style={style.inputText} />
                <span style={style.inputAddon}>@alumni.princeton.edu</span>
              </div>
              <div>OR</div>
              <div style={style.inputGroup}>
                <input type='text' style={style.inputText} />
                <span style={style.inputAddon}>@princeton.edu</span>
              </div>
              <input style={style.enterButton} type='submit' value='Enter' />
            </form>
          </div>
        </div>
        <div style={style.main}>
        </div>
      </div>
    )
  }
}
