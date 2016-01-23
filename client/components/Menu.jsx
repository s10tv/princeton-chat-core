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
    const topics = Collections.Topics.find().fetch();
    onData(null, {topics, FlowRouter});
  }
}

const Navigations = ({topics ,FlowRouter}) => {
  const renderedNavItems = topics.map((topic) => {
    return <ListItem
      key={topic._id}
      onTouchTap={() => { FlowRouter.go(`/topics/${topic._id}`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={topic.displayName} />;
  });

  const settings = (
    <ListItem
      key={'settings'}
      onTouchTap={() => { FlowRouter.go(`/settings`) }}
      style={{ color: PRINCETON_WHITE }}
      primaryText={'Princeton.Chat'}/>
  )

  return (
    <List style={{
        backgroundColor: PRINCETON_ORANGE,
        borderBottomWidth: 1,
        borderBottomColor: PRINCETON_WHITE,
      }}>
      { settings }
      { renderedNavItems }
    </List>
  );
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Navigations);
