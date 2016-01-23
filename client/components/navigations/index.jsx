import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const composer = ({context}, onData) => {
  const {Meteor, Collections} = context();
  if (Meteor.subscribe('topics').ready()) {
    const posts = Collections.Topics.find().fetch();
    onData(null, {posts});
  }
}

const Navigations = ({posts}) => {
  const renderedNavItems = posts.map((navItem) => {
    return <ListItem style={{ color: PRINCETON_WHITE }} primaryText="Hardware" />;
  });

  return (
    <List style={{
        backgroundColor: PRINCETON_ORANGE,
        borderBottomWidth: 1,
        borderBottomColor: PRINCETON_WHITE,
      }}>

      { renderedNavItems }
    </List>
  );
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Navigations);
