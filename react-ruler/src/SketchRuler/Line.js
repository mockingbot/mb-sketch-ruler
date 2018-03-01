import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

export default class Line extends PureComponent {
  handleDown = (e) => {
    const { vertical, index, value, scale, onChange, onMouseDown, onRelease } = this.props
    const startValue = value
    const startD = vertical ? e.clientY : e.clientX
    onMouseDown()
    const onMove = (e) => {
      const currentD = vertical ? e.clientY : e.clientX
      const newValue = Math.round(startValue + (currentD - startD) / scale)
      onChange(newValue, index)
    }
    const onEnd = () => {
      onRelease()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
  }
  handleRemove = () => {
    const { index, onRemove } = this.props
    onRemove(index)
  }

  render () {
    const { vertical, start, scale, value } = this.props
    const offset = (value - start) * scale
    if (offset < 0) return null
    const lineStyle = vertical ? { top: offset } : { left: offset }

    return (
      <div className="line" style={lineStyle} onMouseDown={this.handleDown}>
        <div className="action">
          <span className="del" onClick={this.handleRemove}>&times;</span>
          <span className="value">{value}</span>
        </div>
      </div>
    )
  }
}
Line.propTypes = {
  index: PropTypes.number,
  vertical: PropTypes.bool,
  offset: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  onRemove: PropTypes.func
}
