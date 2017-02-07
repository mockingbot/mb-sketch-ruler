import $ from 'jquery'

let ratio, thick, width, height, fgColor, bgColor, font
export default class RulerFactory {
  constructor (options) {
    ratio = options.ratio
    thick = options.thick
    width = options.width
    height = options.height
    fgColor = options.fgColor
    bgColor = options.bgColor
    font = options.font
  }

  getCorner () {
    var corner = $('<span class="corner"></span>')
    corner.css({
      // width: thick,
      // height: thick,
      borderBottom: '1px solid ' + fgColor,
      borderRight: '1px solid ' + fgColor,
      backgroundColor: bgColor
    })
    return corner
  }
  getHorRuler () {
    var horRuler = $('<canvas class="hor-ruler"></canvas>')
    horRuler.css({
      marginLeft: thick,
      width: width,
      height: thick,
      borderBottom: '1px solid '+ fgColor
    })
    //为canvas设置样式
    var canvas = horRuler.get(0)
    canvas.width = width * ratio
    canvas.height = thick * ratio

    var ctx = canvas.getContext('2d')
    //设置字体以及刻度的样式
    ctx.font = font
    ctx.lineWidth = ratio
    ctx.strokeStyle = fgColor
    ctx.textBaseline = 'middle'
    return horRuler
  }
  getVerRuler () {
    var verRuler = $('<canvas class="ver-ruler"></canvas>')
    verRuler.css({
      marginTop: thick,
      width: thick,
      height: height,
      borderRight: '1px solid ' + fgColor
    })
    //为canvas设置样式
    var canvas = verRuler.get(0)
    canvas.width = thick * ratio
    canvas.height = height * ratio

    var ctx = canvas.getContext('2d')
    //设置字体以及刻度的样式
    ctx.font = font
    ctx.lineWidth = ratio
    ctx.strokeStyle = fgColor
    ctx.textBaseline = 'middle'
    return verRuler
  }
  getHorLine () {
    var horLine = $('<div class="hor-line"></div>')
    horLine.css('height', height + thick)
    //文字
    var text = $('<p class="hor-text"></p>')
    text.css('top', thick + 3)
    horLine.append(text)
    // 删除图标
    var span = $('<span class="hor-del">×</span>')
    span.css('top', thick + 3)
    horLine.append(span)

    horLine.on('mouseover', function(e) {
      e.preventDefault()
      var offset = e.offsetY
      if(offset > thick){
        span.show()
      }
    })

    horLine.on('mouseleave', function(e) {
      e.preventDefault()
      span.hide()
    })
    return horLine
  }
  getVerLine () {
    var verLine = $('<div class="ver-line"></div>')
    verLine.css('width', width + thick)
    //文字
    var text = $('<p class="ver-text"></p>')
    text.css({
      position:'absolute',
      top: 5,
      left: thick + 3,
      pointerEvents: 'none'
    })

    verLine.append(text)
    // 删除图标
    var span = $('<span class="ver-del">×</span>')
    span.css('left', thick + 3)
    verLine.append(span)

    verLine.on('mouseover', function(e) {
      e.preventDefault()
      var offset = e.offsetX
      if(offset > thick){
        span.show()
      }
    })
    verLine.on('mouseleave', function(e) {
      e.preventDefault()
      span.hide()
    })
    return verLine
  }
  getHorCur () {
    var horCur = $('<div class="hor-cur"></div>')
    horCur.css('height', thick)
    var div = $('<div class="hor-cur-line"></div>')
    div.css('height', height)
    horCur.append(div)
    var text = $('<p class="hor-cur-text"></p>')
    horCur.append(text)
    return horCur
  }
  getVerCur () {
    var verCur = $('<div class="ver-cur"></div>')
    verCur.css('width', thick)
    var div = $('<div class="ver-cur-line"></div>')
    div.css('width', width)
    verCur.append(div)
    var text = $('<p class="ver-cur-text"></p>')
    verCur.append(text)
    return verCur
  }
}