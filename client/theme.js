// TODO: Figure out a more permanent solution, comma-dangle is actually very important
// Trailing spaces is used to separate stuff into logical chunks

/*eslint-disable comma-dangle */
/*eslint-disable no-trailing-spaces */

const color = {
  brandPrimary: '#F07621', // Princeton orange
  black: '#292F33', // Near black
  white: 'white',
  green: '#2AB27B',
  gray: '#979797',
}

const fontSize = {
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

const spacing = {
  x1: 8,
  x2: 16,
  x3: 24,
  x4: 32,
  x5: 40,
  x6: 48,
}

export const onboarding = {
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

export default {color, fontSize, spacing}
