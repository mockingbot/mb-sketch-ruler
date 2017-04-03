import React, { Component, PropTypes } from 'react'
import { contextTypes } from './utils'
import Line from './Line'

// TODO 两个ruler都写完后, 抽象公用逻辑到父类

export default class HorRuler extends Component {
  state = {
    showIndicator: false
  }
  componentDidMount () {
    Object.assign(this, this.context)
    this.width = this.ruler.getBoundingClientRect().width
    this.ruler.width = this.width * this.ratio
    this.ruler.height = this.thick * this.ratio
    this.ctx = this.ruler.getContext('2d')
    this.drawHorRuler()
  }
  componentWillReceiveProps () {
    this.drawHorRuler()
  }
  checkLock () {
    if (this.lock) return true
    this.lock = true
    setTimeout(() => {
      this.lock = false
    }, 17)
  }
  drawHorRuler () {
    const { ctx, fontScale, scale, ratio } = this
    const { select, start } = this.props

    // 绘制刻度尺的背景
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.width, this.thick)

    // 先根据iphone宽度绘制阴影
    if (select) {
      const { x, width } = select
      // 阴影起点坐标
      const posX = (x * scale - start) * ratio
      // 阴影宽度
      const shadowWidth = width * ratio * scale
      ctx.fillStyle = this.shadowColor
      ctx.fillRect(posX, 0, shadowWidth, this.thick)
    }
    //再画刻度和文字(因为刻度遮住了阴影)
    //移动画布原点,方便绘制
    ctx.translate(-start * this.ratio, 0)

    ctx.beginPath() //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
    ctx.fillStyle = this.fontColor

    const perWidth = this.perWidth
    const startX = start - start % perWidth
    for (let i = startX; i < startX + this.width / ratio; i += perWidth) {
      var tempX = ((i >> 0) + 0.5) * ratio
      ctx.moveTo(tempX, this.thick)
      //绘制长刻度
      if (i % (perWidth * 10) === 0) {
        ctx.save()
        ctx.translate((i + 2) * ratio, 0)
        ctx.scale(fontScale, fontScale)
        ctx.fillText(i / scale, 2 * ratio, this.thick / 2)
        ctx.restore()
        ctx.lineTo(tempX, 0)
      } else { //绘制短刻度
        ctx.lineTo(tempX, this.thick * 2 / 3)
      }
      ctx.stroke()
    }
    ctx.closePath()
    ctx.translate(start * ratio, 0)
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
    const { offsetX } = e.nativeEvent
    this.setState({ value: offsetX })
  }
  handleLeave = (e) => {
    // this.setState({ showIndicator: false })
  }
  handleClick = (e) => {
    const { start, onAddLine } = this.props
    const { offsetX } = e.nativeEvent
    const value = start + offsetX
  }
  render () {
    const { showIndicator, value } = this.state
    const { start, lines } = this.props
    return (
      <div className="h-container">
        <canvas className="ruler"
          ref={ref => this.ruler = ref}
          onClick={this.handleClick}
          onMouseEnter={this.handleEnter}
          onMouseMove={this.handleMove}
          onMouseLeave={this.handleLeave}
        />
        <div className="lines">
          { lines.map((v, i) => {
            return <Line key={i} start={start} value={v} />
          }) }
        </div>
        { showIndicator ? (
          <div className="indicator" style={{ left: value }}>
            <span className="value">{start + value}</span>
          </div>
        ) : null }
      </div>
    )
  }
}
HorRuler.contextTypes = contextTypes
