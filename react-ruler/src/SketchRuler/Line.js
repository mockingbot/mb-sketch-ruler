import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

export default class Line extends PureComponent {
  handleDown = (e) => {
    const { value, vertical } = this.props
    this.startValue = value
    this.startOffset = vertical ? e.clientY : e.clientX
    document.addEventListener('mousemove', this.handleMove)
    document.addEventListener('mouseup', this.handleUp)
  }
  handleMove = (e) => {
    const { vertical, index, scale, onChange } = this.props
    const offset = vertical ? e.clientY : e.clientX
    const newValue = Math.round(this.startValue + (offset - this.startOffset) / scale)
    onChange(newValue, index)
  }
  handleUp = () => {
    document.removeEventListener('mousemove', this.handleMove)
    document.removeEventListener('mouseup', this.handleUp)
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
