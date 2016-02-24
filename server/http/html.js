import invariant from 'invariant'

export default ({title, body}) => {
  invariant(title != null, 'Title must exist')
  invariant(body != null, 'body must exist')
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <link href="/css/normalize.css" media="all" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato">
        <title>${title}</title>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `
}
