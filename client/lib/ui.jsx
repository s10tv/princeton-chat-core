import React from 'react'
import {Style} from 'radium'
import _ from 'underscore'
import _SelectField from 'material-ui/lib/select-field'
import _TextField from 'material-ui/lib/text-field'
import _FlatButton from 'material-ui/lib/flat-button'
import _RaisedButton from 'material-ui/lib/raised-button'
import _MenuItem from 'material-ui/lib/menus/menu-item'
import _Dialog from 'material-ui/lib/dialog'
import _FontIcon from 'material-ui/lib/font-icon'
import _DatePicker from 'material-ui/lib/date-picker'
import _AutoComplete from 'material-ui/lib/auto-complete'
import _Tab from 'material-ui/lib/tabs/tab'
import _Tabs from 'material-ui/lib/tabs/tabs'
import _IconButton from 'material-ui/lib/icon-button'
import _LinearProgress from 'material-ui/lib/linear-progress'
import _CircularProgress from 'material-ui/lib/circular-progress'

export const FlatButton = _FlatButton
export const RaisedButton = _RaisedButton
export const MenuItem = _MenuItem
export const Dialog = _Dialog
export const FontIcon = _FontIcon
export const DatePicker = _DatePicker
export const AutoComplete = _AutoComplete
export const Tab = _Tab
export const Tabs = _Tabs
export const IconButton = _IconButton
export const LinearProgress = _LinearProgress
export const CircularProgress = _CircularProgress

/** Wrapping MUI components for use with react-redux **/
export const TextField = (props) => (
  <_TextField {...props} errorText={props.touched && props.error}>
    {props.children}
  </_TextField>
)

export const SelectField = (props) => (
  <_SelectField {...props} onChange={(event, index, value) => {
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

export const PageControl = ({current, total}) => {
  const style = {
    div: {
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
/*eslint-enable */
