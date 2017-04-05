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
  handleRemove = () => {
    const { index, onRemove } = this.props
    onRemove(index)
  }
  render () {
    // TODO 拖拽
    // TODO 点击删除
    const { value } = this.props
    const style = this.getStyle()
    return (
      <div className="line" style={style}>
        <div className="action">
          <span className="del" onClick={this.handleRemove}>&times;</span>
          <span className="value">{value}</span>
        </div>
      </div>
    )
  }
}
