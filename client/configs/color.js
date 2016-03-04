/*eslint-disable comma-dangle */
import Colors from '../../node_modules/material-ui/lib/styles/colors'
import tinycolor from 'tinycolor2'

export default {
  ...Colors,
  brand: {
    // Bootstrap primary: #0275d8
    primary: '#F07621', // Princeton Orange
    success: '#5cb85c',
    info: '#5bc0de',
    warning: '#f0ad4e',
    danger: '#d9534f',
  },
  black: '#292F33', // Near black
  white: 'white',
  green: '#2AB27B',
  lightGreen: tinycolor('#2AB27B').lighten(10).toString(),
  gray: '#979797',
  lightGray: '#d3d4d7',
  avatarButtons: {
    dullGrey: '#404548',
    lighterGrey: tinycolor('#404548').lighten(10).toString()
  },
  inbox: {
    backgroundGray: '#F5F5F5',
    separatorGray: '#E1E2E4',
    hoverGray: '#F8F8F9',
    archiveBoxGray: '#EFF0F1',
    archiveIconGray: '#9B9B9B'
  },
  // School colors
  princeton: {
    // Color picked not entirely accurate
    orange: '#F07621',
    black: '#221E1F',
  },
  ped: {
    primary: '#5477AD', // Ped blue
    lightPrimary: '#76A4ED', // Ped blue
    success: '#5cb85c',
    info: '#5bc0de',
    warning: '#f0ad4e',
    danger: '#d9534f'
  },
  // Social media colors
  // Courtesy of http://designpieces.com/2012/12/social-media-colours-hex-and-rgb/
  facebook: {
    blue: '#3b5998',
    mediumBlue: '#6d84b4',
    lighterBlue: '#afbdd4',
    lightestBlue: '#d8dfea',
    white: '#ffffff',
  },
  twitter: {
    blue: '#00aced',
    darkBlue: '#0084b4',
    logoBlue: '#00aced',
    verifiedBlue: '#1dcaff',
    backgroundBlue: '#c0deed',
    white: '#ffffff',
  },
  instagram: {
    blue: '#125688',
    iconRed: '#fb3958',
    iconYellow: '#ffc838',
    iconGreen: '#6dc993',
    iconBlue: '#458eff',
    iconLightBrown: '#ded1c1',
    iconDarkBrown: '#9b6954',
    logoDarkBlue: '#125688',
  },
  vimeo: {
    green: '#aad450',
    blue: '#45bbff',
    skyBlue: '#90d5ec',
    powderBlue: '#d1eef7',
    purple: '#c09eda',
    yellow: '#f7b42c',
    orange: '#ff8a3c',
    red: '#fc575e',
    pink: '#f27490',
    magenta: '#f49ac1',
    brown: '#ccaa55',
    gray: '#99aabb',
    mint: '#66cc99',
  },
  googlePlusRed: '#dd4b39',
  youtubeRed: '#bb0000',
  linkedInBlue: '#007bb5',
  whatsAppGreen: '#4dc247',
  pinterestRed: '#cb2027',
  vineGreen: '#00bf8f',
  snapchatYellow: '#fffc00',
  quoraBurgundy: '#a82400',
  dropboxBlue: '#007ee5',
  flickrPint: '#ff0084',
  tumblrDarkTurquoise: '#32506d',
  vkBlue: '#45668e',
  foursquareLogoBlue: '#0072b1',
}
