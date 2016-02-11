/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import {color, fontSize, spacing} from '/client/config/theme'

export default {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    fontFamily: '"Avenir Next", sans-serif',
  },
  sidebar: {
    flex: 4,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: color.black,
    color: color.white,
  },
  sidebarHeader: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing.x2,
  },
  logo: {
    fontWeight: 600,
    fontSize: fontSize.h4,
    color: color.brandPrimary,
  },
  login: {
    color: color.white,
    fontSize: fontSize.h5,
  },
  sidebarInner: {
    marginTop: spacing.x6,
    maxWidth: 320,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  h1: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
  },
  verifyForm: {
    marginTop: spacing.x6,
    display: 'flex',
    flexDirection: 'column',
  },
  verifyLabel: {
    fontSize: fontSize.sm,
  },
  inputGroup: {
    display: 'flex',
    border: `1px solid ${color.gray}`,
    borderRadius: 3,
    padding: spacing.x1,
  },
  inputText: {
    backgroundColor: 'transparent',
    border: 'none',
    width: 100,
    ':focus': {
      outline: 'none',
    }
  },
  inputAddon: {
    
  },
  enterButton: {
    marginTop: spacing.x2,
    alignSelf: 'center',
    border: 'none',
    borderRadius: 3,
    backgroundColor: color.green,
    padding: '8px 24px',
    fontSize: fontSize.lg,
  },
  main: {
    flex: 6,
  },
}
