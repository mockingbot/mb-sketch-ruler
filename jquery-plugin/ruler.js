/**
 * 2016.6.5 iny
 * 为了便于非react环境的调用,改造成jquery插件
 */
(function($){

	$.fn.getRuler = function(){
		var me = this;
		console.log(me.data('ruler'))
		var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me)
		return ruler;
	};

	var Ruler = function(elem){
		this.elem = elem;
	}

	//方法库
	Ruler.prototype = {
		_destory: function(){
			console.log('销毁原有实例')
			var elem = this.elem;
			console.log(this.doms)
			this.doms.forEach(function(item){
				$(item).remove()
			})
			this.elem.removeData('ruler')
		},
		//为给定元素添加标尺(需要目标元素已定位)
		init : function(options){
			var elem = this.elem;
			if(elem.data('ruler')){
				this._destory();
			}
			
			// parseInt会将空串转换为number类型,我晕
			// this.startX = typeof options.startX !== 'undefined' ? options.startX : -240;
			// this.startY = typeof options.startY !== 'undefined' ? options.startY : -100;
			// this.thick = typeof options.thick !== 'undefined' ? options.thick * 2 : 60;
			options = options || {}
			this.startX = !isNaN(options.startX) ? options.startX : -240;
			this.startY = !isNaN(options.startY) ? options.startY : -100;
			this.thick = !isNaN(options.thick) ? options.thick * 2 : 60;
			this.width = elem.width() * 2
			this.height = elem.height() * 2
			//厚度 其实就是尺子的宽度 但是变量名重复了

			//左上角小块
			var corner = $('<canvas></canvas>')
			corner.css({
				position: 'absolute',
				bottom: '100%',
				right: '100%',
				width: this.thick / 2 +'px',
				height: this.thick / 2 +'px',
			});
			
			var cornerDom = corner.get(0);
	  		cornerDom.width = this.thick;
	  		cornerDom.height = this.thick;
	  		var ctx = cornerDom.getContext('2d');

	  		ctx.fillStyle = '#F5F5F5'
	  		ctx.fillRect(0, 0, 60, 60);

	  		ctx.lineWidth = 2;
	  	  	ctx.strokeStyle = '#999'
	  		ctx.moveTo(60, 0);
	  		ctx.lineTo(60, 60);
	  		ctx.moveTo(60, 60);
	  		ctx.lineTo(0, 60);
	  		ctx.stroke();
	  		elem.prepend(corner)
			
			//水平
			var horRuler = $('<canvas></canvas>')
			horRuler.css({
				position: 'absolute',
				bottom: '100%',
				left: 0,
				width: this.width / 2,
				height: this.thick / 2,
			});
			var horRulerDom = horRuler.get(0);
			horRulerDom.width = this.width
			horRulerDom.height = this.thick
			elem.prepend(horRuler)

			this.horCtx = horRulerDom.getContext('2d');
			

			//垂直
			var verRuler = $('<canvas></canvas>')
			verRuler.css({
				position: 'absolute',
				right: '100%',
				top: 0,
				width: this.thick / 2,
				height: this.height / 2,
			});
			var verRulerDom = verRuler.get(0);
			verRulerDom.width = this.thick
			verRulerDom.height = this.height
			elem.prepend(verRuler)

			this.verCtx = verRulerDom.getContext('2d');
			
			this._drawRuler();

			this.elem.data('ruler', this);
			this.doms = [cornerDom, horRulerDom, verRulerDom]
			console.log(this.doms)
		},
		/*
		drawBackground : function(){
			//水平
			this.horCtx.fillStyle = '#F5F5F5'
	        this.horCtx.fillRect(0, 0, this.width, this.thick);

	        //设置底部刻度的样式
			this.horCtx.lineWidth = 2;
			this.horCtx.strokeStyle = '#999'
			//绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
			this.horCtx.beginPath();
			
			//border-bottom(border-left对不齐,改用css实现)
			this.horCtx.moveTo(0, this.thick); 
			this.horCtx.lineTo(this.width, this.thick);
			this.horCtx.closePath();
			this.horCtx.stroke();

			//垂直

			this.verCtx.fillStyle = '#F5F5F5'
	        this.verCtx.fillRect(0, 0, this.thick, this.height);

			this.verCtx.lineWidth = 2;
	        this.verCtx.strokeStyle = '#999'
	        
	        //绘制底部刻度
	        this.verCtx.beginPath();
	        
	        //border-right(border-top对不齐,改用css实现)
	        this.verCtx.moveTo(this.thick, 0);	
	        this.verCtx.lineTo(this.thick, this.height);
	        
	        this.verCtx.closePath();
	        this.verCtx.stroke();
		},*/
		setPosition : function(startX, startY){
			this.startX = startX;
			this.startY = startY;
			this._drawRuler();
		},
		_drawRuler : function(){
			this._drawHorRuler();
			this._drawVerRuler();
		},
		_drawHorRuler : function(posX, width, needShadow){
			var start = this.startX;
			console.log(start)
            var posX = typeof posX !== 'undefined' ? posX : 0
            var width = typeof width !== 'undefined' ? width : 320
            var needShadow = needShadow || false;
			var ctx = this.horCtx;
			//绘制刻度尺的背景
			ctx.fillStyle = '#F5F5F5'
			ctx.fillRect(0, 0, this.width, this.thick);

			//先根据iphone宽度绘制阴影
			if(needShadow){
			    ctx.fillStyle = '#CCC'
			    ctx.fillRect((posX - start) * 2, 0, width * 2, this.thick);
			}

			//再画刻度和文字(因为刻度遮住了阴影)
			ctx.font = '30px Microsoft Yahei'
			
			//设置底部刻度的样式
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#999'
			//绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
			ctx.beginPath();
			
			//border-bottom(border-left对不齐,改用css实现)
			ctx.moveTo(0, this.thick); 
			ctx.lineTo(this.width, this.thick);
			ctx.closePath();
			ctx.stroke();

			//移动画布原点,方便绘制
			ctx.translate(- start * 2, 0);
			
			ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
			ctx.fillStyle = '#000'

			var perWidth = 10 * 2;
			var startX = start - start % perWidth
			console.log(startX)

			//这样绘制当起点不为10的倍数时,长标和文字都不会出现
			// for(let i = start ; i < start+this.width ; i += 10){
			//正确的方法是:偏移到10的倍数,再开始绘制
			for (let i = startX; i < startX + this.width / 2; i += 10) {
			    
			    ctx.moveTo(i * 2, this.thick);
			    
			    //绘制长刻度
			    if (i % 100 === 0) {
			        ctx.fillText(i, (i + 2) * 2, this.thick / 2);
			        ctx.lineTo(i * 2, 0);
			    } else { //绘制短刻度
			        ctx.lineTo(i * 2, this.thick - perWidth);
			    }
			    ctx.stroke();
			}
			ctx.closePath();

			ctx.translate(start * 2, 0);
		},
		_drawVerRuler : function(posY, height, needShadow){
			var start = this.startY;
	        var posY = typeof posY !== 'undefined' ? posY : 0
	        var height = typeof height !== 'undefined' ? height : 568
	        var needShadow = needShadow || false;
	        var ctx = this.verCtx;
	        //绘制刻度尺的背景
	        ctx.fillStyle = '#F5F5F5'
	        ctx.fillRect(0, 0, this.thick, this.height);

	        //先根据iphone高度绘制阴影
	        if(needShadow){
		        ctx.fillStyle = '#CCC'
		        ctx.fillRect(0, (posY - start) * 2, this.thick, height * 2);
		    }
			
			//再画刻度和文字(因为刻度遮住了阴影)
	        ctx.font = '30px Microsoft Yahei'
	        
	        //设置底部刻度的样式
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = '#999'
	        
	        //绘制底部刻度
	        ctx.beginPath();
	        
	        //border-right(border-top对不齐,改用css实现)
	        ctx.moveTo(this.thick, 0);	
	        ctx.lineTo(this.thick, this.height);
	        
	        ctx.closePath();
	        ctx.stroke();

	        //移动画布原点,方便绘制
	        ctx.translate(0, - start * 2);
	        
	        
	        ctx.beginPath();
	        ctx.fillStyle = '#000'
	        
	        var perHeight = 10 * 2;
	        var startY = start - start % perHeight
			
	        for (let i = startY; i < startY + this.height / 2; i += 10) {
	            
	            ctx.moveTo(this.thick, i * 2);
	            
	            //绘制长刻度
	            if (i % 100 === 0) {
	                //这里先保存一下状态
	                ctx.save();
	                //将原点转移到当前画笔所在点
	                ctx.translate(this.thick / 2, (i - 2) * 2)
	                //旋转 -90 度
	                ctx.rotate(-Math.PI / 2)
					//画文字
	                ctx.fillText(i, 0, 0)
	                //回复刚刚保存的状态
	                ctx.restore();
	                ctx.lineTo(0, i * 2)

	            } else { //绘制短刻度
	                ctx.lineTo(this.thick / 3 * 2, i * 2)
	            }
	            ctx.stroke();
	        }
	        ctx.closePath();
	        ctx.translate(0, start * 2);
		},
		setSelect : function(x, y, width, height){
			if(!this.startX){
				console.log("未初始化,先初始化")
				this.init()
			}
			this._drawHorRuler(x, width, true);
			this._drawVerRuler(y, height, true);
		}
	}
})(jQuery)
