/*eslint-disable */
// eslint validation is disabled because this file is copied from github
// https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/utils/validation.js

import { degrees } from '/lib/data'
import moment from 'moment'

const isEmpty = value => value === undefined || value === null || value === ''
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ]

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address'
  }
}

export function degree(value) {
  if (!degrees.reduce((acc, degree) => {
    return acc || degree.value
  }, false)) {
    return 'No such degree found'
  }
}

// mm/dd/yyyy
export function dateFormat(value) {
  if (!moment(value, "MM/DD/YYYY", true).isValid()) {
    return 'Date should be in mm/dd/yyyy format'
  }
}

export function isNumericString(value) {
  if (!/^[-+]?[0-9]+$/.test(value)) {
    return 'Should be a number'
  }
}

export function classYear(value) {
  if (!(+value >= 1912) && !(+value <= 2021)) {
    return 'Class year should be a number between 1912 and 2021'
  }
}

export function princeton(value) {
  if (!/@alumni.princeton.edu$/i.test(value)) {
    return 'Not a princeton email address'
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required'
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`
    }
  }
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`
    }
  }
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer'
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`
    }
  }
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match'
      }
    }
  }
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {}
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])) // concat enables both functions and arrays of functions
      const error = rule(data[key], data)
      if (error) {
        errors[key] = error
      }
    })
    return errors
  }
}
