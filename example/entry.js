const { $ } = window
import './style.css'

function initRuler(){
  var posX = parseInt($('#posX').val())
  var posY = parseInt($('#posY').val())
  var thick = parseInt($('#thick').val())
  var fgColor = $('#fgColor').val()
  var bgColor = $('#bgColor').val()
  var shadowColor = $('#shadowColor').val()
  var font = $('#font').val()
  var fontColor = $('#fontColor').val()
  var ratio = parseInt($('#ratio').val())
  var perWidth = $('#perWidth').val()
  var ruler = $('#screens').getRuler({
    startX: -240, //posX,
    // -240
    startY: posY,
    // -100
    thick: thick,
    // 30
    fgColor: fgColor,
    // '#F5F5F5'
    bgColor: bgColor,
    // '#999'
    shadowColor :shadowColor,
    // '#CCC'
    font: font, //这里因为用了2x 字体大小应为期望的2倍,如需要12就写24
    // 详见 https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font

    // '15px -apple-system, '.SFNSText'Regular', "SF'UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
    fontColor: fontColor,
    // '#000'
    ratio: ratio,
    //canvas绘制比例,默认值为当前设备的像素倍数(一般为1, retina 2 ,越高越清晰,相应地性能消耗越高)
    perWidth: perWidth
    //10
  });

  $('#screens').css({
    overflow: 'scroll'
  }).on('scroll', function(event) {
    event.preventDefault();
    ruler.update();
  });
}
function removeRuler(){
  var ruler = $('#screens').getRuler();
  ruler.destroy()
}
function setSelect(){
  var x = parseInt($("#x").val());
  var y = parseInt($("#y").val());
  var width = parseInt($("#width").val());
  var height = parseInt($("#height").val());
  var ruler = $('#screens').getRuler();
  ruler.setSelect(x, y, width, height);
}
function clearShadow(){
  var ruler = $('#screens').getRuler();
    ruler.clearShadow();
}

function bindFunction () {
  $('#setSelect').on('click', setSelect)
  $('#initRuler').on('click', initRuler)
  $('#removeRuler').on('click', removeRuler)
  $('#clearShadow').on('click', clearShadow)
}

$(() => {
  bindFunction()
  var html = ''
  for(var i = 0 ; i < 200 ; i ++){
    var width = (50 + Math.random() * 50) >> 0
    var height = (50 + Math.random() * 50) >> 0
    // var top = (Math.random() - 0.5) * 10000 >> 0
    // var left = (Math.random() - 0.5) * 10000 >> 0
    var top = Math.random() * 5000 + 10 >> 0
    var left = Math.random() * 5000 + 10 >> 0
    var color = '#'+(Math.random()*Math.pow(256, 3)-1>>0).toString(16);
    // console.log(color)
    html += `<div class="cube" style="background:${color};left:${left}px;top:${top}px;width:${width}px;height:${height}px"></div>`
    // var div = $('div').width()
  }
  $('#screens .screen_container').append(html)

  var screensStyle = $('#screens').get(0).getBoundingClientRect();
  var conTop = screensStyle.top
  var conLeft = screensStyle.left
  // console.log(conTop, conLeft)
  //点击测试
  $('#screens').on('click', '.cube', (e) => {
    var ruler = $('#screens').getRuler()

    var style = e.target.getBoundingClientRect()
    var left = style.left - conLeft + ruler.startX - ruler.thick / ruler.ratio
    var top = style.top - conTop + ruler.startY - ruler.thick / ruler.ratio
    var width = style.width
    var height = style.height
    // console.log(left, top, width, height)
    ruler.setSelect(left, top, width, height);
  })

  var ruler = $('#screens').getRuler({
    horLine: 150,
    verLine: 150
  });
  $('#screens').css({
    overflow: 'scroll'
  }).on('scroll', function(event) {
    event.preventDefault();
    ruler.update();
  });

  $(document.body).on('setAlignLine', function(event, position) {
    event.preventDefault();
    console.log('Horizontal', position.horValue)
    console.log('Vertical', position.verValue)
  });
});