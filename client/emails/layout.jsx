import React from 'react'

export default React.createClass({
  render () {
    return (
      <table width='100%' cellPadding='0' cellSpacing='0'>
        <tbody>
          <tr>
            <td align='center'>
              <table width='100%' cellPadding='0' cellSpacing='0'>
                <tbody>
                  <tr>
                    <td>
                      <a>Princeton.Chat</a>
                    </td>
                  </tr>
                  <tr>
                    <td width='100%'>
                      <table align='center' width='570' cellPadding='0' cellSpacing='0'>
                        <tbody>
                          <tr>
                            <td>
                              {this.props.children}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
})
