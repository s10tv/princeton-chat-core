// TODO: Figure out a more permanent solution, comma-dangle is actually very important
// Trailing spaces is used to separate stuff into logical chunks

/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

export const color = {
  brandPrimary: '#F07621', // Princeton orange
  black: '#292F33', // Near black
  white: 'white',
  green: '#2AB27B',
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

export default {color, fontSize, spacing}
