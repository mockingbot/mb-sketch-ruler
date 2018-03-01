import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { drawHorizontalRuler, drawVerticalRuler } from './utils'

const getValueByOffset = (offset, start, scale) => Math.round(start + offset / scale)

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
    ctx.lineWidth = 1
    ctx.strokeStyle = fgColor
    ctx.textBaseline = 'middle'
  }
  drawRuler () {
    const { start, scale, width, height, selectStart, selectLength, canvasConfigs } = this.props
    const options = { scale, width, height, canvasConfigs }
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
  handleClick = (e) => {
    const { vertical, scale, start, onAddLine } = this.props
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    onAddLine(getValueByOffset(offset, start, scale))
  }
  handleEnter = (e) => {
    const { vertical, scale, start, onIndicatorShow } = this.props
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    onIndicatorShow(getValueByOffset(offset, start, scale))
  }
  handleMove = (e) => {
    const { vertical, scale, start, onIndicatorMove } = this.props
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    onIndicatorMove(getValueByOffset(offset, start, scale))
  }
  handleLeave = () => this.props.onIndicatorHide()

  render () {
    return (
      <canvas className="ruler"
        ref={this.setCanvasRef}
        onClick={this.handleClick}
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
