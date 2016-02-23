/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import {color, fontSize, spacing} from '/client/configs/theme'

export default {
  sidebarHeader: {
    alignSelf: 'stretch',
    flex: '1 0 60px',
    maxHeight: 60,
    justifyContent: 'flex-end',
    padding: spacing.x2,
  },
  sidebarInner: {
    flex: '1 0 0px',
    marginTop: spacing.x6,
    minWidth: 320,
    maxWidth: 320,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      padding: '10px 16px 25px 16px',
      marginTop: 0
    }
  },
  sidebarLogo: {
    fontWeight: 'normal',
    fontSize: fontSize.h5,
    color: color.brand.primary,
    marginRight: 'auto',
    '@media (max-width: 768px)': {
      marginLeft: 'auto'
    }
  },
  sidebarLink: {
    color: color.white,
    fontSize: fontSize.h6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: color.white,
    fontSize: fontSize.sm,
    marginTop: 10
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
  },
  button: {
    width: '100%',
    marginTop: 20,
    textTransform: 'inherit',
    textAlign: 'center',
    minHeight: 36
    // marginLeft: spacing.x2,
    // marginRight: spacing.x2,
  },
  fbButton: {
    textTransform: 'inherit',
    minHeight: 36
    // marginLeft: spacing.x2,
    // marginRight: spacing.x2,
  },
  error: {
    color: color.brand.danger,
    marginTop: 20,
    marginBottom: 5
  },
  notShowOnDesktop: {
    '@media (min-width: 768px)': {
      display: 'none'
    }
  },
  notShowOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none'
    }
  }
}
