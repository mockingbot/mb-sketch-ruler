/**
 * 2016.6.5 iny
 * 为了便于非react环境的调用,改造成jquery插件
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

            this.origin = {
                    x: this.elem.width() / 2,
                    y: this.elem.height() / 2
                }
                //如果已经初始化,则需要先销毁原有实例
            this.addWrapper();
            this.width = this.wrapper.width() * this.ratio - this.thick
            this.height = this.wrapper.height() * this.ratio - this.thick


            this._addRuler();
            this._drawRuler();
            this.elem.data('ruler', this);
            this._initScrollEvent();
            // this._initMouseWheelEvent()
        },
        addWrapper: function(elem, thick) {
            var elem = this.elem;
            var thick = this.thick / this.ratio
                //外部包裹层(负责存放标尺)
            var wrapper = $('<section></section>')
            var width = elem.width() < document.body.clientWidth ? elem.width() : document.body.clientWidth;
            var height = elem.height() < document.body.clientHeight ? elem.height() : document.body.clientHeight;
            wrapper.css({
                position: elem.css('position'),
                left: elem.css('left'),
                top: elem.css('top'),
                right: elem.css('right'),
                bottom: elem.css('bottom'),
                //性能优化:elem宽高小于屏幕,则使用elem宽高,超出屏幕则使用屏幕宽高
                width: width,
                height: height,
                overflow: 'hidden'
            });
            // 内部包裹层(可见视窗)
            var innerWrapper = $('<div></div>');
            innerWrapper.css({
                position: 'absolute',
                left: thick,
                top: thick,
                width: width - thick,
                height: height - thick,
                overflow: 'scroll'
            });

            elem.css({
                position: 'absolute',
                left: this.origin.x,
                top: this.origin.y,
                width: elem.width() / 2,
                height: elem.height() / 2,
                // width: elem.width() - thick,
                // height : elem.height() - thick
            });
            elem.wrap(wrapper)
            var outerWrapper = elem.parent()
            elem.wrap(innerWrapper)
            var innerWrapper = elem.parent()

            this.innerWrapper = innerWrapper;
            this.wrapper = outerWrapper;
        },
        destory: function() {

            var wrapper = this.wrapper
                //取消监听
            wrapper.off('mousewheel DOMMouseScroll', this, this._handleMouseWheelEvent);

            //去包裹     
            var elem = this.elem;
            elem.css({
                position: wrapper.css('position'),
                left: wrapper.css('left'),
                top: wrapper.css('top'),
                right: wrapper.css('right'),
                bottom: wrapper.css('bottom'),
                width: elem.width() * 2,
                height: elem.height() * 2
            });

            this.doms.forEach(function(item) {
                $(item).remove()
            })
            this.elem.unwrap();
            this.elem.unwrap();
            this.elem.removeData('ruler')
        },
        _addRuler() {
            var elem = this.elem;
            var wrapper = this.wrapper
            var _this = this
            // parseInt会将空串转换为number类型,我晕
            // this.startX = typeof options.startX !== 'undefined' ? options.startX : -240;
            // this.startY = typeof options.startY !== 'undefined' ? options.startY : -100;
            // this.thick = typeof options.thick !== 'undefined' ? options.thick * 2 : 60;

            //左上角小块
            var corner = $('<span></span>')
            corner.css({
                position: 'absolute',
                width: this.thick / this.ratio - 1,
                height: this.thick / this.ratio - 1,
                borderBottom: '1px solid ' + this.fgColor,
                borderRight: '1px solid ' + this.fgColor,
                'zIndex': 9999,
                backgroundColor: this.bgColor,
            });

            var cornerDom = corner.get(0);
            wrapper.prepend(corner)

            //水平
            var horRuler = $('<canvas></canvas>')
            horRuler.css({
                position: 'absolute',
                top: 0,
                left: this.thick / this.ratio,
                width: this.width / this.ratio,
                height: this.thick / this.ratio - 1,
                borderBottom: '1px solid '+ this.fgColor,
                'zIndex': 9999,
                backgroundColor: this.bgColor,
            });
            
            horRuler.on('click', function(event) {
              event.preventDefault();
              _this.drawHorLine(event.offsetX)
            });
            var horRulerDom = horRuler.get(0);
            horRulerDom.width = this.width
            horRulerDom.height = this.thick
            wrapper.prepend(horRuler)

            var horCtx = horRulerDom.getContext('2d');
            //设置字体以及刻度的样式
            horCtx.font = this.font
            horCtx.lineWidth = this.ratio;
            horCtx.strokeStyle = this.fgColor
            this.horCtx = horCtx

            //垂直
            var verRuler = $('<canvas></canvas>')
            verRuler.css({
                position: 'absolute',
                top: this.thick / this.ratio,
                left: 0,
                width: this.thick / this.ratio - 1,
                height: this.height / this.ratio,
                borderRight: '1px solid ' + this.fgColor,
                'z-index': 9999,
                backgroundColor: this.bgColor,
            });
            
            verRuler.on('click', function(event) {
              event.preventDefault();

              console.log('点击了: ',_this.startY + event.offsetY)
            });
            var verRulerDom = verRuler.get(0);
            verRulerDom.width = this.thick
            verRulerDom.height = this.height
            wrapper.prepend(verRuler)

            var verCtx = verRulerDom.getContext('2d');
            //设置字体以及刻度的样式
            verCtx.font = this.font
            verCtx.lineWidth = this.ratio;
            verCtx.strokeStyle = this.fgColor
            this.verCtx = verCtx
            
            this.doms = [cornerDom, horRulerDom, verRulerDom]
        },
        drawHorLine(offsetX){
          console.log(this.startX + offsetX)
          if(!this.horLine){
            var horLine = $('<div></div>')
            horLine.css({
              position: 'absolute',
              border: '1px solid red',
              top: 0,
              height: '100%',
              width: 0,
              'zIndex': 10000
            });
            var span = $('<span></span>')
            span.css({
              position:'absolute',
              left: 3,
              top: this.thick / this.ratio + 3,
              fontSize: 12 
            });
            horLine.append(span)
            this.wrapper.append(horLine)
            this.horLine = horLine
            // console.log(horLine)
          }
          this.horLine.css({
            left: this.thick / this.ratio + offsetX,
          });
          this.horLine.find('span').html(this.startX + offsetX)
          // <div class="horLine"
            //<span class="horNum">{this.props.offsetY}</span>
          //</div>
           
  
        },
        //为给定元素添加标尺(需要目标元素已定位)

        _initScrollEvent() {
            var innerWrapper = this.innerWrapper
            var origin = this.origin;
            var originX = origin.x;
            var originY = origin.y;

            innerWrapper.scrollLeft(originX + this.startX)
            innerWrapper.scrollTop(originY + this.startY)
            var _this = this
            this.innerWrapper.on('scroll', function(event) {
                event.preventDefault();
                event.stopPropagation();
                var top = innerWrapper.scrollTop()
                var left = innerWrapper.scrollLeft()
                    // container.css('left', parseInt(container.css('left')) - detail);
                _this.setPosition(left - originX, top - originY)
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
        _handleMouseWheelEvent: function(event) {
            event.preventDefault();
            var _this = event.data
            var container = _this.elem
            if (event.type == 'DOMMouseScroll') {
                //根据axis和detail对事件进行包装,添加一个方向
                //垂直是2,水平是1
                var axis = event.originalEvent.axis;
                //左和上为正方向
                var detail = event.originalEvent.detail;
                //水平方向
                if (axis === 1) {
                    container.css('left', parseInt(container.css('left')) - detail);
                    _this._moveRuler(detail, 0)
                }
                //垂直方向
                else if (axis === 2) {
                    container.css('top', parseInt(container.css('top')) - detail);
                    _this._moveRuler(0, detail)
                }
            }
            //如果是其他浏览器的滚轮事件
            if (event.type === 'mousewheel') {
                //根据deltaX和deltaY的比较对事件进行包装,添加一个方向
                var deltaX = event.originalEvent.deltaX;
                var deltaY = event.originalEvent.deltaY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    container.css('left', parseInt(container.css('left')) - deltaX);
                    _this._moveRuler(deltaX, 0)
                } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    container.css('top', parseInt(container.css('top')) - deltaY);
                    _this._moveRuler(0, deltaY)
                }
            }
        },
        _initMouseWheelEvent: function() {
            var _this = this

            var wrapper = this.wrapper
                //使用自定义的事件处理函数,好兼容ff的鼠标滚轮事件
            wrapper.on('mousewheel DOMMouseScroll', this, this._handleMouseWheelEvent);
        },
        setPosition: function(startX, startY) {
            this.startX = startX;
            this.startY = startY;

            var innerWrapper = this.innerWrapper
            var originX = this.origin.x;
            var originY = this.origin.y;

            innerWrapper.scrollLeft(originX + this.startX)
            innerWrapper.scrollTop(originY + this.startY)

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
        }
    }
})(jQuery)
