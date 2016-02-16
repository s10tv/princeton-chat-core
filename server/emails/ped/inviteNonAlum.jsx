import React from 'react'
import Layout, { accentColor } from './layout.jsx'

const s = {
  paragraph: {
    fontSize: '16px'
  }
}

export default React.createClass({
  propTypes: {
    senderName: React.PropTypes.string,
    firstName: React.PropTypes.string,
    rootURL: React.PropTypes.string
  },

  render () {
    const { senderName, firstName, rootURL } = this.props;

    return (
      <Layout>
        <div style={{
          background: '#fff',
          padding: 10
        }}>
          <h3>{firstName ? `Hey ${firstName},` : 'Hello!'}</h3>
          <p style={s.paragraph}>
            You were just invited to Pedagogy and Play{senderName ? ` by ${senderName}` : ''}!
          </p>
          <p style={s.paragraph}>
            Pedagogy and Play is a community for music teachers to meet new colleagues in
            the area, share pedagogy successes (and frustrations), and give feedback on
            any questions.
          </p>
          <p style={s.paragraph}>
            Come check it out at <a href={rootURL}>{rootURL}</a>
          </p>
        </div>
      </Layout>
    )
  }
})

