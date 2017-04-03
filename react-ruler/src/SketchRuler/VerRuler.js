import React, { Component, PropTypes } from 'react'
import { contextTypes } from './utils'
import Line from './Line'

export default class VerRuler extends Component {
  state = {
    showIndicator: false
  }
  componentDidMount () {
    Object.assign(this, this.context)
    this.height = this.ruler.getBoundingClientRect().height
    this.ruler.width = this.thick
    this.ruler.height = this.height
    this.ctx = this.ruler.getContext('2d')
    this.drawVerRuler()
  }
  componentWillReceiveProps () {
    this.drawVerRuler()
  }
  checkLock () {
    if (this.lock) return true
    this.lock = true
    setTimeout(() => {
      this.lock = false
    }, 10)
  }
  drawVerRuler () {
    const { ctx, fontScale, scale, ratio } = this
    const { select, start } = this.props

    // 绘制刻度尺的背景
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.thick, this.height)

    // 先根据iphone高度绘制阴影
    if (select) {
      const { y, height } = select
      // 阴影起点坐标
      const posY = (y * scale - start) * ratio
      // 阴影高度
      const shadowHeight = height * ratio * scale
      ctx.fillStyle = this.shadowColor
      ctx.fillRect(0, posY, this.thick, shadowHeight)
    }
    //再画刻度和文字(因为刻度遮住了阴影)
    //移动画布原点,方便绘制
    ctx.translate(0, -start * this.ratio)

    ctx.beginPath()
    ctx.fillStyle = this.fontColor

    const perHeight = this.perWidth
    const startY = start - start % perHeight
    for (let i = startY; i < startY + this.height / ratio; i += perHeight) {
      var tempY = ((i >> 0) + 0.5) * ratio
      ctx.moveTo(this.thick, tempY)
      //绘制长刻度
      if (i % (perHeight * 10) === 0) {
        //这里先保存一下状态
        ctx.save()
        //将原点转移到当前画笔所在点
        ctx.translate(this.thick, (i - 2) * ratio)
        // 旋转 -90 度
        ctx.rotate(-Math.PI / 2)
        // 画文字
        ctx.scale(fontScale, fontScale)
        ctx.fillText(i / scale, 2 * ratio, -this.thick / 3 * 2)
        // 回复刚刚保存的状态
        ctx.restore()
        ctx.lineTo(0, tempY)

      } else { //绘制短刻度
        ctx.lineTo(this.thick * 2 / 3, tempY)
      }
      ctx.stroke()
    }
    ctx.closePath()
    ctx.translate(0, start * ratio)
  }
  handleEnter = (e) => {
    const { offsetY } = e.nativeEvent
    this.setState({
      showIndicator: true,
      value: offsetY
    })
  }
  handleMove = (e) => {
    if (!this.state.showIndicator) return
    if (this.checkLock()) return
    const { offsetY } = e.nativeEvent
    this.setState({ value: offsetY })
  }
  handleLeave = (e) => {
    // this.setState({ showIndicator: false })
  }
  render () {
    const { showIndicator, value } = this.state
    const { start, lines } = this.props
    return (
      <div className="v-container">
        <canvas className="ruler"
          ref={ref => this.ruler = ref}
          onMouseEnter={this.handleEnter}
          onMouseMove={this.handleMove}
          onMouseLeave={this.handleLeave}
        />
        <div className="lines">
          { lines.map((v, i) => {
            return <Line vertical key={i} start={start} value={v} />
          }) }
        </div>
        { showIndicator ? (
          <div className="indicator" style={{ top: value }}>
            <span className="value">{value}</span>
          </div>
        ) : null }
      </div>
    )
  }
}
VerRuler.contextTypes = contextTypes
