// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale) => {
  if (scale <= 0.25) return 40
  if (scale <= 0.5) return 20
  if (scale <= 1) return 10
  if (scale <= 2) return 5
  if (scale <= 4) return 2
  return 1
}

const FONT_SCALE = 0.83 // 10 / 12

export const drawHorizontalRuler = (ctx, start, shadow, options) => {
  const { scale, width, height, canvasConfigs } = options
  const { bgColor, fontColor, shadowColor, ratio } = canvasConfigs

  // 缩放ctx, 以简化计算
  ctx.scale(ratio, ratio)

  // 1. 画标尺底色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // 2. 画阴影
  if (shadow) {
    const shadowX = (shadow.x - start) * scale // 阴影起点坐标
    const shadowWidth = shadow.width * scale // 阴影宽度
    ctx.fillStyle = shadowColor
    ctx.fillRect(shadowX, 0, shadowWidth, height)
  }

  const gridSize = getGridSize(scale) // 每小格表示的宽度
  const gridSize_10 = gridSize * 10 // 每大格表示的宽度
  const gridPixel = gridSize * scale

  const startValue = Math.floor(start / gridSize) * gridSize  // 绘制起点的刻度(略小于start, 且是gridSize的整数倍)
  const offsetX = (startValue - start) / gridSize * gridPixel // 起点刻度距离ctx原点(start)的px距离
  const endValue = start + Math.ceil(width / scale)               // 终点刻度(略超出标尺宽度即可)

  // 3. 画刻度和文字(因为刻度遮住了阴影)
  ctx.beginPath() // 一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
  ctx.fillStyle = fontColor

  for (let value = startValue, count = 0 ; value < endValue ; value += gridSize, count ++) {
    const x = offsetX + count * gridPixel + 0.5 // prevent canvas 1px line blurry
    ctx.moveTo(x, height)
    if (value % gridSize_10 === 0) {
      ctx.save()
      ctx.translate(x, height * 0.4)
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio)
      ctx.fillText(value, 4 * ratio, 0)
      ctx.restore()
      ctx.lineTo(x, 0)
    } else {
      ctx.lineTo(x, height * 2 / 3)
    }
  }

  ctx.stroke()
  ctx.closePath()

  // 恢复ctx matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export const drawVerticalRuler = (ctx, start, shadow, options) => {
  const { scale, width, height, canvasConfigs } = options
  const { bgColor, fontColor, shadowColor, ratio } = canvasConfigs

  // 缩放ctx, 以简化计算
  ctx.scale(ratio, ratio)

  // 1. 画标尺底色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // 2. 画阴影
  if (shadow) {
    // 阴影起点坐标
    const posY = (shadow.y - start) * scale
    // 阴影高度
    const shadowHeight = shadow.height * scale
    ctx.fillStyle = shadowColor
    ctx.fillRect(0, posY, width, shadowHeight)
  }

  const gridSize = getGridSize(scale) // 每小格表示的宽度
  const gridSize_10 = gridSize * 10 // 每大格表示的宽度
  const gridPixel = gridSize * scale

  const startValue = Math.floor(start / gridSize) * gridSize  // 绘制起点的刻度(略小于start, 且是gridSize的整数倍)
  const offsetY = (startValue - start) / gridSize * gridPixel // 起点刻度距离ctx原点(start)的px距离
  const endValue = start + Math.ceil(height / scale)               // 终点刻度(略超出标尺宽度即可)

  // 3. 画刻度和文字(因为刻度遮住了阴影)
  ctx.beginPath() // 一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
  ctx.fillStyle = fontColor

  for (let value = startValue, count = 0; value < endValue ; value += gridSize, count ++) {
    const y = offsetY + count * gridPixel + 0.5
    ctx.moveTo(width, y)
    if (value % gridSize_10 === 0) {
      ctx.save() // 这里先保存一下状态
      ctx.translate(width * 0.4, y) // 将原点转移到当前画笔所在点
      ctx.rotate(-Math.PI / 2) // 旋转 -90 度
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio) // 缩放至10px
      ctx.fillText(value, 4 * ratio, 0) // 画文字
      // 回复刚刚保存的状态
      ctx.restore()
      ctx.lineTo(0, y)
    } else {
      ctx.lineTo(width * 2 / 3, y)
    }
  }

  ctx.stroke()
  ctx.closePath()

  // 恢复ctx matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
