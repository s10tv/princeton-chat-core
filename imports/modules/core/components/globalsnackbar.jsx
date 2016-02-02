import React from 'react'
import Snackbar from 'material-ui/lib/snackbar';

export default React.createClass({
  propTypes: {
    /**
     * If true, shows a snackbar with a coressponding error
     */
    isSnackbarOpen: React.PropTypes.bool.isRequired,

    /**
     * Function to close snackbar
     */
    closeSnackbar: React.PropTypes.func.isRequired,

    /**
     * Description of error shown in snackbar
     */
    snackbarErrorString: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <Snackbar
        open={this.props.isSnackbarOpen}
        message={this.props.snackbarErrorString}
        autoHideDuration={4000}
        onRequestClose={this.props.closeSnackbar}
      />
    )
  }
});
