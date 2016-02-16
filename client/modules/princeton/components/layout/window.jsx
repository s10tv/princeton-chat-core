import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'

export default React.createClass({
  mixins: [
    StyleResizable
  ],

  propTypes: {
    children: React.PropTypes.node
  },

  render () {
    const isAtLeastDesktop = this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    const isAtLeastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
    const isMobile = !(isAtLeastTablet || isAtLeastDesktop)
    return (
      <div style={style.pageWrapper}>
        { React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, { isMobile })
        }) }
      </div>
    )
  }
})

const style = {
  pageWrapper: {
    height: '100vh',
    display: 'flex'
  }
}
