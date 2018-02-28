import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { drawHorizontalRuler, drawVerticalRuler } from './utils'

export default class CanvasRuler extends PureComponent {
  componentDidMount () {
    this.updateCanvasContext()
    this.drawRuler()
  }
  componentDidUpdate (prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.updateCanvasContext()
    }
    this.drawRuler()
  }
  updateCanvasContext () {
    const { width, height, canvasConfigs } = this.props
    const { ratio, fgColor } = canvasConfigs

    // 比例宽高
    this.$canvas.width = width * ratio
    this.$canvas.height = height * ratio

    const ctx = this.$canvas.getContext('2d')
    ctx.font = `${12 * ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
    ctx.lineWidth = ratio
    ctx.strokeStyle = fgColor
    ctx.textBaseline = 'middle'
    // this.ctx = ctx
  }
  drawRuler () {
    const { start, perWidth, width, height, selectStart, selectLength, canvasConfigs } = this.props
    const options = { width, height, perWidth, canvasConfigs }
    if (this.props.vertical) {
      drawVerticalRuler(this.canvasContext, start, { y: selectStart, height: selectLength }, options)
    } else {
      drawHorizontalRuler(this.canvasContext, start, { x: selectStart, width: selectLength }, options)
    }
  }
  setCanvasRef = (ref) => {
    this.$canvas = ref
    this.canvasContext = ref && ref.getContext('2d')
  }
  handleAdd = (e) => {
    const { vertical, scale, start, lines, onAddLine } = this.props
    const { offsetX, offsetY } = e.nativeEvent
    const value = start + (vertical ? offsetY : offsetX)
    lines.push(value / scale >> 0)
    onAddLine(lines, vertical)
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
    const { offsetX, offsetY } = e.nativeEvent
    const value = this.vertical ? offsetY : offsetX
    this.setState({ value })
  }
  handleLeave = () => {
    this.setState({ showIndicator: false })
  }
  render () {
    return (
      <canvas className="ruler"
        ref={this.setCanvasRef}
        onClick={this.handleAdd}
        onMouseEnter={this.handleEnter}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleLeave}
      />
    )
  }
}
CanvasRuler.propTypes = {
  dispatch: PropTypes.func
}
