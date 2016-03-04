// TODO: Figure out a more permanent solution, comma-dangle is actually very important
// Trailing spaces is used to separate stuff into logical chunks
/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

import darkRawTheme from '../../../node_modules/material-ui/lib/styles/baseThemes/darkBaseTheme'
import lightRawTheme from '../../../node_modules/material-ui/lib/styles/baseThemes/lightBaseTheme'
import getMuiTheme from '../../../node_modules/material-ui/lib/styles/getMuiTheme'
import Spacing from '../../../node_modules/material-ui/lib/styles/spacing'
import _color from './color'
import tinycolor from 'tinycolor2'

export const color = _color

export const fontFamily = {
  base: 'Lato, sans-serif',
  system: 'Lato, sans-serif',
  article: 'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif'
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

export const primaryMuiTheme = getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...lightRawTheme.palette,
    primary1Color: '#8BC34A',
    lightenedPrimary1Color: tinycolor('#8BC34A').lighten(10).toString(), // Required in order to flat buttons with custom backgrounds to work
    accent1Color: color.princeton.orange,
    lightenedAccent1Color: tinycolor(color.princeton.orange).lighten(10).toString()
  }
})

export const secondaryMuiTheme = getMuiTheme({
  spacing: Spacing,
  fontFamily: fontFamily.base,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: color.princeton.orange,
    alternateTextColor: color.white
  }
})
