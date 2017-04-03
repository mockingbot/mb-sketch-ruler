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
  render () {
    // TODO 拖拽
    // TODO 点击删除
    const { value } = this.props
    const style = this.getStyle()
    return (
      <div className="line" style={style}>
        <span className="value">{value}</span>
        <span className="del"></span>
      </div>
    )
  }
}
