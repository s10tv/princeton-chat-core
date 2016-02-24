export const normalizeDate = (value, prevVal) => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, '')
  if (!prevVal || value.length > prevVal.length) {
    if (onlyNums.length === 2) {
      return onlyNums + '/'
    }

    if (onlyNums.length === 4) {
      return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2) + '/'
    }
  }
  if (onlyNums.length <= 2) {
    return onlyNums
  }

  if (onlyNums.length <= 4) {
    return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2)
  }

  return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2, 4) + '/' + onlyNums.slice(4, 8)
}

export const normalizeFullName = (value, previousValue, allValues, previousAllValues) => {
  if (value === undefined) {
    return value
  }

  // firstName changed
  if (previousAllValues.firstName !== undefined && allValues.firstName !== previousAllValues.firstName) {
    const valWithoutName = value.slice(previousAllValues.firstName.length)
    return allValues.firstName + valWithoutName
  }

  // lastName changed
  if (previousAllValues.lastName !== undefined && allValues.lastName !== previousAllValues.lastName) {
    const oldFullName = `${allValues.firstName} ${previousAllValues.lastName}`
    const valWithoutFullName = value.slice(oldFullName.length)
    return `${allValues.firstName} ${allValues.lastName}${valWithoutFullName}`
  }

  const { firstName, lastName } = allValues
  const fullName = `${firstName} ${lastName} `

  if (value.length <= fullName.length) {
    return fullName
  }

  // typing forward
  if (previousValue === undefined) {
    return value
  }

  // typing forward
  if (value.length > previousValue.length) {
    console.log('typing forward')
    return value
  }

  if (value.length > fullName.length) {
    return value
  }
}

export const trimSpaces = (value) => value && value.trim()

export const numbersOnly = (value) => value && value.replace(/\D/g, '')
