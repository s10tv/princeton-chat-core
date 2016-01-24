import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('topics').ready()) {
    const currentUser = Meteor.user();
    var topics = [];
    if (currentUser) {
      topics = Collections.Topics.find({ _id: { $in : currentUser.followingTopics} }).fetch();
    }

    onData(null, {topics, FlowRouter});
  }
}

const Navigations = ({topics ,FlowRouter}) => {
  const renderedNavItems = topics.map((topic) => {
    return <ListItem
      key={topic._id}
      onTouchTap={() => { FlowRouter.go(`/topics/${topic._id}`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={topic.displayName}>
    </ListItem>
  });

  const addPost = (
    <ListItem
      key={'addPost'}
      onTouchTap={() => { FlowRouter.go(`/add-post`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'Add Post'}/>
  )

  const settings = (
    <ListItem
      key={'settings'}
      onTouchTap={() => { FlowRouter.go(`/settings`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'Princeton.Chat'}/>
  )

  const allMine = (
    <ListItem
      key={'all-mine'}
      onTouchTap={() => { FlowRouter.go(`/all-mine`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'Everything I Follow'}>
    </ListItem>
  );

  const all = (
    <ListItem
      key={'all'}
      onTouchTap={() => { FlowRouter.go(`/all`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'All'}>
    </ListItem>
  );

  const allTopics = (
    <ListItem
      key={'all-topics'}
      onTouchTap={() => { FlowRouter.go(`/all-topics`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'>> More <<'}>
    </ListItem>
  )

  return (
    <div>
      <List style={{
          width: 270,
          backgroundColor: PRINCETON_ORANGE,
          borderBottomWidth: 1,
          borderBottomColor: PRINCETON_WHITE,
        }}>
        { settings }
        { addPost }
        { all }
        { allMine }
      </List>

      <List style={{
          width: 270,
          marginTop: 50,
          backgroundColor: PRINCETON_ORANGE,
          borderBottomWidth: 1,
          borderBottomColor: PRINCETON_WHITE,
        }}>
        { allTopics }
        { renderedNavItems }
      </List>
    </div>
  );
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Navigations);
