import Ruler from './Ruler'

export default class VerRuler extends Ruler {
  constructor () {
    super()
    this.vertical = true
  }
  componentDidMount () {
    super.componentDidMount()
    const ctx = this.ruler.getContext('2d')
    ctx.font = `${12 * this.ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
    ctx.lineWidth = this.ratio
    ctx.strokeStyle = this.fgColor
    ctx.textBaseline = 'middle'
    this.ctx = ctx
  }
  /* override */
  drawRuler (start, shadow) {
    const {
      ctx, fontColor, shadowColor, bgColor,
      fontScale, perWidth, scale, width, height, ratio
    } = this

    // 1. 画标尺底色
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // 2. 画阴影
    if (shadow) {
      // 阴影起点坐标
      const posY = (shadow.y * scale - start) * ratio
      // 阴影高度
      const shadowHeight = shadow.height * ratio * scale
      ctx.fillStyle = shadowColor
      ctx.fillRect(0, posY, width, shadowHeight)
    }

    // 3. 画刻度和文字(因为刻度遮住了阴影)
    ctx.translate(0, -start * ratio) // 移动画布原点,方便绘制
    ctx.beginPath()
    ctx.fillStyle = fontColor

    const perHeight = perWidth
    const startY = start - start % perHeight
    for (let i = startY; i < startY + height / ratio; i += perHeight) {
      var tempY = ((i >> 0) + 0.5) * ratio
      ctx.moveTo(width, tempY)
      //绘制长刻度
      if (i % (perHeight * 10) === 0) {
        //这里先保存一下状态
        ctx.save()
        //将原点转移到当前画笔所在点
        ctx.translate(width, (i - 2) * ratio)
        // 旋转 -90 度
        ctx.rotate(-Math.PI / 2)
        // 画文字
        ctx.scale(fontScale, fontScale)
        ctx.fillText(i / scale, 2 * ratio, -width / 3 * 2)
        // 回复刚刚保存的状态
        ctx.restore()
        ctx.lineTo(0, tempY)

      } else { //绘制短刻度
        ctx.lineTo(width * 2 / 3, tempY)
      }
      ctx.stroke()
    }
    ctx.closePath()
    ctx.translate(0, start * ratio)
  }
}