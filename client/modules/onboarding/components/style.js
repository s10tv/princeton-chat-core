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
  sidebarLogo: {
    fontWeight: 'normal',
    fontSize: fontSize.h5,
    color: color.brandPrimary,
    marginRight: 'auto',
  },
  sidebarLink: {
    color: color.white,
    fontSize: fontSize.h6,
  },
  h1: {
    fontWeight: 'lighter',
    marginBottom: spacing.x2,
    // fontSize: fontSize.h4,
  },
  horizontalSpacer: {
    minWidth: spacing.x2,
    minHeight: spacing.x2,
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    textTransform: 'inherit',
    // marginLeft: spacing.x2,
    // marginRight: spacing.x2,
  },
  fbButton: {
    textTransform: 'inherit',
    // marginLeft: spacing.x2,
    // marginRight: spacing.x2,
  },
  error: {
    color: color.brand.danger,
  }
}
