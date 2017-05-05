import React, { PureComponent } from 'react'

export default class Line extends PureComponent {
  getStyle () {
    // TODO 超出最大值也需要隐藏
    const { start, vertical, value } = this.props
    const val = value - start
    if (val < 0) return { display: 'none' }
    if (vertical) {
      return { top: val }
    } else {
      return { left: val }
    }
  }
  handleDown = (e) => {
    const { value, vertical } = this.props
    this.startValue = value
    this.startOffset = vertical ? e.clientY : e.clientX
    document.addEventListener('mousemove', this.handleMove)
    document.addEventListener('mouseup', this.handleUp)
  }
  handleMove = (e) => {
    const { vertical, index, onChange } = this.props
    const offset = vertical ? e.clientY : e.clientX
    const newValue = this.startValue + offset - this.startOffset
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
    const { value } = this.props
    const style = this.getStyle()
    return (
      <div className="line" style={style} onMouseDown={this.handleDown}>
        <div className="action">
          <span className="del" onClick={this.handleRemove}>&times;</span>
          <span className="value">{value}</span>
        </div>
      </div>
    )
  }
}
