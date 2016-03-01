import React from 'react'
import Radium from 'radium'
import {color, fontSize} from '/client/configs/theme'
import style from '../configs/style.js'
import {SelectField, TextField, LinearProgress, FlatButton,
  MenuItem} from '/client/lib/ui.jsx'

const StudentFormComponent = (props) => {
  const {fields: {domain, netid, classYear}, handleSubmit} = props
  const {domains, error, submitting} = props
  return (
    <form style={style.form} onSubmit={handleSubmit}>
      <TextField hintText='Princeton Class Year (e.g. 2012)' fullWidth {...classYear} />
      <div style={s.emailContainer}>
        <TextField hintText='netid' {...netid} style={s.netid} />
        <span style={s.atSymbol}>@</span>
        <SelectField hintText='domain' {...domain}>
          {domains.map((d) =>
            <MenuItem key={d} value={d} primaryText={d} />
          )}
        </SelectField>
      </div>
      <a style={s.manualInvite} href='/request-invite'>
        Don't have access to your Princeton email?
      </a>
      {error && <p style={style.error}>{error}</p>}
      <FlatButton type='submit' style={style.button} label='Get Invited' disabled={submitting}
        backgroundColor={submitting ? color.gray : color.green} hoverColor={color.lightGreen} />
      {submitting && <LinearProgress color={color.brand.primary} />}
    </form>
  )
}

const s = {
  emailContainer: {
    marginTop: 5,
    display: 'flex',
    alignItems: 'center'
  },
  netid: {
    width: 150
  },
  atSymbol: {
    marginRight: 4
  },
  manualInvite: {
    color: color.white,
    fontSize: fontSize.xs
  }
}

export default Radium(StudentFormComponent)
