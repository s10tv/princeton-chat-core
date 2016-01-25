import React from 'react';
import List from 'material-ui/lib/lists/list';
import MUIListItem from 'material-ui/lib/lists/list-item';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const Menu = () => {
  return (
    <div style={{width: 270, backgroundColor: PRINCETON_ORANGE, height: '100%', backgroundAttachment: 'fixed'}}></div>
  )
}

export default Menu;
// const composer = ({context}, onData) => {
//   const {Meteor, Collections, FlowRouter} = context();
//   if (Meteor.subscribe('topics').ready()) {
//     const currentUser = Meteor.user();
//     var isUserActive = Meteor.user().status == 'active';
//     var topics = [];
//     if (currentUser) {
//       topics = Collections.Topics.find({ _id: { $in : currentUser.followingTopics} }).fetch();
//     }
//
//     onData(null, {isUserActive, topics, FlowRouter});
//   }
// }
//
// const ListItem = (props) => <MUIListItem innerDivStyle={{
//   paddingTop: 4,
//   paddingBottom: 4,
// }} {...props} />
//
// const Navigations = ({isUserActive, topics, FlowRouter}) => {
//   const renderedNavItems = topics.map((topic) => {
//     return <ListItem
//       key={topic._id}
//       onTouchTap={() => { FlowRouter.go(`/topics/${topic._id}`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={`#${topic.displayName}`} />
//   });
//
//   const addPost = (
//     <ListItem
//       key={'addPost'}
//       onTouchTap={() => { FlowRouter.go(`/add-post`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={'Add Post'}/>
//   )
//
//   const settings = (
//     <ListItem
//       key={'settings'}
//       onTouchTap={() => { FlowRouter.go(`/settings`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={'Princeton.Chat'}/>
//   )
//
//   const allMine = (
//     <ListItem
//       key={'all-mine'}
//       onTouchTap={() => { FlowRouter.go(`/all-mine`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={'Everything I Follow'}>
//     </ListItem>
//   );
//
//   const all = (
//     <ListItem
//       key={'all'}
//       onTouchTap={() => { FlowRouter.go(`/all`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={'All'}>
//     </ListItem>
//   );
//
//   const allTopics = (
//     <ListItem
//       key={'all-topics'}
//       onTouchTap={() => { FlowRouter.go(`/all-topics`) }}
//       style={{ color: PRINCETON_WHITE }}
//       primaryText={'>> More <<'}>
//     </ListItem>
//   )
//
//   const returnVal = isUserActive ?
//     <div>
//       <List style={{
//           width: 270,
//           backgroundColor: PRINCETON_ORANGE,
//           borderBottomWidth: 1,
//           borderBottomColor: PRINCETON_WHITE,
//         }}>
//         { settings }
//         { addPost }
//         { all }
//         { allMine }
//       </List>
//
//       <List style={{
//           width: 270,
//           marginTop: 50,
//           backgroundColor: PRINCETON_ORANGE,
//           borderBottomWidth: 1,
//           borderBottomColor: PRINCETON_WHITE,
//         }}>
//         { allTopics }
//         { renderedNavItems }
//       </List>
//     </div> :
//     <div style={{width: 270, backgroundColor: PRINCETON_ORANGE}}></div>
//
//     return returnVal;
// }
//
// export default composeAll(
//   composeWithTracker(composer),
//   useDeps()
// )(Navigations);
