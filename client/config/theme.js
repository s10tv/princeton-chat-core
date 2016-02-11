// TODO: Figure out a more permanent solution, comma-dangle is actually very important
// Trailing spaces is used to separate stuff into logical chunks
/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import darkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme'
import lightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import Colors from 'material-ui/lib/styles/colors'
import Spacing from 'material-ui/lib/styles/spacing'
import tinycolor from 'tinycolor2'

export const fontFamily = {
  base: '-apple-system, BlinkMacSystemFont, "Avenir Next", sans-serif',
  system: `-apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
    "Fira Sans", "Droid Sans", "Avenir Next", "Helvetica Neue",
    sans-serif`,
  article: 'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif'
}

export const color = {
  ...Colors,
  brandPrimary: '#F07621', // Princeton orange
  black: '#292F33', // Near black
  white: 'white',
  green: '#2AB27B',
  lightGreen: tinycolor('#2AB27B').lighten(10).toString(),
  gray: '#979797',
}

export const fontSize = {
  h1: '2.5rem',
  h2: '2rem',
  h3: '1.75rem',
  h4: '1.5rem',
  h5: '1.25rem',
  h6: '1rem',
  
  base: '1rem', // 16px in practice
  lg: '1.25rem',
  sm: '0.875rem', // 14px in practice
  xs: '0.75rem',
}

export const spacing = {
  x1: 8,
  x2: 16,
  x3: 24,
  x4: 32,
  x5: 40,
  x6: 48,
}

export const primaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...lightRawTheme.palette,
    primary1Color: '#8BC34A',
    accent1Color: '#F07621' // princeton orange
  }
})

export const secondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: '#F07621', // princeton orange
    alternateTextColor: Colors.white
  }
})

export const pedPrimaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...lightRawTheme.palette,
    accent1Color: '#5477AD' // ped blue
  }
})

export const pedSecondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: '#5477AD', // ped blue
    primary3Color: '#4E6A93', // not-so-dark blue
    alternateTextColor: Colors.white,
    canvasColor: '#1B293D' // dark blue
  }
})
