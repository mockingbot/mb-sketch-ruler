require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 垂直标尺
 */
class VerRuler extends React.Component {

	//当窗口发生改变时,根据新的窗口大小绘制canvas
	reSize(width, height){
	    var canvas = this.refs.ruler;
	    canvas.style.width = width + 'px';
	    canvas.style.height = height + 'px';
	    this.width = width * 2;
	    this.height = height * 2;
	    canvas.width = this.width;
	    canvas.height = this.height;
	}

	//组件绑定后首次绘制
    componentDidMount() {
        var canvas = this.refs.ruler;
        var domWidth = this.props.domWidth;
        var domHeight = this.props.domHeight;
        canvas.style.width = domWidth + 'px';
        canvas.style.height = domHeight + 'px';

        //2倍宽高,以解决canvas的1px问题
        this.width = domWidth * 2;
        this.height = domHeight * 2;
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('2d');
        this.drawRuler();
    }
	/* 核心方法,根据属性重新绘制canvas
     * @ params
     * start : 标尺起始y坐标
     * posX : 手机的y坐标
     * height : 手机的高度
     */
    drawRuler(start = this.props.start,
                posY = this.props.posY,
                height = this.props.height) {
    	
    	console.log("垂直重绘")

        var ctx = this.ctx;

        //绘制刻度尺的背景
        ctx.fillStyle = '#F5F5F5'
        ctx.fillRect(0, 0, this.width, this.height);

        //设置底部刻度的样式
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#999'
        
        //绘制底部刻度
        ctx.beginPath();
        
        //border-right(border-top对不齐,改用css实现)
        ctx.moveTo(this.width, 0);	
        ctx.lineTo(this.width, this.height);
        
        ctx.closePath();
        ctx.stroke();

        //移动画布原点,方便绘制
        ctx.translate(0, - start * 2);
        
        //根据iphone高度绘制阴影
        ctx.fillStyle = '#CCC'
        ctx.font = '30px Microsoft Yahei'
        ctx.fillRect(0, posY * 2, this.width, height * 2);

        //再画刻度和文字
        ctx.beginPath();
        ctx.fillStyle = '#000'
        
        var perHeight = 10 * 2;
        var startY = start - start % perHeight
		
        for (let i = startY; i < startY + this.height / 2; i += 10) {
            
            ctx.moveTo(this.width, i * 2);
            
            //绘制长刻度
            if (i % 100 === 0) {
                //这里先保存一下状态
                ctx.save();
                //将原点转移到当前画笔所在点
                ctx.translate(this.width / 2, (i - 2) * 2)
                //旋转 -90 度
                ctx.rotate(-Math.PI / 2)
				//画文字
                ctx.fillText(i, 0, 0)
                //回复刚刚保存的状态
                ctx.restore();
                ctx.lineTo(0, i * 2)

            } else { //绘制短刻度
                ctx.lineTo(this.width / 3 * 2, i * 2)
            }
            ctx.stroke();
        }
        ctx.closePath();
        ctx.translate(0, start * 2);
    }

    componentWillReceiveProps(nextProps) {
    	//下一个props中与绘制函数相关的参数
    	var nStart = nextProps.start;
    	var nPosY = nextProps.posY;
    	var nHeight = nextProps.height;

    	//如果是窗口大小发生了变化
    	if(nextProps.domWidth !== this.props.domWidth
    	    || nextProps.domHeight !== this.props.domHeight){
    	    
    	    this.reSize(nextProps.domWidth, nextProps.domHeight);
    	    this.drawRuler(nStart, nPosY, nHeight);
    	}

        if(nextProps.start !== this.props.start
        	|| nextProps.posY !== this.props.posY
        	|| nextProps.height !== this.props.height)
        {
        	this.drawRuler(nStart, nPosY, nHeight);
        }

    }

    render() {
        return <canvas ref="ruler" id="verRuler" />;
    }
}

VerRuler.defaultProps = {};

export default VerRuler;
