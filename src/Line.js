import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

export default class Line extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }
  handleDown = (e) => {
    const { vertical, index, scale, onMouseDown, onRelease } = this.props
    const { value: startValue } = this.state
    const startD = vertical ? e.clientY : e.clientX
    onMouseDown()
    const onMove = (e) => {
      const currentD = vertical ? e.clientY : e.clientX
      const newValue = Math.round(startValue + (currentD - startD) / scale)
      this.setState({ value: newValue })
    }
    const onEnd = () => {
      onRelease(this.state.value, index)
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
    const { vertical, start, scale } = this.props
    const { value } = this.state
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
  start: PropTypes.number,
  vertical: PropTypes.bool,
  scale: PropTypes.number,
  value: PropTypes.number,
  onRemove: PropTypes.func,
  onMouseDown: PropTypes.func,
  onRelease: PropTypes.func
}
