import {compose} from 'mantra-core'
import {createAction as createActionCreator} from 'redux-actions'
import {browserHistory} from 'react-router'

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
export const createOnSubmit = (method, success) => {
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

export const createAction = (type, payloadCreator, metaCreator) => {
  const actionCreator = createActionCreator(type, payloadCreator, metaCreator)
  actionCreator.toString = () => type
  return actionCreator
}

export const createBoundAction = (type, payloadCreator, metaCreator) => {
  const actionCreator = createAction(type, payloadCreator, metaCreator)
  const boundAction = ({store: {dispatch}}, ...data) => dispatch(actionCreator(...data))
  boundAction.toString = actionCreator.toString
  return boundAction
}

// In almost all cases use react-redux connect is a better choice
export const composeWithRedux = (fn, L, E, options) => {
  const onPropsChange = (props, onData) => {
    const store = props.context.store
    onData(null, fn(props))
    return store.subscribe(() => {
      onData(null, fn(props))
    })
  }
  return compose(onPropsChange, L, E, options)
}

// Intended to be used with 3rd party anchor tags that would otherwise cause a
// full page refresh. It's a bit of a hack so we should probably not use it too
// often by avoiding those components in the first place
export const navigateViaRouter = (event) => {
  event.preventDefault()
  browserHistory.push(event.currentTarget.href)
}

// Simpler helper, inteded to be used via spread
export const muiLinkButton = (href) => ({
  linkButton: true,
  href: href,
  onClick: navigateViaRouter
})
