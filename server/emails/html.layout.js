import invariant from 'invariant'

// adpoted from
// https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/
export function singleLineString(strings, ...values) {
  // Interweave the strings with the
  // substitution vars first.
  let output = '';
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  let lines = output.split(/(?:\r\n|\n|\r)/);

  // Rip out the leading whitespace.
  return lines.map((line) => {
    return line.replace(/^\s+/gm, '');
  }).join(' ').trim();
}

export default ({title, body}) => {
  invariant(title != null, 'Title must exist')
  invariant(body != null, 'body must exist')
  return singleLineString`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
        <title>${title}</title>
        <style>
          /* Base ------------------------------ */
          *:not(br):not(tr):not(html) {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            -webkit-text-size-adjust: none;
          }
          p {
            margin-top: 0;
            color: #74787E;
            font-size: 16px;
            line-height: 1.5em;
            text-align: left;
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `
}
