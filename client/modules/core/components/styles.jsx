const PRINCETON_ORANGE = '#F07621'
const PRINCETON_WHITE = 'white'
const GREY = '#cccccc'

export default {
  main: {
    height: '100vh',
    display: 'flex',
    flex: '1 0 100%',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      height: 'initial',
      minHeight: '100vh'
    }
  },

  primaryButton: {
    backgroundColor: PRINCETON_ORANGE,
    color: PRINCETON_WHITE,
    marginRight: 10
  },

  secondaryButton: {
    backgroundColor: GREY,
    color: PRINCETON_WHITE
  },

  disabledButton: {
    backgroundColor: '#cccccc',
    color: PRINCETON_WHITE,
    marginRight: 10
  },

  facebookButton: {
    backgroundColor: '#3B5998',
    color: PRINCETON_WHITE,
    marginRight: 10
  },

  instagramButton: {
    backgroundColor: '#125688',
    color: PRINCETON_WHITE
  },

  textField: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },

  textFieldUnderlineFocusStyle: {
    borderColor: PRINCETON_ORANGE
  },

  avatar: {
    objectFit: 'scale-down'
  }
}
