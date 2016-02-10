import React from 'react'
import {Flex} from 'jsxstyle'
import styles from '/imports/modules/core/components/styles.jsx'
import { i18n } from '/imports/libs/mantra'
import {Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody} from 'material-ui/lib/table';
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import _ from 'underscore';
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

const theme = i18n('primaryMuiTheme');
const accent1Color = theme.baseTheme.palette.accent1Color;

export default React.createClass({
  propTypes: {
    /**
     * Topic to add followers to
     */
    topic: React.PropTypes.object.isRequired,

    /**
     * Func to validate email
     */
    validateEmail: React.PropTypes.func.isRequired,

    /**
     * Func to validate name
     */
    validateName: React.PropTypes.func.isRequired,

    /**
     * Func to add followers to the topic
     */
    sendInvitations: React.PropTypes.func.isRequired,

    /**
     * Func to show a snackbar with an error string
     */
    showSnackbarWithString: React.PropTypes.func.isRequired,

    /**
     * Generates a uuid, used for storing text field refs
     */
    generateRandomString: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      textFieldRowRefs: [this.props.generateRandomString()]
    }
  },

  addNewFollower() {
    this.setState({
      textFieldRowRefs: this.state.textFieldRowRefs.concat([this.props.generateRandomString()])
    });
  },

  handleChange(e) {
    var nextState = this.state;
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  },

  sendInvitations() {
    const textFieldRows = this.state.textFieldRowRefs.map(textFieldRowRef => {
      return textFieldRow = this.refs[textFieldRowRef];
    });

    const hasValidationError = textFieldRows.reduce((acc, curTextFieldRow) => {
      return acc || curTextFieldRow.hasValidationError();
    }, false);

    if (!hasValidationError) {
      const userInfos = textFieldRows.map(textFieldRow => {
        const email = textFieldRow.refs.emailWrapper.refs.email.getValue();
        const firstName = textFieldRow.refs.firstNameWrapper.refs.firstName.getValue();
        const lastName = textFieldRow.refs.lastNameWrapper.refs.lastName.getValue();
        return { email, firstName, lastName };
      });
      this.props.sendInvitations(this.props.topic._id, userInfos);
    } else {
      this.props.showSnackbarWithString("One of your fields has errors. Please check.");
    }
  },

  removeRow(id) {
    this.setState({
      textFieldRowRefs: _.without(this.state.textFieldRowRefs, id)
    });
  },

  render() {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0})}>
        <Flex flexDirection='column' alignItems='center' className='add-followers' justifyContent='space-between' flexGrow={1}>
          <Flex flexDirection='column' alignItems='center'>
            <h1>Add followers</h1>
            <h4>Topic to follow</h4>
            <h4>#{this.props.topic.displayName}</h4>

            <Flex flexDirection='column' alignItems='center' maxWidth='700px' marginTop={30}>
              <p>New followers do not need to register for {i18n('title')} in order to participate. Each topic is analogous to a mailing list.</p>
              <p><span style={{color: '#9B9B9B'}}>To create a new post:</span> Send an email to {this.props.topic._id}@{i18n('topicMailServer')}</p>
              <p><span style={{color: '#9B9B9B'}}>To reply to a post:</span> Simply reply to the email notification</p>
            </Flex>

            <form style={{maxHeight: 300, overflowY: 'scroll', marginTop: 50}}>
              <table>
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th><div style={{width: 50, height: 50}}></div></th> {/* so the table doesn't shift when clear buttons are added */}
                  </tr>
                </thead>
                <tbody>
                  { this.state.textFieldRowRefs.map((textFieldRowRef, index) => (
                    <TextFieldRow
                      id={textFieldRowRef}
                      removeRow={this.removeRow}
                      ref={textFieldRowRef}
                      key={textFieldRowRef}
                      validateEmail={this.props.validateEmail}
                      validateName={this.props.validateName}
                      isRemoveButtonHidden={index == 0} />
                  )) }
                </tbody>
              </table>
            </form>
            <FlatButton
              label='Add Another'
              labelPosition='after'
              primary={true}
              onTouchTap={this.addNewFollower}
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              style={{marginTop: 10}}/>
          </Flex >

          <Flex marginBottom={20}>
            <RaisedButton label={giveAddFollowersLabel(this.state.textFieldRowRefs.length)} primary={true} onTouchTap={this.sendInvitations} />
          </Flex>
        </Flex>
      </main>
    )
  },
})

const TextFieldRow = React.createClass({
  propTypes: {
    /**
     * Func to validate email
     */
    validateEmail: React.PropTypes.func.isRequired,

    /**
     * Func to validate name
     */
    validateName: React.PropTypes.func.isRequired,

    /**
     * Bool to show/hide button
     */
    isRemoveButtonHidden: React.PropTypes.bool,

    /**
     * Unique identifier of row
     */
    id: React.PropTypes.string,

    /**
     * Func called from the parent to remove the row
     */
    removeRow: React.PropTypes.func.isRequired
  },

  hasValidationError() {
    return (this.refs.emailWrapper.hasValidationError() || this.refs.firstNameWrapper.hasValidationError() ||
            this.refs.lastNameWrapper.hasValidationError())
  },

  render() {
    return (
      <tr>
        <td><TextFieldEmail ref='emailWrapper' refComponent='email'
              validateEmail={this.props.validateEmail} /></td>
        <td><TextFieldName ref='firstNameWrapper' refComponent='firstName'
              hintText='Banana (optional)' validateName={this.props.validateName} />
        </td>
        <td><TextFieldName ref='lastNameWrapper' refComponent='lastName'
              hintText='Eater (optional)' validateName={this.props.validateName} />
        </td>
        { this.props.isRemoveButtonHidden
          ? null
          : (<td>
              <IconButton onTouchTap={() => this.props.removeRow(this.props.id)}>
                <FontIcon className='material-icons'>clear</FontIcon>
              </IconButton>
            </td>)
        }
      </tr>
    )
  }
});

const TextFieldEmail = React.createClass({
  propTypes: {
    /**
     * Func to validate email
     */
    validateEmail: React.PropTypes.func.isRequired,

    /**
     * Ref of a textfield
     */
    refComponent: React.PropTypes.string.isRequired
  },

  hasValidationError() {
    const textField = this.refs[this.props.refComponent];
    const error = this.props.validateEmail(textField.getValue());
    if (error.reason) {
      this.setState({ error: error.reason });
    } else {
      this.setState({ error: null });
    }
    return this.state.error != null || error.reason;
  },

  getInitialState() {
    return {
      error: null
    }
  },

  handleBlur(e) {
    const error = this.props.validateEmail(e.target.value);
    if (error.reason) {
      this.setState({ error: error.reason });
    } else {
      this.setState({ error: null });
    }
  },

  render() {
    return !this.state.error
      ? <TextField ref={this.props.refComponent}
          hintText='name@domain.com'
          onBlur={this.handleBlur} />
      : <TextField ref={this.props.refComponent}
          hintText='name@domain.com'
          onBlur={this.handleBlur}
          errorText={this.state.error}
          errorStyle={{ color: accent1Color, borderColor: accent1Color }} />
  }
});

const TextFieldName = React.createClass({
  propTypes: {
    /**
     * Func to validate name
     */
    validateName: React.PropTypes.func.isRequired,

    /**
     * TextField hint text
     */
    hintText: React.PropTypes.string.isRequired,

    /**
     * Ref of a textfield
     */
    refComponent: React.PropTypes.string.isRequired
  },

  hasValidationError() {
    const textField = this.refs[this.props.refComponent];
    const error = this.props.validateName(textField.getValue());
    if (error.reason) {
      this.setState({ error: error.reason });
    } else {
      this.setState({ error: null });
    }

    return this.state.error != null || error.reason;
  },

  getInitialState() {
    return {
      error: null
    }
  },

  handleBlur(e) {
    const error = this.props.validateName(e.target.value);
    if (error.reason) {
      this.setState({ error: error.reason });
    } else {
      this.setState({ error: null });
    }
  },

  render() {
    return !this.state.error
      ? <TextField
            ref={this.props.refComponent}
            hintText={this.props.hintText}
            onBlur={this.handleBlur} />
      : <TextField ref={this.props.refComponent}
            hintText={this.props.hintText}
            onBlur={this.handleBlur}
            errorText={this.state.error}
            errorStyle={{ color: accent1Color, borderColor: accent1Color }} />
  }
});

const giveAddFollowersLabel = (numFollowers) => {
  var str = `Add ${numFollowers} `;
  if (numFollowers == 1) {
    str = str.concat('follower');
  } else {
    str = str.concat('followers');
  }
  return str;
}
