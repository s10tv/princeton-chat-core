import React from 'react'
import {Style} from 'radium'
import {color} from '/client/configs/theme'
import _ from 'underscore'
import _SelectField from 'material-ui/lib/select-field'
import _TextField from 'material-ui/lib/text-field'
import _FlatButton from 'material-ui/lib/flat-button'
import _RaisedButton from 'material-ui/lib/raised-button'
import _Menu from 'material-ui/lib/menus/menu'
import _MenuItem from 'material-ui/lib/menus/menu-item'
import _Dialog from 'material-ui/lib/dialog'
import _FontIcon from 'material-ui/lib/font-icon'
import _DatePicker from 'material-ui/lib/date-picker/date-picker'
import _AutoComplete from 'material-ui/lib/auto-complete'
import _Tab from 'material-ui/lib/tabs/tab'
import _Tabs from 'material-ui/lib/tabs/tabs'
import _IconButton from 'material-ui/lib/icon-button'
import _LinearProgress from 'material-ui/lib/linear-progress'
import _CircularProgress from 'material-ui/lib/circular-progress'
import _Paper from 'material-ui/lib/paper'
import _List from 'material-ui/lib/lists/list'
import _ListItem from 'material-ui/lib/lists/list-item'
import _DropDownMenu from 'material-ui/lib/DropDownMenu'
import _SvgIcon from 'material-ui/lib/svg-icon'

export const FlatButton = _FlatButton
export const RaisedButton = _RaisedButton
export const MenuItem = _MenuItem
export const Menu = _Menu
export const Dialog = _Dialog
export const FontIcon = _FontIcon
export const DatePicker = _DatePicker
export const AutoComplete = _AutoComplete
export const Tab = _Tab
export const Tabs = _Tabs
export const IconButton = _IconButton
export const LinearProgress = _LinearProgress
export const CircularProgress = _CircularProgress
export const Paper = _Paper
export const List = _List
export const ListItem = _ListItem
export const DropDownMenu = _DropDownMenu
export const SvgIcon = _SvgIcon
/** Wrapping MUI components for use with react-redux **/
export const TextField = (props) => (
  <_TextField {...props} errorText={props.touched && props.error}>
    {props.children}
  </_TextField>
)

export const SelectField = (props) => (
  <_SelectField {...props} errorText={props.touched && props.error} onChange={(event, index, value) => {
    props.onChange && props.onChange(value)
  }}>
    {props.children}
  </_SelectField>
)
/*eslint-disable */
export const OrDivider = ({margin}) => (
  <div className='or-divider'>
    <Style rules={{
        '.or-divider': {
          display: 'flex',
          alignItems: 'center',
          margin: margin,
        },
        '.or-divider hr': {
          border: 0,
          height: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          flex: 1
        },
        '.or-divider span': {
          margin: '0 8px'
        }
      }}/>
    <hr/>
    <span>or</span>
    <hr/>
  </div>
)

export const PageControl = ({current, total, divStyle}) => {
  const style = {
    div: {
      ...divStyle,
      display: 'flex',
      justifyContent: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#8999A6',
      margin: '8px 4px'
    },
    active: {
      backgroundColor: 'white',
    }
  }
  return (
    <div style={style.div}>
      {_.range(total).map((index) =>
        <span key={index} style={{...style.dot, ...(index === current ? style.active : {})}} />
      )}
    </div>
  )
}

export const PageLoader = () => {
  const style = {
    div: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      //width: '100vw',
      height: '100vh',
      flexGrow: '1'
    },
    span: {
      color: color.gray,
    }
  }
  return (
    <div style={style.div}>
      <span style={style.span}>Loading...</span>
      <CircularProgress />
    </div>
  )
}

// notification svg icons
export const MentionSvgIcon = (props) => (
  <SvgIcon viewBox="0 0 30 31" {...props}>
    <g id="Core-Experience" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="My-Inbox" transform="translate(-210.000000, -1366.000000)" fill="#F06721">
            <g id="Body" transform="translate(195.000000, 306.000000)">
                <g id="Mention" transform="translate(0.000000, 988.000000)">
                    <path d="M31.1864498,72 C28.0366925,72 25.2003977,72.6889888 22.7267632,74.0825373 C20.2530557,75.4734541 18.3284923,77.4602275 16.9945222,79.9934403 C15.6605521,82.5215359 15,85.4018383 15,88.5956031 C15,92.9912423 16.2537038,96.537287 18.7946655,99.0653096 C21.3356271,101.593332 24.9128134,102.836729 29.3680309,102.836729 C32.3545509,102.836729 35.051001,102.321284 37.4391789,101.277384 C37.6981802,101.163418 37.879547,100.888846 37.879547,100.606525 L37.879547,98.2338444 C37.879547,97.9981627 37.7578317,97.7650396 37.5635259,97.6303121 C37.3692931,97.4982163 37.1076601,97.4671478 36.8874761,97.5500458 C34.2687337,98.5473069 31.7665893,99.0368728 29.3680309,99.0368728 C25.8945037,99.0368728 23.3612909,98.1173194 21.6077138,96.3274835 C19.8489464,94.5376477 18.9423321,91.9732933 18.9423321,88.4713293 C18.9423321,85.8888456 19.4396468,83.6508928 20.4161468,81.7263295 C21.3900883,79.8043978 22.7758879,78.3538296 24.6201119,77.3229414 C26.4591456,76.2894216 28.6349614,75.763597 31.1863767,75.763597 C33.1912063,75.763597 34.9266541,76.1754552 36.434169,76.988791 C37.9416839,77.7995682 39.0787896,78.9314837 39.8947571,80.4338083 C40.7106515,81.9309427 41.1276999,83.6871515 41.1276999,85.741179 C41.1276999,87.7045596 40.7987397,89.2509649 40.1952074,90.3855121 C39.5916751,91.5226178 38.9958917,91.9163466 38.2007583,91.9163466 C37.5739064,91.9163466 37.2630756,91.755741 37.0066328,91.4138417 C36.7501901,91.0719424 36.5585159,90.4373416 36.5585159,89.471149 L36.5585159,89.0774202 L37.0040011,80.7290684 C37.0195719,80.407857 36.7993879,80.0892774 36.4937473,79.9934403 C35.628582,79.7163096 34.6676527,79.5038744 33.6108133,79.3510907 C32.5617958,79.1982338 31.6111739,79.1205261 30.7589477,79.1205261 C28.3111915,79.1205261 26.2260225,79.9675621 24.6874391,81.6304924 C23.1514143,83.2908642 22.3872763,85.4744288 22.3872763,88.0439003 C22.3872763,90.2533432 22.9286717,92.1001988 24.0657774,93.4782496 C25.2055148,94.8614176 26.8606232,95.5737261 28.8110648,95.5737261 C30.1424763,95.5737261 31.3494678,95.2447659 32.3648583,94.5790967 C32.9554515,94.1879995 33.460515,93.695802 33.8905026,93.1311601 C34.1443136,93.6311065 34.4836543,94.0817819 34.9162004,94.4625716 C35.7502242,95.1981997 36.8148125,95.5737992 37.9856183,95.5737992 C39.3766082,95.5737992 40.6587489,95.120492 41.731086,94.2502096 C42.7982329,93.379854 43.6090101,92.1702308 44.1685348,90.6730964 C44.7254279,89.1785206 45,87.5414685 45,85.7775108 C45,83.0914412 44.4301678,80.6799437 43.2774913,78.5818355 C42.124961,76.4836543 40.4698526,74.841485 38.361364,73.7017476 C36.2529485,72.5620833 33.8491998,72 31.1864498,72 L31.1864498,72 L31.1864498,72 Z M30.7590208,82.7779787 C31.4894587,82.7779787 32.1681401,82.8453059 32.7975506,82.9722114 L32.5799982,87.0181294 L32.5799982,87.0206879 C32.4789709,88.802775 32.0981812,90.0667862 31.5543004,90.8257339 C31.0077878,91.5846817 30.3420455,91.9162004 29.293028,91.9162004 C28.2932083,91.9162004 27.7026151,91.6390697 27.2648787,91.0691645 C26.829701,90.5018909 26.5448214,89.5305811 26.5448214,88.113713 C26.5448214,86.3212455 26.9514893,85.0209755 27.6923077,84.1143612 C28.4329798,83.2079662 29.3810431,82.7779787 30.7590208,82.7779787 L30.7590208,82.7779787 L30.7590208,82.7779787 Z" id="Shape"></path>
                </g>
            </g>
        </g>
    </g>
  </SvgIcon>
)

export const ReplySvgIcon = (props) => (
  <SvgIcon viewBox="0 0 30 25" {...props}>
    <g id="Core-Experience" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="My-Inbox" transform="translate(-210.000000, -623.000000)" fill="#82B2EB">
            <g id="Body" transform="translate(195.000000, 306.000000)">
                <g id="New-Reply" transform="translate(0.000000, 220.000000)">
                    <path d="M26.5733334,97 L15,108.66592 L26.5733334,120.33184 L26.5733334,113.498944 C34.8400002,113.498944 40.6266669,116.16544 44.7600002,121.9984 C43.1066669,113.6656 38.1466668,105.3328 26.5733334,103.66624 L26.5733334,97 Z" id="Shape"></path>
                </g>
            </g>
        </g>
    </g>
  </SvgIcon>
)

export const NewPostSvgIcon = (props) => (
  <SvgIcon viewBox="0 0 30 31" {...props}>
    <g id="Core-Experience" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="My-Inbox" transform="translate(-211.000000, -832.000000)" fill="#82B2EB">
            <g id="Body" transform="translate(195.000000, 306.000000)">
                <g id="New-Post" transform="translate(0.000000, 439.000000)">
                    <g id="Group" transform="translate(16.000000, 87.000000)">
                        <path d="M30.7340426,3.22340426 L27.9459574,0.439148936 C27.6580851,0.151276596 27.2795745,0.0070212766 26.9017021,0.0070212766 C26.5231915,0.0070212766 26.1446809,0.150638298 25.8574468,0.438510638 L23.627234,2.66234043 L28.5038298,7.53 L30.7340426,5.30680851 C31.3104255,4.73106383 31.3104255,3.79723404 30.7340426,3.22340426 L30.7340426,3.22340426 Z" id="Shape"></path>
                        <path d="M9.1506383,17.112766 L14.027234,21.9810638 L27.4602128,8.57297872 L22.583617,3.70468085 L9.1506383,17.112766 Z" id="Shape"></path>
                        <path d="M8.09808511,18.1538298 L7.05702128,24.06 L12.9746809,23.0214894 L8.09808511,18.1538298 Z" id="Shape"></path>
                        <path d="M21.5789362,26.6910638 L3.19212766,26.6910638 L3.19212766,8.30489362 L16.1680851,8.30489362 L19.3659574,5.11340426 L2.06425532,5.11340426 C0.928723404,5.11340426 0,6.04212766 0,7.17765957 L0,27.8189362 C0,28.9538298 0.928723404,29.8825532 2.06425532,29.8825532 L22.7061702,29.8825532 C23.8404255,29.8825532 24.7691489,28.9538298 24.7691489,27.8189362 L24.7691489,13.0608511 L21.5776596,16.247234 L21.5789362,26.6910638 L21.5789362,26.6910638 L21.5789362,26.6910638 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </SvgIcon>
)
/*eslint-enable */
