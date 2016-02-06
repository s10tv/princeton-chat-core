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
        <title>${title}</title>
        <style>
          body {
            font-family: "Avenir Next", -apple-system, BlinkMacSystemFont,
            "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
            "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `
}
