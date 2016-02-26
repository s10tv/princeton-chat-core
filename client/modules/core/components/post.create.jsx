import React from 'react'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import Select from 'react-select'
import {Flex} from 'jsxstyle'
import LinearProgress from '../../../../node_modules/material-ui/lib/linear-progress'
import {color} from '/client/configs/theme'
import Menu from '/client/modules/core/components/menu.jsx'
import styles from './styles.jsx'
import MyAutoComplete from '/client/lib/mention.textfield.jsx'

/**
 * https://github.com/erikras/redux-form/issues/82
 */
class ReduxFormSelect extends React.Component {
  render () {
    const {value, onBlur, ...props} = this.props // onBlur and value was on this.props.fields.myField in MyForm
    return <Select
      value={value || ''}          // because react-select doesnt like the initial value of undefined
      onBlur={() => onBlur(value)} // just pass the current value (updated on change) on blur
      {...props} />                // options are part of other props
  }
}

ReduxFormSelect.propTypes = {
  value: React.PropTypes.string,
  onBlur: React.PropTypes.func
}

export default React.createClass({
  propTypes: {

    /**
     * Function to call when we want to close the modal.
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * A list of all of the topics to use for the selector
     */
    allTopics: React.PropTypes.array,

    /**
     * A function to show the followers of the post.
     */
    showTopicFollowers: React.PropTypes.func.isRequired,

    /**
     * Updates the list of followers whenever a new topic is selected.
     */
    updateTopicFollowers: React.PropTypes.func.isRequired,

    /**
     * Number of people who will be notified about this post
     */
    numFollowersNotified: React.PropTypes.number.isRequired,

    /**
     * Function to show snackbar with an error string
     */
    showSnackbarError: React.PropTypes.func.isRequired,

    fields: React.PropTypes.shape({
      title: React.PropTypes.object.isRequired,
      content: React.PropTypes.object.isRequired,
      topicIds: React.PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    error: React.PropTypes.string,
    submitting: React.PropTypes.bool,
    sidebarOpen: React.PropTypes.bool.isRequired,
    createPostTopicWrapper: React.PropTypes.object.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    showSidebar: React.PropTypes.func.isRequired,
    fetchMentions: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      hasWrittenAnything: false
    }
  },

  modifyTopicsList (value) {
    this.props.fields.topicIds.onChange(value)
    this.props.updateTopicFollowers(value.split(','))
  },

  onBlur (e) {
    if (e.currentTarget.value) {
      this.setState({ hasWrittenAnything: true })
    } else {
      this.setState({ hasWrittenAnything: false })
    }
  },

  render () {
    const { fields: {title, content, topicIds},
      allTopics, showTopicFollowers, handleSubmit, submitting, error,
      numFollowersNotified} = this.props

    return (
      <main style={Object.assign({}, styles.main, {
        marginLeft: this.props.sidebarOpen ? 240 : 0
      })}>
        <Flex className='no-scrollbar' flexDirection='column' flexGrow={1}>
          <Menu
            topic={this.props.createPostTopicWrapper}
            shouldShowSearch={false}
            {...this.props} />
          <Flex className='no-scrollbar' flex='1 1 0px' overflowY='scroll' padding='0px 24px 24px 24px'>
            <form style={{
              width: '100%'
            }} onSubmit={handleSubmit}>
              <Flex flexDirection='column'>
                <MyAutoComplete
                  fullWidth
                  onBlur={(e) => this.onBlur(e)}
                  fetchMentions={this.props.fetchMentions}
                  floatingLabelText='Subject'
                  {...title}
                />

                <MyAutoComplete
                  fullWidth
                  rowsMax={10}
                  rows={10}
                  multiLine
                  onBlur={(e) => this.onBlur(e)}
                  fetchMentions={this.props.fetchMentions}
                  hintText='Start a conversation...'
                  floatingLabelText='Content'
                  {...content}
                />

                <ReduxFormSelect {...topicIds}
                  placeholder='Post in channels ... '
                  options={allTopics}
                  multi
                  simpleValue
                  onChange={this.modifyTopicsList} />

                {submitting && <LinearProgress color={color.brand.primary} style={{
                  marginTop: 15
                }} />}

                {error && <p style={{
                  color: color.brand.danger,
                  marginTop: 15,
                  marginBottom: 0
                }}>{error}</p>}

                <Flex flexDirection={this.props.isMobile ? 'column' : 'row'}
                  justifyContent={this.props.isMobile ? 'center' : 'space-between'}
                  alignItems='center' marginTop={15} flexWrap='wrap'>
                  {!this.props.fields.topicIds ? <Flex />
                    : <a href='#' onClick={showTopicFollowers} style={{
                      textAlign: 'center'
                    }}>
                      {numFollowersNotified} people will be notified
                    </a>}

                  <RaisedButton
                    label='Post'
                    type='submit'
                    style={Object.assign({
                      width: 200
                    }, this.props.isMobile && { marginTop: 10 })}
                    primary
                    disabled={submitting} />
                </Flex>
              </Flex>
            </form>
          </Flex>
        </Flex>
      </main>
    )
  }
})
