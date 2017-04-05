import Ruler from './Ruler'

export default class HorRuler extends Ruler {
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
      const posX = (shadow.x * scale - start) * ratio
      // 阴影宽度
      const shadowWidth = shadow.width * ratio * scale
      ctx.fillStyle = shadowColor
      ctx.fillRect(posX, 0, shadowWidth, height)
    }

    // 3. 画刻度和文字(因为刻度遮住了阴影)
    ctx.translate(-start * ratio, 0) // 移动画布原点,方便绘制
    ctx.beginPath() //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
    ctx.fillStyle = fontColor

    const startX = start - start % perWidth
    for (let i = startX; i < startX + width / ratio; i += perWidth) {
      var tempX = ((i >> 0) + 0.5) * ratio
      ctx.moveTo(tempX, height)
      //绘制长刻度
      if (i % (perWidth * 10) === 0) {
        ctx.save()
        ctx.translate((i + 2) * ratio, 0)
        ctx.scale(fontScale, fontScale)
        ctx.fillText(i / scale, 2 * ratio, height / 2)
        ctx.restore()
        ctx.lineTo(tempX, 0)
      } else { //绘制短刻度
        ctx.lineTo(tempX, height * 2 / 3)
      }
      ctx.stroke()
    }
    ctx.closePath()
    ctx.translate(start * ratio, 0)
  }
}
