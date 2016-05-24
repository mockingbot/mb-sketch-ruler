require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 垂直标尺
 */
class VerRuler extends React.Component {

    componentDidMount() {
        var canvas = this.refs.ruler;
        var rect = canvas.getBoundingClientRect();
        this.width = rect.width * 2;
        this.height = rect.height * 2;
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('2d');

        this.drawRuler();
    }

    drawRuler() {
    	console.log("垂直重绘")
        //标尺起始y坐标
        var start = this.props.start;
        //手机的y坐标
        var posY = this.props.posY;
        //手机的高度
        var height = this.props.height;
        // console.log(start, posY, height)

        var ctx = this.ctx;

        //绘制刻度尺的背景
        ctx.fillStyle = '#F5F5F5'
        ctx.fillRect(0, 0, this.width, this.height);

        //设置底部刻度的样式
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#999'
        
        //绘制底部刻度
        ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(this.width, 0);	//border-top对不齐,改用黑科技实现
        ctx.moveTo(this.width, 0);	//border-right
        ctx.lineTo(this.width, this.height);
        ctx.closePath();
        ctx.stroke();

        //移动画布原点,方便绘制
        ctx.translate(0, - start * 2);
        
        //根据iphone高度绘制阴影
        ctx.fillStyle = '#CCC'
        ctx.font = '30px Microsoft Yahei'
        ctx.fillRect(0, posY * 2, this.width, height * 2);

        var perHeight = 10 * 2;
        var startY = start - start % perHeight
		
		//再画刻度和文字
        for (let i = startY; i < startY + this.height / 2; i += 10) {
            
            ctx.moveTo(this.width, i * 2);
            
            if (i % 100 === 0) {
                //这里先保存一下状态
                ctx.save();
                //将原点转移到当前画笔所在点
                ctx.translate(this.width / 2, (i - 2) * 2)
                //旋转 -90 度
                ctx.rotate(-Math.PI / 2)
                ctx.fillStyle = '#000'
				//画文字
                ctx.fillText(i, 0, 0)
                //回复刚刚保存的状态
                ctx.restore();
                ctx.lineTo(0, i * 2)
            } else {
                ctx.lineTo(this.width / 3 * 2, i * 2)
            }
            ctx.stroke();
        }
        ctx.closePath();
        ctx.translate(0, start * 2);
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.start !== this.props.start
        	|| nextProps.posY !== this.props.posY
        	|| nextProps.height !== this.props.height)
        {
        	        this.drawRuler();
        }

    }

    render() {
        return <canvas ref="ruler" id="verRuler" />;
    }
}

VerRuler.defaultProps = {};

export default VerRuler;
