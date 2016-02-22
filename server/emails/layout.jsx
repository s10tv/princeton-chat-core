import React from 'react'

//const PRINCETON_ORANGE = '#F07621'
//const PED_BLUE = '#5477AD'

export const accentColor = '#F07621'

export default React.createClass({
  render () {
    return (
      <div style={{
        fontFamily: "'Avenir Next', 'Helvetica Neue', Helvetica, sans-serif",
        width: '100% !important',
        height: '100%',
        margin: 0,
        lineHeight: 1.4,
        color: '#74787E',
        backgroundColor: '#192024'
      }}>
      <table width='100%' cellPadding='0' cellSpacing='0'>
        <tbody>
          <tr>
            <td align='center'>
              <table width='100%' cellPadding='0' cellSpacing='0'>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '25px 0',
                      backgroundColor: '#192024',
                      textAlign: 'center'
                    }}>
                      <a style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        color: accentColor
                      }}>Princeton.Chat</a>
                    </td>
                  </tr>
                  <tr>
                    <td width='100%' style={{
                      margin: 0,
                      padding: 0,
                      borderTop: '1px solid #EDEFF2',
                      borderBottom: '1px solid #EDEFF2',
                      backgroundColor: '#efefef',
                    }}>
                      <table align='center' width='570' cellPadding='0' cellSpacing='0' style={{
                        width: '570px',
                        margin: '0 auto',
                        padding: 0
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '35px' }}>
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
      </div>
    )
  }
})
