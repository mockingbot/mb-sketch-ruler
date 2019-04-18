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
  componentWillUnmount () {
    document.removeEventListener('contextmenu', (e) => { e.preventDefault() })
  }
  updateCanvasContext () {
    const { width, height, canvasConfigs } = this.props
    const { ratio } = canvasConfigs

    // 比例宽高
    this.$canvas.width = width * ratio
    this.$canvas.height = height * ratio

    const ctx = this.$canvas.getContext('2d')
    ctx.font = `${12 * ratio}px -apple-system, "Helvetica Neue", ".SFNSText-Regular", "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
    ctx.lineWidth = 1
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

  // 取消默认菜单事件
  preventDefault (e) {
    e.preventDefault()
  }

  handleRightMenu = (e) => {
    if (e.button === 2) {
      const { onhandleRightMenu, vertical } = this.props
      const clickLeft = e.clientX
      const clickTop = e.clientY
      onhandleRightMenu(vertical, clickLeft, clickTop)
    }
  }

  render () {
    return (
      <canvas className="ruler"
        ref={this.setCanvasRef}
        onClick={this.handleClick}
        onMouseEnter={this.handleEnter}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleLeave}
        onMouseDown={this.handleRightMenu}
        onContextMenu={this.preventDefault}
      />
    )
  }
}
CanvasRuler.propTypes = {
  vertical: PropTypes.bool,
  start: PropTypes.number,
  scale: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  canvasConfigs: PropTypes.object,
  selectStart: PropTypes.number,
  selectLength: PropTypes.number,
  onAddLine: PropTypes.func,
  onIndicatorShow: PropTypes.func,
  onIndicatorMove: PropTypes.func,
  onIndicatorHide: PropTypes.func,
  onhandleRightMenu: PropTypes.func
}
