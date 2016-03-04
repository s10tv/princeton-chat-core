import SearchBox from '/src/client/modules/core/components/search.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import AmplitudeService from '/src/client/lib/amplitude.service'

const composer = ({context}, onData) => {
  const {LocalState} = context()
  onData(null, {
    searchResults: LocalState.get('SEARCH_RESULTS') || [],
    trackTextFieldFocus: () => AmplitudeService.track('focus/search'),
    trackToggle: () => AmplitudeService.track('toggle/search')
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
