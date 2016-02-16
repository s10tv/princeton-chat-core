import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
import Radium from 'radium'

const Window = React.createClass({
  mixins: [
    StyleResizable
  ],

  propTypes: {
    children: React.PropTypes.node,
    style: React.PropTypes.object
  },

  render () {
    const isAtLeastDesktop = this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    const isAtLeastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
    const isMobile = !(isAtLeastTablet || isAtLeastDesktop)
    return (
      <div style={[style.pageWrapper, this.props.style]}>
        { React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, { isMobile })
        }) }
      </div>
    )
  }
})

export default Radium(Window)

const style = {
  pageWrapper: {
    height: '100vh',
    display: 'flex'
  }
}
