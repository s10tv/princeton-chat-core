/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import {color, fontSize, spacing} from '/client/config/theme'

export default {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
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
    justifyContent: 'flex-end',
    padding: spacing.x2,
  },
  login: {
    color: color.white,
    fontSize: fontSize.h6,
  },
  sidebarInner: {
    flex: 1,
    marginTop: spacing.x6,
    maxWidth: 320,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  h1: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
    // fontSize: fontSize.h4,
    color: color.brandPrimary,
  },
  verifyForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  manualInvite: {
    color: color.white,
    fontSize: fontSize.xs,
  },
  submitButton: {
    marginLeft: spacing.x2,
    marginRight: spacing.x2,
  },
  main: {
    flex: 6,
    backgroundImage: 'url(/images/bg-blair-arch-people.jpg)',
    backgroundSize: 'cover',
  },
}
