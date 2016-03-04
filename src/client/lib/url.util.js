import URL from 'url'

export function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const getFilenameFromURL = (url) => {
  return URL.parse(url).pathname.split('/').pop()
}

export const shortenFilename = (filename) => {
  if (filename.length > 40) {
    return '...' + filename.substr(-40)
  }

  return filename
}
