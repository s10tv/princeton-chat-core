import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import Select from 'react-select'
import {Flex} from 'jsxstyle'
import LinearProgress from 'material-ui/lib/linear-progress'
import {color} from 'client/configs/theme'
import Menu from 'client/modules/core/components/menu.jsx'
import styles from './styles.jsx'
import MyAutoComplete from 'client/lib/mention.textfield.jsx'

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
     * A list of all of the topics to use for the selector
     */
    allTopics: React.PropTypes.array,

    /**
     * A function to show the followers of the post.
     */
    showTopicFollowers: React.PropTypes.func.isRequired,

    /**
     console.log(mentionedUsernames)
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
    parseAndFetchMentions: React.PropTypes.func.isRequired,
    replaceWithMention: React.PropTypes.func.isRequired,
    clearMentions: React.PropTypes.func.isRequired,
    mentions: React.PropTypes.object.isRequired
  },

  componentWillMount () {
    window.onbeforeunload = (e) => {
      e = e || window.event
      var msg = 'Are you sure you want to exit this page? ' +
        'All the effort you put into this post will be gone to waste. Forever.'
      if (e) {
        e.returnValue = msg
      }
      return msg
    }
  },

  componentWillUnmount () {
    window.onbeforeunload = null
  },

  modifyTopicsList (value) {
    this.props.fields.topicIds.onChange(value)
    this.props.updateTopicFollowers(value.split(','))
  },

  render () {
    const { fields: {title, content, topicIds},
      allTopics, showTopicFollowers, handleSubmit, submitting, error,
      numFollowersNotified, mentions, clearMentions, replaceWithMention} = this.props

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
                  floatingLabelText='Subject'
                  mentions={mentions.title}
                  clearMentions={() => clearMentions(title)}
                  onMentionTap={(user) => replaceWithMention(title, user)}
                  {...title}
                  onChange={(e) => {
                    const msg = e.target.value
                    this.props.parseAndFetchMentions(title, msg)
                    title.onChange(e)
                  }}
                />

                <MyAutoComplete
                  fullWidth
                  rowsMax={10}
                  rows={10}
                  multiLine
                  onBlur={(e) => this.onBlur(e)}
                  mentions={mentions.content}
                  clearMentions={() => clearMentions(content)}
                  onMentionTap={(user) => replaceWithMention(content, user)}
                  hintText='Start a conversation...'
                  floatingLabelText='Content'
                  {...content}
                  onChange={(e) => {
                    const msg = e.target.value
                    this.props.parseAndFetchMentions(content, msg)
                    content.onChange(e)
                  }}
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
