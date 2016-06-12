/**
 * 2016.6.11 iny
 * jquery插件v0.2 直接append canvas
 */
(function($) {

    $.fn.getRuler = function(options) {
        var me = this;
        var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me, options)
        return ruler;
    };

    var getPixelRatio = function() {
        var context = document.createElement('canvas').getContext('2d')

        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        console.log("当前设备像素倍数: ", window.devicePixelRatio)
        return (window.devicePixelRatio || 1) / backingStore;
    };

    var RulerFactory = function(options){
      var ratio = options.ratio
      var thick = options.thick
      var width = options.width
      var height = options.height
      var fgColor = options.fgColor
      var bgColor = options.bgColor
      var font = options.font
      
      return {
        getCorner : function(){
          var corner = $('<span></span>')
          corner.css({
              position: 'fixed',
              // top:0,
              // left:0,
              width: thick - 1,
              height: thick - 1,
              borderBottom: '1px solid ' + fgColor,
              borderRight: '1px solid ' + fgColor,
              'zIndex': 9999,
              // bottom: '100%',
              // right: '100%',
              backgroundColor: bgColor,
          });
          return corner;
        },
        getHorRuler : function(options){
          var horRuler = $('<canvas></canvas>')
          horRuler.css({
              position: 'fixed',
              marginLeft: thick,
              width: width,
              height: thick - 1,
              borderBottom: '1px solid '+ fgColor,
              'zIndex': 9999,
              backgroundColor: bgColor,
          });

          //为canvas设置样式
          var canvas = horRuler.get(0);
          canvas.width = width * ratio
          canvas.height = thick * ratio

          var ctx = canvas.getContext('2d');
          //设置字体以及刻度的样式
          ctx.font = font
          ctx.lineWidth = ratio;
          ctx.strokeStyle = fgColor
          return horRuler;
        },
        getVerRuler : function(){
          var verRuler = $('<canvas></canvas>')
          verRuler.css({
              position: 'fixed',
              marginTop: thick,
              
              width: thick - 1,
              height: height,
              borderRight: '1px solid ' + fgColor,
              'z-index': 9999,
              backgroundColor: bgColor,
          });

          //为canvas设置样式
          var canvas = verRuler.get(0);
          canvas.width = thick * ratio
          canvas.height = height * ratio

          var ctx = canvas.getContext('2d');
          //设置字体以及刻度的样式
          ctx.font = font
          ctx.lineWidth = ratio;
          ctx.strokeStyle = fgColor
          return verRuler;
        },
        getHorLine : function(){
          var horLine = $('<div></div>')
          horLine.css({
            position: 'fixed',
            height: height + thick,
            borderLeft: '1px solid red',
            width: 5,
            'zIndex': 10000
          });
          //文字
          var text = $('<p></p>')
          text.css({
            position:'absolute',
            paddingLeft: 3,
            top: thick + 3,
            font: '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif',
          });
          horLine.append(text)
          //图标
          var span = $('<span>×</span>')
          span.css({
            position:'absolute',
            display: 'none',
            left:'100%',
            padding: 5,
            top: thick + 3,
            fontSize: 14,
            cursor: 'pointer'
          });
          horLine.append(span)

          horLine.on('mouseenter', function(e) {
              event.preventDefault();
              span.css({
                top: e.offsetY - 10,
                left: 0
              });
              span.show(); 
          });
          horLine.on('mouseleave', function(e) {
            event.preventDefault();
            span.hide();
          });
          return horLine;
        },
        getVerLine : function(){
          var verLine = $('<div></div>')
          verLine.css({
            position: 'fixed',
            width: width + thick,
            borderTop: '1px solid red',
            height: 5,
            'zIndex': 10000
          });
          //文字
          var text = $('<p></p>')
          text.css({
            position:'absolute',
            paddingTop: 3,
            left: thick + 3,
            font: '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif',
          });
          verLine.append(text)
          //图标
          var span = $('<span>×</span>')
          span.css({
            position:'absolute',
            display: 'none',
            bottom:'100%',
            padding: 5,
            left: thick + 3,
            fontSize: 14,
            cursor: 'pointer'
          });
          verLine.append(span)

          verLine.on('mouseenter', function(e) {
              event.preventDefault();
              span.css({
                left: e.offsetX - 10,
              });
              span.show(); 
          });
          verLine.on('mouseleave', function(e) {
            event.preventDefault();
            span.hide();
          });
          return verLine;
        }
      }
    }

    var Ruler = function(elem, options) {
        console.log("创建ruler")
        this.elem = elem
        this._init(options)
    }

    //为已定位的元素增加厚度为thick的包裹层

    //方法
    Ruler.prototype = {
        _init: function(options) {
            //参数默认处理
            options = options || {}
            this.ratio = !isNaN(options.ratio) ? options.ratio : getPixelRatio()
            // this.ratio = 1
            this.startX = !isNaN(options.startX) ? options.startX : -240;
            this.startY = !isNaN(options.startY) ? options.startY : -100;
            this.thick = !isNaN(options.thick) ? options.thick * this.ratio : 30 * this.ratio;
            this.bgColor = options.bgColor || '#F5F5F5';
            this.fgColor = options.fgColor || '#999';
            this.shadowColor = options.shadowColor || '#CCC';
            this.font = options.font || 12 * this.ratio + 'px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif';
            this.fontColor = options.fontColor || '#000';
            //如果已经初始化,则需要先销毁原有实例
            this.width = this.elem.width() * this.ratio - this.thick
            this.height = this.elem.height() * this.ratio - this.thick

            this.factory = new RulerFactory({
              ratio : this.ratio,
              thick : this.thick / this.ratio,
              width : this.width / this.ratio,
              height : this.height / this.ratio,
              fgColor : this.fgColor,
              bgColor : this.bgColor,
              font : this.font,
            })

            //对齐线信息
            this.horLineValue = options.horLineValue
            this.verLineValue = options.verLineValue

            // console.log(this.elem.scrollLeft())
            //起始位置
            this.origin = {
                x: this.elem.width() / 2,
                y: this.elem.height() / 2
            }
            


            this._addRuler();
            this._drawRuler();
            this._drawAlignLine();

            this.elem.data('ruler', this);
            this._initScrollEvent();
            // this._initMouseWheelEvent()
        },
        _addRuler() {
            var elem = this.elem;
            var _this = this
            var factory = this.factory;
            
            //父元素改为scroll
            elem.css({
              overflow: 'scroll',
            });

            //左上角小块
            var corner = factory.getCorner();
            elem.prepend(corner)

            //创建水平标尺
            var horRuler = factory.getHorRuler();
            elem.prepend(horRuler)
            this.horCtx = horRuler.get(0).getContext('2d')
            
            
            horRuler.on('click', function(event) {
              event.preventDefault();
              _this.horLineValue = event.offsetX + _this.startX;
              _this._drawHorLine()
              $(document.body).trigger('setAlignLine', {
                horValue : _this.horLineValue,
                verValue : _this.verLineValue
              }); 
            });

            //创建垂直标尺
            var verRuler = factory.getVerRuler();
            elem.prepend(verRuler)
            this.verCtx = verRuler.get(0).getContext('2d')
            
            verRuler.on('click', function(event) {
              event.preventDefault();
              _this.verLineValue = event.offsetY + _this.startY;
              _this._drawVerLine()
              $(document.body).trigger('setAlignLine', {
                horValue : _this.horLineValue,
                verValue : _this.verLineValue
              });
              
            });
            
            this.horRuler = horRuler;
            this.verRuler = verRuler;
            this.corner = corner
        },
        _drawAlignLine(){
          if(this.horLineValue){
            this._drawHorLine();
          }
          if(this.verLineValue){
            this._drawVerLine();
          }
        },
        _drawHorLine(){
          var value = this.horLineValue
          if(!this.horLine){
            var _this = this;
            var horLine = this.factory.getHorLine()
            horLine.find('span').on('click', this._destoryHorLine.bind(this));
            this.elem.append(horLine)
            this.horLine = horLine
          }
          var offsetX = value - this.startX
          if(offsetX < 0 || offsetX > this.width / this.ratio){
            this.horLine.css({
              display: 'none',
            });
          }else{
            this.horLine.css({
              display: 'block',
              marginLeft: offsetX + this.thick / this.ratio,
            });  
            this.horLine.find('p').html(value)
          }
        },
        _drawVerLine(){
          
          var value = this.verLineValue
          if(!this.verLine){
            var verLine = this.factory.getVerLine()
            this.elem.append(verLine)
            this.verLine = verLine
          }
          var offsetY = value - this.startY
          if(offsetY < 0 || offsetY > this.height / this.ratio){
            this.verLine.css({
              display: 'none',
            });
          }else{
            this.verLine.css({
              display: 'block',
              marginTop: offsetY + this.thick / this.ratio,
            });  
            this.verLine.find('p').html(value)
          }
        },

        //为给定元素添加标尺(需要目标元素已定位)

        _initScrollEvent() {
            var elem = this.elem
            var origin = this.origin;
            var originX = origin.x;
            var originY = origin.y;

            elem.scrollLeft(originX + this.startX)
            elem.scrollTop(originY + this.startY)
            var _this = this
            elem.on('scroll', function(event) {
                event.preventDefault();
                event.stopPropagation();
                var top = elem.scrollTop()
                var left = elem.scrollLeft()
                    // container.css('left', parseInt(container.css('left')) - detail);
                _this.setPosition(left - originX, top - originY)
                _this._drawAlignLine()
                    // container.css('top', parseInt(container.css('top')) - detail);

            });
        },

        _moveRuler(deltaX, deltaY) {
            this.startX = this.startX + deltaX
            this.startY = this.startY + deltaY
            this._drawRuler();
            if (this.shadow) {
                this.setSelect(this.shadow.x, this.shadow.y, this.shadow.width, this.shadow.height);
            }
        },
        setPosition: function(startX, startY) {
            this.startX = startX;
            this.startY = startY;

            var elem = this.elem
            var originX = this.origin.x;
            var originY = this.origin.y;

            elem.scrollLeft(originX + this.startX)
            elem.scrollTop(originY + this.startY)

            this._drawRuler();
            if (this.shadow) {
                this.setSelect(this.shadow.x, this.shadow.y, this.shadow.width, this.shadow.height);
            }
        },
        _drawRuler: function() {

            this._drawHorRuler();
            this._drawVerRuler();
        },
        _drawHorRuler: function(posX, width, needShadow) {
            var start = this.startX;
            var posX = typeof posX !== 'undefined' ? posX : 0
            var width = typeof width !== 'undefined' ? width : 320
            var needShadow = needShadow || false;
            var ctx = this.horCtx;

            //刻度尺背景改用dom的bgcolor实现,这样可以减少ctx.fillStyle状态改变带来的效率损失
            ctx.clearRect(0, 0, this.width, this.thick);  

            //先根据iphone宽度绘制阴影
            if (needShadow) {
                ctx.fillStyle = this.shadowColor
                ctx.fillRect((posX - start) * this.ratio, 0, width * this.ratio, this.thick);
                // ctx.fillRect(20, 0, 2, this.thick);
            }

            //再画刻度和文字(因为刻度遮住了阴影)
            //移动画布原点,方便绘制
            ctx.translate(-start * this.ratio, 0);

            ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
            ctx.fillStyle = this.fontColor

            var perWidth = 10;
            var startX = start - start % perWidth
                //这样绘制当起点不为10的倍数时,长标和文字都不会出现
                // for(var i = start ; i < start+this.width ; i += 10){
                //正确的方法是:偏移到10的倍数,再开始绘制
            for (var i = startX; i < startX + this.width / this.ratio; i += perWidth) {

                ctx.moveTo((i + 0.5) * this.ratio, this.thick);

                //绘制长刻度
                if (i % 100 === 0) {
                    ctx.fillText(i, (i + 4) * this.ratio, this.thick / 2);
                    ctx.lineTo((i + 0.5) * this.ratio, 0);
                } else { //绘制短刻度
                    ctx.lineTo((i + 0.5) * this.ratio, this.thick * 2 / 3);
                }
                ctx.stroke();
            }
            
            ctx.closePath();

            ctx.translate(start * this.ratio, 0);

        },
        _drawVerRuler: function(posY, height, needShadow) {
            var start = this.startY;
            var posY = typeof posY !== 'undefined' ? posY : 0
            var height = typeof height !== 'undefined' ? height : 568
            var needShadow = needShadow || false;
            var ctx = this.verCtx;
            
            //绘制刻度尺的背景
            ctx.clearRect(0, 0, this.thick, this.height);  

            //先根据iphone高度绘制阴影
            if (needShadow) {
                ctx.fillStyle = this.shadowColor
                ctx.fillRect(0, (posY - start) * this.ratio, this.thick, height * this.ratio);
            }

            //再画刻度和文字(因为刻度遮住了阴影)
            //移动画布原点,方便绘制
            ctx.translate(0, -start * this.ratio);

            ctx.beginPath();
            ctx.fillStyle = this.fontColor

            var perHeight = 10;
            var startY = start - start % perHeight

            for (var i = startY; i < startY + this.height / this.ratio; i += perHeight) {

                ctx.moveTo(this.thick, (i + 0.5) * this.ratio);

                //绘制长刻度
                if (i % 100 === 0) {
                    //这里先保存一下状态
                    ctx.save();
                    //将原点转移到当前画笔所在点
                    ctx.translate(this.thick, (i - 2) * this.ratio)
                        //旋转 -90 度
                    ctx.rotate(-Math.PI / 2)
                        //画文字
                    ctx.fillText(i, 2 * this.ratio, -this.thick / 2)
                        //回复刚刚保存的状态
                    ctx.restore();
                    ctx.lineTo(0, (i + 0.5) * this.ratio)

                } else { //绘制短刻度
                    ctx.lineTo(this.thick * 2 / 3, (i + 0.5) * this.ratio)
                }
                ctx.stroke();
            }
            ctx.closePath();
            ctx.translate(0, start * this.ratio);
        },
        setSelect: function(x, y, width, height) {

            this._drawHorRuler(x, width, true);
            this._drawVerRuler(y, height, true);
            this.shadow = {
                x: x,
                y: y,
                width: width,
                height: height
            }
        },
        clearShadow: function() {
            this.shadow = null;
            this._drawRuler();
        },
        destory: function() {
          this.horRuler.remove()
          this.verRuler.remove()
          this.corner.remove()
          
          this.elem.removeData('ruler')
        },
        _destoryHorLine(event){
          event.preventDefault();
          this.horLineValue = null;
          this.horLine.remove()
          this.horLine = null;

          $(document.body).trigger('setAlignLine', {
            horValue : this.horLineValue,
            verValue : this.verLineValue
          });
        },
        _destoryVerLine(event){
          event.preventDefault();
          this.verLineValue = null;
          this.verLine.remove()
          this.verLine = null;

          $(document.body).trigger('setAlignLine', {
            horValue : this.horLineValue,
            verValue : this.verLineValue
          });
        },
    }
})(jQuery)
