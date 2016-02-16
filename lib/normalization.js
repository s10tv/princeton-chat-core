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

export const trimSpaces = (value) => value && value.trim()

export const numbersOnly = (value) => value && value.replace(/\D/g, '')
