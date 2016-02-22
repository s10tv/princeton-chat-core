var request = require('request')
// request('http://www.google.com', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Show the HTML for the Google homepage.
//   }
// })

// Basically javax.faces.ViewState is very important

// https://puwebp.princeton.edu/tigerNet/startPage.jsf

request.post({
  url: 'https://puwebp.princeton.edu/tigerNet/verifyAffiliation.jsf',
  headers: {
    // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103 Safari/537.36',
    // 'Referer': 'https://puwebp.princeton.edu/tigerNet/startPage.jsf',
    // 'Cookie': 'JSESSIONID=gz9TW6DTNHsGB43QWr6VP8zlHWGpFz2phhrv0gk7k3BY3XQdnyQv!-1102072508',
    'Cookie': 'JSESSIONID=y1vcW6HMfYjngXTV0LvKZMLPYNsG2ntxJ2tMVhTyJrPYgNYlfG1H!-1102072508'
  },
  form: {
    'j_idt28': 'j_idt28',
    'j_idt67:firstName': 'Tony',
    'j_idt67:lastName': 'Xiao',
    'j_idt67:birthDate_input': '05/05/1989',
    'j_idt67:classYear': '2012',
    'j_idt67:degree': 'AB',
    'j_idt94': 'Next ⇒',
    'javax.faces.ViewState': '-2795199216095107866:-7097254731865547708'
  }
}, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(body) // Show the HTML for the Google homepage.
  } else {
    console.log(response.statusCode, error)
  }
})

// Cookie:JSESSIONID=y1vcW6HMfYjngXTV0LvKZMLPYNsG2ntxJ2tMVhTyJrPYgNYlfG1H!-1102072508
// JSESSIONID=y1vcW6HMfYjngXTV0LvKZMLPYNsG2ntxJ2tMVhTyJrPYgNYlfG1H!-1102072508
