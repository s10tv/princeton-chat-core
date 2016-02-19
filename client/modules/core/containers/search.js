import SearchBox from '/client/modules/core/components/search.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

const composer = ({context}, onData) => {
  const {LocalState} = context()
  onData(null, {
    searchResults: LocalState.get('SEARCH_RESULTS') || []
  })
}

const depsMapper = (context, actions) => {
  return {
    search: actions.search.search,
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SearchBox)
