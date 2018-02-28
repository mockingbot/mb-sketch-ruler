// 标尺中每小格代表的宽度
const getGridSize = (scale) => {
  if (scale <= 0.25) return 40
  if (scale <= 0.5) return 20
  if (scale <= 1) return 10
  if (scale <= 2) return 5
  if (scale <= 4) return 2
  return 1
}

export const drawHorizontalRuler = (ctx, start, shadow, options) => {
  const { width, height, perWidth, canvasConfigs } = options
  const { bgColor, fontColor, shadowColor, ratio, fontScale } = canvasConfigs
  const scale = perWidth / 10

  // 1. 画标尺底色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // 每两个长刻度之间的距离的px不能低于50(如果低于50, 则合并大格)

  // 2. 画阴影
  if (shadow) {
    // 阴影起点坐标
    const posX = (shadow.x - start) * scale * ratio
    // 阴影宽度
    const shadowWidth = shadow.width * scale * ratio
    ctx.fillStyle = shadowColor
    ctx.fillRect(posX, 0, shadowWidth, height)
  }

  const gridSize = getGridSize(scale) // 每小格表示的宽度
  const gridSize_10 = gridSize * 10 // 每大格表示的宽度
  const gridPixel = gridSize * scale

  const startX = Math.floor(start / gridSize) * gridSize
  // const offsetX = start % gridSize === 0 ? 0 : -gridPixel
  const offsetX = (startX - start) / gridSize * gridPixel
  // const startX = -500
  // const startX = start - start % gridSize
  const endX = start + Math.ceil(width / scale)
  if (startX === 0) return
  console.log({ offsetX, start, startX, gridSize, gridPixel })

  // 3. 画刻度和文字(因为刻度遮住了阴影)
  // ctx.translate(-start, 0) // 移动画布原点,方便绘制
  ctx.beginPath() // 一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
  ctx.fillStyle = fontColor

  for (let value = startX, count = 0; value < endX ; value += gridSize, count ++) {
    const x = offsetX + count * gridPixel

    ctx.moveTo(x, height)
    if (value % gridSize_10 === 0) {
      // console.log('==长==', value, x)
      ctx.fillText(value, x, height / 2)
      ctx.lineTo(x, 0)
    } else {
      ctx.lineTo(x, height * 2 / 3)
      // console.log('短', value, x)
    }
  }

  ctx.stroke()
  ctx.closePath()
  // ctx.translate(start, 0)

  // for (let i = startX; i < endX; i += gridSize) {
  //   var tempX = ((i >> 0) + 0.5) * ratio
  //   ctx.moveTo(tempX, height)
  //   // 绘制长刻度
  //   if (i % gridSize_10 === 0) {
  //     ctx.save()
  //     ctx.translate((i + 2) * ratio, 0)
  //     ctx.scale(fontScale, fontScale)
  //     // 刻度值为整数
  //     ctx.fillText(i, 2 * ratio, height / 2)
  //     ctx.restore()
  //     ctx.lineTo(tempX, 0)
  //   } else { //绘制短刻度
  //     ctx.lineTo(tempX, height * 2 / 3)
  //   }
  // }
  // ctx.stroke()
  // ctx.closePath()
  // ctx.translate(start * ratio, 0)
}

export const drawVerticalRuler = (ctx, start, shadow, options) => {
  const { width, height, perWidth, canvasConfigs } = options
  const { bgColor, fontColor, shadowColor, ratio, fontScale } = canvasConfigs
  const scale = perWidth / 10

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
      // 刻度值为整数
      ctx.fillText(Math.round(i / scale), 2 * ratio, -width / 3 * 2)
      // 回复刚刚保存的状态
      ctx.restore()
      ctx.lineTo(0, tempY)

    } else { //绘制短刻度
      ctx.lineTo(width * 2 / 3, tempY)
    }
  }
  ctx.stroke()
  ctx.closePath()
  ctx.translate(0, start * ratio)
}
