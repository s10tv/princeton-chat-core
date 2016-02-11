/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import {color, fontSize, spacing} from '/client/config/theme'

export default {
  sidebarHeader: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: spacing.x2,
  },
  sidebarInner: {
    flex: 1,
    marginTop: spacing.x6,
    maxWidth: 320,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    fontWeight: 600,
    fontSize: fontSize.h4,
    color: color.brandPrimary,
    marginRight: 'auto',
  },
  login: {
    color: color.white,
    fontSize: fontSize.h6,
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
  
}
