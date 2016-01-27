import React from 'react';
import ReactDOM from 'react-dom'
import {Flex, Block} from 'jsxstyle';
import {Message, MessageGroup} from './message.jsx';
import InputBox from '../containers/inputBox.js';

export class ScrollingContainer extends React.Component {
  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this)
    node.scrollTop = node.scrollHeight
  }
  componentDidMount() {
    this.scrollToBottom()
  }
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this)
    // Sometimes scrollTop + offsetHeight is greater than scrollHeight.. Maybe border? >= for workaround
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight >= node.scrollHeight
  }
  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.scrollToBottom()
    }
  }
  render() {
    return this.props.child
  }
}

export default (props) => (
  <Flex flexDirection='column' flex={1}>
    <ScrollingContainer child={
      <article className='post-details'>
        <header>
          <h1>{ props.post.title }</h1>
          <div>
            <span className='topic'>Legal</span>
            <span className='topic'>Operation</span>
            <span className='topic'>Programming</span>
            <span className='spacer' />
            <span className='comments-count'>2 comments</span>
          </div>
        </header>
        <MessageGroup owner={props.owner} timestamp={props.post.timestamp} content={props.post.content} />
        { props.messages.map(message =>
          <MessageGroup key={message._id} owner={message.owner} timestamp={message.timestamp} content={message.content} />
        )}
      </article>
    } />
    <InputBox postId={props.post._id} />
  </Flex>
)
