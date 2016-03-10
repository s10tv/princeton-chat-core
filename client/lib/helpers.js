/* @flow */
import Immutable from 'immutable'
import invariant from 'invariant'
import {compose} from 'mantra-core'
import {createAction as _createAction} from 'redux-actions'
import {createReducer as _createReducer} from 'redux-immutablejs'
import {browserHistory} from 'react-router'

export const createReducer = (initialState, handlers, constructor) => {
  const enforceImmutable = Immutable.Iterable.isIterable(initialState)
  return _createReducer(initialState, handlers, enforceImmutable, constructor)
}

export const createAction = (type, payloadCreator, metaCreator) => {
  const actionCreator = _createAction(type, payloadCreator, metaCreator)
  actionCreator.toString = () => type
  return actionCreator
}

export const bindContext = (actionCreator, defaultContext) => {
  let boundAction = (context, ...args) => {
    invariant(context.store, 'context.store must not be null')
    context.store.dispatch(actionCreator(...args))
  }
  if (defaultContext !== undefined) {
    boundAction = boundAction.bind(null, defaultContext)
  }
  boundAction.toString = actionCreator.toString
  return boundAction
}

// In almost all cases use react-redux connect is a better choice
export const composeWithRedux = (fn: Function, L: any, E: any, options: Object) : Function => {
  const onPropsChange = (props, onData) => {
    const store = props.context.store
    onData(null, fn(props))
    return store.subscribe(() => {
      onData(null, fn(props))
    })
  }
  return compose(onPropsChange, L, E, options)
}

/*
Transform Meteor server errors into errors understood by redux form
http://erikras.github.io/redux-form/#/api/reduxForm

> If your onSubmit function returns a promise, the submitting property will be set
> to true until the promise has been resolved or rejected. If it is rejected with
> an object matching { field1: 'error', field2: 'error' } then the submission
> errors will be added to each field (to the error prop) just like async validation
> errors are. If there is an error that is not specific to any field, but
> applicable to the entire form, you may pass that as if it were the error for
> a field called _error, and it will be given as the error prop.

So on the server side if validation fails we should set the `err.reason` field to
be a overall human-readable description of why the form submission failed
and set the `err.details` field to be field-specific description of errors. e.g.
```
throw new Meteor.Error('invalid-input', 'Your input is invalid', {email: 'This is not a valid email'})
```
*/
export const createOnSubmit = (method: string, success: () => void) : Function => {
  // Creates an action passed as onSubmit property into redux form
  return (context, data) => {
    const {Meteor} = context
    return new Promise((resolve, reject) => {
      Meteor.call(method, data, (err, res) => {
        if (err) {
          console.error(`Failure calling method ${method}`, err)
          reject({
            ...(typeof err.details === 'object' ? err.details : {}),
            _error: err.reason || 'An unknown error has occured'
          })
        } else {
          resolve(res)
          success && success(context, res)
        }
      })
    })
  }
}

// Intended to be used with 3rd party anchor tags that would otherwise cause a
// full page refresh. It's a bit of a hack so we should probably not use it too
// often by avoiding those components in the first place
export const navigateViaRouter = (event: any) : void => {
  event.preventDefault()
  browserHistory.push(event.currentTarget.href)
}

// Simpler helper, inteded to be used via spread
export const muiLinkButton = (href: string) : Object => ({
  linkButton: true,
  href: href,
  onClick: navigateViaRouter
})
