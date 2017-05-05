import React, { Component } from 'react'
import { contextTypes } from '../utils'
import Line from '../Line'

// TODO 两个ruler都写完后, 抽象公用逻辑到父类

export default class Ruler extends Component {
  constructor () {
    super()
    this.state = {
      showIndicator: false
    }
  }
  componentDidMount () {
    Object.assign(this, this.context)
    const { width, height } = this.ruler.getBoundingClientRect()
    this.width = width * this.ratio
    this.height = height * this.ratio
    this.ruler.width = this.width
    this.ruler.height = this.height
  }
  componentWillReceiveProps ({ start, select }) {
    this.drawRuler(start, select)
  }
  checkLock () {
    if (this.lock) return true
    this.lock = true
    setTimeout(() => {
      this.lock = false
    }, 17)
  }
  drawRuler () {
    console.error('请务必重载drawRuler方法')
  }
  handleEnter = (e) => {
    const { offsetX } = e.nativeEvent
    this.setState({
      showIndicator: true,
      value: offsetX
    })
  }
  handleMove = (e) => {
    if (!this.state.showIndicator) return
    if (this.checkLock()) return
    const { offsetX, offsetY } = e.nativeEvent
    const value = this.vertical ? offsetY : offsetX
    this.setState({ value })
  }
  handleLeave = () => {
    this.setState({ showIndicator: false })
  }
  handleAdd = (e) => {
    const { vertical, onLineChange } = this
    const { start, lines } = this.props
    const { offsetX, offsetY } = e.nativeEvent
    const value = start + (vertical ? offsetY : offsetX)
    lines.push(value)
    onLineChange(lines, vertical)
  }
  handleChange = (value, index) => {
    const { onLineChange } = this.context
    // 左右或上下超出时, 删除该条对齐线
    const offset = value - this.props.start
    const maxOffset = this.vertical ? this.height : this.width
    if (offset < 0 || offset > maxOffset) {
      this.handleRemove(index)
    } else {
      const { lines } = this.props
      lines[index] = value
      onLineChange(lines, this.vertical)
    }
  }
  handleRemove = (index) => {
    const { onLineChange } = this.context
    const { lines } = this.props
    lines.splice(index, 1)
    onLineChange(lines, this.vertical)
  }
  render () {
    const { vertical } = this
    const { showIndicator, value } = this.state
    const { start, lines } = this.props
    const className = vertical ? 'v-container' : 'h-container'
    const indicatorStyle = vertical ? { top: value } : { left: value }
    return (
      <div className={className}>
        <canvas className="ruler"
          ref={ref => this.ruler = ref}
          onClick={this.handleAdd}
          onMouseEnter={this.handleEnter}
          onMouseMove={this.handleMove}
          onMouseLeave={this.handleLeave}
        />
        <div className="lines">
          { lines.map((v, i) => {
            return (
              <Line
                key={i}
                index={i}
                value={v}
                start={start}
                vertical={vertical}
                onChange={this.handleChange}
                onRemove={this.handleRemove} />
              )
          }) }
        </div>
        { showIndicator ? (
          <div className="indicator" style={indicatorStyle}>
            <span className="value">{start + value}</span>
          </div>
        ) : null }
      </div>
    )
  }
}
Ruler.contextTypes = contextTypes
