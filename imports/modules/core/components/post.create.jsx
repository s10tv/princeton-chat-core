import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import {Flex} from 'jsxstyle'

export default ({open, handleClose}) => (
  <Dialog
     title='New Post'
     actions={[
       <FlatButton
             label='Cancel'
             secondary={true}
             onTouchTap={handleClose} />,
       <FlatButton
         label='Post'
         primary={true}
         disabled={true}
         onTouchTap={handleClose} />,
     ]}
     modal={true}
     open={open}>
     <Flex flexDirection='column'>
       <TextField fullWidth={true} floatingLabelText='Title' />
       <TextField fullWidth={true} rows={5} multiLine={true} 
         hintText='What do you want to say to other Princetonians?'
         floatingLabelText='Content' />
        { /* Replace the following with react-select */ }
        <TextField fullWidth={true} floatingLabelText='Topics' multiLine={true} />
     </Flex>
   </Dialog>
)
