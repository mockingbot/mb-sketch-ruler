import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { contextTypes } from '../utils'
import Line from './Line'

export default class Ruler extends Component {
  constructor () {
    super()
    this.state = {
      showIndicator: false
    }
  }
  componentDidMount () {
    Object.assign(this, this.context)
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }
  componentWillReceiveProps (nextProps) {
    const widthChange = this.props.width !== nextProps.width
    const heightChange = this.props.height !== nextProps.height
    this.shouldResize = widthChange || heightChange
  }
  componentDidUpdate () {
    const { start, select } = this.props
    this.shouldResize && this.handleResize(false)
    this.drawRuler(start, select)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize = (redraw=true) => {
    const { width, height } = this.props

    // 实际宽高
    this.domWidth = width
    this.domHeight = height
    // 比例宽高
    this.width = width * this.ratio
    this.height = height * this.ratio
    this.ruler.width = this.width
    this.ruler.height = this.height

    const ctx = this.ruler.getContext('2d')
    ctx.font = `${12 * this.ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
    ctx.lineWidth = this.ratio
    ctx.strokeStyle = this.fgColor
    ctx.textBaseline = 'middle'
    this.ctx = ctx

    const { start, select } = this.props
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
    const { scale } = this.context
    const { vertical, onLineChange } = this
    const { start, lines } = this.props
    const { offsetX, offsetY } = e.nativeEvent
    const value = start + (vertical ? offsetY : offsetX)
    lines.push(value / scale >> 0)
    onLineChange(lines, vertical)
  }
  handleChange = (value, index) => {
    const { onLineChange } = this.context
    // 左右或上下超出时, 删除该条对齐线
    const offset = value - this.props.start
    const maxOffset = this.vertical ? this.domHeight : this.domWidth

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
    const { scale } = this.context
    const { vertical } = this
    const { showIndicator, value } = this.state
    const { start, lines } = this.props
    const className = vertical ? 'v-container' : 'h-container'
    const indicatorStyle = vertical ? { top: value } : { left: value }
    const indicatorValue = (start + value) / scale >> 0

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
          {
            lines.map((v, i) =>
              <Line
                key={i}
                index={i}
                value={v >> 0}
                scale={scale}
                offset={-start}
                vertical={vertical}
                onChange={this.handleChange}
                onRemove={this.handleRemove}
              />
            )
          }
        </div>
        {
          showIndicator &&
          <div className="indicator" style={indicatorStyle}>
            <span className="value">{indicatorValue}</span>
          </div>
        }
      </div>
    )
  }
}
Ruler.contextTypes = contextTypes
Ruler.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  start: PropTypes.number,
  select: PropTypes.object,
  lines: PropTypes.array,
}
